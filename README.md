# TIEFFE Artworks Portfolio

A modern React + Vite portfolio website for TIEFFE artworks, featuring admin management, Firebase integration, and a clean gallery‑first design.

## Features

### Public site
- **Home**: Hero carousel with dynamic photos, events calendar, and highlights
- **Works**: Portfolio grid with categories (Recent, Internal, External, Future, Old)
- **Photos**: Minimal image‑only gallery with carousel/lightbox
- **About**: Dynamic bio, skills, and stats
- **Contacts**: Dynamic contact info and social links
- **Responsive design** with dark/light theme toggle

### Admin dashboard (`/admin`)
- Google OAuth authentication
- Manage **Works**, **Photos**, **Events**, **About**, and **Contacts**
- **Admins** tab to add/remove co‑managers (Firestore‑based)
- File upload for photos (client‑side resize, Firebase Storage)
- Real‑time updates via Firestore

## Tech stack

- **Frontend**: React 18, Vite 6, React Router 7
- **Styling**: SCSS modules, CSS variables for theming
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Build**: ESLint 9, modern module bundling

## Getting started

### Prerequisites
- Node 18+
- npm
- Firebase project with Auth, Firestore, and Storage enabled

### Install dependencies
```bash
npm install
```

### Environment variables
Create `.env.local` in the project root with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: fallback admin email (useful for initial setup)
VITE_ADMIN_EMAIL=your-admin@gmail.com
```

### Run locally
```bash
npm run dev
```
Open http://localhost:5173

### Build for production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm run deploy:firebase
```

## Project structure

```
src/
├── admin/               # Admin dashboard components
│   ├── AdminDashboard.jsx
│   ├── AdminsManager.jsx
│   ├── WorksManager.jsx
│   ├── PhotosManager.jsx
│   ├── EventsManager.jsx
│   ├── AboutManager.jsx
│   └── ContactsManager.jsx
├── components/          # Reusable UI
│   └── Header/
├── context/             # React contexts
│   ├── AuthContext.jsx   # Firebase Auth + admin logic
│   └── DataContext.jsx   # Firestore CRUD
├── pages/               # Public pages
│   ├── home/
│   ├── works/
│   ├── photos/
│   ├── aboutUs/
│   └── contacts/
├── firebase/            # Firebase config
│   └── firebase.js
└── App.jsx              # Router and providers
```

## Admin access

### Initial admin
- Set `VITE_ADMIN_EMAIL` to your Google account email.
- Sign in at `/admin` → you’ll have admin access.
- In the **Admins** tab, add yourself and any co‑managers so they’re stored in Firestore.

### Firestore admin collection
- Collection: `admins`
- Document ID: user UID
- Fields: `email`, `addedBy`, `addedAt`

Once admins exist in Firestore, you can remove the `VITE_ADMIN_EMAIL` fallback.

## Theming

- Uses CSS custom properties (`--accent`, `text`, `bg`, etc.).
- Dark theme by default; light theme toggles values.
- Styles live in `*.module.scss` files.

## Deploy notes

- `npm run deploy:firebase` runs `vite build` then `firebase deploy`.
- Build assets go to `dist/`.
- Ensure `firebase.json` and `.firebaserc` are configured for your project.

## Contributing

1. Keep components modular.
2. Use SCSS modules for component styles.
3. Follow the existing folder structure.
4. Test admin flows after changes to auth or data context.

## License

© 2026 TIEFFE Art. All rights reserved.
