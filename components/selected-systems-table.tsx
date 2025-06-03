"use client"

import { Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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

interface SelectedSystemsTableProps {
  systems: System[]
  onRemoveSystem: (systemId: string) => void
}

export function SelectedSystemsTable({ systems, onRemoveSystem }: SelectedSystemsTableProps) {
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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Division</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Desktop Name</TableHead>
                <TableHead className="font-semibold">Caliber</TableHead>
                <TableHead className="font-semibold">Pool</TableHead>
                <TableHead className="font-semibold">OS</TableHead>
                <TableHead className="font-semibold">Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systems.map((system, index) => (
                <TableRow
                  key={system.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/50"
                  }`}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveSystem(system.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
