"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SystemSelectionModal } from "@/components/system-selection-modal"
import { SelectedSystemsTable } from "@/components/selected-systems-table"
import { ScheduleMigrationModal } from "@/components/schedule-migration-modal"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockSystems = [
  {
    id: "SYS001",
    user: "jsmith",
    division: "IT",
    department: "Support",
    desktopName: "DESKTOP-001",
    caliber: "Prod-A",
    pool: "QA",
    os: "Windows 10",
    lastSeen: "2024-01-15",
  },
  {
    id: "SYS002",
    user: "adoe",
    division: "Finance",
    department: "Accounts",
    desktopName: "DESKTOP-002",
    caliber: "Prod-B",
    pool: "QA",
    os: "Windows 10",
    lastSeen: "2024-01-14",
  },
  {
    id: "SYS003",
    user: "mjohnson",
    division: "HR",
    department: "Recruiting",
    desktopName: "DESKTOP-003",
    caliber: "Prod-C",
    pool: "QA",
    os: "Windows 11",
    lastSeen: "2024-01-13",
  },
  {
    id: "SYS004",
    user: "bwilson",
    division: "Marketing",
    department: "Digital",
    desktopName: "DESKTOP-004",
    caliber: "Prod-A",
    pool: "QA",
    os: "Windows 10",
    lastSeen: "2024-01-12",
  },
  {
    id: "SYS005",
    user: "sgarcia",
    division: "Operations",
    department: "Logistics",
    desktopName: "DESKTOP-005",
    caliber: "Prod-B",
    pool: "QA",
    os: "Windows 10",
    lastSeen: "2024-01-11",
  },
]

interface System {
  id: string
  user: string
  division: string
  department: string
  desktopName: string
  caliber: string
  pool: string
  os: string
  lastSeen: string
}

export function ScheduleMigrationPage() {
  const [selectedSystems, setSelectedSystems] = useState<System[]>([])
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const { toast } = useToast()

  const handleAddSystems = (systems: System[]) => {
    // Avoid duplicates
    const newSystems = systems.filter((system) => !selectedSystems.some((selected) => selected.id === system.id))
    setSelectedSystems([...selectedSystems, ...newSystems])
    setIsSelectionModalOpen(false)

    if (newSystems.length > 0) {
      toast({
        title: "Systems added successfully",
        description: `Added ${newSystems.length} systems to migration list`,
      })
    }
  }

  const handleRemoveSystem = (systemId: string) => {
    setSelectedSystems(selectedSystems.filter((system) => system.id !== systemId))
    toast({
      title: "System removed",
      description: "System removed from migration list",
    })
  }

  const handleScheduleMigration = () => {
    if (selectedSystems.length === 0) {
      toast({
        title: "No systems selected",
        description: "Please add systems to schedule migration",
        variant: "destructive",
      })
      return
    }
    setIsScheduleModalOpen(true)
  }

  const handleMigrationScheduled = (batchName: string, migrationDate: string) => {
    toast({
      title: "Migration scheduled successfully",
      description: `Migration scheduled for ${selectedSystems.length} systems on ${migrationDate}`,
    })
    setSelectedSystems([])
    setIsScheduleModalOpen(false)
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Schedule Migration</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Add systems and schedule migrations for your organization
          </p>
        </div>
        <Button
          onClick={() => setIsSelectionModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Systems for Migration
        </Button>
      </div>

      {/* Selected Systems Section */}
      {selectedSystems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Selected Systems</h2>
          <SelectedSystemsTable systems={selectedSystems} onRemoveSystem={handleRemoveSystem} />

          {/* Schedule Migration Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={handleScheduleMigration} className="bg-green-600 hover:bg-green-700 text-white" size="lg">
              📆 Schedule Migration
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedSystems.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No systems selected</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding systems to your migration list</p>
          <Button onClick={() => setIsSelectionModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-5 w-5 mr-2" />
            Add Systems for Migration
          </Button>
        </div>
      )}

      {/* Modals */}
      <SystemSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        onAddSystems={handleAddSystems}
        availableSystems={mockSystems}
      />

      <ScheduleMigrationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        selectedCount={selectedSystems.length}
        onSchedule={handleMigrationScheduled}
      />
    </div>
  )
}
