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
