import { useEffect, useState } from "react";
import { fetchPublicPosts } from "./api";
import type { BoardKey, PostRow } from "./types";

/** 공개 페이지에서 게시판 글 목록을 로드 */
export function usePublicPosts(board: BoardKey) {
  const [items, setItems] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchPublicPosts(board)
      .then((rows) => {
        if (active) setItems(rows);
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "불러오기에 실패했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [board]);

  return { items, loading, error };
}

/** 최근 7일 내 등록된 글이면 N 배지 */
export function isNewPost(publishedAt: string): boolean {
  const posted = new Date(`${publishedAt}T00:00:00`).getTime();
  if (Number.isNaN(posted)) return false;
  return Date.now() - posted <= 7 * 24 * 60 * 60 * 1000;
}

/**
 * 목록 번호. 고정글은 번호 대신 아이콘을 쓰므로,
 * 고정되지 않은 글에만 최신순으로 번호를 매긴다.
 */
export function numberMap(items: PostRow[]): Map<string, number> {
  const normals = items.filter((i) => !i.is_pinned);
  const map = new Map<string, number>();
  normals.forEach((item, idx) => map.set(item.id, normals.length - idx));
  return map;
}

/** 첨부파일 중 첫 번째의 확장자 배지 (자료실 목록용) */
export function primaryExt(post: PostRow): string | null {
  return post.attachments?.[0]?.ext ?? null;
}
