# 로그인 · 관리자 페이지 구축 계획

> 대상: 양주문화재단 웹사이트 (React 19 + Vite + TS + Tailwind + react-router-dom v7)
> 백엔드: **Supabase** (Auth + Postgres + Storage + RLS)
> 로그인 범위: **관리자 전용** / 대관 신청은 시민 공개 폼(로그인 불필요)

## 1. 핵심 결정 사항

| 항목 | 결정 |
| --- | --- |
| 인증 | Supabase Auth (이메일+비밀번호). 일반 시민 회원가입 없음 |
| 관리자 가입 | 공개 회원가입 비활성화. 최초 슈퍼관리자는 수동 생성, 이후 관리자 페이지에서 초대 |
| 권한 모델 | `super_admin` / `editor` 2단계 (필요 시 확장) |
| 대관 신청 | 시민 공개 폼 → `rental_applications` 익명 INSERT → 관리자 승인 |
| 회원 관리 | = 관리자/직원 계정 관리 (초대, 권한 변경, 비활성화) |
| 권한 제어 | DB는 RLS, 프론트는 ProtectedRoute로 이중 방어 |

## 2. 데이터 모델 (Supabase)

```
profiles            -- auth.users 1:1 확장 (관리자 계정)
  id (uuid, FK auth.users)  name  role(super_admin|editor)  is_active  created_at

events              -- 공연/전시/축제 통합
  id  type(performance|exhibition|festival)  title  category
  start_date  end_date  venue  poster_url  body(html)  status(draft|published)
  created_by  created_at  updated_at

rental_applications -- 대관 신청 (시민 제출)
  id  space  applicant_name  phone  email  org
  use_date_from  use_date_to  purpose  headcount  memo
  status(pending|approved|rejected)  admin_memo  created_at  reviewed_by

posts (선택, 2차) -- 공지/보도/소식/자료실 게시물 CMS화
  id  board(notice|news|archive|data)  title  body(html)
  is_pinned  attachments(jsonb)  view_count  status  created_at
```

### RLS 정책 요약
- `profiles`: 본인 SELECT 가능 / 변경은 `super_admin`만.
- `events`, `posts`: 누구나 `status='published'` SELECT. INSERT/UPDATE/DELETE는 로그인한 관리자(`profiles.is_active=true`).
- `rental_applications`: **익명 INSERT 허용**(공개 신청), SELECT/UPDATE는 관리자만.
- 관리자 판별은 `auth.uid()`가 `profiles`에 존재하고 `is_active`인지 확인하는 helper 함수로 처리.

## 3. 프론트엔드 구조

```
src/
  lib/supabase.ts              -- createClient (env: VITE_SUPABASE_URL / _ANON_KEY)
  features/auth/
    AuthProvider.tsx           -- 세션 context, onAuthStateChange 구독
    useAuth.ts                 -- { user, profile, role, signIn, signOut, loading }
    ProtectedRoute.tsx         -- 미인증 시 /admin/login 리다이렉트, role 검사
  pages/admin/
    login/page.tsx             -- 관리자 로그인
    layout.tsx                 -- 사이드바 + 헤더 (관리자 전용 레이아웃)
    dashboard/page.tsx         -- 요약 (신규 대관신청 n건 등)
    events/page.tsx            -- 공연/전시/축제 목록 + 작성/수정 폼
    rentals/page.tsx           -- 대관 신청 목록 + 승인/거절
    members/page.tsx           -- 관리자 계정 관리 (super_admin only)
  pages/rent/apply/page.tsx    -- (공개) 대관 신청 폼
```

### 라우팅 (`src/router/config.tsx` 확장)
```tsx
{ path: "/admin/login", element: <AdminLogin /> },
{ path: "/admin", element: <ProtectedRoute><AdminLayout/></ProtectedRoute>, children: [
    { index: true, element: <Dashboard /> },
    { path: "events", element: <EventsAdmin /> },
    { path: "rentals", element: <RentalsAdmin /> },
    { path: "members", element: <ProtectedRoute role="super_admin"><MembersAdmin/></ProtectedRoute> },
]},
{ path: "/rent/apply", element: <RentApply /> },  // 공개
```
- `App.tsx`를 `<AuthProvider>`로 감싼다.
- [Header.tsx:129-141](src/components/feature/Header.tsx#L129-L141)의 placeholder 로그인/회원가입 링크 → "관리자 로그인"(`/admin/login`) 단일 링크로 정리. 로그인 상태면 "관리자 페이지"·"로그아웃" 표시.

## 4. 단계별 구현 계획

### Phase 1 — 인증 기반 (½~1일)
- [ ] Supabase 프로젝트 생성, `.env`에 URL/anon key 추가, `.gitignore` 확인
- [ ] `profiles` 테이블 + RLS + 슈퍼관리자 1명 수동 생성
- [ ] `lib/supabase.ts`, `AuthProvider`, `useAuth`, `ProtectedRoute` 구현
- [ ] `/admin/login` 페이지 + 로그인/로그아웃 동작
- [ ] Header 링크 정리

### Phase 2 — 관리자 레이아웃 & 대시보드 (½일)
- [ ] `AdminLayout` (사이드바 네비 + 로그아웃), 반응형
- [ ] 대시보드: 대관 신청 대기 건수, 최근 게시물 등 요약 카드

### Phase 3 — 공연·전시·축제 관리 (1일)
- [ ] `events` 테이블 + RLS + Storage 버킷(포스터)
- [ ] 목록/검색/필터 + 작성·수정·삭제 폼(이미지 업로드 포함)
- [ ] 기존 공개 페이지(`/business/*`)를 mock → Supabase 조회로 전환

### Phase 4 — 대관 신청/현황 (1일)
- [ ] `rental_applications` 테이블 + RLS(익명 INSERT)
- [ ] 공개 신청 폼 `/rent/apply`
- [ ] 관리자 신청 목록 + 승인/거절 + 메모
- [ ] `/rent/status` 현황을 승인 건 기반으로 표시

### Phase 5 — 회원(관리자 계정) 관리 (½일)
- [ ] 관리자 목록, 권한 변경, 비활성화 (super_admin 전용)
- [ ] 신규 관리자 초대 (Supabase invite 또는 임시 비밀번호 생성)

### Phase 6 — 마감 (½일)
- [ ] (선택) 알림마당 게시물 CMS화(`posts`)
- [ ] 에러/로딩/빈상태 처리, 권한 우회 점검, 배포 환경변수 설정

## 5. 보안 체크리스트
- anon key는 공개되어도 안전하나, **모든 보호는 RLS로** 강제 (프론트 가드만 믿지 않음)
- 관리자 페이지는 SEO 비노출(`noindex`)
- 공개 회원가입 엔드포인트 비활성화 확인
- 대관 신청 폼 스팸 방지(간단한 rate limit / 필수값 검증)

## 6. 확정된 결정 사항
1. 슈퍼관리자 최초 계정 이메일: **dwww92@naver.com**
2. 대관 가능 공간 목록(드롭다운 값): **시민회관 / 양주사랑행복센터 / 양주우정행복센터 / 양주아트홀**
3. 이미지 업로드: **Supabase Storage** (드래그&드롭 업로드, 운영 편의 우선. 기존 외부 URL도 호환 위해 URL 직접 입력 필드 병행)
