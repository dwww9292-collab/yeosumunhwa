import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";

export default function MemberSignup() {
  const { signUp, session, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"none" | "confirm">("none");
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
    const { error, needsConfirm } = await signUp(email.trim(), password, name.trim());
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    if (needsConfirm) {
      // 이메일 확인이 켜져 있는 경우
      setDone("confirm");
      return;
    }
    // 바로 로그인됨
    navigate("/mypage", { replace: true });
  };

  if (done === "confirm") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <i className="ri-mail-check-line text-3xl text-[#1a4fa0]"></i>
          <h1 className="text-lg font-bold text-gray-900 mt-3">가입 신청 완료</h1>
          <p className="text-sm text-gray-500 mt-2">
            입력하신 이메일({email})로 인증 링크를 보냈습니다. 인증 후 로그인해주세요.
          </p>
          <Link
            to="/member/login"
            className="mt-6 inline-block bg-[#1a4fa0] text-white rounded-lg px-5 py-2 text-sm cursor-pointer"
          >
            로그인하러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
          <p className="text-sm text-gray-500 mt-1">양주문화재단 회원으로 가입하세요.</p>
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
