export const heroSlides = [
  {
    id: 1,
    title: "아름다운 물, 문화가 흐르는 여수",
    link: "#",
    poster: true, // 텍스트가 박혀 있는 포스터형(오버레이/제목 미표시)
    image: "/images/hero-1.png",
  },
  {
    id: 2,
    title: "2026 실내악 시리즈",
    link: "#",
    image: "https://readdy.ai/api/search-image?query=A%20classical%20music%20concert%20with%20string%20quartet%20performing%20on%20stage%2C%20warm%20golden%20lighting%2C%20elegant%20atmosphere%2C%20musicians%20in%20formal%20attire%2C%20large%20concert%20hall%20with%20rich%20wooden%20interior%2C%20cultural%20arts%20foundation%20performance%20with%20deep%20contrast%20lighting%20on%20dark%20stage%20background&width=1600&height=900&seq=hero-slide-2&orientation=landscape",
  },
  {
    id: 3,
    title: "생활밀착형 문화예술교육 <가가호호>",
    link: "#",
    image: "https://readdy.ai/api/search-image?query=Community%20arts%20education%20workshop%20with%20families%20and%20children%20participating%20in%20creative%20activities%2C%20bright%20and%20warm%20atmosphere%2C%20cultural%20center%20setting%2C%20people%20painting%20and%20doing%20crafts%20together%2C%20natural%20light%20streaming%20through%20large%20windows%2C%20joyful%20expressions%2C%20Korean%20cultural%20arts%20foundation%20program%20photography%20style&width=1600&height=900&seq=hero-slide-3&orientation=landscape",
  },
];

export const newsTabs = ["공지사항", "보도자료", "경영공시"] as const;

export const newsItems = [
  {
    id: 1,
    category: "공지사항",
    title: "[여수문화재단 공고 제2026-37호] 2026 공연창작 지원사업 최종 선정 결과 공고",
    date: "2026-06-02",
    isNew: true,
  },
  {
    id: 2,
    category: "공지사항",
    title: "[여수문화재단 공고 제2026-36호] 2026년 경기 생활문화 공간 활성화 지원사업 <한뼘 더 커뮤니티> 서류심사 결과 공고",
    date: "2026-05-29",
    isNew: false,
  },
  {
    id: 3,
    category: "공지사항",
    title: "여수문화재단 임직원 사칭 허위 구매 사기 피해 예방 안내",
    date: "2026-05-08",
    isNew: false,
  },
];

export const businessItems = [
  {
    id: 1,
    title: "가족과 함께하는 생활밀착형 문화예술교육 「가가호호」<모두기록> <모두원예> 참여자 모집",
    image: "https://public.readdy.ai/ai/img_res/edited_321905ed51441b47c90ebe7338ff3ca5_c28165a8.jpg",
    status: "진행중",
    category: "교육",
  },
  {
    id: 2,
    title: "[모집마감 안내] 시민과 함께하는 율곡문화학당 <예술+ 시민강좌> 정규ㆍ특강 참여자 모집",
    image: "https://public.readdy.ai/ai/img_res/edited_ab18ec01c070718068a69e6ab316fe92_c28165a8.jpg",
    status: "진행중",
    category: "교육",
  },
  {
    id: 3,
    title: "2026 혜음원지 방문자센터 어린이 단체관람 프로그램 〈쓱쓱! 혜음원지 유물 찾기〉",
    image: "https://public.readdy.ai/ai/img_res/edited_9d0fbd63a8527f58b4d17b654634e370_c28165a8.jpg",
    status: "진행중",
    category: "행사",
  },
  {
    id: 4,
    title: "2026년 경기 생활문화 공간 활성화 지원사업 <한뼘 더 커뮤니티> 모집 공고",
    image: "https://public.readdy.ai/ai/img_res/edited_08fb2fb3314ba8641ae8844f8223f39b_c28165a8.jpg",
    status: "종료",
    category: "지원사업",
  },
];

export const performanceTabs = ["공연", "전시", "축제"] as const;

export const performanceItems = [
  {
    id: 1,
    title: "[대관] 여수시립소년소녀합창단 제5회 정기연주회「Mozart in Yeosu」",
    image: "https://public.readdy.ai/ai/img_res/edited_90cff594bad1289137ad7ef69a018cfd_c28165a8.jpg",
    type: "대관",
    category: "공연",
  },
  {
    id: 2,
    title: "[기획] 찾아가는 문화하루 1회차 <정오의 하모니>",
    image: "https://public.readdy.ai/ai/img_res/edited_10efdec102b0c023cd0144ac639ebc57_c28165a8.jpg",
    type: "기획",
    category: "공연",
  },
  {
    id: 3,
    title: "[기획] 2026 실내악 시리즈<브라보 브라스(Bravo Brass)>",
    image: "https://public.readdy.ai/ai/img_res/edited_57bdb839b35c1d1f4424b4b4b9a0b8d5_c28165a8.jpg",
    type: "기획",
    category: "공연",
  },
  {
    id: 4,
    title: "[기획] 2026 문화살롱 2회차 <오락가락(五樂歌樂) 콘서트: 청춘국악>",
    image: "https://public.readdy.ai/ai/img_res/edited_e35327b635d438b265e874405fa149c1_c28165a8.jpg",
    type: "기획",
    category: "공연",
  },
];

export const rentalTabs = ["시민회관", "여수사랑행복센터", "여수우정행복센터", "여수아트홀"] as const;

export const rentalDates = [
  { day: "08", week: "MON", active: true },
  { day: "09", week: "TUE", active: false },
  { day: "10", week: "WED", active: false },
  { day: "11", week: "THU", active: false },
  { day: "12", week: "FRI", active: false },
  { day: "13", week: "SAT", active: false },
  { day: "14", week: "SUN", active: false },
  { day: "15", week: "MON", active: false },
  { day: "16", week: "TUE", active: false },
  { day: "17", week: "WED", active: false },
  { day: "18", week: "THU", active: false },
  { day: "19", week: "FRI", active: false },
  { day: "20", week: "SAT", active: false },
  { day: "21", week: "SUN", active: false },
  { day: "22", week: "MON", active: false },
  { day: "23", week: "TUE", active: false },
  { day: "24", week: "WED", active: false },
  { day: "25", week: "THU", active: false },
  { day: "26", week: "FRI", active: false },
  { day: "27", week: "SAT", active: false },
  { day: "28", week: "SUN", active: false },
];

export const rentalItems = [
  {
    id: 1,
    title: "공연장 휴관일",
    place: "다목적실",
    time: "8:00 ~ 22:00",
    host: "여수문화재단",
  },
  {
    id: 2,
    title: "공연장 휴관일",
    place: "소공연장",
    time: "8:00 ~ 22:00",
    host: "여수문화재단",
  },
  {
    id: 3,
    title: "2026 전국체전 시설 개·보수 사업 추진 공사",
    place: "대공연장",
    time: "8:00 ~ 22:00",
    host: "여수시 체육과",
  },
];

export const spaceBanners = [
  {
    id: 1,
    title: "시민회관",
    subtitle: "공간소개",
    description: "대공연장(900석), 소공연장(302석), 다목적실을\n갖춘 여수의 대표 문화공간입니다.",
    image: "https://public.readdy.ai/ai/img_res/edited_651952617912a6c9672e010a4ab816a2_333b818a.jpg",
    link: "/rent/space",
  },
  {
    id: 2,
    title: "여수사랑행복센터",
    subtitle: "공간소개",
    description: "대공연장(500석)을 비롯해 문화카페까지\n주민 곁으로 찾아간 생활문화 거점입니다.",
    image: "https://public.readdy.ai/ai/img_res/edited_5afb3b103fa866ccc4b8e0fc48b27681_f7139d32.jpg",
    link: "/rent/space",
  },
  {
    id: 3,
    title: "여수우정행복센터",
    subtitle: "공간소개",
    description: "대공연장(700석)과 전시실을 갖춘\n옥정 신도시의 문화 랜드마크입니다.",
    image: "https://public.readdy.ai/ai/img_res/edited_3dd8a408cdd6bb5680d00b195c58bf84_726ce405.jpg",
    link: "/rent/space",
  },
  {
    id: 4,
    title: "여수아트홀",
    subtitle: "공간소개",
    description: "최적의 음향을 자랑하는 클래식 전용홀(350석),\n실내악과 독주회의 성지입니다.",
    image: "https://public.readdy.ai/ai/img_res/edited_a0a2d478892d5042a37e3c78e898106f_4b19b0a4.jpg",
    link: "/rent/space",
  },
];

export const partners = [
  {
    id: 1,
    name: "여수시청",
    image: "/images/partner-1.png",
    link: "https://www.yeosu.go.kr/",
  },
  {
    id: 2,
    name: "여수시의회",
    image: "/images/partner-2.png",
    link: "https://council.yeosu.go.kr/",
  },
  {
    id: 3,
    name: "전라남도청",
    image: "/images/partner-3.png",
    link: "https://www.jeonnam.go.kr/",
  },
  {
    id: 4,
    name: "여수시도시관리공단",
    image: "/images/partner-4.png",
    link: "https://www.yumcorp.or.kr/",
  },
  {
    id: 5,
    name: "여수문화원",
    image: "/images/partner-5.png",
    link: "https://www.yeosu.go.kr/tour/",
  },
  {
    id: 6,
    name: "여수문화재단",
    image: "/images/partner-6.png",
    link: "https://www.yeosu.go.kr/",
  },
  {
    id: 7,
    name: "여수세계박람회재단",
    image: "/images/partner-7.png",
    link: "https://www.expo2012.kr/",
  },
  {
    id: 8,
    name: "한국문화예술위원회",
    image: "/images/partner-8.png",
    link: "https://www.arko.or.kr/",
  },
];