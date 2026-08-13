import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ADMIN_BASE, ADMIN_LOGIN } from "./adminPath";
import { useIdleLogout } from "./useIdleLogout";

/**
 * 로그인 상태에서 일정 시간 무활동이면 자동 로그아웃한다.
 * 만료 2분 전부터 경고 배너를 띄워 사용자가 작업 중 잘려나가지 않게 한다.
 */
export default function SessionTimeoutGuard() {
  const { session, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleExpire = useCallback(async () => {
    const wasAdmin = isAdmin || location.pathname.startsWith(ADMIN_BASE);
    await signOut();
    navigate(wasAdmin ? ADMIN_LOGIN : "/member/login", {
      replace: true,
      state: { notice: "장시간 활동이 없어 자동으로 로그아웃되었습니다. 다시 로그인해 주세요." },
    });
  }, [isAdmin, location.pathname, navigate, signOut]);

  const { remainingMs, extend } = useIdleLogout({
    enabled: !!session,
    onExpire: handleExpire,
  });

  if (remainingMs === null) return null;

  const minutes = Math.max(1, Math.ceil(remainingMs / 60000));

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      aria-label="세션 만료 안내"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[min(92vw,26rem)] rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-lg"
    >
      <p className="text-sm text-amber-900">
        보안을 위해 <strong>약 {minutes}분 후</strong> 자동 로그아웃됩니다.
      </p>
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleExpire}
          className="px-3 py-1.5 text-sm text-amber-900 rounded-lg hover:bg-amber-100 cursor-pointer"
        >
          지금 로그아웃
        </button>
        <button
          type="button"
          onClick={extend}
          className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 cursor-pointer"
        >
          계속 사용
        </button>
      </div>
    </div>
  );
}
