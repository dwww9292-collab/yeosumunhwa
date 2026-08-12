# 대관 시설명 마이그레이션 계획서

> 상태: **계획 단계. 실행하지 않음.**
> 선행 조건: **재단이 실제 운영·대관할 시설 목록을 여수시로부터 문서로 확보**
> 목록 없이 추측으로 치환하면 대관 신청·일정 데이터가 파손된다.

---

## 0. 왜 grep 치환이 위험한가

`시민회관` / `여수사랑행복센터` / `여수우정행복센터` / `여수아트홀` 네 값은
표시용 문구가 아니라 **시스템 키값**이다.

- 대관 신청 폼의 드롭다운 `value`
- 대관현황 캘린더의 시설 탭 필터 키
- Supabase `rental_applications.space` / `venue_schedules.space` 컬럼에
  **문자열 그대로 저장된 실데이터**

코드 상수만 바꾸면 기존 신청·일정 레코드의 `space` 값이 새 목록 어디에도
매칭되지 않아 **캘린더와 신청 내역에서 조용히 사라진다.** 에러도 나지 않는다.

---

## 1. 영향 범위 (조사 완료)

### 1-1. 시스템 키값 — 반드시 DB와 동시에 변경

| 파일 | 심볼 | 역할 |
|---|---|---|
| `src/features/rentals/types.ts` | `RENTAL_SPACES` | 신청 폼 드롭다운 원본. 4개 값 |
| `src/features/schedules/api.ts` | `HALLS` | 시설 → 홀 목록 매핑. 키가 시설명 |
| `src/pages/rent/status/page.tsx` | `venues` | 캘린더 시설 탭. **`RENTAL_SPACES`와 별도로 하드코딩되어 있음 → 통합 대상** |

> ⚠️ `venues`가 `RENTAL_SPACES`를 import하지 않고 따로 선언돼 있다.
> 마이그레이션 전에 `RENTAL_SPACES`를 단일 출처로 통합하는 선행 리팩터링을 권장한다.
> 지금 구조에서는 한쪽만 고치는 실수가 나기 쉽다.

### 1-2. 표시 문구 — 코드만 바꾸면 되는 것

| 파일 | 출현 | 성격 |
|---|---|---|
| `src/mocks/rent.ts` | 64 | 공간소개 페이지 데이터(`spaceData` 키 + 본문). **키가 시설명이라 준-시스템값** |
| `src/mocks/business.ts` | 8 | 사업/공연 목록 장소 문구 |
| `src/mocks/home.ts` | 5 | 홈 섹션 문구 |
| `src/pages/rent/space/page.tsx` | 2 | 공간소개 탭 |
| `src/pages/home/components/RentalSection.tsx` | 1 | 홈 대관 섹션 |
| `src/pages/introduce/organization/page.tsx` | 1 | 조직 업무 설명("시민회관 청사관리") |
| `src/pages/admin/events/page.tsx` | 1 | 입력 placeholder 예시 |
| `src/mocks/community.ts` | 1 | **현재 미사용(게시판 DB 이관 완료)** |

### 1-3. Supabase 실데이터

| 테이블 | 컬럼 | 행 수 | 확인 방법 |
|---|---|---|---|
| `rental_applications` | `space` | **[확인필요]** | 아래 쿼리 |
| `venue_schedules` | `space` | **[확인필요]** | 아래 쿼리 |
| `events` | `location` | **[확인필요]** | 시설명이 문장 안에 포함됨 |
| `programs` | `location` | **[확인필요]** | 시설명이 문장 안에 포함됨 |

```sql
-- 실행 규모 파악 (읽기 전용)
select 'rental_applications' as t, space as value, count(*)
from public.rental_applications group by space
union all
select 'venue_schedules', space, count(*)
from public.venue_schedules group by space
order by t, value;

-- 문장 안에 시설명이 섞인 경우
select 'events' as t, id, location from public.events
where location ~ '시민회관|행복센터|아트홀'
union all
select 'programs', id, location from public.programs
where location ~ '시민회관|행복센터|아트홀';
```

---

## 2. 신구 값 매핑 (재단 확정 목록 확보 후 작성)

| # | 현재 값 | 새 값 | 처리 | 비고 |
|---|---|---|---|---|
| 1 | 시민회관 | | ☐유지 ☐개명 ☐삭제 | |
| 2 | 여수사랑행복센터 | | ☐유지 ☐개명 ☐삭제 | |
| 3 | 여수우정행복센터 | | ☐유지 ☐개명 ☐삭제 | |
| 4 | 여수아트홀 | | ☐유지 ☐개명 ☐삭제 | |
| 5 | (신규) | | ☐추가 | |

**삭제 처리 시 주의:** 해당 시설의 기존 신청·일정 레코드를 어떻게 할지 먼저 정해야 한다.
(보존 후 비활성 표시 / 아카이브 테이블 이관 / 삭제 — 셋 중 택일)

---

## 3. 실행 절차 (순서 엄수)

### 사전
1. **Supabase 백업** — 대시보드 → Database → Backups 에서 수동 백업 생성
2. 아래 롤백용 스냅샷 확보
   ```sql
   create table if not exists public._backup_space_20260813 as
   select 'rental_applications' as src_table, id, space from public.rental_applications
   union all
   select 'venue_schedules', id, space from public.venue_schedules;
   ```
3. `git checkout -b chore/rental-space-rename`

### 본작업
4. **선행 리팩터링** — `rent/status/page.tsx`의 `venues`를 `RENTAL_SPACES` import로 교체
5. 코드 상수 변경 (`RENTAL_SPACES`, `HALLS`, `mocks/rent.ts`의 `spaceData` 키)
6. 표시 문구 변경 (1-2 목록)
7. **배포 전에** DB UPDATE 실행 — 아래 순서 중요
   ```sql
   begin;
   update public.rental_applications set space = '<새값>' where space = '<옛값>';
   update public.venue_schedules      set space = '<새값>' where space = '<옛값>';
   -- 문장형 컬럼은 replace 사용
   update public.events   set location = replace(location, '<옛값>', '<새값>') where location like '%<옛값>%';
   update public.programs set location = replace(location, '<옛값>', '<새값>') where location like '%<옛값>%';
   -- 결과 확인 후
   commit;   -- 이상하면 rollback;
   ```
8. 코드 배포
9. `/rent/status`, `/rent/apply`, `/admin/rentals`, `/admin/schedules` 육안 확인

> **순서 근거:** DB를 먼저 바꾸고 코드를 나중에 배포하면 그 사이 구코드가 새 값을
> 인식하지 못한다. 반대로 코드를 먼저 배포하면 구데이터가 안 보인다.
> 트래픽이 적은 시간대에 7→8을 연달아 수행하거나, 짧은 점검 공지를 권장한다.

### 롤백
```sql
update public.rental_applications r set space = b.space
from public._backup_space_20260813 b
where b.src_table = 'rental_applications' and b.id = r.id;

update public.venue_schedules v set space = b.space
from public._backup_space_20260813 b
where b.src_table = 'venue_schedules' and b.id = v.id;
```
코드는 `git revert`.

---

## 4. 리스크

| 리스크 | 영향 | 완화 |
|---|---|---|
| `venues` / `RENTAL_SPACES` 이중 정의 중 한쪽만 수정 | 캘린더 탭과 신청 폼 값 불일치 → 승인 건이 캘린더에 안 뜸 | 3-4 선행 리팩터링 |
| `mocks/rent.ts`의 `spaceData` 객체 **키** 누락 | 공간소개 페이지가 빈 화면 | 키와 탭 목록을 같은 상수에서 파생 |
| DB UPDATE 누락 | 기존 신청·일정이 캘린더에서 사라짐 | 1-3 쿼리로 사전/사후 건수 대조 |
| 시설 삭제 시 기존 레코드 | 고아 데이터 | 2절 "삭제 처리 시 주의" 결정 선행 |
| 배포 시점 불일치 | 수 분간 데이터 미표시 | 점검 공지 또는 저트래픽 시간대 |

---

## 5. 열린 질문 (재단 확인 필요)

- [ ] 재단이 직접 운영·대관하는 시설의 **정확한 공식 명칭** 목록
- [ ] 각 시설의 홀(대공연장/소공연장/다목적실 등) 구성
- [ ] 폐지·이관되는 시설이 있는지, 있다면 기존 예약 이력 처리 방침
- [ ] 시설별 담당 부서·문의 전화 (현재 전부 `[확인필요]` 상태)
