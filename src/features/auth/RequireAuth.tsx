import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

/** 로그인한 사용자(회원/관리자 모두)만 접근 허용. 미로그인 시 회원 로그인으로 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <i className="ri-loader-4-line animate-spin text-2xl"></i>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/member/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
