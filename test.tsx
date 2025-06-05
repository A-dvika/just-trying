// file: components/SystemSelectionModal.tsx

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from '@gs-ux-uitoolkit-react/button'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@gs-ux-uitoolkit-react/modal'
import { Radio } from '@gs-ux-uitoolkit-react/radio'
import { Input } from '@gs-ux-uitoolkit-react/input'
import { Table } from '@gs-ux-uitoolkit-react/table'
import { Checkbox } from '@gs-ux-uitoolkit-react/checkbox'
import { useToast } from '../hooks/useToast'

// ---------------
// 1) Define your System interface (make sure it matches your backend/props exactly)
// ---------------
export interface System {
  id: string
  user: string
  division: string
  department: string
  desktopName: string
  caliber: string
  mappedUser: string
  pool: string
  datacenter: string
  cabinet: string
  hypervisor: string
}

// ---------------
// 2) Define the props for your modal
// ---------------
interface SystemSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSystems: (systems: System[]) => void
  availableSystems: System[]
}

// ---------------
// 3) The cleaned-up, responsive modal component
// ---------------
export const SystemSelectionModal: React.FC<SystemSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddSystems,
  availableSystems,
}) => {
  // --- local state ---
  const [selectionMethod, setSelectionMethod] = useState<'search' | 'bulk'>(
    'search'
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredSystems, setFilteredSystems] =
    useState<System[]>(availableSystems)
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const entriesPerPage = 7

  const { showToast } = useToast()

  // --- 4) Whenever searchQuery or selectionMethod changes, re‐filter on text search ---
  useEffect(() => {
    if (selectionMethod === 'search') {
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase()
        const matched = availableSystems.filter((sys) => {
          return (
            sys.user.toLowerCase().includes(q) ||
            sys.desktopName.toLowerCase().includes(q) ||
            sys.division.toLowerCase().includes(q)
          )
        })
        setFilteredSystems(matched)
      } else {
        // empty query → show all
        setFilteredSystems(availableSystems)
      }
      setCurrentPage(1)
    }
  }, [searchQuery, selectionMethod, availableSystems])

  // --- 5) Handle CSV file upload for “bulk” mode ---
  const handleFileUpload = useCallback(
    (file: File) => {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        // Split lines by newline
        const lines = content.split('\n')
        // Trim out empty lines
        const users = lines.map((line) => line.trim()).filter((l) => l.length > 0)
        // Filter availableSystems where either user or desktopName matches any of these lines
        const matched = availableSystems.filter((sys) =>
          users.some((u) => {
            return (
              sys.user.toLowerCase().includes(u.toLowerCase()) ||
              sys.desktopName.toLowerCase().includes(u.toLowerCase())
            )
          })
        )
        setFilteredSystems(matched)
        setCurrentPage(1)
        showToast({
          status: 'success',
          message: `Found ${matched.length} matching systems from ${users.length} entries`,
        })
      }
      reader.readAsText(file)
    },
    [availableSystems, showToast]
  )

  // --- 6) Checkbox handler for each row ---
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedSystemIds((prev) =>
      checked ? [...prev, id] : prev.filter((key) => key !== id)
    )
  }

  // --- 7) “Select All” logic on the current page →
  //     If you check the header checkbox, add all IDs from current page
  //     If you uncheck it, remove those IDs from the selected list
  const paginatedSystems = filteredSystems.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )
  const totalPages = Math.ceil(filteredSystems.length / entriesPerPage)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // add all IDs from the current page
      const pageIds = paginatedSystems.map((sys) => sys.user)
      setSelectedSystemIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      // remove each id in this page from selected list
      const pageIds = paginatedSystems.map((sys) => sys.user)
      setSelectedSystemIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    }
  }

  // --- 8) “Add to Migration List” button: send back actual System objects,
  //     then clear local selections so next time we start fresh.
  const handleAddToMigrationList = () => {
    const systemsToAdd = availableSystems.filter((sys) =>
      selectedSystemIds.includes(sys.user)
    )
    onAddSystems(systemsToAdd)

    // Reset everything
    setSelectedSystemIds([])
    setSearchQuery('')
    setUploadedFile(null)
    setFilteredSystems(availableSystems)
    setCurrentPage(1)
  }

  // --- 9) Main JSX return ---
  return (
    <Modal
      visible={isOpen}
      onVisibilityToggle={onClose}
      className="w-full max-w-6xl mx-auto my-4"
    >
      <ModalHeader>Select Systems to Schedule Migration</ModalHeader>
      <ModalBody className="h-[80vh] overflow-y-auto">
        <div className="space-y-6 p-4">
          {/* === Selection Method Radios === */}
          <div className="flex flex-wrap items-center space-x-4">
            <Radio
              name="method"
              value="search"
              checked={selectionMethod === 'search'}
              onChange={() => setSelectionMethod('search')}
              className="inline-flex"
            >
              Search a Single System
            </Radio>
            <Radio
              name="method"
              value="bulk"
              checked={selectionMethod === 'bulk'}
              onChange={() => {
                setSelectionMethod('bulk')
                // whenever switching to bulk, clear search text and show all or keep previous?
                setSearchQuery('')
                setFilteredSystems(availableSystems)
                setSelectedSystemIds([])
                setCurrentPage(1)
              }}
              className="inline-flex"
            >
              Bulk Import Systems (CSV)
            </Radio>
          </div>

          {/* === Search Input (only if selectionMethod === "search") === */}
          {selectionMethod === 'search' && (
            <Input
              placeholder="Search by User, Desktop Name or Division"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}

          {/* === Bulk Upload Input (only if selectionMethod === "bulk") === */}
          {selectionMethod === 'bulk' && (
            <div className="space-y-4">
              {uploadedFile ? (
                <div className="flex items-center justify-between space-x-4">
                  <p className="text-gray-700">Uploaded File: {uploadedFile.name}</p>
                  <Button
                    onClick={() => {
                      setUploadedFile(null)
                      setFilteredSystems(availableSystems)
                      setCurrentPage(1)
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFileUpload(file)
                    }
                  }}
                  className="block w-full text-sm text-gray-500
                             file:py-2 file:px-4 file:border file:border-gray-300
                             file:rounded file:text-sm file:font-semibold
                             file:bg-gray-50 hover:file:bg-gray-100"
                />
              )}
            </div>
          )}

          {/* === Table of filteredSystems (paginated) === */}
          <div className="mt-4 overflow-x-auto">
            <Table bordered striped className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">
                    <Checkbox
                      checked={
                        paginatedSystems.length > 0 &&
                        paginatedSystems.every((s) =>
                          selectedSystemIds.includes(s.user)
                        )
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="p-2">User</th>
                  <th className="p-2">Division</th>
                  <th className="p-2">Department</th>
                  <th className="p-2">Desktop Name</th>
                  <th className="p-2">Caliber</th>
                  <th className="p-2">Mapped User</th>
                  <th className="p-2">Pool</th>
                  <th className="p-2">Datacenter</th>
                  <th className="p-2">Cabinet</th>
                  <th className="p-2">Hypervisor</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSystems.map((sys) => (
                  <tr
                    key={sys.user}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2">
                      <Checkbox
                        checked={selectedSystemIds.includes(sys.user)}
                        onChange={(e) =>
                          handleCheckboxChange(sys.user, e.target.checked)
                        }
                      />
                    </td>
                    <td className="p-2">{sys.user}</td>
                    <td className="p-2">{sys.division}</td>
                    <td className="p-2">{sys.department}</td>
                    <td className="p-2">{sys.desktopName}</td>
                    <td className="p-2">{sys.caliber}</td>
                    <td className="p-2">{sys.mappedUser}</td>
                    <td className="p-2">{sys.pool}</td>
                    <td className="p-2">{sys.datacenter}</td>
                    <td className="p-2">{sys.cabinet}</td>
                    <td className="p-2">{sys.hypervisor}</td>
                  </tr>
                ))}

                {paginatedSystems.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="p-4 text-center text-gray-500"
                    >
                      No systems found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* === Pagination Controls === */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="bg-gray-500 hover:bg-gray-600 text-white disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className="bg-gray-500 hover:bg-gray-600 text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}

          {/* === Selected‐Systems Summary === */}
          {selectedSystemIds.length > 0 && (
            <div className="text-sm text-gray-700">
              {selectedSystemIds.length} system
              {selectedSystemIds.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </ModalBody>

      {/* === Footer Buttons === */}
      <ModalFooter className="flex justify-end space-x-4 p-6">
        <Button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white"
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddToMigrationList}
          disabled={selectedSystemIds.length === 0}
          className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
        >
          Add to Migration List
        </Button>
      </ModalFooter>
    </Modal>
  )
}
