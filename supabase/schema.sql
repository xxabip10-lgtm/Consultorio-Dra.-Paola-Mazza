create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  phone text not null,
  reason text,
  status text not null default 'pendiente',
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id text primary key,
  title text not null,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists gallery_images (
  id text primary key,
  title text not null,
  src text not null,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists whatsapp_requests (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  created_at timestamptz not null default now()
);
