# 이미지 자체 호스팅 전환 계획서

> 상태: **계획 단계. 실행하지 않음.**
> 목적: 서드파티(readdy.ai) 실시간 생성 URL 의존 제거

---

## 1. 현황

### 1-1. 외부 의존 URL 분포 (실측)

| 형태 | 소스 코드 | SQL seed | index.html | 합계 |
|---|---:|---:|---:|---:|
| `readdy.ai/api/search-image?query=…` (생성형) | 13 | 9 | 4 | **26** |
| `public.readdy.ai/ai/img_res/edited_*.jpg` (정적 CDN) | 68 | 42 | 0 | **110** |
| **합계** | **81** | **51** | **4** | **136** |

> ⚠️ **중요:** 전체의 81%가 `query=` 파라미터가 **없는 정적 CDN URL**이다.
> "query 문자열만 교체" 방식은 26건에만 적용되고, 나머지 110건은
> URL 자체를 통째로 교체해야 한다. 작업 프롬프트의 3-2 규칙만으로는 부족하다.

### 1-2. 소스 코드 81건의 위치

| 파일 | 건수 | 현재 상태 |
|---|---:|---|
| `src/mocks/business.ts` | 29 | 사용 중 (`/business`) |
| `src/mocks/community.ts` | 22 | **미사용** — 게시판 DB 이관 완료. 삭제 후보 |
| `src/mocks/home.ts` | 19 | 사용 중 (홈 5개 섹션) |
| `src/mocks/rent.ts` | 9 | 사용 중 (`/rent/space`) |
| `src/pages/introduce/greeting/page.tsx` | 2 | 사용 중. **AI 생성 인물 사진(이사장 초상)** |

> `mocks/community.ts` 22건은 이미 화면에 안 나온다. 교체 대상에서 제외하고
> 파일 자체를 정리하는 편이 낫다. (내용은 `supabase/seed_posts.sql`로 이관 완료)

> `introduce/greeting`의 2건은 **가상의 인물 초상**이다. 실존 이사장 사진이
> 아니면서 공식 홈페이지 인사말에 배치돼 있어 이미지 교체와 별개로
> 표기 방침 결정이 필요하다.

### 1-3. 현재 로컬 자산

- `public/images/hero-1.png` — 단 1개
- Supabase Storage 버킷 3개 존재: `event-posters`, `program-files`, `board-files`
  (모두 public read, 관리자 write. 관리자 페이지 업로드가 이미 이 버킷을 쓴다)

---

## 2. 호스팅 방식 비교

| 항목 | (a) `public/` 정적 | (b) Supabase Storage |
|---|---|---|
| 빌드 크기 | 이미지가 리포·번들에 포함 → git 비대화 | 영향 없음 |
| CDN | Vercel Edge 자동 | Supabase CDN |
| 관리자 교체 | 불가. 개발자가 커밋·배포해야 함 | **관리자 페이지에서 즉시 교체 가능** |
| 버전 관리 | git 이력에 남음 | 남지 않음 |
| 비용 | Vercel 무료 범위 | 무료 티어 1GB, 초과 시 과금 |
| 오프라인/로컬 개발 | 그대로 동작 | 네트워크 필요 |

### 권장안 — **혼합**

- **(a) `public/`**: 자주 안 바뀌는 구조적 이미지
  → 히어로 기본 배경, OG 이미지, 파비콘, CI 요소, 공간소개 시설 사진
- **(b) Supabase Storage**: 운영 중 계속 바뀌는 콘텐츠 이미지
  → 공연·전시·축제 포스터, 사업소개 썸네일, 게시판 이미지, 축제 배너

근거: 이미 `/admin/events`, `/admin/programs`, `/admin/posts`, `/admin/hero`에
업로드 UI가 붙어 있어 콘텐츠 이미지는 (b)가 자연스럽다. 반대로 OG·파비콘을
Storage에 두면 배포마다 외부 의존이 생겨 손해다.

---

## 3. 전환 절차

1. **수집** — 현재 136개 URL 중 실제로 화면에 노출되는 것만 추림
   (미사용 `mocks/community.ts` 22건 제외 → 약 114건)
2. **생성/선정** — `docs/image-references.md`의 12개 항목 기준으로 새 이미지 확보
3. **최적화**
   - WebP 변환, 품질 80 전후
   - 히어로 1920×1080 / 카드 800×600 / 썸네일 400×400 / OG 1200×630
   - 각 이미지 200KB 이하 목표
4. **배치**
   - `public/images/` 또는 Storage 버킷 업로드
5. **URL 교체** — 소스 / SQL seed / Supabase 실데이터 세 곳 모두
6. **fallback 적용** (아래 4절)
7. 검증 — `npm run build` 후 각 페이지 육안 확인

### 파일 명명 규칙

```
public/images/yeosu-<주제>-<용도>-<가로>x<세로>.webp

예)
  yeosu-odongdo-card-800x600.webp
  yeosu-nightsea-hero-1920x1080.webp
  yeosu-og-default-1200x630.webp
```

Storage는 관리자 업로드가 UUID 파일명을 쓰므로 규칙 적용 대상이 아니다.

---

## 4. fallback 처리

현재 코드는 이미지 로드 실패 시 깨진 아이콘이 그대로 노출된다.
공통 컴포넌트를 하나 두고 교체하는 것을 권장한다.

```tsx
// src/components/base/SafeImage.tsx (제안)
export default function SafeImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center text-gray-300`}>
        <i className="ri-image-line text-2xl"></i>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" />;
}
```

> 게시판(`/community/news`, `/community/archive`)에는 이미 `image_url` null 처리가
> 들어가 있으나, **로드 실패(404)** 처리는 없다. 위 컴포넌트로 통일하면 둘 다 해결된다.

---

## 5. 저작권 관리

AI 생성 이미지임을 코드에 남기는 것만으로는 운영 인수인계가 안 된다.
별도 대장을 권장한다.

`docs/image-credits.md` (제안 형식)

| 파일명 | 출처 | 생성일 | 프롬프트 | 실사 교체 필요 | 비고 |
|---|---|---|---|---|---|
| yeosu-jinnamgwan-card-800x600.webp | AI 생성 | 2026-08 | (전문) | **예** | 실제 건축물과 형태 상이 가능 |
| yeosu-odongdo-card-800x600.webp | AI 생성 | 2026-08 | (전문) | 권장 | |

**실사 교체 우선순위 (실존 대상이라 오인 위험 큼)**
1. 진남관 — 국가지정문화유산
2. 예울마루 — 실존 건축물 + 타 기관 운영
3. 여수세계섬박람회 — 미개최 행사
4. 여순사건 기념관 — 추모 시설
5. 이사장 인물 사진 — 실존 인물이면 AI 생성 사용 불가

---

## 6. 작업량 추정

| 작업 | 규모 | 비고 |
|---|---|---|
| 미사용 mock 정리 | 0.5h | `mocks/community.ts` 삭제 |
| 이미지 생성·선정 | 12~20장 | 항목당 여러 컷 검토 시 증가 |
| 최적화·리사이즈 | 1~2h | 스크립트화 가능 |
| 소스 URL 교체 (59건) | 2~3h | mocks 3개 파일 집중 |
| SQL seed 교체 (51건) | 1~2h | |
| Supabase 실데이터 교체 | **[확인필요]** | 실제 행 수 확인 후 산정 |
| fallback 컴포넌트 도입 | 1~2h | 사용처 일괄 치환 포함 |
| 검증 | 1h | |

> Supabase 실데이터 규모는 아래로 확인:
> ```sql
> select 'events' t, count(*) from public.events where image_url like '%readdy%'
> union all select 'programs', count(*) from public.programs where image_url like '%readdy%'
> union all select 'posts', count(*) from public.posts where image_url like '%readdy%'
> union all select 'hero_slides', count(*) from public.hero_slides where image_url like '%readdy%';
> ```
