import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { USERNAME_HINT, USERNAME_RULE, isUsernameAvailable } from "@/features/auth/accountId";
import ConsentBox from "@/features/privacy/ConsentBox";
import { SIGNUP_CONSENT, TERMS_CONSENT } from "@/features/privacy/consent";

export default function MemberSignup() {
  const { signUp, signIn, session, loading } = useAuth();
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [idCheck, setIdCheck] = useState<"idle" | "checking" | "ok" | "taken">("idle");
  const [submitting, setSubmitting] = useState(false);
  // 개인정보 보호법 제15조 — 동의 없이는 수집할 수 없다
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const allAgreed = agreeTerms && agreePrivacy;

  if (!loading && session) {
    return <Navigate to="/mypage" replace />;
  }

  const handleIdChange = (value: string) => {
    setUserId(value.toLowerCase());
    setIdCheck("idle");
  };

  const handleCheckId = async () => {
    if (!USERNAME_RULE.test(userId)) {
      setError(`아이디는 ${USERNAME_HINT} 로 입력해주세요.`);
      return;
    }
    setError(null);
    setIdCheck("checking");
    try {
      setIdCheck((await isUsernameAvailable(userId)) ? "ok" : "taken");
    } catch {
      setIdCheck("idle");
      setError("아이디 확인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!USERNAME_RULE.test(userId)) {
      setError(`아이디는 ${USERNAME_HINT} 로 입력해주세요.`);
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (!allAgreed) {
      setError("이용약관과 개인정보 수집·이용에 모두 동의하셔야 가입할 수 있습니다.");
      return;
    }

    setSubmitting(true);

    // 가입 직전 아이디 중복 재확인 (중복이면 트리거에서 실패하므로 미리 거른다)
    try {
      if (!(await isUsernameAvailable(userId))) {
        setSubmitting(false);
        setIdCheck("taken");
        setError("이미 사용 중인 아이디입니다.");
        return;
      }
    } catch {
      setSubmitting(false);
      setError("아이디 확인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const { error: signUpError, needsConfirm } = await signUp({
      username: userId,
      email: email.trim(),
      password,
      name: name.trim(),
    });
    if (signUpError) {
      setSubmitting(false);
      setError(signUpError);
      return;
    }

    if (needsConfirm) {
      setSubmitting(false);
      navigate("/member/login", {
        replace: true,
        state: { notice: `${email} 로 인증 메일을 보냈습니다. 인증 후 로그인해주세요.` },
      });
      return;
    }

    // 이메일 확인이 꺼져 있으면 바로 로그인
    const { error: signInError } = await signIn(userId, password);
    setSubmitting(false);
    if (signInError) {
      setError("가입은 완료되었지만 자동 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.");
      return;
    }
    navigate("/mypage", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">여수문화재단 회원으로 가입하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <div className="flex gap-2">
              <input
                required
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={userId}
                onChange={(e) => handleIdChange(e.target.value)}
                className="input"
                placeholder={USERNAME_HINT}
              />
              <button
                type="button"
                onClick={handleCheckId}
                disabled={idCheck === "checking"}
                className="flex-shrink-0 border border-gray-300 rounded-lg px-3 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                중복확인
              </button>
            </div>
            {idCheck === "ok" && (
              <p className="mt-1 text-xs text-green-600">사용할 수 있는 아이디입니다.</p>
            )}
            {idCheck === "taken" && (
              <p className="mt-1 text-xs text-red-600">이미 사용 중인 아이디입니다.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <p className="mt-1 text-xs text-gray-400">
              로그인에는 쓰이지 않습니다. 가입 인증과 비밀번호 찾기에만 사용됩니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="6자 이상"
            />
          </div>

          <ConsentBox
            spec={TERMS_CONSENT}
            checked={agreeTerms}
            onChange={setAgreeTerms}
            policyPath="/policy/terms"
          />
          <ConsentBox spec={SIGNUP_CONSENT} checked={agreePrivacy} onChange={setAgreePrivacy} />

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !allAgreed}
            className="w-full bg-[#1a4fa0] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#163f82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          이미 회원이신가요?{" "}
          <Link to="/member/login" className="text-[#1a4fa0] font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
