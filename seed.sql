-- 발표 시연용 데이터. schema.sql 실행 후 붙여넣기.
-- 작업자 화면:    /p/11111111-1111-1111-1111-111111111111
-- 클라이언트 화면: /p/22222222-2222-2222-2222-222222222222

delete from project where owner_token = '11111111-1111-1111-1111-111111111111';

insert into project (id, title, client_name, kind, owner_token, client_token, free_revisions, change_fee, started)
values ('33333333-3333-3333-3333-333333333333', '사내 재고관리 웹 구축', '김대표', 'dev',
        '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 2, 50000, true);

insert into approval (project_id, stage, approved_at)
values ('33333333-3333-3333-3333-333333333333', '1차 검수', now() - interval '12 days');

insert into spec_item (project_id, label, value, locked_at, locked_by, sort) values
('33333333-3333-3333-3333-333333333333', '구현 범위 (화면/기능 목록)', '입고·출고·재고현황 3개 화면', now() - interval '12 days', '1차 검수', 0),
('33333333-3333-3333-3333-333333333333', '지원 브라우저·기기',         'Chrome, Edge (PC 전용)',      now() - interval '12 days', '1차 검수', 1),
('33333333-3333-3333-3333-333333333333', '데이터 이관 포함 여부',       '기존 엑셀 1회 이관 포함',      now() - interval '12 days', '1차 검수', 2),
('33333333-3333-3333-3333-333333333333', '배포 환경 및 계정 주체',      'Vercel, 클라이언트 계정',      now() - interval '12 days', '1차 검수', 3),
('33333333-3333-3333-3333-333333333333', '인수인계 형태 (문서/코드/교육)', '', null, null, 4),
('33333333-3333-3333-3333-333333333333', '유지보수 기간',              '', null, null, 5);

insert into request (project_id, spec_item_id, body, verdict, reason, fee, created_at)
select '33333333-3333-3333-3333-333333333333', id,
       '인수인계는 문서 말고 화상으로 한 번 설명해 주실 수 있나요?', 'free',
       '‘인수인계 형태 (문서/코드/교육)’은(는) 아직 확정되지 않은 항목입니다. 작업 전에 확인하지 않은 쪽의 책임이므로 무료입니다.',
       0, now() - interval '3 days'
from spec_item where project_id = '33333333-3333-3333-3333-333333333333' and sort = 4;

-- 클릭 없이 화면만 가리켜도 되도록, 유상 판정 예시도 미리 넣어둔다.
insert into request (project_id, spec_item_id, body, verdict, reason, fee, created_at)
select '33333333-3333-3333-3333-333333333333', id,
       '역시 IE11도 지원해주세요', 'paid',
       '‘지원 브라우저·기기’은(는) 9월 11일 1차 검수 단계에서 클라이언트가 직접 확정한 항목입니다. 이미 정한 걸 다시 바꾸자는 요청입니다.',
       50000, now() - interval '20 hours'
from spec_item where project_id = '33333333-3333-3333-3333-333333333333' and sort = 1;
