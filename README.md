# FitFolio Mobile

A mobile fitness tracking app built with React Native and a Node.js backend.

## Tech Stack

**Frontend:**
- React Native with Expo
- TypeScript
- NativeWind (Tailwind CSS for React Native)
- React Navigation
- Clerk for authentication

**Backend:**
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database hosted by Supabase

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- PostgreSQL database

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Set up your database and update the Prisma schema if needed:
```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npm start
```

4. Use the Expo Go app on your phone to scan the QR code, or press `a` for Android emulator or `i` for iOS simulator.

## Development

- Backend runs on port 3001
- Frontend uses Expo's default port
- Make sure both servers are running for full functionality

## Environment Variables

You'll need to set up environment variables for Clerk authentication. Check the Clerk docs for setup instructions.