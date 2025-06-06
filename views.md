Below is a suggested directory layout and naming convention that directly reflects the wireframe you shared (the “Schedule Migration” page, the “Select Systems” modal, the “Selected Systems” table, and the “Schedule Migration” form). Everything is organized for a React + Vite + TypeScript codebase, using the GS UI Toolkit (for components like Button, DataGrid, Modal, Form controls) and Tailwind (for spacing, colors, and layout tweaks). Feel free to adjust naming if your team prefers different conventions, but this structure will give you a clear starting point.

```
my-migration-app/
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts
│   │   └── systemsApi.ts
│   │
│   ├── assets/
│   │   └── images/
│   │       └── logo.svg
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx          # if you have a persistent side‐panel
│   │   │   ├── IconButton.tsx       # e.g. user avatar button, settings icon, dark‐mode toggle
│   │   │   └── Logo.tsx
│   │   │
│   │   ├── ScheduleMigration/
│   │   │   ├── ScheduleMigrationPage.tsx       # the main page component (route: /schedule-migration)
│   │   │   ├── ScheduleMigrationPage.module.css
│   │   │   │
│   │   │   ├── SystemSelectionModal.tsx         # “Select Systems to Schedule Migration”
│   │   │   ├── SystemSelectionModal.styles.ts   # optional: GS UI + Tailwind overrides (if needed)
│   │   │   │
│   │   │   ├── SelectedSystemsTable.tsx         # the table that lists “Selected Systems”
│   │   │   ├── SelectedSystemsTable.module.css  # if you need any table‐specific overrides
│   │   │   │
│   │   │   └── ScheduleMigrationFormModal.tsx   # “Schedule Migration for X systems” modal (form fields)
│   │   │       ├── ScheduleMigrationFormModal.styles.ts
│   │   │       └── ScheduleMigrationForm.tsx    # a subcomponent for the actual form inputs/validation
│   │   │
│   │   └── … (other feature folders)
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx   # if you need user-login protection on these pages
│   │
│   ├── hooks/
│   │   ├── useFetchSystems.ts     # hook to fetch “all available systems” for selection
│   │   ├── useSelectedSystems.ts  # hook to manage “selected systems” state
│   │   └── useScheduleMigration.ts# hook to call the schedule-migration API
│   │
│   ├── pages/
│   │   ├── Home.tsx               # perhaps a dashboard or landing page
│   │   └── NotFound.tsx
│   │
│   ├── routes/
│   │   └── AppRouter.tsx          # defines <Route path="/schedule-migration" …>
│   │
│   ├── services/
│   │   └── systemsService.ts      # wrapper around systemsApi.ts for business logic
│   │
│   ├── styles/
│   │   ├── index.css              # import Tailwind base/components/utilities here
│   │   └── tailwind.config.js
│   │
│   ├── types/
│   │   └── system.d.ts            # e.g. interface System { id: string; user: string; … }
│   │
│   ├── utils/
│   │   └── formatDate.ts          # e.g. for formatting “Last Seen” timestamps
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env                            # VITE_API_BASE_URL=http://localhost:8080/api
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
└── tailwind.config.js
```

---

## Folder‐by‐Folder Explanation

### 1. **public/**

* **Purpose:** Static assets (favicon, robots.txt, any images/fonts you don’t need Vite to process).
* **Why:** If you have a logo or any SVGs referenced directly in `index.html`, they live here unmodified.

### 2. **src/api/**

* **`axiosInstance.ts`**

  * Exports a preconfigured Axios client to hit your Spring Boot backend.
  * Example:

    ```ts
    // src/api/axiosInstance.ts
    import axios from 'axios';

    const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:8080/api
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    // (Optional) Request interceptor to attach JWT, if needed
    api.interceptors.request.use(config => {
      const token = localStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    export default api;
    ```
* **`systemsApi.ts`**

  * Defines raw HTTP calls related to the “systems” domain (you’ll import these in your service layer).
  * Example:

    ```ts
    // src/api/systemsApi.ts
    import api from './axiosInstance';
    import type { System } from '../types/system';

    export const fetchAvailableSystems = async (): Promise<System[]> => {
      const response = await api.get<System[]>('/systems'); // GET /api/systems
      return response.data;
    };

    export interface SchedulePayload {
      systemIds: string[];       // array of IDs selected in the modal
      batchName: string;
      migrationType: string;
      targetOS: string;
      calibrerRules: string;
      migrationDate: string;     // e.g. "2024-07-12"
      notifications: string[];   // email list
      justification: string;
    }

    export const scheduleMigration = async (
      payload: SchedulePayload
    ): Promise<void> => {
      await api.post('/migrations/schedule', payload);
    };
    ```

### 3. **src/assets/**

* **Purpose:** Any static images or SVGs you want to import into React.
* **Usage:**

  * `logo.svg` or illustration that goes in your Navbar or “empty” state (the big “+” icon in your wireframe can be an SVG here).
  * Referenced via: `import Logo from '@assets/images/logo.svg';`

### 4. **src/components/**

All reusable React components. We break them down into “common” and “feature‐specific.”

#### a. **components/common/**

* **`Navbar.tsx`**

  * Renders the top navigation (“Schedule Migration | Migration Status | Scheduled Migrations” tabs, plus right‐aligned icons for dark mode toggle, settings, user avatar).
  * Uses GS UI Toolkit’s `Tabs` (or `Button`) components for those menu items, and GS UI `IconButton` for the icons.
  * You can style the background and spacing with Tailwind:

    ```tsx
    // src/components/common/Navbar.tsx
    import React from 'react';
    import { Tabs, Tab } from '@gs-ux-uitoolkit-react/tabs';
    import IconButton from './IconButton';
    import Logo from '@assets/images/logo.svg';

    export default function Navbar() {
      return (
        <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
          {/* Left: App logo + tabs */}
          <div className="flex items-center space-x-8">
            <img src={Logo} alt="App Logo" className="h-8 w-auto" />
            <Tabs>
              <Tab to="/schedule-migration">Schedule Migration</Tab>
              <Tab to="/migration-status">Migration Status</Tab>
              <Tab to="/scheduled-migrations">Scheduled Migrations</Tab>
            </Tabs>
          </div>
          {/* Right: Icon buttons (dark mode, settings, user) */}
          <div className="flex items-center space-x-4">
            <IconButton icon="moon" aria-label="Toggle Dark Mode" />
            <IconButton icon="settings" aria-label="Settings" />
            <IconButton icon="user" aria-label="My Profile" />
          </div>
        </nav>
      );
    }
    ```
* **`Sidebar.tsx`** (optional)

  * If you later decide to have a left‐side menu, put it here.
* **`IconButton.tsx`**

  * A tiny wrapper around GS UI’s icon‐button so you can apply consistent Tailwind classes (hover states, padding).

  ```tsx
  // src/components/common/IconButton.tsx
  import React from 'react';
  import { Button as GSButton } from '@gs-ux-uitoolkit-react/button';
  import { Icon } from '@gs-ux-uitoolkit-react/icon';

  interface IconButtonProps {
    icon: string; // the name of the GS UI icon
    ariaLabel: string;
    onClick?: () => void;
  }

  export default function IconButton({ icon, ariaLabel, onClick }: IconButtonProps) {
    return (
      <GSButton
        variant="ghost"
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        <Icon name={icon} size="20" />
      </GSButton>
    );
  }
  ```

#### b. **components/ScheduleMigration/**

Everything related to the “Schedule Migration” flow lives here:

1. **`ScheduleMigrationPage.tsx`**

   * The main page component that ties together:

     * A header (“Schedule Migration” + subtitle)
     * The “Add Systems for Migration” button
     * The “Selected Systems” table (if any systems have been added)
     * The “Schedule Migration” green button (enabled only once at least one system is selected)

   ```tsx
   // src/components/ScheduleMigration/ScheduleMigrationPage.tsx
   import React, { useState } from 'react';
   import SystemSelectionModal from './SystemSelectionModal';
   import SelectedSystemsTable from './SelectedSystemsTable';
   import ScheduleMigrationFormModal from './ScheduleMigrationFormModal';
   import { Button } from '@gs-ux-uitoolkit-react/button';
   import { System } from '../types/system';

   export default function ScheduleMigrationPage() {
     const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
     const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
     const [selectedSystems, setSelectedSystems] = useState<System[]>([]);

     return (
       <div className="px-8 py-6">
         {/* Page Header */}
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-semibold">Schedule Migration</h1>
             <p className="text-gray-600">Add systems and schedule migrations</p>
           </div>
           <Button
             variant="primary"
             onClick={() => setIsSelectModalOpen(true)}
           >
             + Add Systems for Migration
           </Button>
         </div>

         {/* Selected Systems Table (only show if any systems) */}
         {selectedSystems.length > 0 && (
           <div className="mt-6">
             <h2 className="text-xl font-medium mb-2">Selected Systems</h2>
             <SelectedSystemsTable
               systems={selectedSystems}
               onRemove={(id) =>
                 setSelectedSystems(s =>
                   s.filter(sys => sys.id !== id)
                 )
               }
             />
           </div>
         )}

         {/* Schedule Migration Button (bottom center) */}
         {selectedSystems.length > 0 && (
           <div className="flex justify-center mt-8">
             <Button
               variant="success"
               onClick={() => setIsScheduleModalOpen(true)}
               size="large"
               className="space-x-2"
             >
               <i className="gs-icon gs-icon-calendar" />
               <span>Schedule Migration</span>
             </Button>
           </div>
         )}

         {/* Modals */}
         <SystemSelectionModal
           isOpen={isSelectModalOpen}
           onClose={() => setIsSelectModalOpen(false)}
           onSelect={(systems) => {
             setSelectedSystems(systems);
             setIsSelectModalOpen(false);
           }}
           alreadySelected={selectedSystems.map((s) => s.id)}
         />

         <ScheduleMigrationFormModal
           isOpen={isScheduleModalOpen}
           onClose={() => setIsScheduleModalOpen(false)}
           selectedSystems={selectedSystems}
           onScheduled={() => {
             // e.g., clear selectedSystems or show a toast
             setSelectedSystems([]);
             setIsScheduleModalOpen(false);
           }}
         />
       </div>
     );
   }
   ```

   * **Styling**:

     * Outer container: `px-8 py-6` for comfortable padding (Tailwind).
     * The header uses `flex justify-between` for the title on the left and the blue “+ Add Systems for Migration” button on the right (GS UI `Button` with `variant="primary"`).
     * Conditional rendering: we only show `<SelectedSystemsTable>` and the green Schedule button when `selectedSystems.length > 0`.

2. **`SystemSelectionModal.tsx`**

   * A modal containing:

     * Radio toggles for “Search a Single System” vs. “Bulk Import Systems (CSV)”
     * A search bar (“Search by ID or System Name…”)
     * A data grid/table listing systems with checkboxes in each row
     * A footer with “Cancel” and “Add to Migration List” buttons

   ```tsx
   // src/components/ScheduleMigration/SystemSelectionModal.tsx
   import React, { useEffect, useState } from 'react';
   import { Modal } from '@gs-ux-uitoolkit-react/modal';
   import { Input } from '@gs-ux-uitoolkit-react/input';
   import { Button } from '@gs-ux-uitoolkit-react/button';
   import { DataGrid, ColumnDef } from '@gs-ux-uitoolkit-react/datagrid';
   import { System } from '../../types/system';
   import { fetchAvailableSystems } from '../../api/systemsApi';

   interface Props {
     isOpen: boolean;
     onClose: () => void;
     onSelect: (selected: System[]) => void;
     alreadySelected: string[]; // IDs to disable in the grid
   }

   export default function SystemSelectionModal({
     isOpen,
     onClose,
     onSelect,
     alreadySelected,
   }: Props) {
     const [systems, setSystems] = useState<System[]>([]);
     const [filtered, setFiltered] = useState<System[]>([]);
     const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
     const [searchTerm, setSearchTerm] = useState('');

     useEffect(() => {
       if (isOpen) {
         fetchAvailableSystems().then((data) => {
           setSystems(data);
           setFiltered(data);
           setSelectedIds(new Set());
         });
       }
     }, [isOpen]);

     // Filter logic on searchTerm
     useEffect(() => {
       const term = searchTerm.toLowerCase();
       setFiltered(
         systems.filter((s) =>
           s.id.toLowerCase().includes(term) ||
           s.desktopName.toLowerCase().includes(term)
         )
       );
     }, [searchTerm, systems]);

     const columns: ColumnDef<System>[] = [
       {
         header: '',
         accessorKey: 'select', // custom accessor for the checkbox column
         cell: ({ row }) => {
           const sys: System = row.original;
           const isDisabled = alreadySelected.includes(sys.id);
           const isChecked = selectedIds.has(sys.id);
           return (
             <input
               type="checkbox"
               disabled={isDisabled}
               checked={isChecked}
               onChange={() => {
                 setSelectedIds((prev) => {
                   const copy = new Set(prev);
                   if (copy.has(sys.id)) copy.delete(sys.id);
                   else copy.add(sys.id);
                   return copy;
                 });
               }}
             />
           );
         },
         size: 40,
       },
       { header: 'User', accessorKey: 'user', size: 150 },
       { header: 'Division', accessorKey: 'division', size: 120 },
       { header: 'Department', accessorKey: 'department', size: 120 },
       { header: 'Desktop Name', accessorKey: 'desktopName', size: 140 },
       {
         header: 'Caliber',
         accessorKey: 'caliber',
         size: 100,
         cell: ({ row }) => {
           const calib = row.original.caliber;
           // Render a colored badge, e.g. GS UI “Badge” component
           return (
             <span
               className={`
                 px-2 py-1 text-xs rounded-full
                 ${
                   calib === 'Prod-A'
                     ? 'bg-red-100 text-red-800'
                     : calib === 'Prod-B'
                     ? 'bg-yellow-100 text-yellow-800'
                     : 'bg-green-100 text-green-800'
                 }
               `}
             >
               {calib}
             </span>
           );
         },
       },
       { header: 'Pool', accessorKey: 'pool', size: 80 },
       {
         header: 'OS',
         accessorKey: 'os',
         size: 100,
         cell: ({ row }) => {
           const os = row.original.os;
           return (
             <span
               className={`
                 px-2 py-1 text-xs rounded-full
                 ${os.includes('Windows 10')
                   ? 'bg-green-100 text-green-800'
                   : 'bg-blue-100 text-blue-800'}
               `}
             >
               {os}
             </span>
           );
         },
       },
       {
         header: 'Last Seen',
         accessorKey: 'lastSeen',
         size: 100,
         cell: ({ row }) =>
           new Date(row.original.lastSeen).toLocaleDateString(),
       },
     ];

     return (
       <Modal
         isOpen={isOpen}
         onClose={onClose}
         title="Select Systems to Schedule Migration"
         size="large"
       >
         <div className="px-6 py-4 space-y-4">
           {/* Radio Buttons (Search vs. Bulk import) */}
           <div className="flex items-center space-x-6">
             <label className="flex items-center">
               <input
                 type="radio"
                 name="selectionMethod"
                 defaultChecked
                 className="mr-2"
               />
               Search a Single System
             </label>
             <label className="flex items-center">
               <input type="radio" name="selectionMethod" className="mr-2" />
               Bulk Import Systems (CSV)
             </label>
           </div>

           {/* Search Input */}
           <Input
             placeholder="Search by ID or System Name…"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full"
           />

           {/* DataGrid */}
           <div className="h-80 overflow-auto">
             <DataGrid<System>
               data={filtered}
               columns={columns}
               pagination={false}
               rowHeight={40}
             />
           </div>
         </div>

         <div className="flex justify-end px-6 py-4 space-x-3 border-t">
           <Button variant="secondary" onClick={onClose}>
             Cancel
           </Button>
           <Button
             variant="primary"
             onClick={() => {
               // gather selected systems and pass back
               const chosen = systems.filter((sys) =>
                 selectedIds.has(sys.id)
               );
               onSelect(chosen);
             }}
             disabled={selectedIds.size === 0}
           >
             Add to Migration List
           </Button>
         </div>
       </Modal>
     );
   }
   ```

   * **Styling Notes:**

     * We wrap GS UI’s `<Modal>` (size="large") and supply a custom header title.
     * Use Tailwind `px-6 py-4` inside the modal’s content for consistent padding.
     * The radio buttons are plain HTML for simplicity—if GS UI has a radio component, you can swap it in.
     * The search `<Input>` is a GS UI input, stretched full width with `className="w-full"`.
     * The `<DataGrid>` is inside a fixed-height container (`h-80 overflow-auto`) so it scrolls if there are many rows.
     * Each badge (Caliber, OS) uses Tailwind to color‐code the pill.

3. **`SelectedSystemsTable.tsx`**

   * Renders the rows of systems that the user already added. Each row has:

     * A trash‐icon button (to remove that system from the list)
     * Columns: User, Division, Department, Desktop Name, Caliber, Pool, OS, Last Seen

   ```tsx
   // src/components/ScheduleMigration/SelectedSystemsTable.tsx
   import React from 'react';
   import { System } from '../../types/system';
   import { Button } from '@gs-ux-uitoolkit-react/button';

   interface Props {
     systems: System[];
     onRemove: (id: string) => void;
   }

   export default function SelectedSystemsTable({
     systems,
     onRemove,
   }: Props) {
     return (
       <table className="min-w-full table-auto border border-gray-200">
         <thead className="bg-gray-50">
           <tr>
             <th className="px-4 py-2"></th>
             <th className="px-4 py-2 text-left">User</th>
             <th className="px-4 py-2 text-left">Division</th>
             <th className="px-4 py-2 text-left">Department</th>
             <th className="px-4 py-2 text-left">Desktop Name</th>
             <th className="px-4 py-2 text-left">Caliber</th>
             <th className="px-4 py-2 text-left">Pool</th>
             <th className="px-4 py-2 text-left">OS</th>
             <th className="px-4 py-2 text-left">Last Seen</th>
           </tr>
         </thead>
         <tbody>
           {systems.map((sys) => (
             <tr key={sys.id} className="even:bg-gray-100">
               <td className="px-4 py-2">
                 <Button
                   variant="ghost"
                   className="p-2 text-red-600 hover:bg-red-50"
                   onClick={() => onRemove(sys.id)}
                   aria-label="Remove"
                 >
                   <i className="gs-icon gs-icon-trash" />
                 </Button>
               </td>
               <td className="px-4 py-2">{sys.user}</td>
               <td className="px-4 py-2">{sys.division}</td>
               <td className="px-4 py-2">{sys.department}</td>
               <td className="px-4 py-2">{sys.desktopName}</td>
               <td className="px-4 py-2">
                 <span
                   className={`
                     px-2 py-1 text-xs rounded-full
                     ${
                       sys.caliber === 'Prod-A'
                         ? 'bg-red-100 text-red-800'
                         : sys.caliber === 'Prod-B'
                         ? 'bg-yellow-100 text-yellow-800'
                         : 'bg-green-100 text-green-800'
                     }
                   `}
                 >
                   {sys.caliber}
                 </span>
               </td>
               <td className="px-4 py-2">{sys.pool}</td>
               <td className="px-4 py-2">
                 <span
                   className={`
                     px-2 py-1 text-xs rounded-full
                     ${sys.os.includes('Windows 10')
                       ? 'bg-green-100 text-green-800'
                       : 'bg-blue-100 text-blue-800'}
                   `}
                 >
                   {sys.os}
                 </span>
               </td>
               <td className="px-4 py-2">
                 {new Date(sys.lastSeen).toLocaleDateString()}
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     );
   }
   ```

   * **Styling Notes:**

     * Use Tailwind to give the table a light border (`border-gray-200`), striped rows (`even:bg-gray-100`), and consistent padding (`px-4 py-2`).
     * The remove‐icon button is a GS UI `Button variant="ghost"` with a red trash icon.

4. **`ScheduleMigrationFormModal.tsx`**

   * A modal with a form that lets the user:

     * Enter a “Batch Name” (required)
     * Select “Migration Type” (dropdown)
     * Select “Target OS” (dropdown)
     * Select “Caliber Rules” (dropdown)
     * Pick a “Migration Date” (date picker)
     * Enter “Additional Notifications” (comma‐separated emails)
     * Enter “Justification” (textarea, min 20 chars)
     * See a “0/20 characters minimum” counter under the justification.
     * A “Cancel” and “Submit” or “Schedule” button at the bottom.

   ```tsx
   // src/components/ScheduleMigration/ScheduleMigrationFormModal.tsx
   import React, { useState } from 'react';
   import { Modal } from '@gs-ux-uitoolkit-react/modal';
   import { Input } from '@gs-ux-uitoolkit-react/input';
   import { TextArea } from '@gs-ux-uitoolkit-react/textarea';
   import { Select } from '@gs-ux-uitoolkit-react/select';
   import { Button } from '@gs-ux-uitoolkit-react/button';
   import { DatePicker } from '@gs-ux-uitoolkit-react/datepicker';
   import type { System } from '../../types/system';
   import { scheduleMigration } from '../../api/systemsApi';

   interface Props {
     isOpen: boolean;
     onClose: () => void;
     selectedSystems: System[];
     onScheduled: () => void;
   }

   export default function ScheduleMigrationFormModal({
     isOpen,
     onClose,
     selectedSystems,
     onScheduled,
   }: Props) {
     // form state
     const [batchName, setBatchName] = useState('');
     const [migrationType, setMigrationType] = useState('');
     const [targetOS, setTargetOS] = useState('');
     const [caliberRule, setCaliberRule] = useState('');
     const [migrationDate, setMigrationDate] = useState<Date | null>(null);
     const [notifications, setNotifications] = useState('');
     const [justification, setJustification] = useState('');

     const [isSubmitting, setIsSubmitting] = useState(false);

     const isValid =
       batchName.trim().length > 0 &&
       migrationType &&
       targetOS &&
       caliberRule &&
       migrationDate &&
       justification.trim().length >= 20;

     const handleSubmit = async () => {
       if (!isValid || !migrationDate) return;
       setIsSubmitting(true);
       try {
         await scheduleMigration({
           systemIds: selectedSystems.map((s) => s.id),
           batchName,
           migrationType,
           targetOS,
           calibrerRules: caliberRule,
           migrationDate: migrationDate.toISOString().split('T')[0],
           notifications: notifications
             .split(',')
             .map((email) => email.trim())
             .filter((e) => e),
           justification,
         });
         onScheduled();
       } catch (err) {
         console.error(err);
         // optionally show a toast here
       } finally {
         setIsSubmitting(false);
       }
     };

     return (
       <Modal
         isOpen={isOpen}
         onClose={onClose}
         title={`Schedule Migration for ${selectedSystems.length} system${
           selectedSystems.length > 1 ? 's' : ''
         }`}
         size="medium"
       >
         <div className="px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
           {/* Batch Name */}
           <label className="block">
             <span className="text-sm font-medium">Batch Name *</span>
             <Input
               placeholder="e.g., Q1-2024-Migration"
               value={batchName}
               onChange={(e) => setBatchName(e.target.value)}
               className="mt-1 w-full"
             />
           </label>

           {/* Migration Type / Target OS / Caliber Rules */}
           <div className="grid grid-cols-2 gap-x-4 gap-y-6">
             <label className="block">
               <span className="text-sm font-medium">Migration Type</span>
               <Select
                 placeholder="Select migration type"
                 value={migrationType}
                 onChange={(val) => setMigrationType(val)}
                 options={[
                   { label: 'In‐Place Upgrade', value: 'in-place' },
                   { label: 'Rebuild', value: 'rebuild' },
                   { label: 'Re-Image', value: 'reimage' },
                 ]}
                 className="mt-1 w-full"
               />
             </label>
             <label className="block">
               <span className="text-sm font-medium">Target Operating System *</span>
               <Select
                 placeholder="Select target OS"
                 value={targetOS}
                 onChange={(val) => setTargetOS(val)}
                 options={[
                   { label: 'Windows 10', value: 'win10' },
                   { label: 'Windows 11', value: 'win11' },
                   { label: 'Ubuntu 22.04', value: 'ubuntu22' },
                 ]}
                 className="mt-1 w-full"
               />
             </label>
             <label className="block">
               <span className="text-sm font-medium">Caliber Rules</span>
               <Select
                 placeholder="Select caliber rules"
                 value={caliberRule}
                 onChange={(val) => setCaliberRule(val)}
                 options={[
                   { label: 'Prod-A', value: 'Prod-A' },
                   { label: 'Prod-B', value: 'Prod-B' },
                   { label: 'Prod-C', value: 'Prod-C' },
                 ]}
                 className="mt-1 w-full"
               />
             </label>
             <label className="block">
               <span className="text-sm font-medium">Migration Date *</span>
               <DatePicker
                 value={migrationDate}
                 onChange={(date) => setMigrationDate(date)}
                 placeholder="Pick a date"
                 className="mt-1 w-full"
               />
             </label>
           </div>

           {/* Additional Notifications */}
           <label className="block">
             <span className="text-sm font-medium">Additional Notifications</span>
             <Input
               placeholder="email1@company.com, email2@company.com"
               value={notifications}
               onChange={(e) => setNotifications(e.target.value)}
               className="mt-1 w-full"
             />
             <p className="mt-1 text-xs text-gray-500">
               (comma‐separate multiple emails)
             </p>
           </label>

           {/* Justification */}
           <label className="block">
             <span className="text-sm font-medium">
               Justification * (minimum 20 characters)
             </span>
             <TextArea
               placeholder="Provide a detailed justification for this migration…"
               value={justification}
               onChange={(e) => setJustification(e.target.value)}
               rows={4}
               className="mt-1 w-full"
             />
             <p
               className={`mt-1 text-xs ${
                 justification.length < 20 ? 'text-red-500' : 'text-gray-500'
               }`}
             >
               {justification.length}/20 characters minimum
             </p>
           </label>
         </div>

         <div className="flex justify-end px-6 py-4 space-x-3 border-t">
           <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
             Cancel
           </Button>
           <Button
             variant="success"
             onClick={handleSubmit}
             disabled={!isValid || isSubmitting}
           >
             {isSubmitting ? 'Scheduling…' : 'Schedule Migration'}
           </Button>
         </div>
       </Modal>
     );
   }
   ```

   * **Styling Notes:**

     * The modal’s content area has `max-h-[80vh] overflow-y-auto` so that if the form is very tall, it scrolls.
     * Each label/input pair uses a `block` label with a `span` for the field title and a GS UI input/select/textarea below it.
     * We use a two‐column grid (`grid grid-cols-2 gap-x-4 gap-y-6`) for the dropdowns and date picker.
     * Tailwind classes ensure consistent spacing (e.g. `mt-1 w-full`, `px-6 py-4` for padding).
     * The justification counter turns red if `< 20` characters.

---

### 5. **src/contexts/**

* If your app requires authentication or a global theme, you can create `AuthContext.tsx` (for login/logout) or `ThemeContext.tsx` (light/dark), and wrap `<AppRouter/>` in those providers inside `App.tsx`. For a simple “Schedule Migration” feature, you might not need an extra context—unless you need to block non‐logged‐in users.

### 6. **src/hooks/**

Encapsulate data‐fetching or state logic that multiple components might reuse.

* **`useFetchSystems.ts`**

  ```ts
  // src/hooks/useFetchSystems.ts
  import { useEffect, useState } from 'react';
  import type { System } from '../types/system';
  import { fetchAvailableSystems } from '../api/systemsApi';

  export function useFetchSystems() {
    const [systems, setSystems] = useState<System[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      fetchAvailableSystems()
        .then((data) => setSystems(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    return { systems, loading, error };
  }
  ```

* **`useSelectedSystems.ts`** can manage a local array of selected IDs (or entire `System` objects) if you want a more complex state machine (e.g. persistence across pages). But in our example above, we simply keep that state in `ScheduleMigrationPage`.

* **`useScheduleMigration.ts`**

  ```ts
  // src/hooks/useScheduleMigration.ts
  import { useState } from 'react';
  import { scheduleMigration, SchedulePayload } from '../api/systemsApi';

  export function useScheduleMigration() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const schedule = async (payload: SchedulePayload) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        await scheduleMigration(payload);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Failed to schedule migration');
      } finally {
        setLoading(false);
      }
    };

    return { schedule, loading, error, success };
  }
  ```

### 7. **src/pages/**

* **`Home.tsx`** could be a landing page or redirect to `/schedule-migration`.
* **`NotFound.tsx`** is your 404 fallback.

### 8. **src/routes/AppRouter.tsx**

* Wire up React Router (or your preferred router). Example using React Router v6:

  ```tsx
  // src/routes/AppRouter.tsx
  import React from 'react';
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import Home from '../pages/Home';
  import ScheduleMigrationPage from '../components/ScheduleMigration/ScheduleMigrationPage';
  import NotFound from '../pages/NotFound';

  export default function AppRouter() {
    return (
      <BrowserRouter>
        {/* If you have a Navbar that should appear on every page, render it here */}
        {/* <Navbar /> */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule-migration" element={<ScheduleMigrationPage />} />
          {/*
            You could add /migration-status and /scheduled-migrations
            by creating those pages/components similarly.
          */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }
  ```

### 9. **src/services/systemsService.ts**

* A thin wrapper around `systemsApi.ts` if you need to transform data or handle business logic. For instance:

  ```ts
  // src/services/systemsService.ts
  import type { System } from '../types/system';
  import {
    fetchAvailableSystems as fetchAll,
    scheduleMigration as schedule,
    SchedulePayload,
  } from '../api/systemsApi';

  export async function getAllSystems(): Promise<System[]> {
    const data = await fetchAll();
    return data.map(sys => ({
      ...sys,
      // maybe transform lastSeen to a Date object client‐side:
      lastSeen: new Date(sys.lastSeen).toISOString(),
    }));
  }

  export function scheduleMigrationBatch(payload: SchedulePayload) {
    // you can pre‐validate or add extra fields if needed
    return schedule(payload);
  }
  ```

### 10. **src/styles/**

* **`index.css`**

  ```css
  /* src/styles/index.css */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  /* Example: Override GS UI’s default input border to align with Tailwind theme */
  .gs-input {
    @apply border border-gray-300 rounded-md;
  }

  .gs-modal {
    @apply rounded-lg drop-shadow-xl;
  }
  ```
* **`tailwind.config.js`**

  ```js
  // tailwind.config.js
  module.exports = {
    content: [
      './index.html',
      './src/**/*.{ts,tsx,js,jsx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1D4ED8',   // matching GS UI’s blue button
          success: '#10B981',   // for green “Schedule Migration”
        },
      },
    },
    plugins: [],
  };
  ```

### 11. **src/types/system.d.ts**

* Define the shape of a “System” object so you can strongly type everything:

  ```ts
  // src/types/system.d.ts
  export interface System {
    id: string;           // unique identifier
    user: string;         // e.g. "jsmith"
    division: string;     // e.g. "IT"
    department: string;   // e.g. "Support"
    desktopName: string;  // e.g. "DESKTOP-001"
    caliber: string;      // e.g. "Prod-A" | "Prod-B" | "Prod-C"
    pool: string;         // e.g. "QA"
    os: string;           // e.g. "Windows 10", "Windows 11"
    lastSeen: string;     // ISO date string, e.g. "2024-01-15"
  }
  ```

### 12. **src/utils/formatDate.ts**

* If you need to format dates consistently across your tables:

  ```ts
  // src/utils/formatDate.ts
  export function formatDate(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  ```

---

## How It All Fits Together

1. **Route**

   * User navigates to `http://localhost:3000/schedule-migration`.
   * `AppRouter.tsx` renders the `ScheduleMigrationPage` component.

2. **ScheduleMigrationPage**

   * Renders a header (Title + subtitle) and a blue “+ Add Systems for Migration” button (GS UI `Button` with `variant="primary"`).
   * Maintains local state (`selectedSystems: System[]`).
   * If `selectedSystems.length > 0`, it shows:

     * A “Selected Systems” table (`SelectedSystemsTable.tsx`) in a white card‐style table.
     * A large green “Schedule Migration” button (`variant="success"`) centered below.

3. **SystemSelectionModal**

   * When the user clicks “+ Add Systems for Migration”, `isSelectModalOpen = true`, and `<SystemSelectionModal>` appears.
   * On open, it calls `fetchAvailableSystems()` (via `useEffect`), stores results in local `systems` state, and shows them in a GS UI `DataGrid` (scrollable, with checkboxes).
   * The user types into the search input (GS UI `Input`), which filters rows by `id` or `desktopName`.
   * Each row has a checkbox. If the row’s ID is already in `alreadySelected` (passed from `ScheduleMigrationPage`), disable that row’s checkbox.
   * “Add to Migration List” is disabled until at least one new checkbox is checked. Once clicked, it calls `onSelect(chosen)`, which sends the selected array of `System` objects back up to `ScheduleMigrationPage`.

4. **SelectedSystemsTable**

   * Receives the `selectedSystems` array and a callback `onRemove(id)`.
   * Renders a simple HTML table with Tailwind styling (`border`, `striped rows`, `px-4 py-2`), plus a red trash icon (GS UI `Button variant="ghost"`) in the first column.
   * If the user clicks the trash button for a row, it calls `onRemove(sys.id)` which filters that system out of the parent’s `selectedSystems` state.

5. **ScheduleMigrationFormModal**

   * Once there is at least one selected system, the green “Schedule Migration” button appears. Clicking it opens `ScheduleMigrationFormModal`.
   * The modal’s title reads “Schedule Migration for X systems” (where X = `selectedSystems.length`).
   * The form fields inside:

     * **Batch Name**\* (GS UI `Input`, required)
     * **Migration Type** (GS UI `Select`)
     * **Target OS**\* (GS UI `Select`, required)
     * **Caliber Rules** (GS UI `Select`)
     * **Migration Date**\* (GS UI `DatePicker`, required)
     * **Additional Notifications** (GS UI `Input`, free‐form email list)
     * **Justification**\* (GS UI `TextArea`, min 20 chars; shows a red counter if below 20)
   * “Schedule Migration” (GS UI `Button variant="success"`) is disabled until `isValid === true`.
   * On submission, it calls the `scheduleMigration` API with a payload containing the selected IDs and all form values.
   * On success, it calls `onScheduled()` which (in the parent) can clear selected systems and optionally show a toast.

---

## Styling Principles

1. **Tailwind for Layout & Spacing**

   * Use `px-6 py-4`, `mt-6`, `flex items-center justify-between`, `grid grid-cols-2 gap-x-4 gap-y-6`, etc., to replicate the wireframe’s spacing.
   * Use color classes like `bg-gray-50`, `text-gray-600`, `bg-green-100 text-green-800`, etc., to mirror those colored labels (Caliber, OS badges).

2. **GS UI Toolkit for Primitives**

   * **Buttons**:

     * Blue “Add Systems for Migration” → `<Button variant="primary">`.
     * Green “Schedule Migration” → `<Button variant="success">`.
     * “Cancel” → `<Button variant="secondary">`.
   * **Modal**: Use `<Modal isOpen={…} title="…">` for both selection and scheduling modals.
   * **DataGrid**: Use `<DataGrid>` from GS UI for the “Select Systems” list—this gives built-in sorting, column resizing if needed, and smooth rendering.
   * **Inputs/Selects/TextArea/DatePicker**: All come from GS UI, so they share a consistent look and feel.

3. **Module CSS or Style Objects**

   * We created optional `.module.css` or `.styles.ts` files next to each component, in case you need to override a GS UI default or add a few custom Tailwind utilities. E.g., if the default GS UI `Modal` corners are too sharp, you can use `.styles.ts` to apply `rounded-lg drop-shadow-xl`.
   * Otherwise, prefer using Tailwind classes inline since it’s faster to iterate.

4. **Responsive Considerations**

   * The modals (`size="large"` or `"medium"`) will automatically center on desktop. If you need them to be full‐screen or narrower on mobile, you can add a Tailwind `max-w-md` or `w-full` override in the modal’s container.
   * The `DataGrid` has a fixed height (`h-80`), so on smaller screens it scrolls inside the modal.

---

## Quick Checklist to Get Started

1. **Initialize with Vite + React + TypeScript**

   ```bash
   npm create vite@latest my-migration-app --template react-ts
   cd my-migration-app
   npm install
   ```

2. **Install Tailwind and GS UI Toolkit**

   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   npm install @gs-ux-uitoolkit-react/button @gs-ux-uitoolkit-react/modal \
     @gs-ux-uitoolkit-react/datagrid @gs-ux-uitoolkit-react/input \
     @gs-ux-uitoolkit-react/select @gs-ux-uitoolkit-react/textarea \
     @gs-ux-uitoolkit-react/datepicker @gs-ux-uitoolkit-react/icon
   ```

3. **Configure Tailwind**

   * Update `tailwind.config.js` content to scan `./index.html` and `./src/**/*.{ts,tsx}`.
   * Create `src/styles/index.css` with:

     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

4. **Set Up `.env`**

   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

5. **Create Folder Structure**

   * Under `src/`, create the `api/`, `components/`, `hooks/`, `services/`, `styles/`, `types/`, and `routes/` folders exactly as outlined above.
   * Populate each with the corresponding `.ts` / `.tsx` files.

6. **Run Dev Server**

   ```bash
   npm run dev
   ```

   * Vite will serve at `http://localhost:3000`.
   * Because of the proxy in `vite.config.ts`, any API calls to `/api/...` go to `http://localhost:8080/api/...` where your Spring Boot backend is assumed to run.

---

### Final Thoughts

With this structure, you have:

* **Highly cohesive feature folders** (everything related to “Schedule Migration” is under `components/ScheduleMigration/`).
* **Clear separation of concerns** (API calls in `src/api/`, business logic in `src/services/`, reusable UI in `src/components/common/`, page logic in `src/components/ScheduleMigration/`).
* **Consistent styling** by combining GS UI Toolkit primitives (buttons, modals, data grids) with Tailwind’s utility classes for spacing, colors, and typography.
* **Easy future expansion**—if you later add “Migration Status” or “Scheduled Migrations,” you simply create new folders under `components/MigrationStatus/` and `components/ScheduledMigrations/` with analogous subcomponents.

Feel free to tweak any names (e.g., call `SelectedSystemsTable.tsx` simply `MigrationListTable.tsx` if that makes more sense). But following this blueprint will ensure that your codebase remains organized, maintainable, and visually consistent with the wireframe you provided.
