-- ============================================================
-- 개인정보 패턴 자동 차단
--
-- 여수시 지침: "게시글 등록 시 주민번호, 전화번호 등 개인정보 패턴을
--              자동으로 감지해 등록을 차단하는 솔루션 탑재"
--
-- 프론트엔드(src/features/privacy/detect.ts)에서도 같은 검사를 하지만
-- 브라우저 코드는 우회할 수 있으므로 DB 트리거가 최종 차단선이다.
-- ⚠️ 규칙을 바꿀 때는 두 곳을 함께 고칠 것.
--
-- SQL Editor 에 붙여넣고 Run 하세요.
-- ============================================================

-- ------------------------------------------------------------
-- 검출 함수 — 발견되면 유형명, 없으면 null
-- ------------------------------------------------------------
create or replace function public.detect_pii(p_text text)
returns text
language plpgsql
immutable
as $$
begin
  if p_text is null or btrim(p_text) = '' then
    return null;
  end if;

  -- 주민등록번호 (생년월일 6자리 + 성별코드 1~4 + 6자리)
  if p_text ~ '(^|[^0-9])[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[-[:space:]]?[1-4][0-9]{6}([^0-9]|$)' then
    return '주민등록번호';
  end if;

  -- 외국인등록번호 (성별코드 5~8)
  if p_text ~ '(^|[^0-9])[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[-[:space:]]?[5-8][0-9]{6}([^0-9]|$)' then
    return '외국인등록번호';
  end if;

  -- 신용카드 (4-4-4-4)
  if p_text ~ '(^|[^0-9])[0-9]{4}[-[:space:]]?[0-9]{4}[-[:space:]]?[0-9]{4}[-[:space:]]?[0-9]{4}([^0-9]|$)' then
    return '카드번호';
  end if;

  -- 휴대폰 / 지역번호 유선전화
  if p_text ~ '(^|[^0-9])(01[016789]|02|0[3-6][0-9])[-.[:space:]]?[0-9]{3,4}[-.[:space:]]?[0-9]{4}([^0-9]|$)' then
    return '전화번호';
  end if;

  return null;
end;
$$;

-- ------------------------------------------------------------
-- 게시글 트리거
--   제목·본문·첨부파일명을 함께 검사한다.
--   관리자가 올리는 공고문에도 담당자 연락처가 들어가는 경우가 있어,
--   업무를 막지 않도록 "허용" 플래그를 둔다. 플래그를 켠 사람과 시각은
--   접속기록(access_logs)에 남는다.
-- ------------------------------------------------------------
alter table public.posts
  add column if not exists pii_reviewed boolean not null default false;

comment on column public.posts.pii_reviewed is
  '개인정보 패턴 검사 예외 처리 여부. 담당자 연락처 등 의도적으로 포함해야 하는 경우에만 true.';

create or replace function public.posts_pii_guard()
returns trigger
language plpgsql
as $$
declare
  hit text;
  attachment_names text;
begin
  if new.pii_reviewed then
    return new;   -- 검토를 거쳐 의도적으로 포함한 경우
  end if;

  select string_agg(value->>'name', ' ')
  into attachment_names
  from jsonb_array_elements(coalesce(new.attachments, '[]'::jsonb)) as value;

  hit := public.detect_pii(
    concat_ws(' ', new.title, new.body, attachment_names)
  );

  if hit is not null then
    raise exception
      '개인정보(%)로 보이는 내용이 포함되어 저장할 수 없습니다. 해당 부분을 삭제하거나, 반드시 필요한 경우 관리자에게 예외 처리를 요청하세요.', hit
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists posts_pii_guard on public.posts;
create trigger posts_pii_guard
  before insert or update on public.posts
  for each row execute function public.posts_pii_guard();

-- ------------------------------------------------------------
-- 대관 신청 트리거
--   신청자 이름·연락처·이메일은 수집 동의를 받은 정식 항목이므로 검사 대상이 아니다.
--   자유 입력란(목적·비고)에 주민번호 등이 들어오는 것만 막는다.
-- ------------------------------------------------------------
create or replace function public.rentals_pii_guard()
returns trigger
language plpgsql
as $$
declare
  hit text;
begin
  hit := public.detect_pii(concat_ws(' ', new.purpose, new.memo));

  if hit is not null then
    raise exception
      '요청사항에 개인정보(%)로 보이는 내용이 포함되어 있습니다. 해당 부분을 삭제한 뒤 다시 신청해 주세요.', hit
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists rentals_pii_guard on public.rental_applications;
create trigger rentals_pii_guard
  before insert or update on public.rental_applications
  for each row execute function public.rentals_pii_guard();

-- ------------------------------------------------------------
-- 동작 확인
-- ------------------------------------------------------------
select public.detect_pii('문의는 010-1234-5678 로 주세요')       as should_be_phone,
       public.detect_pii('주민번호 900101-1234567 입니다')        as should_be_rrn,
       public.detect_pii('2026년 공연 안내입니다')                as should_be_null;
