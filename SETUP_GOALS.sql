-- PROJECT NEW ME: secure goals table
-- Run this once in Supabase Dashboard > SQL Editor > New query.
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  description text check (description is null or char_length(description) <= 300),
  category text not null default 'Learning',
  target_date date,
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamptz not null default now()
);
alter table public.goals enable row level security;
drop policy if exists "Users can view their own goals" on public.goals;
drop policy if exists "Users can create their own goals" on public.goals;
drop policy if exists "Users can update their own goals" on public.goals;
drop policy if exists "Users can delete their own goals" on public.goals;
create policy "Users can view their own goals" on public.goals for select to authenticated using (auth.uid() = user_id);
create policy "Users can create their own goals" on public.goals for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own goals" on public.goals for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own goals" on public.goals for delete to authenticated using (auth.uid() = user_id);
create index if not exists goals_user_id_created_at_idx on public.goals (user_id, created_at desc);
