import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { AdminProfile } from "./types";

interface SignInResult {
  error: string | null;
  isAdmin: boolean;
}

interface AuthContextValue {
  session: Session | null;
  profile: AdminProfile | null;
  /** 활성 관리자 여부 */
  isAdmin: boolean;
  /** 로그인했지만 관리자가 아닌 일반 회원 */
  isMember: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirm: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 관리자 프로필 로드 (없으면 일반 회원 → null)
  const loadProfile = useCallback(async (userId: string | undefined): Promise<AdminProfile | null> => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    const prof = (data as AdminProfile | null) ?? null;
    setProfile(prof);
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
    async (email: string, password: string): Promise<SignInResult> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message, isAdmin: false };
      const prof = await loadProfile(data.user.id);
      return { error: null, isAdmin: !!prof?.is_active };
    },
    [loadProfile],
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) return { error: error.message, needsConfirm: false };
      // 세션이 바로 생기면 이메일 확인 불필요(확인 OFF 상태)
      return { error: null, needsConfirm: !data.session };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const isAdmin = !!session && !!profile?.is_active;
  const isMember = !!session && !isAdmin;

  return (
    <AuthContext.Provider
      value={{ session, profile, isAdmin, isMember, loading, signIn, signUp, signOut }}
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
