// src/components/ScheduleMigration/ScheduleMigrationPage.tsx
"use client";

import React, { useState } from "react";
import PageLayout from "../PageLayout";
import { Button } from "@gs-ux-uitoolkit-react/button";
import { FaPlus } from "react-icons/fa";
import SystemSelectionModal from "./SystemSelectionModal";

export default function ScheduleMigrationPage() {
  const [open, setOpen] = useState(false);

  return (
    <PageLayout>
      {/* page header & action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Schedule Migration</h1>
          <p className="text-gray-600">Add systems and schedule migrations</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          variant="primary"
          leftIcon={<FaPlus />}
        >
          Add Systems for Migration
        </Button>
      </div>

      {/* empty state */}
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <FaPlus size={64} className="text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-700">No systems selected</h2>
        <p className="text-gray-500">
          Get started by adding systems to your migration list
        </p>
        <Button onClick={() => setOpen(true)}>Add Systems for Migration</Button>
      </div>

      {/* modal */}
      <SystemSelectionModal isOpen={open} onClose={() => setOpen(false)} />
    </PageLayout>
  );
}
