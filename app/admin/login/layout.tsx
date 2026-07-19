// Admin login page does NOT use the admin layout (no sidebar/header needed)
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
