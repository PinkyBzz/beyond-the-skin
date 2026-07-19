import type { Database } from './database'

// ─── Table Row Types ───────────────────────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Story = Database['public']['Tables']['stories']['Row']
export type StoryCategory = Database['public']['Tables']['story_categories']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type ArticleCategory = Database['public']['Tables']['article_categories']['Row']
export type ArticleTag = Database['public']['Tables']['article_tags']['Row']
export type ArticleTagRelation = Database['public']['Tables']['article_tag_relations']['Row']
export type WeeklySpotlight = Database['public']['Tables']['weekly_spotlights']['Row']
export type ChangemakerNomination = Database['public']['Tables']['changemaker_nominations']['Row']
export type ChangemakerWinner = Database['public']['Tables']['changemaker_winners']['Row']
export type PageView = Database['public']['Tables']['page_views']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']

// ─── Enums ─────────────────────────────────────────────────────────────────────
export type StoryStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published'
export type CommentStatus = 'pending' | 'approved' | 'rejected'
export type ArticleStatus = 'draft' | 'published'
export type ArticleSection = 'skin_talk' | 'girl_talk' | 'creators_corner'
export type UserRole = 'user' | 'admin'

// ─── Enriched Types ────────────────────────────────────────────────────────────
export type StoryWithCategory = Story & {
  story_categories: StoryCategory
}

export type ArticleWithCategory = Article & {
  article_categories: ArticleCategory
  article_tag_relations?: Array<{
    article_tags: ArticleTag
  }>
}

export type SpotlightWithStory = WeeklySpotlight & {
  stories: StoryWithCategory
}

export type CommentWithStory = Comment & {
  stories?: Pick<Story, 'id' | 'title'>
}

// ─── Story Form Types ──────────────────────────────────────────────────────────
export interface StoryFormData {
  full_name: string
  age: number
  school: string
  phone_number?: string
  category_id: string
  title: string
  content: string
  reflection: string
  changemaker_name: string
  changemaker_reason: string
  publish_consent: boolean
  privacy_agreement: boolean
}

// ─── Comment Form ──────────────────────────────────────────────────────────────
export interface CommentFormData {
  author_name: string
  content: string
}

// ─── Pagination ────────────────────────────────────────────────────────────────
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── API Response ──────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ─── Filter & Sort ─────────────────────────────────────────────────────────────
export type SortOrder = 'newest' | 'oldest' | 'popular'

export interface StoryFilters {
  category?: string
  sort?: SortOrder
  page?: number
  search?: string
}

export interface ArticleFilters {
  section?: ArticleSection
  category?: string
  sort?: SortOrder
  page?: number
  search?: string
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────────
export interface DashboardStats {
  pendingStories: number
  publishedStories: number
  totalArticles: number
  pendingComments: number
  totalVisitors: number
  storiesThisMonth: number
}

// ─── Search ────────────────────────────────────────────────────────────────────
export interface SearchResult {
  type: 'story' | 'article'
  id: string
  title: string
  excerpt: string
  slug?: string
  category: string
  url: string
}
