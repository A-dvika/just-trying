"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown } from "lucide-react"
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
}

export function SystemsTable({ systems, selectedSystems, onSelectionChange }: SystemsTableProps) {
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

  const getCaliberColor = (caliber: string) => {
    switch (caliber.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const isAllSelected = systems.length > 0 && selectedSystems.length === systems.length
  const isPartiallySelected = selectedSystems.length > 0 && selectedSystems.length < systems.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Search Results</span>
          {selectedSystems.length > 0 && <Badge variant="outline">✅ {selectedSystems.length} systems selected</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {systems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No systems found. Try adjusting your search or upload a file.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
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
                    <Button variant="ghost" onClick={() => handleSort("user")} className="h-auto p-0 font-medium">
                      User
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("division")} className="h-auto p-0 font-medium">
                      Division
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("department")} className="h-auto p-0 font-medium">
                      Department
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("desktopName")}
                      className="h-auto p-0 font-medium"
                    >
                      Desktop Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("caliber")} className="h-auto p-0 font-medium">
                      Caliber
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("pool")} className="h-auto p-0 font-medium">
                      Pool
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("os")} className="h-auto p-0 font-medium">
                      OS
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("lastSeen")} className="h-auto p-0 font-medium">
                      Last Seen
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSystems.map((system) => (
                  <TableRow key={system.id}>
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
                      <Badge variant={getCaliberColor(system.caliber)}>{system.caliber}</Badge>
                    </TableCell>
                    <TableCell>{system.pool}</TableCell>
                    <TableCell>{system.os}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{system.lastSeen}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
