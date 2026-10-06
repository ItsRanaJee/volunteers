-- Volunteers registration schema (applied identically to dev and prod)

create table public.volunteers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (
    char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  ),
  phone text check (phone is null or char_length(phone) <= 30),
  availability text check (availability is null or char_length(availability) <= 500),
  skills text check (skills is null or char_length(skills) <= 500),
  created_at timestamptz not null default now()
);

create unique index volunteers_email_unique on public.volunteers (lower(email));

-- Admins: users allowed to read registrations.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.admins enable row level security;
-- No policies on admins: nobody can read or write it through the API.
-- Add admins from the Supabase SQL editor: insert into public.admins values ('<user uuid>');

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Row Level Security: the real security boundary.
alter table public.volunteers enable row level security;

-- Anyone may register (insert only). Column checks above validate the data.
create policy "public can register"
  on public.volunteers for insert
  to anon, authenticated
  with check (true);

-- Only admins may read registrations. No public update/delete policies exist.
create policy "admins can read registrations"
  on public.volunteers for select
  to authenticated
  using (public.is_admin());
