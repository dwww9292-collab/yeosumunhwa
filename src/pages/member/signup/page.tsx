import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

export default function MemberSignup() {
  const { signUp, signIn, session, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to="/mypage" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    if (error) {
      setSubmitting(false);
      setError(error);
      return;
    }
    // 이메일 확인이 켜져있어 세션이 없을 수도 있으므로, 명시적으로 로그인 시도
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError("가입은 완료되었지만 자동 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.");
      return;
    }
    navigate("/mypage", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">여수문화재단 회원으로 가입하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
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

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1a4fa0] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#163f82] transition-colors disabled:opacity-50 cursor-pointer"
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
