# Resonance Music Catalog Dashboard

A responsive React dashboard for managing the bands and tracks exposed by the Music API REST backend.

## Features

- Session-based JWT login and registration
- Protected routes with automatic token expiration handling
- Catalog overview metrics
- Searchable and sortable band management
- Searchable and sortable track management
- Accessible forms, dialogs, confirmations, and notifications
- Responsive desktop and mobile navigation

## Requirements

- Node.js 22 or newer
- Music API REST running locally

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The frontend runs on `http://localhost:5173` and uses this API URL by default:

```env
VITE_API_URL=http://localhost:3000
```

The backend's `CORS_ORIGINS` must include `http://localhost:5173`.

## Commands

```bash
npm run dev
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

## Current scope

This MVP manages bands and tracks. User administration, playlists, and audio playback are intentionally outside the current frontend scope.
