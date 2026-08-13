import { useEffect, useRef, useState } from "react";

/**
 * 세션 타임아웃 — 일정 시간 무활동 시 자동 로그아웃
 *
 * 여수시 지침: "세션 타임아웃(일정 시간 미활동 시 자동 로그아웃) 적용"
 *
 * 브라우저 탭이 여러 개 열려 있어도 마지막 활동 시각을 localStorage 로 공유해
 * 한 탭에서만 조작 중인데 다른 탭 기준으로 로그아웃되는 일이 없게 한다.
 */

/** 무활동 허용 시간 (기본 30분) */
export const IDLE_LIMIT_MS = 30 * 60 * 1000;
/** 만료 몇 분 전부터 경고할지 */
export const IDLE_WARN_MS = 2 * 60 * 1000;

const STORAGE_KEY = "yscf.lastActivity";
const CHECK_INTERVAL_MS = 15 * 1000;

const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll", "focus"] as const;

function readLastActivity(): number {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function writeLastActivity(at: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(at));
  } catch {
    /* 사파리 프라이빗 모드 등에서 실패해도 타이머는 계속 동작해야 한다 */
  }
}

interface Options {
  /** 로그인 상태일 때만 감시 */
  enabled: boolean;
  /** 만료 시 호출 (로그아웃 처리) */
  onExpire: () => void;
  limitMs?: number;
}

/**
 * @returns remainingMs — 경고 구간에 진입하면 남은 시간(ms), 아니면 null
 */
export function useIdleLogout({ enabled, onExpire, limitMs = IDLE_LIMIT_MS }: Options) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!enabled) {
      setRemainingMs(null);
      expiredRef.current = false;
      return;
    }

    expiredRef.current = false;
    writeLastActivity(Date.now());

    const touch = () => {
      if (expiredRef.current) return;
      writeLastActivity(Date.now());
      setRemainingMs(null);
    };

    for (const ev of ACTIVITY_EVENTS) {
      window.addEventListener(ev, touch, { passive: true });
    }

    const timer = window.setInterval(() => {
      const idleFor = Date.now() - readLastActivity();
      const left = limitMs - idleFor;

      if (left <= 0) {
        if (expiredRef.current) return;
        expiredRef.current = true;
        setRemainingMs(null);
        onExpireRef.current();
        return;
      }
      setRemainingMs(left <= IDLE_WARN_MS ? left : null);
    }, CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
      for (const ev of ACTIVITY_EVENTS) {
        window.removeEventListener(ev, touch);
      }
    };
  }, [enabled, limitMs]);

  /** 경고 배너에서 "연장" 눌렀을 때 */
  const extend = () => {
    writeLastActivity(Date.now());
    setRemainingMs(null);
  };

  return { remainingMs, extend };
}
