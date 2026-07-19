import { z } from 'zod'

// ─── Story Submission ──────────────────────────────────────────────────────────
export const storyFormSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters'),
  age: z
    .number()
    .int('Age must be a whole number')
    .min(10, 'You must be at least 10 years old')
    .max(25, 'This platform is for teenage girls up to 25'),
  school: z
    .string()
    .min(2, 'School name must be at least 2 characters')
    .max(150, 'School name must be at most 150 characters'),
  phone_number: z
    .string()
    .regex(/^[0-9+\-\s()]{8,20}$/, 'Enter a valid phone number')
    .optional()
    .or(z.literal('')),
  category_id: z.string().uuid('Please select a valid category'),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters'),
  content: z
    .string()
    .min(100, 'Your story must be at least 100 characters')
    .max(10000, 'Your story must be at most 10,000 characters'),
  reflection: z
    .string()
    .min(20, 'Reflection must be at least 20 characters')
    .max(2000, 'Reflection must be at most 2,000 characters'),
  changemaker_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  changemaker_reason: z
    .string()
    .min(10, 'Please tell us why this person inspired you')
    .max(1000, 'Reason must be at most 1,000 characters'),
  publish_consent: z.literal(true, {
    error: 'You must consent to publish your story',
  }),
  privacy_agreement: z.literal(true, {
    error: 'You must agree to the privacy policy',
  }),
})

export type StoryFormSchema = z.infer<typeof storyFormSchema>

// ─── Comment ───────────────────────────────────────────────────────────────────
export const commentFormSchema = z.object({
  author_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be at most 80 characters'),
  content: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .max(500, 'Message must be at most 500 characters'),
})

export type CommentFormSchema = z.infer<typeof commentFormSchema>

// ─── Admin Login ───────────────────────────────────────────────────────────────
export const adminLoginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type AdminLoginSchema = z.infer<typeof adminLoginSchema>

// ─── Article ───────────────────────────────────────────────────────────────────
export const articleFormSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters'),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().max(300, 'Excerpt must be at most 300 characters').optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  author_name: z.string().min(2).max(100),
  category_id: z.string().uuid('Please select a valid category'),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()).optional(),
})

export type ArticleFormSchema = z.infer<typeof articleFormSchema>

// ─── Story Moderation ─────────────────────────────────────────────────────────
export const storyModerationSchema = z.object({
  action: z.enum(['approve', 'reject', 'publish']),
  rejection_reason: z.string().max(500).optional(),
  admin_notes: z.string().max(1000).optional(),
})

export type StoryModerationSchema = z.infer<typeof storyModerationSchema>

// ─── Spotlight ─────────────────────────────────────────────────────────────────
export const spotlightSchema = z.object({
  story_id: z.string().uuid(),
  week_start: z.string(),
  week_end: z.string(),
  message: z.string().max(500).optional(),
})

export type SpotlightSchema = z.infer<typeof spotlightSchema>

// ─── Changemaker Winner ────────────────────────────────────────────────────────
export const changemakerwWinnerSchema = z.object({
  name: z.string().min(2).max(100),
  school: z.string().min(2).max(150),
  biography: z.string().max(1000).optional(),
  reason: z.string().min(10).max(1000),
  impact: z.string().max(1000).optional(),
  inspirational_message: z.string().max(500).optional(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
  nomination_count: z.number().int().min(0).optional(),
})

export type ChangemakerWinnerSchema = z.infer<typeof changemakerwWinnerSchema>
