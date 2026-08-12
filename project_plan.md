# 양주문화재단 웹사이트 재구축

## 1. Project Description
양주문화재단 공식 웹사이트를 React + Tailwind + TypeScript로 재구축합니다. 시민과 동행하는 문화도시 양주를 만들고, 문화예술로 사회적 가치를 실현하는 정보를 제공합니다. 타겟 사용자는 양주 시민 및 문화예술 관심자입니다.

## 2. Page Structure
- `/` - Home (메인 홈페이지)
- `/community/notice` - 공지사항
- `/community/news` - 보도자료
- `/community/archive` - 재단소식
- `/community/data` - 자료실
- `/rent/status` - 대관현황
- `/rent/space` - 공간소개
- `/business` - 사업소개
- `/business/performance` - 공연
- `/business/exhibition` - 전시
- `/business/festival` - 축제
- `/introduce/greeting` - 인사말
- `/introduce/establishment` - 설립 및 운영
- `/introduce/organization` - 조직소개
- `/introduce/ci` - CI소개
- `/introduce/philosophy` - 경영철학
- `/introduce/announce` - 경영공시
- `/introduce/location` - 오시는길

## 3. Core Features
- [ ] 메인 홈페이지 (히어로 슬라이더, 소식, 문화사업, 공연/전시/축제, 대관현황, 공간소개, 예매 CTA, 협력기관)
- [ ] 알림마당 (공지사항, 보도자료, 재단소식, 자료실 목록 및 상세)
- [ ] 대관안내 (대관현황 캘린더, 공간소개)
- [ ] 문화사업 (사업소개 목록)
- [ ] 공연·전시·축제 (공연, 전시, 축제 목록 및 상세)
- [ ] 재단소개 (인사말, 설립, 조직, CI, 철학, 공시, 오시는길)
- [ ] 반응형 네비게이션 (데스크탑/모바일)
- [ ] 검색 UI
- [ ] 로그인/회원가입 UI

## 4. Data Model Design
현재 단계에서는 정적 콘텐츠로 구성하며, 추후 Supabase 연결 시 데이터 모델을 추가합니다.

## 5. Backend / Third-party Integration Plan
- Supabase: 현재 미연결. 추후 회원 시스템 및 CMS 연결 검토
- Shopify: 미사용
- Stripe: 미사용

## 6. Development Phase Plan

### Phase 1: 메인 홈페이지 구축
- Goal: 기존 홈페이지의 모든 메인 섹션을 재현
- Deliverable: Header, Hero Slider, 소식, 문화사업, 공연·전시·축제, 대관현황, 공간소개, 예매 CTA, 협력기관, Footer

### Phase 2: 알림마당 페이지
- Goal: 공지사항, 보도자료, 재단소식, 자료실 목록 페이지
- Deliverable: /community/* 라우트 및 페이지

### Phase 3: 대관안내 페이지
- Goal: 대관현황, 공간소개 페이지
- Deliverable: /rent/* 라우트 및 페이지

### Phase 4: 문화사업 및 공연·전시·축제 페이지
- Goal: 사업소개, 공연, 전시, 축제 목록 페이지
- Deliverable: /business/* 라우트 및 페이지

### Phase 5: 재단소개 페이지
- Goal: 인사말, 설립, 조직, CI, 철학, 공시, 오시는길 페이지
- Deliverable: /introduce/* 라우트 및 페이지

### Phase 6: 추가 기능 및 최적화
- Goal: 로그인/회원가입, 검색, 모바일 메뉴 완성, 애니메이션, 성능 최적화
- Deliverable: 전체 기능 점검 및 최적화