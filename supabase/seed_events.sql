-- ============================================================
-- 기존 mock 샘플 데이터를 events 테이블로 이전 (한 번만 실행)
-- 먼저 events.sql 로 테이블을 만든 뒤 실행하세요.
-- ============================================================

insert into public.events (type, title, image_url, tag, location, start_date, end_date, sort_order) values
-- ===== 공연 (performance) =====
('performance', '[안내] 여수문화재단 기획공연 모바일 티켓 사용법', 'https://public.readdy.ai/ai/img_res/edited_5688a75bcf70dbdd45bec9121be637d5_c28165a8.jpg', '기획', '여수문화재단 공연장', '2026-02-27', '2026-12-31', 1),
('performance', '[기획] 찾아가는 문화하루 1회차 <정오의 하모니>', 'https://public.readdy.ai/ai/img_res/edited_10efdec102b0c023cd0144ac639ebc57_c28165a8.jpg', '기획', 'LG이노텍 여수사업장', '2026-06-10', '2026-06-10', 2),
('performance', '[기획] 2026 문화살롱 2회차 <오락가락(五樂歌樂) 콘서트: 청춘국악>', 'https://public.readdy.ai/ai/img_res/edited_e35327b635d438b265e874405fa149c1_c28165a8.jpg', '기획', '여수사랑행복센터 대공연장', '2026-06-11', '2026-06-11', 3),
('performance', '[기획] 2026 실내악 시리즈<브라보 브라스(Bravo Brass)>', 'https://public.readdy.ai/ai/img_res/edited_57bdb839b35c1d1f4424b4b4b9a0b8d5_c28165a8.jpg', '기획', '여수아트홀 공연장', '2026-06-19', '2026-06-19', 4),
('performance', '[대관] 여수시립소년소녀합창단 제5회 정기연주회「Mozart in Yangju」', 'https://public.readdy.ai/ai/img_res/edited_90cff594bad1289137ad7ef69a018cfd_c28165a8.jpg', '대관', '여수우정행복센터 공연장', '2026-06-20', '2026-06-20', 5),
('performance', '[대관] 제6회 여수시민오케스트라 정기연주회', 'https://public.readdy.ai/ai/img_res/edited_beb841ef883ac732dbd069a7d4e5f05f_c28165a8.jpg', '대관', '여수아트홀', '2026-06-27', '2026-06-27', 6),
('performance', '[대관] 지브리와 사랑에 빠지다: 지브리 영화음악 콘서트 2026 - 여수', 'https://public.readdy.ai/ai/img_res/edited_7f36ee7c881b04cce5fa2d1643e70c12_c28165a8.jpg', '대관', '여수아트홀', '2026-06-28', '2026-06-28', 7),
('performance', '[대관] 여수시립예술단 제55회 정기공연 어린이 뮤지컬<콩도사 인삼도사의 옛날 옛적에>', 'https://public.readdy.ai/ai/img_res/edited_7210ccfd0a56dc83aedc93e086ce5300_c28165a8.jpg', '대관', '여수우정행복센터 공연장', '2026-05-15', '2026-05-16', 8),

-- ===== 전시 (exhibition) =====
('exhibition', '[기획전시] 평화뮤지엄 S827 개관전 <평화의 빛, 미래의 길 "동행">', 'https://public.readdy.ai/ai/img_res/edited_419d5cf07d8effef86a0b1cfa0249a8b_c28165a8.jpg', '기획', '평화뮤지엄 S827', '2026-02-27', '2026-05-31', 1),
('exhibition', '[기획] 여수문화재단 초대작가전 <지역 예술의 새로운 시선>', 'https://public.readdy.ai/ai/img_res/edited_16af136d75a903c025c7f93cb9d13056_c28165a8.jpg', '기획', '여수문화재단 전시실(경기 여수시 광적면 부흥로618번길 303)', '2025-05-23', '2025-06-02', 2),

-- ===== 축제 (festival) =====
('festival', '[축제]2025년 제7회 여수호수공원 불꽃축제', 'https://public.readdy.ai/ai/img_res/edited_2d85f9f92c08c6a7b1c10cc325e82d37_c28165a8.jpg', '기획', '여수호수공원 일대', '2025-11-01', '2025-11-01', 1),
('festival', '[축제]2025년 제7회 여수호수공원 불꽃축제-불빛정원', 'https://public.readdy.ai/ai/img_res/edited_dc434192a322bd1e1637874278a2b3d4_c28165a8.jpg', '기획', '여수호수공원 꽃마당 인근 및 보행교', '2025-11-01', '2026-01-31', 2),
('festival', '[축제] 여수페이 페스타 2025', 'https://public.readdy.ai/ai/img_res/edited_2a505f186969406b2ebcc4ff479fd5e7_c28165a8.jpg', '기획', '여수중앙공원 일대', '2025-10-25', '2025-10-25', 3),
('festival', '[축제] 2025 여수포크페스티벌 본공연', 'https://public.readdy.ai/ai/img_res/edited_89acb803489bf608a284e90cdefb292f_c28165a8.jpg', '기획', '여수호수공원 야외공연장', '2025-09-19', '2025-09-20', 4),
('festival', '[축제] 2025 여수포크페스티벌 전야제', 'https://public.readdy.ai/ai/img_res/edited_89acb803489bf608a284e90cdefb292f_c28165a8.jpg', '기획', '여수사랑행복센터 대공연장', '2025-09-19', '2025-09-19', 5);
