// File: components/SystemSelectionModal.tsx

"use client"

import React, { useState, useCallback, useEffect } from "react"
import { Search, Upload, X } from "lucide-react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@gs-ux-uitoolkit-react/modal"
import { Button } from "@gs-ux-uitoolkit-react/button"
import { Input } from "@gs-ux-uitoolkit-react/input"
import { Label } from "@gs-ux-uitoolkit-react/label"
import { Radio } from "@gs-ux-uitoolkit-react/radio"
import { Checkbox } from "@gs-ux-uitoolkit-react/checkbox"
import { useToast } from "../hooks/useToast"

// ---------------
// 1) System interface (same shape as your Shadcn version)
// ---------------
export interface System {
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

// ---------------
// 2) Props for the GSUI version of the modal
// ---------------
interface SystemSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSystems: (systems: System[]) => void
  availableSystems: System[]
}

// ---------------
// 3) GSUI-based component, styled to match the Shadcn design as closely as possible
// ---------------
export function SystemSelectionModal({
  isOpen,
  onClose,
  onAddSystems,
  availableSystems,
}: SystemSelectionModalProps) {
  // --- Local state ---
  const [selectionMethod, setSelectionMethod] = useState<"search" | "bulk">(
    "search"
  )
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredSystems, setFilteredSystems] = useState<System[]>(availableSystems)
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { showToast } = useToast()

  // --- 4) Filter as user types ---
  useEffect(() => {
    if (selectionMethod === "search") {
      if (!searchQuery.trim()) {
        setFilteredSystems(availableSystems)
      } else {
        const q = searchQuery.toLowerCase()
        const matched = availableSystems.filter(
          (system) =>
            system.id.toLowerCase().includes(q) ||
            system.desktopName.toLowerCase().includes(q) ||
            system.user.toLowerCase().includes(q)
        )
        setFilteredSystems(matched)
      }
    }
  }, [searchQuery, selectionMethod, availableSystems])

  // --- 5) CSV upload parsing (bulk mode) ---
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
          .slice(0, 10) // limit to first 10 entries for demo

        const matched = availableSystems.filter((system) =>
          lines.some((token) => {
            const lower = token.toLowerCase()
            return (
              system.id.toLowerCase().includes(lower) ||
              system.desktopName.toLowerCase().includes(lower)
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

  // --- 6) Add selected systems to parent + reset state ---
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

  // --- 7) When toggling selection method ---
  const handleMethodChange = (method: "search" | "bulk") => {
    setSelectionMethod(method)
    setSelectedSystemIds([])
    setSearchQuery("")
    setUploadedFile(null)
    setFilteredSystems(availableSystems)
  }

  // --- Pagination (optional) – if you'd like to show pages in the table --- 
  // For simplicity, we’ll show all filteredSystems in one scrollable table. 
  // If you prefer pagination, slice filteredSystems here and maintain currentPage state.

  return (
    <Modal
      visible={isOpen}
      onVisibilityToggle={onClose}
      className="w-full max-w-6xl mx-auto my-6"
    >
      {/* === Header (title + optional description) === */}
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

      {/* === Body === */}
      <ModalBody className="px-6 py-4 space-y-6 max-h-[85vh] overflow-y-auto">
        {/* ---- 1) Selection Method Radios ---- */}
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

        {/* ---- 2) Search Input (if in “search” mode) ---- */}
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

        {/* ---- 3) Bulk Upload Zone (if in “bulk” mode) ---- */}
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

        {/* ---- 4) Results Table (always shown) ---- */}
        <div className="border border-gray-200 rounded-md overflow-y-auto h-[400px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 w-10">
                  <Checkbox
                    checked={
                      filteredSystems.length > 0 &&
                      filteredSystems.every((sys) =>
                        selectedSystemIds.includes(sys.id)
                      )
                    }
                    onChange={(e) => {
                      const checked = (e.target as HTMLInputElement).checked
                      if (checked) {
                        setSelectedSystemIds(
                          filteredSystems.map((sys) => sys.id)
                        )
                      } else {
                        setSelectedSystemIds([])
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  User
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Division
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Department
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Desktop Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Caliber
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Pool
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  OS
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Last Seen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSystems.map((sys) => (
                <tr
                  key={sys.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedSystemIds.includes(sys.id)}
                      onChange={(e) => {
                        const checked = (e.target as HTMLInputElement).checked
                        if (checked) {
                          setSelectedSystemIds((prev) => [...prev, sys.id])
                        } else {
                          setSelectedSystemIds((prev) =>
                            prev.filter((id) => id !== sys.id)
                          )
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.user}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.division}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.department}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.desktopName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.caliber}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.pool}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.os}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                    {sys.lastSeen}
                  </td>
                </tr>
              ))}
              {filteredSystems.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No systems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ---- 5) Selected Systems Summary (if any) ---- */}
        {selectedSystemIds.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              🧾 {selectedSystemIds.length} system
              {selectedSystemIds.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </ModalBody>

      {/* === Footer === */}
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
