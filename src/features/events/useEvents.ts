import { useEffect, useState } from "react";
import { fetchPublicEvents } from "./api";
import { toDisplayItem } from "./format";
import type { EventDisplayItem, EventType } from "./types";

/** 공개 페이지에서 특정 타입의 게시된 이벤트를 표시용 형태로 로드 */
export function usePublicEvents(type: EventType) {
  const [items, setItems] = useState<EventDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchPublicEvents(type)
      .then((rows) => {
        if (!active) return;
        setItems(rows.map(toDisplayItem));
      })
      .catch((e) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "불러오기에 실패했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [type]);

  return { items, loading, error };
}
