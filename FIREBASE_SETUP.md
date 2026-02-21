# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it (e.g. `tieffe-artworks`) → Continue
3. Disable Google Analytics if not needed → **Create project**

## 2. Enable Google Authentication

1. In the Firebase console → **Authentication** → **Get started**
2. Click **Sign-in method** tab → **Google** → Enable → Save
3. Add your admin Gmail address under **Authorized domains** if deploying

## 3. Create Firestore Database

1. In the Firebase console → **Firestore Database** → **Create database**
2. Choose **Start in test mode** (you can add security rules later)
3. Select a region → **Enable**

## 4. Register the Web App

1. In Project Overview → click the **</>** (Web) icon
2. Register app with a nickname (e.g. `tieffe-web`)
3. Copy the `firebaseConfig` object values

## 5. Fill in `.env.local`

Open `.env.local` in the project root and replace the placeholder values:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_ADMIN_EMAIL=your-admin-email@gmail.com
```

> **VITE_ADMIN_EMAIL** must be the exact Gmail address you will use to log in as admin.

## 6. Firestore Security Rules (recommended)

In Firestore → **Rules** tab, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "YOUR_ADMIN_EMAIL@gmail.com";
    }
  }
}
```

Replace `YOUR_ADMIN_EMAIL@gmail.com` with your actual admin email.

## 7. Run the app

```bash
npm run dev
```

- Visit `http://localhost:5173`
- Click **Dev** in the header (or go to `/admin`) to access the login page
- Sign in with your admin Google account
- The **⚡ Admin** button will appear in the header after login

## Admin Features

| Section | What you can do |
|---|---|
| **Works** | Add / edit / delete projects by category (recent, internal, external, future, old) |
| **Photos** | Add / edit / delete gallery photos by category |
| **Events** | Add / edit / delete calendar events with date, location, type |
| **About** | Edit artist bio, stats, and skills |
| **Contacts** | Edit email, phone, location, social handles |

All changes are saved to Firestore and reflected live on the public site.
