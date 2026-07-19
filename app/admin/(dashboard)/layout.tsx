import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF8E6] flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8" id="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
