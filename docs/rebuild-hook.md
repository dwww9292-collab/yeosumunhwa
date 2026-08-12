# Supabase 콘텐츠 변경 → Vercel 재배포 트리거

> 상태: **조사·설계만. 구현하지 않음.**
> 배경: 프리렌더를 도입하면 정적 라우트 HTML이 **빌드 시점**에 고정된다.
> 관리자가 게시글·공연을 올려도 재배포 전까지 프리렌더 HTML에는 반영되지 않는다.
> (브라우저에서 JS가 뜬 뒤에는 최신 데이터가 보이므로 사용자 체감 문제는 아니고,
>  **크롤러·SNS 공유 미리보기**가 옛 내용을 보는 게 실제 문제다.)

---

## 1. 어디까지 문제인가

| 대상 | 프리렌더 | 재배포 필요성 |
|---|---|---|
| 재단소개, 이용안내 등 고정 페이지 | O | 거의 없음 (코드 수정 시 어차피 배포) |
| 목록 페이지 (알림마당, 공연·전시·축제) | O | **있음** — 새 글이 프리렌더 HTML에 없음 |
| 상세 페이지 (`/community/notice/:id` 등) | X (런타임 helmet만) | 없음 |

즉 재배포 훅이 필요한 범위는 **목록 페이지 프리렌더 갱신**뿐이다.

---

## 2. 방식 비교

### (a) Vercel Deploy Hook + Supabase Database Webhook — 권장

Vercel이 제공하는 Deploy Hook URL을 Supabase가 테이블 변경 시 호출한다.

- **장점**: 변경 즉시 반영. 추가 서버 불필요
- **단점**: 글을 5개 연속 올리면 빌드가 5번 돈다 → 디바운스 필요
- **비용**: Vercel Hobby는 월 빌드 시간 제한이 있어 과다 트리거 주의

**설정 절차**
1. Vercel → Project → Settings → Git → **Deploy Hooks** → 생성
   (이름 `supabase-content`, 브랜치 `main`) → URL 복사
2. Supabase → Database → **Webhooks** → Create
   - Table: `posts` / Events: `INSERT`, `UPDATE`, `DELETE`
   - Type: HTTP Request → `POST` → 위 Deploy Hook URL
   - `events`, `programs`, `hero_slides` 에도 동일하게 추가
3. 관리자 페이지에서 글 하나 등록 → Vercel 배포 목록에 새 빌드가 뜨는지 확인

### (b) 예약 재빌드 (Vercel Cron)

하루 N회 정해진 시각에만 재빌드.

- **장점**: 빌드 횟수 예측 가능. 설정이 가장 단순
- **단점**: 최대 반영 지연이 재빌드 주기만큼
- 공공기관 공지사항 정도면 **하루 2~4회로 충분**한 경우가 많다

### (c) 디바운스 경유 (Supabase Edge Function)

Webhook → Edge Function(최근 호출 기록 확인) → 일정 시간 내 중복이면 무시.

- **장점**: (a)의 즉시성 + 빌드 폭주 방지
- **단점**: Edge Function 하나를 더 운영해야 함

---

## 3. 권장

**(b) 예약 재빌드로 시작하고, 반영 지연이 문제가 되면 (c)로 올린다.**

근거: 이 사이트는 콘텐츠 갱신 빈도가 낮고(공지 주 수 건 수준),
(a)를 그대로 붙이면 관리자가 글 여러 개를 연속 등록할 때 빌드가 그 수만큼 돌아
Hobby 플랜 빌드 시간을 빠르게 소진한다. 상세 페이지는 어차피 프리렌더 대상이
아니라 즉시성이 크게 중요하지 않다.

### (b) 설정 스케치

`vercel.json` 에 cron 을 두고, 해당 엔드포인트가 Deploy Hook 을 호출하는 형태.

```jsonc
// vercel.json (예시 — 현재 파일에 아직 반영하지 않음)
{
  "crons": [
    { "path": "/api/rebuild", "schedule": "0 1,7,13 * * *" }  // UTC 기준
  ]
}
```

```ts
// api/rebuild.ts (예시)
export default async function handler() {
  await fetch(process.env.VERCEL_DEPLOY_HOOK_URL!, { method: "POST" });
  return new Response("ok");
}
```

> 현재 프로젝트에는 `api/` 서버리스 함수가 없다. 이 방식을 택하면 처음으로
> 서버 코드가 생기는 셈이라, 그 부담이 싫으면 (a)를 디바운스 없이 쓰되
> `posts` 테이블에만 붙이는 절충도 가능하다.

---

## 4. 확인 필요

- [ ] Vercel 플랜 (Hobby / Pro) — 월 빌드 시간 한도 확인
- [ ] 콘텐츠 갱신 실제 빈도 (재단 담당자 확인)
- [ ] 허용 가능한 반영 지연 시간 (즉시 / 수 시간 / 하루)
- [ ] `VERCEL_DEPLOY_HOOK_URL` 은 환경변수로만 관리 (URL 노출 시 누구나 빌드 트리거 가능)
