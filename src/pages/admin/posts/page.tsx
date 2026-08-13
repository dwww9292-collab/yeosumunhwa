import { useCallback, useEffect, useState } from "react";
import {
  createPost,
  deletePost,
  fetchAllPosts,
  updatePost,
  uploadBoardFile,
} from "@/features/posts/api";
import { BOARDS, BOARD_LABEL } from "@/features/posts/types";
import type {
  Attachment,
  BoardKey,
  MediaType,
  PostInput,
  PostRow,
} from "@/features/posts/types";
import { detectPii, piiWarningMessage } from "@/features/privacy/detect";

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = (board: BoardKey): PostInput => ({
  board,
  title: "",
  body: null,
  image_url: null,
  media_type: board === "archive" ? "video" : null,
  media_url: null,
  attachments: [],
  is_pinned: false,
  is_published: true,
  pii_reviewed: false,
  published_at: today(),
});

export default function AdminPosts() {
  const [board, setBoard] = useState<BoardKey>("notice");
  const [rows, setRows] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");

  const [editing, setEditing] = useState<PostRow | "new" | null>(null);
  const [form, setForm] = useState<PostInput>(emptyForm("notice"));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (b: BoardKey) => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchAllPosts(b));
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(board);
    setKeyword("");
  }, [board, load]);

  const openNew = () => {
    setForm(emptyForm(board));
    setEditing("new");
  };

  const openEdit = (row: PostRow) => {
    setForm({
      board: row.board,
      title: row.title,
      body: row.body,
      image_url: row.image_url,
      media_type: row.media_type,
      media_url: row.media_url,
      attachments: row.attachments ?? [],
      is_pinned: row.is_pinned,
      is_published: row.is_published,
      pii_reviewed: row.pii_reviewed ?? false,
      published_at: row.published_at,
    });
    setEditing(row);
  };

  const closeForm = () => {
    setEditing(null);
    setForm(emptyForm(board));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadBoardFile(file);
      setForm((f) => ({ ...f, image_url: uploaded.url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const handleAttachmentUpload = async (files: FileList) => {
    setUploading(true);
    setError(null);
    try {
      const uploaded: Attachment[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadBoardFile(file));
      }
      setForm((f) => ({ ...f, attachments: [...f.attachments, ...uploaded] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "첨부파일 업로드 실패");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (idx: number) =>
    setForm((f) => ({ ...f, attachments: f.attachments.filter((_, i) => i !== idx) }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }
    // 개인정보 패턴 1차 검사. 최종 차단은 DB 트리거(supabase/pii_guard.sql)가 한다.
    const pii = form.pii_reviewed
      ? []
      : detectPii(form.title, form.body, form.attachments.map((a) => a.name).join(" "));
    if (pii.length > 0) {
      setError(piiWarningMessage(pii));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editing === "new") await createPost(form);
      else if (editing) await updatePost(editing.id, form);
      closeForm();
      await load(board);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: PostRow) => {
    if (!window.confirm(`"${row.title}" 을(를) 삭제할까요?`)) return;
    setError(null);
    try {
      await deletePost(row.id);
      await load(board);
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const togglePublished = async (row: PostRow) => {
    setError(null);
    try {
      await updatePost(row.id, { is_published: !row.is_published });
      await load(board);
    } catch (e) {
      setError(e instanceof Error ? e.message : "변경 실패");
    }
  };

  const togglePinned = async (row: PostRow) => {
    setError(null);
    try {
      await updatePost(row.id, { is_pinned: !row.is_pinned });
      await load(board);
    } catch (e) {
      setError(e instanceof Error ? e.message : "변경 실패");
    }
  };

  const filtered = rows.filter((r) =>
    keyword.trim() ? r.title.toLowerCase().includes(keyword.trim().toLowerCase()) : true,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">알림마당 관리</h1>
        <button
          onClick={openNew}
          className="bg-[#1a4fa0] text-white text-sm rounded-lg px-4 py-2 hover:bg-[#163f82] cursor-pointer"
        >
          + 새 글 작성
        </button>
      </div>

      {/* 게시판 탭 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {BOARDS.map((b) => (
          <button
            key={b}
            onClick={() => setBoard(b)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer ${
              board === b ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {BOARD_LABEL[b]}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          총 <strong className="text-[#1a4fa0]">{filtered.length}</strong> 건
        </p>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="제목 검색"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#1a4fa0]/40"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">등록된 글이 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left font-medium px-4 py-3 w-14">고정</th>
                <th className="text-left font-medium px-4 py-3">제목</th>
                <th className="text-left font-medium px-4 py-3 w-20">첨부</th>
                <th className="text-left font-medium px-4 py-3 w-28">작성일</th>
                <th className="text-left font-medium px-4 py-3 w-16">조회</th>
                <th className="text-left font-medium px-4 py-3 w-20">게시</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <button
                      onClick={() => togglePinned(row)}
                      title={row.is_pinned ? "고정 해제" : "상단 고정"}
                      className={`cursor-pointer ${row.is_pinned ? "text-[#1a4fa0]" : "text-gray-300 hover:text-gray-400"}`}
                    >
                      <i className={row.is_pinned ? "ri-pushpin-2-fill" : "ri-pushpin-2-line"}></i>
                    </button>
                  </td>
                  <td className="px-4 py-2 text-gray-800 max-w-md truncate">
                    {row.media_type && (
                      <span className="mr-1.5 text-xs text-gray-400">
                        [{row.media_type === "video" ? "영상" : "사진"}]
                      </span>
                    )}
                    {row.title}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs">
                    {row.attachments?.length ? `${row.attachments.length}개` : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-xs font-mono">{row.published_at}</td>
                  <td className="px-4 py-2 text-gray-500 text-xs">{row.view_count}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => togglePublished(row)}
                      className={`text-xs cursor-pointer ${row.is_published ? "text-[#1a4fa0]" : "text-gray-400"}`}
                    >
                      {row.is_published ? "게시중" : "숨김"}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(row)}
                      className="text-gray-500 hover:text-[#1a4fa0] px-2 cursor-pointer"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="text-gray-500 hover:text-red-600 px-2 cursor-pointer"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 작성/수정 모달 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto p-6 space-y-4"
          >
            <h2 className="text-lg font-bold text-gray-900">
              {BOARD_LABEL[form.board]} — {editing === "new" ? "새 글 작성" : "글 수정"}
            </h2>

            <Field label="게시판">
              <select
                value={form.board}
                onChange={(e) => {
                  const next = e.target.value as BoardKey;
                  setForm({
                    ...form,
                    board: next,
                    media_type: next === "archive" ? (form.media_type ?? "video") : null,
                  });
                }}
                className="input"
              >
                {BOARDS.map((b) => (
                  <option key={b} value={b}>
                    {BOARD_LABEL[b]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="제목 *">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="작성일">
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => setForm({ ...form, published_at: e.target.value || today() })}
                  className="input"
                />
              </Field>
              {form.board === "archive" && (
                <Field label="구분">
                  <select
                    value={form.media_type ?? "video"}
                    onChange={(e) => setForm({ ...form, media_type: e.target.value as MediaType })}
                    className="input"
                  >
                    <option value="video">영상 이야기</option>
                    <option value="photo">사진 이야기</option>
                  </select>
                </Field>
              )}
            </div>

            {form.board === "archive" && form.media_type === "video" && (
              <Field label="영상 링크 (YouTube 등)">
                <input
                  value={form.media_url ?? ""}
                  onChange={(e) => setForm({ ...form, media_url: e.target.value || null })}
                  className="input"
                  placeholder="https://youtu.be/..."
                />
              </Field>
            )}

            {(form.board === "news" || form.board === "archive") && (
              <Field label="대표 이미지">
                <div className="space-y-2">
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt=""
                      className="w-28 h-28 object-cover rounded border"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="block text-sm text-gray-600"
                  />
                  <input
                    value={form.image_url ?? ""}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value || null })}
                    className="input"
                    placeholder="또는 이미지 URL 직접 입력"
                  />
                </div>
              </Field>
            )}

            <Field label="본문">
              <textarea
                value={form.body ?? ""}
                onChange={(e) => setForm({ ...form, body: e.target.value || null })}
                className="input min-h-[140px]"
                placeholder="본문을 입력하세요. 줄바꿈이 그대로 표시됩니다."
              />
            </Field>

            <Field label="첨부파일">
              <div className="space-y-2">
                {form.attachments.length > 0 && (
                  <ul className="space-y-1">
                    {form.attachments.map((att, i) => (
                      <li
                        key={`${att.name}-${i}`}
                        className="flex items-center gap-2 text-sm bg-gray-50 rounded px-3 py-1.5"
                      >
                        <span className="text-xs font-bold text-gray-500">{att.ext}</span>
                        <span className="flex-1 truncate text-gray-700">{att.name}</span>
                        {!att.url && <span className="text-xs text-amber-600">파일 없음</span>}
                        <button
                          type="button"
                          onClick={() => removeAttachment(i)}
                          className="text-gray-400 hover:text-red-600 cursor-pointer"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files?.length) handleAttachmentUpload(e.target.files);
                    e.target.value = "";
                  }}
                  className="block text-sm text-gray-600"
                />
                {uploading && <p className="text-xs text-gray-400">업로드 중...</p>}
              </div>
            </Field>

            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                />
                홈페이지에 게시
              </label>
              {form.board === "notice" && (
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_pinned}
                    onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                  />
                  상단 고정(공지)
                </label>
              )}
              {/* 공고문에 담당자 연락처를 넣어야 하는 경우가 있어 예외를 둔다 */}
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.pii_reviewed}
                  onChange={(e) => setForm({ ...form, pii_reviewed: e.target.checked })}
                />
                연락처 포함 허용 (검토 완료)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-4 py-2 text-sm bg-[#1a4fa0] text-white rounded-lg hover:bg-[#163f82] disabled:opacity-50 cursor-pointer"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
    </label>
  );
}
