// components/ScheduleMigrationModalGSUI.tsx
import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@gs-ux-uitoolkit-react/modal'
import { Button } from '@gs-ux-uitoolkit-react/button'
import { Input } from '@gs-ux-uitoolkit-react/input'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface ScheduleMigrationModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Called when user clicks “Cancel” or closes the modal */
  onClose: () => void
  /** How many systems are selected (shown in header) */
  selectedCount: number
  /**
   * Called when form is valid and user clicks “Confirm & Schedule”
   * @param batchName string
   * @param migrationDateFormatted e.g. "Jan 1, 2025"
   */
  onSchedule: (batchName: string, migrationDateFormatted: string) => void
}

export const ScheduleMigrationModalGSUI: React.FC<ScheduleMigrationModalProps> = ({
  isOpen,
  onClose,
  selectedCount,
  onSchedule,
}) => {
  // --- form state ---
  const [batchName, setBatchName] = useState('')
  const [migrationType, setMigrationType] = useState('')       // e.g. "standard" | "express" | "custom"
  const [targetOS, setTargetOS] = useState('')                 // e.g. "windows11" | "windows10" | "ubuntu"
  const [caliberRules, setCaliberRules] = useState('')         // e.g. "high-priority" | "low-priority" | "mixed"
  const [migrationDate, setMigrationDate] = useState<string>('') // store as "YYYY-MM-DD" string from <input type="date">
  const [notifications, setNotifications] = useState('')
  const [justification, setJustification] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Quick helper: is form valid? (must match same constraints as Shadcn version)
  // • batchName required
  // • targetOS required
  // • migrationDate required
  // • justification ≥ 20 characters
  const isFormValid =
    batchName.trim().length > 0 &&
    targetOS.trim().length > 0 &&
    migrationDate.trim().length > 0 &&
    justification.trim().length >= 20

  // Called whenever user submits
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) {
      return
    }
    setIsSubmitting(true)

    // Simulate an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Format date into a more human‐friendly string, e.g. "Jan 1, 2025"
    let formatted = migrationDate
    try {
      const dt = new Date(migrationDate)
      formatted = format(dt, 'PPP') // e.g. "Jan 1, 2025"
    } catch (err) {
      // fallback: leave as the raw YYYY-MM-DD
    }

    onSchedule(batchName.trim(), formatted)

    // Reset form
    setBatchName('')
    setMigrationType('')
    setTargetOS('')
    setCaliberRules('')
    setMigrationDate('')
    setNotifications('')
    setJustification('')
    setIsSubmitting(false)
  }

  // Minimum possible date for migrationDate input (today)
  const todayISO = new Date().toISOString().split('T')[0]

  return (
    <Modal
      visible={isOpen}
      onVisibilityToggle={onClose}
      className="w-full max-w-4xl mx-auto my-6"
    >
      {/* ================= Header ================= */}
      <ModalHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-lg font-medium">
          <CalendarIcon className="h-5 w-5 text-gray-600" />
          <span>Schedule Migration for {selectedCount} system{selectedCount !== 1 ? 's' : ''}</span>
        </div>
        {/* “×” close button */}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          ×
        </button>
      </ModalHeader>

      {/* ================= Body ================= */}
      <ModalBody className="h-[85vh] overflow-y-auto px-6 pt-2 pb-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* -------- Row 1: Batch Name (required) & Migration Type -------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Batch Name */}
            <div className="space-y-1">
              <label htmlFor="batchName" className="block text-sm font-medium text-gray-700">
                Batch Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="batchName"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g., Q1-2024-Migration"
                required
                className="w-full"
              />
            </div>

            {/* Migration Type */}
            <div className="space-y-1">
              <label htmlFor="migrationType" className="block text-sm font-medium text-gray-700">
                Migration Type
              </label>
              <select
                id="migrationType"
                value={migrationType}
                onChange={(e) => setMigrationType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="" disabled>
                  — Select migration type —
                </option>
                <option value="standard">Standard Migration</option>
                <option value="express">Express Migration</option>
                <option value="custom">Custom Migration</option>
              </select>
            </div>
          </div>

          {/* -------- Row 2: Target OS (required) & Caliber Rules -------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target OS */}
            <div className="space-y-1">
              <label htmlFor="targetOS" className="block text-sm font-medium text-gray-700">
                Target Operating System <span className="text-red-500">*</span>
              </label>
              <select
                id="targetOS"
                value={targetOS}
                onChange={(e) => setTargetOS(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="" disabled>
                  — Select target OS —
                </option>
                <option value="windows11">Windows 11</option>
                <option value="windows10">Windows 10</option>
                <option value="ubuntu">Ubuntu 22.04</option>
              </select>
            </div>

            {/* Caliber Rules */}
            <div className="space-y-1">
              <label htmlFor="caliberRules" className="block text-sm font-medium text-gray-700">
                Caliber Rules
              </label>
              <select
                id="caliberRules"
                value={caliberRules}
                onChange={(e) => setCaliberRules(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="" disabled>
                  — Select caliber rules —
                </option>
                <option value="high-priority">High Priority First</option>
                <option value="low-priority">Low Priority First</option>
                <option value="mixed">Mixed Priority</option>
              </select>
            </div>
          </div>

          {/* -------- Migration Date (required) -------- */}
          <div className="space-y-1">
            <label htmlFor="migrationDate" className="block text-sm font-medium text-gray-700">
              Migration Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                id="migrationDate"
                type="date"
                min={todayISO}
                value={migrationDate}
                onChange={(e) => setMigrationDate(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 pl-10 bg-white text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* -------- Additional Notifications -------- */}
          <div className="space-y-1">
            <label htmlFor="notifications" className="block text-sm font-medium text-gray-700">
              Additional Notifications
            </label>
            <Input
              id="notifications"
              value={notifications}
              onChange={(e) => setNotifications(e.target.value)}
              placeholder="email1@company.com, email2@company.com"
              className="w-full"
            />
          </div>

          {/* -------- Justification (required, ≥20 chars) -------- */}
          <div className="space-y-1">
            <label htmlFor="justification" className="block text-sm font-medium text-gray-700">
              Justification <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">(minimum 20 characters)</span>
            </label>
            <textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Provide a detailed justification for this migration..."
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <div className="text-xs text-gray-500">
              {justification.trim().length} / 20 characters
            </div>
          </div>

          {/* -------- Footer Buttons (Cancel & Confirm) -------- */}
          <ModalFooter className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border border-gray-700 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`${
                isFormValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 text-white opacity-50 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Scheduling...' : '✅ Confirm & Schedule'}
            </Button>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  )
}
