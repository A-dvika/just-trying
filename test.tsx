// File: components/SystemSelectionModal.tsx

"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Search, Upload, X } from "lucide-react"

import { Modal, ModalHeader, ModalBody, ModalFooter } from "@gs-ux-uitoolkit-react/modal"
import { Button } from "@gs-ux-uitoolkit-react/button"
import { Input } from "@gs-ux-uitoolkit-react/input"
import { Label } from "@gs-ux-uitoolkit-react/label"
import { Radio } from "@gs-ux-uitoolkit-react/radio"
import { Checkbox } from "@gs-ux-uitoolkit-react/checkbox"

// Import the GSUI DataGrid and related types:
import {
  DataGrid,
  DataGridColumnDef,
  DataGridRowSelectionModel,
} from "@gs-ux-uitoolkit-react/datagrid"

import { useToast } from "../hooks/useToast"

// -----------------------------------------
// 1) Your System interface (fields used below)
// -----------------------------------------
export interface System {
  id: string
  user: string
  division: string
  department: string
  desktopName: string
  caliber: string
  pool: string
  datacenter: string
  cabinet: string
  hypervisor: string
}

// -----------------------------------------
// 2) Props for the modal
// -----------------------------------------
interface SystemSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSystems: (systems: System[]) => void
  availableSystems: System[]
}

// -----------------------------------------
// 3) Define DataGrid column definitions once
//    (make each column filterable: true)
// -----------------------------------------
const columns: DataGridColumnDef<System>[] = [
  {
    field: "user",
    headerName: "User",
    minWidth: 120,
    flex: 1,
    filterable: true,
  },
  {
    field: "division",
    headerName: "Division",
    minWidth: 120,
    flex: 1,
    filterable: true,
  },
  {
    field: "department",
    headerName: "Department",
    minWidth: 140,
    flex: 1,
    filterable: true,
  },
  {
    field: "desktopName",
    headerName: "Desktop Name",
    minWidth: 140,
    flex: 1,
    filterable: true,
  },
  {
    field: "caliber",
    headerName: "Caliber",
    minWidth: 100,
    flex: 1,
    filterable: true,
  },
  {
    field: "pool",
    headerName: "Pool",
    minWidth: 100,
    flex: 1,
    filterable: true,
  },
  {
    field: "datacenter",
    headerName: "Datacenter",
    minWidth: 120,
    flex: 1,
    filterable: true,
  },
  {
    field: "cabinet",
    headerName: "Cabinet",
    minWidth: 100,
    flex: 1,
    filterable: true,
  },
  {
    field: "hypervisor",
    headerName: "Hypervisor",
    minWidth: 120,
    flex: 1,
    filterable: true,
  },
]

// -----------------------------------------
// 4) The main modal component
// -----------------------------------------
export function SystemSelectionModal({
  isOpen,
  onClose,
  onAddSystems,
  availableSystems,
}: SystemSelectionModalProps) {
  // Local state:
  const [selectionMethod, setSelectionMethod] = useState<"search" | "bulk">("search")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredSystems, setFilteredSystems] = useState<System[]>(availableSystems)
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { showToast } = useToast()

  // Whenever “searchQuery” or “selectionMethod” or “availableSystems” changes,
  // re-compute filteredSystems for search mode:
  useEffect(() => {
    if (selectionMethod === "search") {
      if (!searchQuery.trim()) {
        setFilteredSystems(availableSystems)
      } else {
        const q = searchQuery.toLowerCase()
        const matched = availableSystems.filter((sys) => {
          return (
            sys.id.toLowerCase().includes(q) ||
            sys.desktopName.toLowerCase().includes(q) ||
            sys.user.toLowerCase().includes(q)
          )
        })
        setFilteredSystems(matched)
      }
    }
  }, [searchQuery, selectionMethod, availableSystems])

  // CSV upload handler (Bulk mode)
  const handleFileUpload = useCallback(
    (file: File) => {
      setUploadedFile(file)
      const reader = new FileReader()

      reader.onload = (e) => {
        const content = e.target?.result as string
        const lines = content
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .slice(0, 10) // just first 10 for demo

        const matched = availableSystems.filter((sys) =>
          lines.some((token) => {
            const lower = token.toLowerCase()
            return (
              sys.id.toLowerCase().includes(lower) ||
              sys.desktopName.toLowerCase().includes(lower)
            )
          })
        )

        setFilteredSystems(matched)
        showToast({
          status: "success",
          message: `Found ${matched.length} matching system${matched.length !== 1 ? "s" : ""} from ${lines.length} entr${lines.length !== 1 ? "ies" : "y"}`,
        })
      }

      reader.readAsText(file)
    },
    [availableSystems, showToast]
  )

  // “Add to Migration List” button
  const handleAddToMigrationList = () => {
    const toAdd = filteredSystems.filter((sys) =>
      selectedSystemIds.includes(sys.id)
    )
    onAddSystems(toAdd)

    // Reset modal state
    setSelectedSystemIds([])
    setSearchQuery("")
    setUploadedFile(null)
    setFilteredSystems(availableSystems)
  }

  // Toggle between “search” and “bulk”
  const handleMethodChange = (method: "search" | "bulk") => {
    setSelectionMethod(method)
    setSelectedSystemIds([])
    setSearchQuery("")
    setUploadedFile(null)
    setFilteredSystems(availableSystems)
  }

  // When DataGrid selection changes, update selectedSystemIds
  const handleSelectionModelChange = (newSelection: DataGridRowSelectionModel) => {
    // GSUI DataGrid returns an array of selected row IDs (strings)
    setSelectedSystemIds(newSelection as string[])
  }

  return (
    <Modal
      visible={isOpen}
      onVisibilityToggle={onClose}
      className="w-full max-w-6xl mx-auto my-6"
    >
      {/* Header */}
      <ModalHeader className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold">
          Select Systems to Schedule Migration
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          ×
        </button>
      </ModalHeader>

      {/* Body */}
      <ModalBody className="px-6 py-4 space-y-6 max-h-[85vh] overflow-y-auto">
        {/* 1) Selection Method Radios */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Selection Method</Label>
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2">
              <Radio
                name="method"
                value="search"
                checked={selectionMethod === "search"}
                onChange={() => handleMethodChange("search")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="search" className="cursor-pointer">
                Search a Single System
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio
                name="method"
                value="bulk"
                checked={selectionMethod === "bulk"}
                onChange={() => handleMethodChange("bulk")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="bulk" className="cursor-pointer">
                Bulk Import Systems (CSV)
              </Label>
            </div>
          </div>
        </div>

        {/* 2) Search Input (if “search” mode) */}
        {selectionMethod === "search" && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by ID, Desktop Name or User..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:border-blue-500"
            />
          </div>
        )}

        {/* 3) Bulk Upload Zone (if “bulk” mode) */}
        {selectionMethod === "bulk" && (
          <div className="space-y-4">
            {uploadedFile ? (
              <div className="flex items-center justify-between p-4 border border-dashed rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  onClick={() => {
                    setUploadedFile(null)
                    setFilteredSystems(availableSystems)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center relative bg-gray-50 dark:bg-gray-800"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    handleFileUpload(file)
                  }
                }}
              >
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Drop a CSV file here
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Or click to select a file containing system IDs or names
                    </p>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="file-upload"
                      className="inline-flex cursor-pointer"
                    >
                      <Button className="border border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        🔍 Import CSV
                      </Button>
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
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4) The GSUI DataGrid replaces the old <table> */}
        <div className="border border-gray-200 rounded-md overflow-auto h-[450px]">
          <DataGrid<System>
            rows={filteredSystems}
            columns={columns}
            getRowId={(row) => row.id} // tell DataGrid which field is the ID
            checkboxSelection
            disableColumnMenu={false}      // allow column menu (so filter icon appears)
            onRowSelectionModelChange={handleSelectionModelChange}
            rowSelectionModel={selectedSystemIds}
            autoHeight={false}             // keep the fixed container height; grid will scroll
            pageSize={7}
            rowsPerPageOptions={[7, 14, 21]}
            pagination
            filterMode="client"            // do client-side filtering inside DataGrid
          />
        </div>

        {/* 5) Selected Systems Summary */}
        {selectedSystemIds.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              🧾 {selectedSystemIds.length} system
              {selectedSystemIds.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </ModalBody>

      {/* Footer Buttons */}
      <ModalFooter className="flex justify-end space-x-4 px-6 py-4 border-t border-gray-200">
        <Button
          className="border border-gray-700 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddToMigrationList}
          disabled={selectedSystemIds.length === 0}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Add to Migration List
        </Button>
      </ModalFooter>
    </Modal>
  )
}
