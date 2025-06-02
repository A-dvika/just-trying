import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ScheduleMigrationPage } from "@/components/schedule-migration-page"
import { Toaster } from "@/components/ui/toaster"

export default function Page() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Migration Management</h1>
          </div>
        </header>
        <main className="flex-1 p-6">
          <ScheduleMigrationPage />
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
