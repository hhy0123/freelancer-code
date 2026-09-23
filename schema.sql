drop table if exists request, approval, spec_item, project cascade;

-- Supabase SQL Editor에 통째로 붙여넣고 실행
create extension if not exists "pgcrypto";

create table project (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_name text not null default '',
  kind text not null default 'dev',
  owner_token text not null unique,
  client_token text not null unique,
  free_revisions int not null default 2,
  change_fee int not null default 50000,
  started boolean not null default false,
  created_at timestamptz not null default now()
);

create table spec_item (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete cascade,
  label text not null,
  value text not null default '',        -- '' = 미확정
  locked_at timestamptz,                 -- not null = 잠금
  locked_by text,                        -- 잠근 승인 단계 이름
  sort int not null default 0
);

create table approval (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete cascade,
  stage text not null,
  approved_at timestamptz not null default now()
);

create table request (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references project(id) on delete cascade,
  spec_item_id uuid references spec_item(id) on delete set null,  -- null = 목록에 없는 신규 요구
  body text not null,
  verdict text not null,                 -- 'free' | 'paid'
  reason text not null,
  fee int not null default 0,
  created_at timestamptz not null default now()
);

create index on spec_item (project_id);
create index on request (project_id);
create index on approval (project_id);

-- 접근 제어는 URL 토큰 + 서버 액션(service role)에서만 처리한다.
-- anon 키는 클라이언트에 노출되지 않으므로 RLS는 전부 잠가둔다.
alter table project enable row level security;
alter table spec_item enable row level security;
alter table approval enable row level security;
alter table request enable row level security;
