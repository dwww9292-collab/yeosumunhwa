import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { AdminRole } from "./types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** 이 권한 이상만 허용. 미지정 시 활성 관리자면 통과. */
  role?: AdminRole;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <i className="ri-loader-4-line animate-spin text-2xl"></i>
      </div>
    );
  }

  // 미로그인 또는 관리자 프로필 없음 → 로그인 페이지로
  if (!session || !profile || !profile.is_active) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  // 권한 검사 (super_admin 전용 영역)
  if (role === "super_admin" && profile.role !== "super_admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
