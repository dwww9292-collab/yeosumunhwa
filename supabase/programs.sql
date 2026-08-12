-- ============================================================
-- 사업소개(programs) DB화 + 첨부파일(이미지/PDF) Storage
-- SQL Editor 에 붙여넣고 Run 하세요. (시드는 한 번만)
-- ============================================================

create table if not exists public.programs (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null default '기타' check (category in ('교육','지원사업','행사','공연','기타')),
  status       text not null default '진행중' check (status in ('진행중','예정','종료')),
  image_url    text,
  location     text,
  date_range   text,
  body         text,
  contact      text,
  attachments  jsonb not null default '[]'::jsonb,   -- [{name, url}]
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.programs enable row level security;

drop policy if exists "programs_select_published" on public.programs;
create policy "programs_select_published" on public.programs
  for select using (is_published = true or public.is_admin());

drop policy if exists "programs_admin_write" on public.programs;
create policy "programs_admin_write" on public.programs
  for all using (public.is_admin()) with check (public.is_admin());

-- 사업소개 파일(이미지 + PDF 첨부) 버킷
insert into storage.buckets (id, name, public)
values ('program-files', 'program-files', true)
on conflict (id) do nothing;

drop policy if exists "program_files_public_read" on storage.objects;
create policy "program_files_public_read" on storage.objects
  for select using (bucket_id = 'program-files');

drop policy if exists "program_files_admin_write" on storage.objects;
create policy "program_files_admin_write" on storage.objects
  for all
  using (bucket_id = 'program-files' and public.is_admin())
  with check (bucket_id = 'program-files' and public.is_admin());

-- ------------------------------------------------------------
-- 기존 mock 사업 14건 시드 (한 번만 실행)
-- ------------------------------------------------------------
insert into public.programs (title, category, status, image_url, location, date_range, sort_order) values
('혜음원지 방문자센터 운영', '기타', '진행중', 'https://public.readdy.ai/ai/img_res/edited_2078e0733c1e19504ff485a91ed363a9_c28165a8.jpg', '혜음원지 방문자센터(여수시 광탄면 혜음로 430-31)', '2026-01-01(목) ~ 2026-12-31(목)', 1),
('가족과 함께하는 생활밀착형 문화예술교육 「가가호호」<모두기록> <모두원예> 참여자 모집', '교육', '진행중', 'https://public.readdy.ai/ai/img_res/edited_321905ed51441b47c90ebe7338ff3ca5_c28165a8.jpg', NULL, '2026-06-01(월) ~ 2026-06-15(월)', 2),
('[모집마감 안내] 시민과 함께하는 율곡문화학당 <예술+ 시민강좌> 정규·특강 참여자 모집', '교육', '진행중', 'https://public.readdy.ai/ai/img_res/edited_ab18ec01c070718068a69e6ab316fe92_c28165a8.jpg', '경기 여수시 법원읍 술이홀로 970-9, 율곡문화학당', '2026-05-26(화) ~ 2026-06-26(금)', 3),
('2026 혜음원지 방문자센터 어린이 단체관람 프로그램 〈쓱쓱! 혜음원지 유물 찾기〉', '행사', '진행중', 'https://public.readdy.ai/ai/img_res/edited_9d0fbd63a8527f58b4d17b654634e370_c28165a8.jpg', '혜음원지 방문자센터(여수시 광탄면 혜음로 430-31)', '2026-05-20(수) ~ 2026-11-30(월)', 4),
('2026년 경기 생활문화 공간 활성화 지원사업 <한뼘 더 커뮤니티> 모집 공고', '지원사업', '종료', 'https://public.readdy.ai/ai/img_res/edited_08fb2fb3314ba8641ae8844f8223f39b_c28165a8.jpg', NULL, '2026-05-11(월) ~ 2026-05-25(월)', 5),
('2026 문화기획학교 <기획의 발견>', '교육', '진행중', 'https://public.readdy.ai/ai/img_res/edited_ffd856ebafeca7183094613ec1d8e823_c28165a8.jpg', '여수 시민회관 3층 다목적실', '2026-05-04(월) ~ 2026-06-11(목)', 6),
('시민과 함께하는 율곡문화학당 <예술+ 시민강좌> 정규·특강 참여자 모집', '교육', '종료', 'https://public.readdy.ai/ai/img_res/edited_ab18ec01c070718068a69e6ab316fe92_c28165a8.jpg', '경기 여수시 법원읍 술이홀로 970-9, 율곡문화학당', '2026-05-06(수) ~ 2026-05-22(금)', 7),
('2026 인문학 탐방 <율곡과 우계에게 길을 묻다> 참여자 모집', '교육', '진행중', 'https://public.readdy.ai/ai/img_res/edited_bc12fb3f4f9ca75e99b825351a0734ca_c28165a8.jpg', '온라인 및 유선 접수 / 선착순 마감', '2026-03-06(금) ~ 2026-10-25(일)', 8),
('2026 혜음원지 문화해설사 양성과정 모집', '교육', '진행중', 'https://readdy.ai/api/search-image?query=Korean%20cultural%20heritage%20site%20guide%20training%20workshop%20with%20participants%20learning%20about%20Goryeo%20dynasty%20history%20in%20a%20modern%20classroom%20setting%2C%20maps%20and%20artifacts%20on%20display%2C%20professional%20yet%20warm%20atmosphere%2C%20educational%20cultural%20foundation%20program%2C%20natural%20lighting%20through%20windows%2C%20diverse%20age%20group%20of%20Korean%20adults%20engaged%20in%20learning&width=800&height=600&seq=hyeeum-guide-2026&orientation=landscape', '혜음원지 방문자센터(여수시 광탄면 혜음로 430-31)', '2026-06-08(월) ~ 2026-07-31(금)', 9),
('국가무형유산 여수별산대놀이 전수교육관 정기 강습 참여자 모집', '교육', '진행중', 'https://readdy.ai/api/search-image?query=Traditional%20Korean%20mask%20dance%20performance%20Yeosu%20Byeolsandae%20nori%20with%20colorful%20costumes%20and%20traditional%20masks%2C%20outdoor%20cultural%20heritage%20performance%2C%20vibrant%20and%20dynamic%20folk%20art%20scene%2C%20Korean%20intangible%20cultural%20heritage%2C%20performers%20in%20traditional%20hanbok%20with%20exaggerated%20masks%2C%20festive%20atmosphere%20under%20clear%20sky&width=800&height=600&seq=byeolsandae-2026&orientation=landscape', '여수별산대놀이 전수교육관(여수시 광적면)', '2026-04-01(수) ~ 2026-11-30(월)', 10),
('율곡문화학당 <인문학 산책> - 조선 선비의 삶과 지혜 특강 시리즈', '교육', '진행중', 'https://readdy.ai/api/search-image?query=Traditional%20Korean%20scholar%20study%20room%20with%20wooden%20interior%20warm%20lighting%20books%20and%20calligraphy%20materials%20serene%20contemplative%20atmosphere%20Korean%20Confucian%20academy%20style%20space%20with%20paper%20windows%20and%20wooden%20floor%20cultural%20heritage%20education%20program&width=800&height=600&seq=yulgok-human-2026&orientation=landscape', '율곡문화학당(여수시 법원읍 술이홀로 970-9)', '2026-06-15(월) ~ 2026-08-31(월)', 11),
('혜음원지 야간개장 <달빛기행> - 고려의 밤을 걷다', '행사', '진행중', 'https://readdy.ai/api/search-image?query=Ancient%20Korean%20historical%20site%20at%20night%20with%20soft%20lantern%20lighting%20traditional%20Korean%20architecture%20ruins%20under%20moonlight%20peaceful%20atmospheric%20night%20scene%20Goryeo%20dynasty%20heritage%20site%20with%20warm%20glowing%20lanterns%20along%20stone%20pathways%20serene%20cultural%20night%20tour&width=800&height=600&seq=hyeeum-night-2026&orientation=landscape', '혜음원지(여수시 광탄면 혜음로 430-31)', '2026-07-01(수) ~ 2026-08-31(월)', 12),
('2026 여수호수공원 문화피크닉 <예술의 숲>', '행사', '진행중', 'https://readdy.ai/api/search-image?query=Outdoor%20cultural%20picnic%20event%20at%20a%20lakeside%20park%20with%20families%20enjoying%20art%20installations%20live%20acoustic%20music%20on%20small%20stage%20picnic%20blankets%20on%20green%20grass%20Korean%20community%20cultural%20festival%20warm%20spring%20atmosphere%20with%20flowering%20trees%20and%20calm%20lake%20water%20Yeosu%20city%20park%20setting&width=800&height=600&seq=lake-picnic-2026&orientation=landscape', '여수호수공원(여수시 옥정동)', '2026-06-20(토) ~ 2026-06-21(일)', 13),
('2026 찾아가는 문화하루 - 여수 곳곳을 예술로 물들이다', '공연', '진행중', 'https://public.readdy.ai/ai/img_res/edited_10efdec102b0c023cd0144ac639ebc57_c28165a8.jpg', '여수시 관내 기업·학교·공원 등', '2026-04-01(수) ~ 2026-11-30(월)', 14);
