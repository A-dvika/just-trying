import { TopNavigation } from "@/components/top-navigation"
import { ScheduleMigrationPage } from "@/components/schedule-migration-page"
import { Toaster } from "@/components/ui/toaster"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation />
      <main className="container mx-auto px-4 py-8">
        <ScheduleMigrationPage />
      </main>
      <Toaster />
    </div>
  )
}
