import { useState } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

export default function MemberLogin() {
  const { signIn, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/mypage";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (error) {
      setError("이메일 또는 비밀번호를 확인해주세요.");
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">로그인</h1>
          <p className="text-sm text-gray-500 mt-1">여수문화재단 회원 로그인</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
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
            {submitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
          <p>
            아직 회원이 아니신가요?{" "}
            <Link to="/member/signup" className="text-[#1a4fa0] font-medium hover:underline">
              회원가입
            </Link>
          </p>
          <p>
            <Link to="/member/reset" className="text-gray-400 hover:text-gray-600 hover:underline">
              비밀번호를 잊으셨나요?
            </Link>
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ← 홈페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
