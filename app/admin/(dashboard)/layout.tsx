import { SessionProviderWrapper } from "@/components/admin/SessionProviderWrapper";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row">
        <AdminSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </SessionProviderWrapper>
  );
}
