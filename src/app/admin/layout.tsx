import { requireAuth } from "@/lib/auth-server";
import { DashboardSidebar } from "@/shared/components/dashboard/side-bar";
import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { session } = await requireAuth()

  if (!session || session.user.role !== 'admin')
    redirect('/auth/sign-in')


  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="min-h-screen w-full relative">
        <SidebarTrigger className="absolute top-4 left-4" />
        {children}
      </main>
    </SidebarProvider>
  )
}
