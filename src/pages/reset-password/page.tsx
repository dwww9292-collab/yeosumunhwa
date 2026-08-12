import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 메일 링크로 진입하면 복구 세션이 생성됨. 세션 존재 여부로 유효성 확인.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {done ? (
          <div className="text-center">
            <i className="ri-check-line text-3xl text-green-600"></i>
            <h1 className="text-lg font-bold text-gray-900 mt-3">비밀번호가 변경되었습니다</h1>
            <button onClick={() => navigate("/member/login")} className="mt-6 inline-block bg-[#1a4fa0] text-white rounded-lg px-5 py-2 text-sm cursor-pointer">
              로그인하러 가기
            </button>
          </div>
        ) : !ready ? (
          <div className="text-center text-sm text-gray-500">
            <p>유효한 재설정 링크로 접근해야 합니다.</p>
            <p className="mt-2 text-gray-400">메일의 링크를 통해 다시 들어와 주세요.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold text-gray-900">새 비밀번호 설정</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                <input type="password" required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="6자 이상" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
              )}
              <button type="submit" disabled={submitting} className="w-full bg-[#1a4fa0] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#163f82] disabled:opacity-50 cursor-pointer">
                {submitting ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
