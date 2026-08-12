import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useNoIndex } from "@/features/seo/useNoIndex";

export default function AdminLogin() {
  useNoIndex();
  const { signIn, session, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 이미 로그인된 관리자면 관리자 페이지로
  if (!loading && session && profile?.is_active) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error, isAdmin } = await signIn(userId.trim(), password);
    if (error) {
      setSubmitting(false);
      setError("아이디 또는 비밀번호를 확인해주세요.");
      return;
    }
    if (!isAdmin) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError("관리자 권한이 없는 계정입니다.");
      return;
    }
    setSubmitting(false);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">여수문화재단 관리자</h1>
          <p className="text-sm text-gray-500 mt-1">관리자 아이디로 로그인하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
            <input
              type="text"
              required
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fa0]/40"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fa0]/40"
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

        <button
          onClick={() => navigate("/member/reset")}
          className="mt-6 w-full text-center text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          비밀번호를 잊으셨나요?
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-2 w-full text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ← 홈페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
