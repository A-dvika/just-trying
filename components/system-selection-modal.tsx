"use client"

import { useState, useCallback } from "react"
import { Search, Upload, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SystemsTable } from "@/components/systems-table"
import { useToast } from "@/hooks/use-toast"

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

interface SystemSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSystems: (systems: System[]) => void
  availableSystems: System[]
}

export function SystemSelectionModal({ isOpen, onClose, onAddSystems, availableSystems }: SystemSelectionModalProps) {
  const [selectionMethod, setSelectionMethod] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSystems, setFilteredSystems] = useState(availableSystems)
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (!query.trim()) {
        setFilteredSystems(availableSystems)
        return
      }

      const filtered = availableSystems.filter(
        (system) =>
          system.id.toLowerCase().includes(query.toLowerCase()) ||
          system.desktopName.toLowerCase().includes(query.toLowerCase()) ||
          system.user.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredSystems(filtered)
    },
    [availableSystems],
  )

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
        const matchedSystems = availableSystems.filter((system) =>
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
    [availableSystems, toast],
  )

  const handleAddToMigrationList = () => {
    const systemsToAdd = filteredSystems.filter((system) => selectedSystemIds.includes(system.id))
    onAddSystems(systemsToAdd)

    // Reset modal state
    setSelectedSystemIds([])
    setSearchQuery("")
    setUploadedFile(null)
    setFilteredSystems(availableSystems)
  }

  const handleMethodChange = (method: string) => {
    setSelectionMethod(method)
    setSelectedSystemIds([])
    setSearchQuery("")
    setUploadedFile(null)
    setFilteredSystems(availableSystems)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Systems to Schedule Migration</DialogTitle>
          <DialogDescription>Choose how you want to select systems for migration scheduling</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selection Method */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Selection Method</Label>
            <RadioGroup value={selectionMethod} onValueChange={handleMethodChange} className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="search" id="search" />
                <Label htmlFor="search">Search a Single System</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bulk" id="bulk" />
                <Label htmlFor="bulk">Bulk Import Systems (CSV)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Search Method */}
          {selectionMethod === "search" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by ID or System Name..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {/* Bulk Import Method */}
          {selectionMethod === "bulk" && (
            <div className="space-y-4">
              {uploadedFile ? (
                <div className="flex items-center justify-between p-4 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUploadedFile(null)
                      setFilteredSystems(availableSystems)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center relative">
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">Drop a CSV file here</p>
                      <p className="text-sm text-gray-500">Or click to select a file containing system IDs or names</p>
                      <div className="flex justify-center mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Button variant="outline" size="sm">
                            🔍 Import CSV
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
            </div>
          )}

          {/* Results Table */}
          <div className="space-y-4">
            <SystemsTable
              systems={filteredSystems}
              selectedSystems={selectedSystemIds}
              onSelectionChange={setSelectedSystemIds}
              showInModal={true}
            />
          </div>

          {/* Selected Systems Summary */}
          {selectedSystemIds.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                🧾 {selectedSystemIds.length} systems selected
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddToMigrationList}
            disabled={selectedSystemIds.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add to Migration List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
