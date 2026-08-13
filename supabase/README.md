# Supabase 적용 순서

Supabase 대시보드 → **SQL Editor** 에서 아래 순서대로 실행하세요.
이미 실행한 파일은 건너뛰어도 되지만, 순서는 지켜야 합니다.

> ## 먼저 이것부터
>
> **`00_check_status.sql`** 을 실행하면 어디까지 적용됐는지 표로 나옵니다.
> 아무것도 바꾸지 않는 읽기 전용 쿼리이니 부담 없이 먼저 돌려 보세요.
>
> `relation "public.xxx" does not exist` 에러가 났다면 **앞 단계를 건너뛴 것**입니다.
> 각 파일은 앞 단계에서 만든 테이블·함수에 의존하므로 순서를 지켜야 합니다.
>
> 예: `pii_guard.sql` 은 `posts` 테이블에 트리거를 걸기 때문에
> `posts.sql`(9번) 이 먼저 실행돼 있어야 합니다.

## 1. 기본 (이미 적용했다면 건너뛰기)

| 순서 | 파일 | 내용 |
| --- | --- | --- |
| 1 | `schema.sql` | `profiles` (관리자 계정) + RLS + `is_admin()` / `is_super_admin()` |
| 2 | `admins.sql` | 관리자 승격 함수 `promote_admin()` |
| 3 | `events.sql` | 공연·전시·축제 + 포스터 버킷 |
| 4 | `programs.sql` | 사업소개 + 첨부파일 버킷 |
| 5 | `hero_slides.sql` | 축제 배너 슬라이드 |
| 6 | `rentals.sql` | 대관 신청 |

## 2. 이번에 추가된 것

| 순서 | 파일 | 내용 |
| --- | --- | --- |
| 7 | `usernames.sql` | **아이디 로그인 체계** (`user_accounts`, 가입 트리거, 아이디→이메일 조회) |
| 8 | `seed_accounts.sql` | 테스트 계정 `admin` / `user` 생성 (비밀번호 `111111`) |
| 9 | `posts.sql` | 알림마당 게시판 CMS (`posts`) + `board-files` 버킷 |
| 10 | `seed_posts.sql` | 기존 하드코딩 게시물 38건 이관 (**한 번만** 실행) |
| 11 | `site_users.sql` | 회원 관리용 함수 (`list_site_users`, 차단, 삭제) |
| 12 | `venue_schedules.sql` | 대관현황 직접 등록 일정 + `public_rental_bookings` 뷰 재정의 |

> `venue_schedules.sql` 은 기존 `public_rental_bookings` 뷰를 **drop 후 재생성**합니다.
> 따라서 `public_rental_bookings.sql` 은 더 이상 따로 실행할 필요가 없습니다.

## 2-1. 공공기관 준수사항 대응 (docs/compliance-plan.md)

| 순서 | 파일 | 내용 |
| --- | --- | --- |
| 13 | `pii_guard.sql` | 개인정보 패턴 자동 차단. `posts.pii_reviewed` 컬럼을 추가하므로 **앱 배포 전에 먼저 실행**해야 합니다 |
| 14 | `access_logs.sql` | 접속기록 테이블 · `log_access()` · 보관기간 정리 함수. `list_site_users()` 를 열람 기록이 남는 버전으로 교체합니다 |
| — | `revoke_demo_accounts.sql` | **운영 전환 시** 시연 계정(admin/user, 비밀번호 111111) 폐기. 평소에는 실행하지 마세요 |

> ⚠️ `pii_guard.sql` 은 `posts` 테이블에 `pii_reviewed` 컬럼을 추가합니다.
> 이 SQL 을 실행하기 전에 새 앱을 배포하면 게시글 저장이 실패합니다. **SQL 먼저입니다.**

> ⚠️ `access_logs.sql` 은 `list_site_users()` 를 재정의합니다.
> `site_users.sql` 을 나중에 다시 실행하면 열람 기록 부분이 사라지므로 주의하세요.

## 3. 계정

로그인은 **아이디 + 비밀번호** 로 합니다. 이메일은 가입 인증과 비밀번호
찾기 등 메일 발송에만 쓰입니다.

| 아이디 | 비밀번호 | 권한 | 이메일(인증용) |
| --- | --- | --- | --- |
| `admin` | `111111` | 최고관리자 | dwww92@naver.com |
| `user` | `111111` | 일반 회원 | dwww92+user@naver.com |

- 관리자 로그인: `/admin/login`
- 회원 로그인: `/member/login`

`auth.users` 는 이메일이 UNIQUE 라 두 계정이 같은 주소를 쓸 수 없어서
일반 회원 계정은 `+user` 별칭을 씁니다. 네이버는 별칭 수신을 지원하지
않으므로, `user` 계정으로 실제 메일을 받아야 하면 Supabase 대시보드에서
이메일 주소를 바꿔 주세요. (`seed_accounts.sql` 이 이메일 인증을 미리
완료 처리하므로 로그인 자체에는 영향이 없습니다.)

## 4. 대시보드 설정

- **Authentication → Providers → Email**
  - 공개 회원가입을 막고 싶으면 `Allow new users to sign up` OFF
  - 가입 시 메일 인증을 원하면 `Confirm email` ON
    (ON 이면 가입 후 인증 메일을 받아야 로그인됩니다)
- **Authentication → URL Configuration**
  - `Redirect URLs` 에 `https://<도메인>/reset-password` 추가
    (비밀번호 재설정 링크가 이 주소로 돌아옵니다)

## 5. 알아둘 점

`email_for_username()` 은 아이디로 계정 이메일을 조회합니다. 즉 **아이디를
아는 사람은 그 계정의 이메일을 알 수 있습니다.** 운영상 문제가 되면
아이디를 추측하기 어렵게 발급하거나, 이 변환을 Edge Function 으로 옮겨
서버에서만 처리하도록 바꾸세요.
