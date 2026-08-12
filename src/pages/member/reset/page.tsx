import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function MemberResetRequest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {sent ? (
          <div className="text-center">
            <i className="ri-mail-send-line text-3xl text-[#1a4fa0]"></i>
            <h1 className="text-lg font-bold text-gray-900 mt-3">메일을 확인하세요</h1>
            <p className="text-sm text-gray-500 mt-2">
              {email} 로 비밀번호 재설정 링크를 보냈습니다. 메일의 링크를 눌러 새 비밀번호를 설정하세요.
            </p>
            <Link to="/member/login" className="mt-6 inline-block bg-[#1a4fa0] text-white rounded-lg px-5 py-2 text-sm cursor-pointer">
              로그인으로
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold text-gray-900">비밀번호 찾기</h1>
              <p className="text-sm text-gray-500 mt-1">가입한 이메일로 재설정 링크를 보내드립니다.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
              )}
              <button type="submit" disabled={submitting} className="w-full bg-[#1a4fa0] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#163f82] disabled:opacity-50 cursor-pointer">
                {submitting ? "전송 중..." : "재설정 링크 보내기"}
              </button>
            </form>
            <button onClick={() => navigate("/member/login")} className="mt-6 w-full text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
              ← 로그인으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
