-- ============================================================
-- Beyond The Skin Project — Complete Database Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on profiles(role);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORY CATEGORIES
-- ============================================================
create table if not exists story_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  color text not null default '#FFB6D6',
  created_at timestamptz not null default now()
);

-- Seed story categories
insert into story_categories (name, slug, description, color) values
  ('Skin Insecurity', 'skin-insecurity', 'Stories about skin-related insecurities and journeys to self acceptance', '#FFB6D6'),
  ('Self Confidence', 'self-confidence', 'Journeys toward building inner confidence and self-belief', '#E8B4F0'),
  ('School Life', 'school-life', 'Experiences navigating school, peers, and academic pressure', '#BDE1FF'),
  ('Body Image', 'body-image', 'Stories about body acceptance and overcoming body image struggles', '#C6F4E9'),
  ('Personal Growth', 'personal-growth', 'Transformative experiences and lessons learned', '#FFF3B0'),
  ('Others', 'others', 'Other meaningful stories that do not fit the above categories', '#FFE9F1')
on conflict (slug) do nothing;

-- ============================================================
-- STORIES
-- ============================================================
create table if not exists stories (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  age integer not null check (age >= 10 and age <= 25),
  school text not null,
  phone_number text,
  category_id uuid not null references story_categories(id),
  title text not null,
  content text not null,
  reflection text not null,
  changemaker_name text not null,
  changemaker_reason text not null,
  publish_consent boolean not null default false,
  privacy_agreement boolean not null default false,
  status text not null default 'pending' check (status in ('draft','pending','approved','rejected','published')),
  cover_image_url text,
  rejection_reason text,
  view_count integer not null default 0,
  is_spotlight boolean not null default false,
  admin_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stories_status_idx on stories(status);
create index if not exists stories_category_idx on stories(category_id);
create index if not exists stories_published_at_idx on stories(published_at desc);
create index if not exists stories_submitted_at_idx on stories(submitted_at desc);

-- ============================================================
-- COMMENTS
-- ============================================================
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  story_id uuid not null references stories(id) on delete cascade,
  author_name text not null,
  content text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists comments_story_idx on comments(story_id);
create index if not exists comments_status_idx on comments(status);

-- ============================================================
-- ARTICLE CATEGORIES
-- ============================================================
create table if not exists article_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  section text not null check (section in ('skin_talk','girl_talk','creators_corner')),
  description text,
  color text not null default '#FFB6D6',
  created_at timestamptz not null default now()
);

-- Seed article categories
insert into article_categories (name, slug, section, color) values
  ('Teen Skincare', 'teen-skincare', 'skin_talk', '#FFB6D6'),
  ('Healthy Habits', 'healthy-habits', 'skin_talk', '#FFB6D6'),
  ('Dermatologist Tips', 'dermatologist-tips', 'skin_talk', '#FFB6D6'),
  ('Self Confidence', 'self-confidence', 'girl_talk', '#E8B4F0'),
  ('Body Image', 'body-image-talk', 'girl_talk', '#E8B4F0'),
  ('Friendship', 'friendship', 'girl_talk', '#E8B4F0'),
  ('School Pressure', 'school-pressure', 'girl_talk', '#E8B4F0'),
  ('Mental Wellbeing', 'mental-wellbeing', 'girl_talk', '#E8B4F0'),
  ('Public Speaking', 'public-speaking', 'creators_corner', '#BDE1FF'),
  ('Photography', 'photography', 'creators_corner', '#BDE1FF'),
  ('Content Creation', 'content-creation', 'creators_corner', '#BDE1FF'),
  ('Personal Branding', 'personal-branding', 'creators_corner', '#BDE1FF')
on conflict (slug) do nothing;

-- ============================================================
-- ARTICLE TAGS
-- ============================================================
create table if not exists article_tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ARTICLES
-- ============================================================
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_id uuid references profiles(id) on delete set null,
  author_name text not null,
  category_id uuid not null references article_categories(id),
  status text not null default 'draft' check (status in ('draft','published')),
  view_count integer not null default 0,
  reading_time integer not null default 1,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_idx on articles(status);
create index if not exists articles_slug_idx on articles(slug);
create index if not exists articles_category_idx on articles(category_id);
create index if not exists articles_published_at_idx on articles(published_at desc);

-- ============================================================
-- ARTICLE TAG RELATIONS
-- ============================================================
create table if not exists article_tag_relations (
  article_id uuid not null references articles(id) on delete cascade,
  tag_id uuid not null references article_tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- ============================================================
-- WEEKLY SPOTLIGHTS
-- ============================================================
create table if not exists weekly_spotlights (
  id uuid primary key default uuid_generate_v4(),
  story_id uuid not null references stories(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  message text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists weekly_spotlights_active_idx on weekly_spotlights(is_active);

-- ============================================================
-- CHANGEMAKER NOMINATIONS
-- ============================================================
create table if not exists changemaker_nominations (
  id uuid primary key default uuid_generate_v4(),
  story_id uuid not null references stories(id) on delete cascade,
  nominee_name text not null,
  nominee_school text not null,
  reason text not null,
  month integer not null check (month >= 1 and month <= 12),
  year integer not null,
  created_at timestamptz not null default now()
);

create index if not exists changemaker_nominations_month_year_idx on changemaker_nominations(month, year);

-- ============================================================
-- CHANGEMAKER WINNERS
-- ============================================================
create table if not exists changemaker_winners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  school text not null,
  biography text,
  photo_url text,
  reason text not null,
  impact text,
  inspirational_message text,
  month integer not null check (month >= 1 and month <= 12),
  year integer not null,
  nomination_count integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists changemaker_winners_month_year_idx on changemaker_winners(month, year);
create index if not exists changemaker_winners_active_idx on changemaker_winners(is_active);

-- ============================================================
-- PAGE VIEWS
-- ============================================================
create table if not exists page_views (
  id uuid primary key default uuid_generate_v4(),
  page text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_page_idx on page_views(page);
create index if not exists page_views_created_at_idx on page_views(created_at desc);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Seed default settings
insert into site_settings (key, value) values
  ('site_name', '"Beyond The Skin Project"'),
  ('site_tagline', '"Every girl deserves to be seen beyond her skin."'),
  ('submission_enabled', 'true'),
  ('contact_email', '"hello@beyondtheskin.id"')
on conflict (key) do nothing;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notifications_admin_idx on notifications(admin_id);
create index if not exists notifications_read_idx on notifications(is_read);

-- ============================================================
-- MEDIA
-- ============================================================
create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  file_path text not null,
  file_size integer not null,
  mime_type text not null,
  bucket text not null,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references profiles(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_admin_idx on audit_logs(admin_id);
create index if not exists audit_logs_entity_idx on audit_logs(entity_type, entity_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table story_categories enable row level security;
alter table stories enable row level security;
alter table comments enable row level security;
alter table article_categories enable row level security;
alter table article_tags enable row level security;
alter table articles enable row level security;
alter table article_tag_relations enable row level security;
alter table weekly_spotlights enable row level security;
alter table changemaker_nominations enable row level security;
alter table changemaker_winners enable row level security;
alter table page_views enable row level security;
alter table site_settings enable row level security;
alter table notifications enable row level security;
alter table media enable row level security;
alter table audit_logs enable row level security;

-- ============================================================
-- HELPER FUNCTION: check if current user is admin
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- RLS POLICIES: PROFILES
-- ============================================================
create policy "Public can view own profile" on profiles for select using (auth.uid() = id);
create policy "Admin can view all profiles" on profiles for select using (public.is_admin());
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- ============================================================
-- RLS POLICIES: STORY CATEGORIES (public read)
-- ============================================================
create policy "Anyone can view story categories" on story_categories for select using (true);
create policy "Admin can manage story categories" on story_categories for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: STORIES
-- ============================================================
-- Public: only see published stories (no phone number exposure)
create policy "Public can view published stories" on stories
  for select using (status = 'published');

-- Anyone can submit a story (INSERT)
create policy "Anyone can submit a story" on stories
  for insert with check (true);

-- Admins can see and modify all stories
create policy "Admin can manage all stories" on stories
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: COMMENTS
-- ============================================================
create policy "Public can view approved comments" on comments
  for select using (status = 'approved');

create policy "Anyone can submit a comment" on comments
  for insert with check (true);

create policy "Admin can manage all comments" on comments
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: ARTICLE CATEGORIES (public read)
-- ============================================================
create policy "Anyone can view article categories" on article_categories
  for select using (true);
create policy "Admin can manage article categories" on article_categories
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: ARTICLE TAGS (public read)
-- ============================================================
create policy "Anyone can view article tags" on article_tags
  for select using (true);
create policy "Admin can manage article tags" on article_tags
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: ARTICLES
-- ============================================================
create policy "Public can view published articles" on articles
  for select using (status = 'published');

create policy "Admin can manage all articles" on articles
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: ARTICLE TAG RELATIONS
-- ============================================================
create policy "Public can view article tag relations" on article_tag_relations
  for select using (true);
create policy "Admin can manage article tag relations" on article_tag_relations
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: WEEKLY SPOTLIGHTS
-- ============================================================
create policy "Public can view active spotlights" on weekly_spotlights
  for select using (is_active = true);
create policy "Admin can manage spotlights" on weekly_spotlights
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: CHANGEMAKER NOMINATIONS
-- ============================================================
-- Nominations are private (submitted with story)
create policy "Admin can manage nominations" on changemaker_nominations
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: CHANGEMAKER WINNERS
-- ============================================================
create policy "Public can view active winners" on changemaker_winners
  for select using (is_active = true);
create policy "Admin can manage winners" on changemaker_winners
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: PAGE VIEWS
-- ============================================================
create policy "Anyone can insert page views" on page_views
  for insert with check (true);
create policy "Admin can view page views" on page_views
  for select using (public.is_admin());

-- ============================================================
-- RLS POLICIES: SITE SETTINGS
-- ============================================================
create policy "Public can read site settings" on site_settings
  for select using (true);
create policy "Admin can manage site settings" on site_settings
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: NOTIFICATIONS
-- ============================================================
create policy "Admin can view own notifications" on notifications
  for select using (admin_id = auth.uid() and public.is_admin());
create policy "Admin can update own notifications" on notifications
  for update using (admin_id = auth.uid() and public.is_admin());

-- ============================================================
-- RLS POLICIES: MEDIA
-- ============================================================
create policy "Admin can manage media" on media
  for all using (public.is_admin());

-- ============================================================
-- RLS POLICIES: AUDIT LOGS
-- ============================================================
create policy "Admin can view audit logs" on audit_logs
  for select using (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public) values ('story-covers', 'story-covers', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('article-covers', 'article-covers', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('changemaker-photos', 'changemaker-photos', true) on conflict do nothing;

-- Storage policies
create policy "Public can view story covers" on storage.objects for select using (bucket_id = 'story-covers');
create policy "Admin can upload story covers" on storage.objects for insert with check (bucket_id = 'story-covers' and public.is_admin());
create policy "Admin can delete story covers" on storage.objects for delete using (bucket_id = 'story-covers' and public.is_admin());

create policy "Public can view article covers" on storage.objects for select using (bucket_id = 'article-covers');
create policy "Admin can upload article covers" on storage.objects for insert with check (bucket_id = 'article-covers' and public.is_admin());
create policy "Admin can delete article covers" on storage.objects for delete using (bucket_id = 'article-covers' and public.is_admin());

create policy "Public can view changemaker photos" on storage.objects for select using (bucket_id = 'changemaker-photos');
create policy "Admin can upload changemaker photos" on storage.objects for insert with check (bucket_id = 'changemaker-photos' and public.is_admin());

-- ============================================================
-- FUNCTION: Get monthly changemaker nominations count
-- ============================================================
create or replace function public.get_monthly_changemaker(p_month integer, p_year integer)
returns table (
  nominee_name text,
  nominee_school text,
  reason text,
  nomination_count bigint
) language sql security definer set search_path = public as $$
  select
    nominee_name,
    nominee_school,
    max(reason) as reason,
    count(*) as nomination_count
  from changemaker_nominations
  where month = p_month and year = p_year
  group by nominee_name, nominee_school
  order by nomination_count desc;
$$;
