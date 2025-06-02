"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, CalendarIcon } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ScheduleMigrationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCount: number
  onSchedule: (batchName: string, migrationDate: string) => void
}

export function ScheduleMigrationModal({ isOpen, onClose, selectedCount, onSchedule }: ScheduleMigrationModalProps) {
  const [batchName, setBatchName] = useState("")
  const [migrationType, setMigrationType] = useState("")
  const [targetOS, setTargetOS] = useState("")
  const [caliberRules, setCaliberRules] = useState("")
  const [migrationDate, setMigrationDate] = useState<Date>()
  const [notifications, setNotifications] = useState("")
  const [justification, setJustification] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!batchName || !targetOS || !migrationDate || justification.length < 20) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSchedule(batchName, format(migrationDate, "PPP"))

    // Reset form
    setBatchName("")
    setMigrationType("")
    setTargetOS("")
    setCaliberRules("")
    setMigrationDate(undefined)
    setNotifications("")
    setJustification("")
    setIsSubmitting(false)
  }

  const isFormValid = batchName && targetOS && migrationDate && justification.length >= 20

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Migration for {selectedCount} systems
          </DialogTitle>
          <DialogDescription>Configure the migration settings for the selected systems.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchName">
                Batch Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="batchName"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g., Q1-2024-Migration"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="migrationType">Migration Type</Label>
              <Select value={migrationType} onValueChange={setMigrationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select migration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Migration</SelectItem>
                  <SelectItem value="express">Express Migration</SelectItem>
                  <SelectItem value="custom">Custom Migration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetOS">
                Target Operating System <span className="text-destructive">*</span>
              </Label>
              <Select value={targetOS} onValueChange={setTargetOS} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select target OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="windows11">Windows 11</SelectItem>
                  <SelectItem value="windows10">Windows 10</SelectItem>
                  <SelectItem value="ubuntu">Ubuntu 22.04</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caliberRules">Caliber Rules</Label>
              <Select value={caliberRules} onValueChange={setCaliberRules}>
                <SelectTrigger>
                  <SelectValue placeholder="Select caliber rules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-priority">High Priority First</SelectItem>
                  <SelectItem value="low-priority">Low Priority First</SelectItem>
                  <SelectItem value="mixed">Mixed Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Migration Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !migrationDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {migrationDate ? format(migrationDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={migrationDate}
                  onSelect={setMigrationDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notifications">Additional Notifications</Label>
            <Input
              id="notifications"
              value={notifications}
              onChange={(e) => setNotifications(e.target.value)}
              placeholder="email1@company.com, email2@company.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">
              Justification <span className="text-destructive">*</span>
              <span className="text-sm text-muted-foreground ml-2">(minimum 20 characters)</span>
            </Label>
            <Textarea
              id="justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Provide a detailed justification for this migration..."
              rows={4}
              required
            />
            <div className="text-sm text-muted-foreground">{justification.length}/20 characters minimum</div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? "Scheduling..." : "✅ Confirm & Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
