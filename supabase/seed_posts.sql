-- ============================================================
-- 알림마당 게시판 초기 데이터 (기존 하드코딩 콘텐츠 이관)
-- posts.sql 을 먼저 실행한 뒤, 이 파일을 "한 번만" 실행하세요.
-- 이미 같은 제목의 글이 있으면 건너뜁니다.
-- 자료실 첨부파일은 url 이 비어 있으므로, 실제 파일은
-- 관리자 페이지 > 알림마당 관리에서 업로드해 채워 주세요.
-- ============================================================

insert into public.posts (board, title, image_url, media_type, media_url, attachments, is_pinned, published_at)
select v.board, v.title, v.image_url, v.media_type, v.media_url, v.attachments, v.is_pinned, v.published_at
from (values
  ('notice', '[여수문화재단 공고 제2026-37호] 2026 공연창작 지원사업 최종 선정 결과 공고', null, null, null, '[]'::jsonb, true, '2026-06-02'::date),
  ('notice', '[여수문화재단 공고 제2026-36호] 2026년 경기 생활문화 공간 활성화 지원사업 <한뼘 더 커뮤니티> 서류심사 결과 공고', null, null, null, '[]'::jsonb, true, '2026-05-29'::date),
  ('notice', '여수문화재단 임직원 사칭 허위 구매 사기 피해 예방 안내', null, null, null, '[]'::jsonb, true, '2026-05-08'::date),
  ('notice', '[여수문화재단 공고 제2026-34호] 2026 공연창작 지원사업 1차 심사 결과 공고 및 2차 심사 안내', null, null, null, '[]'::jsonb, false, '2026-05-26'::date),
  ('notice', '[여수문화재단 공고 제2026-33호] 2026 꿈의 오케스트라 여수 신규 단원 모집 인터뷰심사 결과 공고', null, null, null, '[]'::jsonb, false, '2026-05-22'::date),
  ('notice', '[여수문화재단 공고 제2026-32호] 2026년 경기 생활문화 공간 활성화 지원사업 <한뼘 더 커뮤니티> 모집 공고', null, null, null, '[]'::jsonb, false, '2026-05-11'::date),
  ('notice', '[여수문화재단 공고 제2026-31호] 2026 꿈의 오케스트라 여수 신규 단원 모집 공고 (바이올린 1명)', null, null, null, '[]'::jsonb, false, '2026-05-08'::date),
  ('notice', '[여수문화재단 공고 제2026-30호] 2026 공연창작 지원사업 공고', null, null, null, '[]'::jsonb, false, '2026-04-29'::date),
  ('notice', '[여수문화재단 공고 제2026-29호] 2026 경기예술활동지원 <모든예술31-여수> 최종 선정 결과 공고', null, null, null, '[]'::jsonb, false, '2026-04-28'::date),
  ('notice', '[여수문화재단 공고 제2026-28호] 2026 꿈의 오케스트라 여수 신규 단원 수시 모집 인터뷰심사 결과 공고(3차)', null, null, null, '[]'::jsonb, false, '2026-04-24'::date),
  ('notice', '[여수문화재단 공고 제2026-27호] 2026 혜음원지 문화해설사 양성과정 모집 공고', null, null, null, '[]'::jsonb, false, '2026-04-20'::date),
  ('notice', '[여수문화재단 공고 제2026-26호] 2026 율곡문화학당 <인문학 산책> 특강 시리즈 수강생 모집', null, null, null, '[]'::jsonb, false, '2026-04-15'::date),
  ('news', '(재)여수문화재단, 혜음원지 방문자센터 문화체험 공간으로 새단장', 'https://public.readdy.ai/ai/img_res/edited_96da9ed61eb68ae70d0239bd079afbd7_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-05-29'::date),
  ('news', '여수문화재단, ''찾아가는 문화하루'' 공연 진행 - 여수시 곳곳으로 찾아가는 생활 속 문화공연 -', 'https://public.readdy.ai/ai/img_res/edited_37ec51b4890599e0397da29dfd9d211f_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-05-27'::date),
  ('news', '여수문화재단,''가가호호''사업 계기 문화예술교육·생활문화 협력 확대', 'https://public.readdy.ai/ai/img_res/edited_fc1b3e07cba134d5a99f05fafa7c8342_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-05-14'::date),
  ('news', '여수문화재단, 평화뮤지엄 S827 개관 기념 기획 전시 <평화의 빛, 미래의 길, "동행"> 5월 31일까지 앙코르 전시 진행', 'https://public.readdy.ai/ai/img_res/edited_f20831ea7b779ee393bddb91c9eee580_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-05-11'::date),
  ('news', '여수문화재단, 시민과 함께하는 율곡문화학당 ''예술+ 시민강좌'' 운영', 'https://public.readdy.ai/ai/img_res/edited_ca94404ff73ef13255c8588b7fc36bc4_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-05-11'::date),
  ('news', '거리는 더 가까이, 무대는 더 풍성하게... 여수 아트씨앗터 선정', 'https://public.readdy.ai/ai/img_res/edited_a9d39afbbcbecbf89cddccf639e01f0b_ddfbb241.jpg', null, null, '[]'::jsonb, false, '2026-04-27'::date),
  ('news', '여수문화재단 제6회 대한민국 축제 박람회 마케팅부문 ''우수상''수상', 'https://public.readdy.ai/ai/img_res/edited_37bb9c925590bdd86f51ea8cc78e4f4c_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-04-22'::date),
  ('news', '여수문화재단, ''모든예술31-여수''공모 여수 전역을 예술의 터전으로', 'https://public.readdy.ai/ai/img_res/edited_16bbe35fc0c793ed733780ff1cdbdcda_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-04-07'::date),
  ('news', '여수문화재단, 생활밀착형 문화예술교육 지원사업 ''가가호호'' 국비 선정', 'https://public.readdy.ai/ai/img_res/edited_23bd30d1506d1877ab4580d85117f85c_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-04-03'::date),
  ('news', '여수문화재단, ''꿈의 오케스트라 여수'' 공식 출범… 음악으로 행복한 아이들 키운다', 'https://public.readdy.ai/ai/img_res/edited_b088d3fe6da4b8c69a347f16ba2ae541_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-04-01'::date),
  ('news', '여수문화재단, 2026 여수 공연예술 지원사업 공모', 'https://public.readdy.ai/ai/img_res/edited_7b28fd6ff2286efbdc98b24a8e90c1a0_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-03-11'::date),
  ('news', '여수문화재단 2026 문화예술 지원사업 공모 추진', 'https://public.readdy.ai/ai/img_res/edited_ce5d821545647238589db9d9dd55896a_c28165a8.jpg', null, null, '[]'::jsonb, false, '2026-03-06'::date),
  ('news', '여수문화재단, 국가무형유산 ''여수별산대놀이'' 전수교육관 신규 개관… 전통문화 계승 본격화', 'https://readdy.ai/api/search-image?query=Traditional%20Korean%20mask%20dance%20performance%20Yeosu%20Byeolsandae%20nori%20with%20colorful%20costumes%20and%20traditional%20masks%2C%20outdoor%20cultural%20heritage%20performance%2C%20vibrant%20and%20dynamic%20folk%20art%20scene%2C%20Korean%20intangible%20cultural%20heritage%2C%20performers%20in%20traditional%20hanbok%20with%20exaggerated%20masks%2C%20festive%20atmosphere%20under%20clear%20sky&width=800&height=600&seq=byeolsandae-news&orientation=landscape', null, null, '[]'::jsonb, false, '2026-02-28'::date),
  ('news', '혜음원지 야간개장 <달빛기행> 7월 첫 선… 고려의 밤, 여수에서 만나다', 'https://readdy.ai/api/search-image?query=Ancient%20Korean%20historical%20site%20at%20night%20with%20soft%20lantern%20lighting%20traditional%20Korean%20architecture%20ruins%20under%20moonlight%20peaceful%20atmospheric%20night%20scene%20Goryeo%20dynasty%20heritage%20site%20with%20warm%20glowing%20lanterns%20along%20stone%20pathways%20serene%20cultural%20night%20tour&width=800&height=600&seq=hyeeum-night-news&orientation=landscape', null, null, '[]'::jsonb, false, '2026-06-05'::date),
  ('news', '여수호수공원에서 펼쳐지는 문화피크닉 <예술의 숲> 6월 개최', 'https://readdy.ai/api/search-image?query=Outdoor%20cultural%20picnic%20event%20at%20a%20lakeside%20park%20with%20families%20enjoying%20art%20installations%20live%20acoustic%20music%20on%20small%20stage%20picnic%20blankets%20on%20green%20grass%20Korean%20community%20cultural%20festival%20warm%20spring%20atmosphere%20with%20flowering%20trees%20and%20calm%20lake%20water%20Yeosu%20city%20park%20setting&width=800&height=600&seq=lake-picnic-news&orientation=landscape', null, null, '[]'::jsonb, false, '2026-06-03'::date),
  ('news', '율곡문화학당, 시민을 위한 ''인문학 산책'' 특강 시리즈 개설… 조선 선비의 삶과 지혜를 배우다', 'https://readdy.ai/api/search-image?query=Traditional%20Korean%20scholar%20study%20room%20with%20wooden%20interior%20warm%20lighting%20books%20and%20calligraphy%20materials%20serene%20contemplative%20atmosphere%20Korean%20Confucian%20academy%20style%20space%20with%20paper%20windows%20and%20wooden%20floor%20cultural%20heritage%20education%20program&width=800&height=600&seq=yulgok-human-news&orientation=landscape', null, null, '[]'::jsonb, false, '2026-05-20'::date),
  ('archive', '2025 여수포크페스티벌 현장 영상', 'https://public.readdy.ai/ai/img_res/edited_89acb803489bf608a284e90cdefb292f_c28165a8.jpg', 'video', null, '[]'::jsonb, false, '2025-09-20'::date),
  ('archive', '여수우정행복센터 개관 기념 공연 영상', 'https://public.readdy.ai/ai/img_res/edited_f20831ea7b779ee393bddb91c9eee580_c28165a8.jpg', 'video', null, '[]'::jsonb, false, '2025-06-10'::date),
  ('archive', '2025 실내악 시리즈 공연 영상', 'https://public.readdy.ai/ai/img_res/edited_57bdb839b35c1d1f4424b4b4b9a0b8d5_c28165a8.jpg', 'video', null, '[]'::jsonb, false, '2025-05-22'::date),
  ('archive', '꿈의 오케스트라 여수 정기연주회', 'https://public.readdy.ai/ai/img_res/edited_b088d3fe6da4b8c69a347f16ba2ae541_c28165a8.jpg', 'video', null, '[]'::jsonb, false, '2025-04-15'::date),
  ('archive', '2025 여수포크페스티벌 현장 사진', 'https://public.readdy.ai/ai/img_res/edited_89acb803489bf608a284e90cdefb292f_c28165a8.jpg', 'photo', null, '[]'::jsonb, false, '2025-09-21'::date),
  ('archive', '2026 문화살롱 2회차 현장 사진', 'https://public.readdy.ai/ai/img_res/edited_e35327b635d438b265e874405fa149c1_c28165a8.jpg', 'photo', null, '[]'::jsonb, false, '2026-06-11'::date),
  ('data', '[문화사업] 2025년 경기 생활문화 플랫폼 사업 <여수 생활문화 현황 리서치 및 라운드테이블> 결과자료집', null, null, null, '[{"name":"[문화사업] 2025년 경기 생활문화 플랫폼 사업 <여수 생활문화 현황 리서치 및 라운드테이블> 결과자료집.pdf","url":null,"ext":"PDF"}]'::jsonb, false, '2025-12-29'::date),
  ('data', '[문화사업] 2025년 마을문화 지원사업 <모두가 마을> 결과자료집', null, null, null, '[{"name":"[문화사업] 2025년 마을문화 지원사업 <모두가 마을> 결과자료집.pdf","url":null,"ext":"PDF"}]'::jsonb, false, '2025-12-29'::date),
  ('data', '[문화사업] 2025년 경기 민간문화공간 활성화 사업 <한뼘 더 커뮤니티> 결과자료집', null, null, null, '[{"name":"[문화사업] 2025년 경기 민간문화공간 활성화 사업 <한뼘 더 커뮤니티> 결과자료집.pdf","url":null,"ext":"PDF"}]'::jsonb, false, '2025-12-18'::date),
  ('data', '여수시 문화시설 설치 및 운영 조례', null, null, null, '[{"name":"여수시 문화시설 설치 및 운영 조례.hwp","url":null,"ext":"HWP"}]'::jsonb, false, '2025-11-14'::date)
) as v(board, title, image_url, media_type, media_url, attachments, is_pinned, published_at)
where not exists (
  select 1 from public.posts p where p.board = v.board and p.title = v.title
);

-- 확인
select board, count(*) from public.posts group by board order by board;
