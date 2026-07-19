import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a date to a readable string */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMMM d, yyyy')
}

/** Format a date to relative time (e.g. "3 days ago") */
export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/** Estimate reading time in minutes */
export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

/** Truncate text to a given length */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '…'
}

/** Generate a URL-safe slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Get initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Map story status to a display label and color */
export function getStatusConfig(status: string): {
  label: string
  color: string
  bg: string
} {
  const configs: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100' },
    pending: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-100' },
    approved: { label: 'Approved', color: 'text-green-700', bg: 'bg-green-100' },
    rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100' },
    published: { label: 'Published', color: 'text-purple-700', bg: 'bg-purple-100' },
  }
  return configs[status] ?? { label: status, color: 'text-gray-600', bg: 'bg-gray-100' }
}

/** Get story category color */
export function getCategoryColor(slug: string): string {
  const colors: Record<string, string> = {
    'skin-insecurity': '#FFB6D6',
    'self-confidence': '#E8B4F0',
    'school-life': '#BDE1FF',
    'body-image': '#C6F4E9',
    'personal-growth': '#FFF3B0',
    others: '#FFE9F1',
  }
  return colors[slug] ?? '#FFB6D6'
}

/** Map article section to display label */
export function getSectionLabel(section: string): string {
  const labels: Record<string, string> = {
    skin_talk: 'Skin Talk',
    girl_talk: 'Girl Talk',
    creators_corner: "Creator's Corner",
  }
  return labels[section] ?? section
}

/** Get month name from number */
export function getMonthName(month: number): string {
  return new Date(2000, month - 1).toLocaleString('default', { month: 'long' })
}

/** Format large numbers */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

/** Strip HTML tags from content */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/** Build absolute URL */
export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return `${base}${path}`
}
