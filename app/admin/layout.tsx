import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin — Beyond The Skin' },
  robots: { index: false, follow: false },
}

// The actual admin UI layout (sidebar + header) is applied per-page
// using a nested layout in app/admin/(dashboard)/layout.tsx
// The login page lives outside that group and uses its own minimal layout.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
