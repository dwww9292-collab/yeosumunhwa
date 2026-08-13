import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { resolveLoginEmail } from "./accountId";
import { logAccess } from "@/features/privacy/accessLog";
import type { AdminProfile } from "./types";

interface SignInResult {
  error: string | null;
  isAdmin: boolean;
}

interface SignUpParams {
  username: string;
  email: string;
  password: string;
  name: string;
}

interface AuthContextValue {
  session: Session | null;
  profile: AdminProfile | null;
  /** 로그인한 계정의 아이디 */
  username: string | null;
  /** 활성 관리자 여부 */
  isAdmin: boolean;
  /** 로그인했지만 관리자가 아닌 일반 회원 */
  isMember: boolean;
  loading: boolean;
  /** 아이디(또는 이메일) + 비밀번호로 로그인 */
  signIn: (identifier: string, password: string) => Promise<SignInResult>;
  signUp: (params: SignUpParams) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 관리자 프로필 + 아이디 로드 (프로필이 없으면 일반 회원 → null)
  const loadProfile = useCallback(async (userId: string | undefined): Promise<AdminProfile | null> => {
    if (!userId) {
      setProfile(null);
      setUsername(null);
      return null;
    }
    const [{ data }, { data: account }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_accounts").select("username").eq("user_id", userId).maybeSingle(),
    ]);
    const prof = (data as AdminProfile | null) ?? null;
    setProfile(prof);
    setUsername((account as { username: string } | null)?.username ?? null);
    return prof;
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session?.user.id);
      if (active) setLoading(false);
    });

    // 주의: onAuthStateChange 콜백 안에서 직접 await supabase 호출 시
    // 인증 락과 충돌해 데드락이 발생할 수 있으므로, 프로필 조회는 락 밖으로 미룬다.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      setTimeout(() => {
        if (active) loadProfile(newSession?.user.id);
      }, 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(
    async (identifier: string, password: string): Promise<SignInResult> => {
      // 아이디를 계정 이메일로 변환한 뒤 Supabase Auth 로 로그인
      let email: string | null;
      try {
        email = await resolveLoginEmail(identifier);
      } catch {
        return { error: "로그인 정보를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.", isAdmin: false };
      }
      if (!email) return { error: "아이디 또는 비밀번호를 확인해주세요.", isAdmin: false };

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message, isAdmin: false };
      const prof = await loadProfile(data.user.id);
      // 접속기록 (개인정보의 안전성 확보조치 기준 제8조)
      void logAccess("login", undefined, undefined, prof?.is_active ? "관리자 로그인" : "회원 로그인");
      return { error: null, isAdmin: !!prof?.is_active };
    },
    [loadProfile],
  );

  const signUp = useCallback(
    async ({ username: newUsername, email, password, name }: SignUpParams) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // username 은 트리거(handle_new_user)가 읽어 user_accounts 에 등록한다
        options: { data: { name, username: newUsername.trim().toLowerCase() } },
      });
      if (error) return { error: error.message, needsConfirm: false };
      // 세션이 바로 생기면 이메일 확인 불필요(확인 OFF 상태)
      return { error: null, needsConfirm: !data.session };
    },
    [],
  );

  const signOut = useCallback(async () => {
    // 세션이 끊기면 auth.uid() 를 못 쓰므로 로그아웃 전에 기록한다
    await logAccess("logout");
    await supabase.auth.signOut();
    setProfile(null);
    setUsername(null);
  }, []);

  const isAdmin = !!session && !!profile?.is_active;
  const isMember = !!session && !isAdmin;

  return (
    <AuthContext.Provider
      value={{ session, profile, username, isAdmin, isMember, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
