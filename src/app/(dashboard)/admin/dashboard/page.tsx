import AdminDashboard from "@/components/admin/dashboard/admin-dashboard"

export const metadata = {
  title: "Dashboard Admin",
  description: "Ringkasan statistik sistem surat masuk & pengguna",
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <AdminDashboard />
    </div>
  )
}