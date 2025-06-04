"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Button } from "@gs-ux-uitoolkit-react/button";
import { useToast } from "../hooks/useToast";
import { SystemSelectionModal } from "../components/system-selection-modal";
import { ScheduleMigrationModal } from "../components/schedule-migration-modal";
import { SelectedSystemsTable } from "../components/selected-systems-table";

// Mock data
const mockSystems = [
  {
    id: "SYS001",
    user: "jsmith",
    division: "IT",
    department: "Support",
    desktopName: "DESKTOP-001",
    caliber: "Prod-A",
    pool: "QA",
    os: "Windows 10",
    lastSeen: "2024-01-15",
  },
  {
    id: "SYS002",
    user: "adoe",
    division: "Finance",
    department: "Accounts",
    desktopName: "DESKTOP-002",
    caliber: "Prod-A",
    pool: "QA",
    os: "Windows 10",
    lastSeen: "2024-01-12",
  },
  {
    id: "SYS003",
    user: "mjane",
    division: "HR",
    department: "Recruitment",
    desktopName: "DESKTOP-003",
    caliber: "Prod-C",
    pool: "QA",
    os: "Windows 11",
    lastSeen: "2024-01-11",
  },
  {
    id: "SYS005",
    user: "sgarcia",
    division: "Operations",
    department: "Logistics",
    desktopName: "DESKTOP-005",
    caliber: "Prod-B",
    pool: "QA",
    os: "Windows 10",
    lastSeen: "2024-01-11",
  },
];

interface System {
  id: string;
  user: string;
  division: string;
  department: string;
  desktopName: string;
  caliber: string;
  pool: string;
  os: string;
  lastSeen: string;
}

export function ScheduleMigrationPage() {
  const [selectedSystems, setSelectedSystems] = useState<System[]>([]);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleAddSystems = (systems: System[]) => {
    // Avoid duplicates
    const newSystems = systems.filter(
      (system) => !selectedSystems.some((sel) => sel.id === system.id)
    );

    if (newSystems.length > 0) {
      setSelectedSystems([...selectedSystems, ...newSystems]);
      showToast({
        status: "success",
        message: `Added ${newSystems.length} system${newSystems.length > 1 ? "s" : ""} to migration list`,
      });
    }

    setIsSelectionModalOpen(false);
  };

  const handleRemoveSystem = (systemId: string) => {
    setSelectedSystems((prev) => prev.filter((sys) => sys.id !== systemId));
    showToast({
      status: "info",
      message: "System removed from migration list",
    });
  };

  const handleScheduleMigration = () => {
    if (selectedSystems.length === 0) {
      showToast({
        status: "error",
        message: "Please add systems to schedule migration",
      });
      return;
    }
    setIsScheduleModalOpen(true);
  };

  const handleMigrationScheduled = (migrationDate: string) => {
    showToast({
      status: "success",
      message: `Migration scheduled for ${selectedSystems.length} system${selectedSystems.length > 1 ? "s" : ""} on ${migrationDate}`,
    });
    setSelectedSystems([]);
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Schedule Migration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Add systems and schedule migrations
          </p>
        </div>

        <div className="flex space-x-2">
          {selectedSystems.length > 0 && (
            <Button onClick={handleScheduleMigration} size="lg">
              📆 Schedule Migration
            </Button>
          )}

          <Button
            onClick={() => setIsSelectionModalOpen(true)}
            appearance="highlight"
            size="lg"
          >
            <FaPlus className="h-5 w-5 mr-2" />
            Add Systems for Migration
          </Button>
        </div>
      </header>

      {/* Selected Systems or Empty State */}
      {selectedSystems.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Selected Systems
          </h2>

          <SelectedSystemsTable
            systems={selectedSystems}
            onRemoveSystem={handleRemoveSystem}
          />
        </section>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FaPlus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No systems selected
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by adding systems to your migration list
          </p>
          <Button
            onClick={() => setIsSelectionModalOpen(true)}
            appearance="highlight"
            size="lg"
          >
            <FaPlus className="h-5 w-5 mr-2" />
            Add Systems for Migration
          </Button>
        </div>
      )}

      {/* Modals */}
      <SystemSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        onAddSystems={handleAddSystems}
        availableSystems={mockSystems}
      />

      <ScheduleMigrationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        selectedCount={selectedSystems.length}
        onSchedule={handleMigrationScheduled}
      />
    </div>
  );
}
