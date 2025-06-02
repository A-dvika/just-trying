"use client"

import { useState, useCallback } from "react"
import { Search, Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SystemsTable } from "@/components/systems-table"
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
    caliber: "High",
    pool: "Pool-A",
    os: "Windows 10",
    lastSeen: "2024-01-15",
  },
  {
    id: "SYS002",
    user: "adoe",
    division: "Finance",
    department: "Accounts",
    desktopName: "DESKTOP-002",
    caliber: "Medium",
    pool: "Pool-B",
    os: "Windows 10",
    lastSeen: "2024-01-14",
  },
  {
    id: "SYS003",
    user: "mjohnson",
    division: "HR",
    department: "Recruiting",
    desktopName: "DESKTOP-003",
    caliber: "Low",
    pool: "Pool-C",
    os: "Windows 10",
    lastSeen: "2024-01-13",
  },
  {
    id: "SYS004",
    user: "bwilson",
    division: "Marketing",
    department: "Digital",
    desktopName: "DESKTOP-004",
    caliber: "High",
    pool: "Pool-A",
    os: "Windows 10",
    lastSeen: "2024-01-12",
  },
  {
    id: "SYS005",
    user: "sgarcia",
    division: "Operations",
    department: "Logistics",
    desktopName: "DESKTOP-005",
    caliber: "Medium",
    pool: "Pool-B",
    os: "Windows 10",
    lastSeen: "2024-01-11",
  },
]

export function ScheduleMigrationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSystems, setFilteredSystems] = useState(mockSystems)
  const [selectedSystems, setSelectedSystems] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredSystems(mockSystems)
      return
    }

    const filtered = mockSystems.filter(
      (system) =>
        system.id.toLowerCase().includes(query.toLowerCase()) ||
        system.desktopName.toLowerCase().includes(query.toLowerCase()) ||
        system.user.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredSystems(filtered)
  }, [])

  const handleFileUpload = useCallback(
    (file: File) => {
      setUploadedFile(file)

      // Simulate file parsing
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const lines = content.split("\n")
        const ids = lines
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .slice(0, 10) // Limit to first 10 for demo

        // Filter systems based on uploaded IDs
        const matchedSystems = mockSystems.filter((system) =>
          ids.some(
            (id) =>
              system.id.toLowerCase().includes(id.toLowerCase()) ||
              system.desktopName.toLowerCase().includes(id.toLowerCase()),
          ),
        )

        setFilteredSystems(matchedSystems)

        toast({
          title: "File imported successfully",
          description: `Found ${matchedSystems.length} matching systems from ${ids.length} entries`,
        })
      }
      reader.readAsText(file)
    },
    [toast],
  )

  const handleFileRemove = () => {
    setUploadedFile(null)
    setFilteredSystems(mockSystems)
    setSearchQuery("")
  }

  const handleScheduleMigration = () => {
    if (selectedSystems.length === 0) {
      toast({
        title: "No systems selected",
        description: "Please select at least one system to schedule migration",
        variant: "destructive",
      })
      return
    }
    setIsModalOpen(true)
  }

  const handleMigrationScheduled = (batchName: string, migrationDate: string) => {
    toast({
      title: "Migration scheduled successfully",
      description: `Migration scheduled for ${selectedSystems.length} systems on ${migrationDate}`,
    })
    setSelectedSystems([])
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule Migration</h1>
        <p className="text-muted-foreground">Search for systems or import a file to schedule migrations</p>
      </div>

      {/* Manual Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Manual Search
          </CardTitle>
          <CardDescription>Search by system ID, desktop name, or username</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID or System Name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              disabled={!!uploadedFile}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File Import
          </CardTitle>
          <CardDescription>Upload a CSV or Excel file containing system IDs or names</CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedFile ? (
            <div className="flex items-center justify-between p-4 border border-dashed rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleFileRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center relative">
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop a file here</p>
                  <p className="text-sm text-muted-foreground">
                    Supports CSV and Excel files containing system IDs or names
                  </p>
                  <div className="flex justify-center mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" className="relative">
                        Select File
                        <input
                          id="file-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file)
                          }}
                          className="sr-only"
                        />
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
              {/* Add drag and drop functionality */}
              <div
                className="absolute inset-0"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const file = e.dataTransfer.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Table */}
      <SystemsTable
        systems={filteredSystems}
        selectedSystems={selectedSystems}
        onSelectionChange={setSelectedSystems}
      />

      {/* Floating Action Button */}
      {selectedSystems.length > 0 && (
        <div className="fixed bottom-6 right-6">
          <Button size="lg" onClick={handleScheduleMigration} className="shadow-lg">
            Schedule Migration ({selectedSystems.length})
          </Button>
        </div>
      )}

      {/* Schedule Migration Modal */}
      <ScheduleMigrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCount={selectedSystems.length}
        onSchedule={handleMigrationScheduled}
      />
    </div>
  )
}
