"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface SystemsTableProps {
  systems: System[]
  selectedSystems: string[]
  onSelectionChange: (selected: string[]) => void
  showInModal?: boolean
}

export function SystemsTable({ systems, selectedSystems, onSelectionChange, showInModal = false }: SystemsTableProps) {
  const [sortField, setSortField] = useState<keyof System | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof System) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedSystems = [...systems].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(systems.map((system) => system.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectSystem = (systemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedSystems, systemId])
    } else {
      onSelectionChange(selectedSystems.filter((id) => id !== systemId))
    }
  }

  const getOSBadgeColor = (os: string) => {
    switch (os.toLowerCase()) {
      case "windows 11":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "windows 10":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCaliberBadgeColor = (caliber: string) => {
    switch (caliber.toLowerCase()) {
      case "prod-a":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "prod-b":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "prod-c":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const isAllSelected = systems.length > 0 && selectedSystems.length === systems.length
  const isPartiallySelected = selectedSystems.length > 0 && selectedSystems.length < systems.length

  const TableContent = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                ref={(el) => {
                  if (el) el.indeterminate = isPartiallySelected
                }}
              />
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("user")} className="h-auto p-0 font-semibold">
                User
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("division")} className="h-auto p-0 font-semibold">
                Division
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("department")} className="h-auto p-0 font-semibold">
                Department
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("desktopName")} className="h-auto p-0 font-semibold">
                Desktop Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("caliber")} className="h-auto p-0 font-semibold">
                Caliber
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("pool")} className="h-auto p-0 font-semibold">
                Pool
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("os")} className="h-auto p-0 font-semibold">
                OS
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("lastSeen")} className="h-auto p-0 font-semibold">
                Last Seen
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {systems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <Users className="h-8 w-8 text-gray-400" />
                  <p className="text-gray-500">No systems found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedSystems.map((system, index) => (
              <TableRow
                key={system.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedSystems.includes(system.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""
                } ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/50"}`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedSystems.includes(system.id)}
                    onCheckedChange={(checked) => handleSelectSystem(system.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{system.user}</TableCell>
                <TableCell>{system.division}</TableCell>
                <TableCell>{system.department}</TableCell>
                <TableCell className="font-mono text-sm">{system.desktopName}</TableCell>
                <TableCell>
                  <Badge className={`${getCaliberBadgeColor(system.caliber)} border-0`}>{system.caliber}</Badge>
                </TableCell>
                <TableCell>{system.pool}</TableCell>
                <TableCell>
                  <Badge className={`${getOSBadgeColor(system.os)} border-0`}>{system.os}</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">{system.lastSeen}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )

  if (showInModal) {
    return <TableContent />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Search Results</span>
          {selectedSystems.length > 0 && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              ✅ {selectedSystems.length} systems selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TableContent />
      </CardContent>
    </Card>
  )
}
