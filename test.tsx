// components/SystemSelectionModal.tsx
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
// 1) System interface (same as before)
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
// 2) Modal props
// ---------------
interface SystemSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSystems: (systems: System[]) => void
  availableSystems: System[]
}

// ---------------
// 3) Improved, responsive modal component
// ---------------
export const SystemSelectionModal: React.FC<SystemSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddSystems,
  availableSystems,
}) => {
  // — Local state hooks —
  const [selectionMethod, setSelectionMethod] = useState<'search' | 'bulk'>('search')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredSystems, setFilteredSystems] = useState<System[]>(availableSystems)
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const entriesPerPage = 7

  const { showToast } = useToast()

  // — 4) Text‐search filtering whenever searchQuery or availableSystems changes —
  useEffect(() => {
    if (selectionMethod === 'search') {
      if (searchQuery.trim()) {
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
        setFilteredSystems(availableSystems)
      }
      setCurrentPage(1)
    }
  }, [searchQuery, selectionMethod, availableSystems])

  // — 5) CSV file upload for “bulk” mode —
  const handleFileUpload = useCallback(
    (file: File) => {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const lines = content.split('\n').map((l) => l.trim()).filter((l) => l.length > 0)
        const matched = availableSystems.filter((sys) =>
          lines.some((u) => {
            const lower = u.toLowerCase()
            return (
              sys.user.toLowerCase().includes(lower) ||
              sys.desktopName.toLowerCase().includes(lower)
            )
          })
        )
        setFilteredSystems(matched)
        setCurrentPage(1)
        showToast({
          status: 'success',
          message: `Found ${matched.length} matching system${matched.length !== 1 ? 's' : ''} from ${lines.length} entr${lines.length !== 1 ? 'ies' : 'y'}`,
        })
      }
      reader.readAsText(file)
    },
    [availableSystems, showToast]
  )

  // — 6) Row checkbox handler —
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSelectedSystemIds((prev) =>
      checked ? [...prev, id] : prev.filter((key) => key !== id)
    )
  }

  // — Pagination logic —
  const paginatedSystems = filteredSystems.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )
  const totalPages = Math.ceil(filteredSystems.length / entriesPerPage)

  // — “Select All” in current page —
  const handleSelectAll = (checked: boolean) => {
    const pageIds = paginatedSystems.map((sys) => sys.user)
    if (checked) {
      setSelectedSystemIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    } else {
      setSelectedSystemIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    }
  }

  // — Add to migration list button —
  const handleAddToMigrationList = () => {
    const toAdd = availableSystems.filter((sys) => selectedSystemIds.includes(sys.user))
    onAddSystems(toAdd)

    // Reset local state
    setSelectedSystemIds([])
    setSearchQuery('')
    setUploadedFile(null)
    setFilteredSystems(availableSystems)
    setCurrentPage(1)
  }

  // — JSX Return —
  return (
    <Modal
      visible={isOpen}
      onVisibilityToggle={onClose}
      className="w-full max-w-3xl mx-auto my-6"
    >
      {/* — Header with “×” close icon — */}
      <ModalHeader className="flex justify-between items-center">
        <span className="text-lg font-medium">Select Systems to Schedule Migration</span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          ×
        </button>
      </ModalHeader>

      <ModalBody className="h-[75vh] overflow-y-auto px-4 pb-4">
        <div className="space-y-6">
          {/* === 1) Radio toggle: “Search” vs “Bulk” === */}
          <div className="flex items-center space-x-6">
            <Radio
              name="method"
              value="search"
              checked={selectionMethod === 'search'}
              onChange={() => {
                setSelectionMethod('search')
                setUploadedFile(null)
                setSelectedSystemIds([])
                setSearchQuery('')
                setFilteredSystems(availableSystems)
                setCurrentPage(1)
              }}
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

          {/* === 2) Search Input (only if “search”) === */}
          {selectionMethod === 'search' && (
            <Input
              placeholder="Search by User, Desktop Name or Division"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500"
            />
          )}

          {/* === 3) File Upload (only if “bulk”) === */}
          {selectionMethod === 'bulk' && (
            <div className="space-y-2">
              {uploadedFile ? (
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 truncate">{uploadedFile.name}</p>
                  <Button
                    onClick={() => {
                      setUploadedFile(null)
                      setFilteredSystems(availableSystems)
                      setCurrentPage(1)
                    }}
                    className="border border-red-500 text-red-500 hover:bg-red-50"
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
                    if (file) handleFileUpload(file)
                  }}
                  className="block w-full text-sm text-gray-500
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border file:border-gray-300
                             file:text-sm file:font-medium
                             file:bg-gray-50 hover:file:bg-gray-100"
                />
              )}
            </div>
          )}

          {/* === 4) Systems Table (fixed-height, vertical scroll) === */}
          <div className="border border-gray-200 rounded-md overflow-y-auto h-[350px]">
            <Table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 w-10">
                    <Checkbox
                      checked={
                        paginatedSystems.length > 0 &&
                        paginatedSystems.every((s) => selectedSystemIds.includes(s.user))
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Division</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Desktop Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Caliber</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mapped User</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Pool</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Datacenter</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Cabinet</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hypervisor</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedSystems.map((sys) => (
                  <tr key={sys.user} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedSystemIds.includes(sys.user)}
                        onChange={(e) => handleCheckboxChange(sys.user, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.user}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.division}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.desktopName}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.caliber}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.mappedUser}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.pool}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.datacenter}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.cabinet}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{sys.hypervisor}</td>
                  </tr>
                ))}

                {paginatedSystems.length === 0 && (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No systems found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* === 5) Pagination Controls === */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
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
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}

          {/* === 6) Selected count summary === */}
          {selectedSystemIds.length > 0 && (
            <div className="text-sm text-gray-700">
              {selectedSystemIds.length} system
              {selectedSystemIds.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>
      </ModalBody>

      {/* — Footer Buttons — */}
      <ModalFooter className="flex justify-end space-x-4 px-4 pb-4 pt-2">
        <Button
          onClick={onClose}
          className="border border-gray-700 text-gray-700 hover:bg-gray-100"
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
