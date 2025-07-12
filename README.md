# FitFolio Mobile

A React Native fitness tracking app built with Expo, React Navigation, NativeWind, and Clerk authentication.

## 🚀 Features

- **Google OAuth Authentication** - Secure sign-in with Google accounts
- **Navigation Drawer** - Easy navigation between screens
- **NativeWind Styling** - Tailwind CSS for React Native
- **TypeScript** - Type-safe development
- **Expo** - Cross-platform development

## 📱 Tech Stack

- **React Native** with Expo
- **React Navigation** (Drawer Navigator)
- **NativeWind** (Tailwind CSS)
- **Clerk** (Authentication)
- **TypeScript**

## 🛠️ Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fitfolio-mobile
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your Clerk publishable key
   # Get it from: https://dashboard.clerk.com/
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## 🔐 Environment Variables

Create a `.env` file in the `frontend` directory with:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
```

**⚠️ Important:** Never commit your actual `.env` file to version control!

## 🏃‍♂️ Running the App

- **iOS:** Press `i` in the terminal or scan QR code with Camera app
- **Android:** Press `a` in the terminal or scan QR code with Expo Go
- **Web:** Press `w` in the terminal

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── NavigationDrawer.tsx
│   │   └── CustomDrawer.tsx
│   └── pages/
│       └── home/
│           └── index.tsx
├── App.tsx
├── global.css
└── package.json
```

## 🔒 Security Notes

- **Environment variables** are properly excluded via `.gitignore`
- **Clerk publishable keys** are safe to use in client-side code
- **No sensitive data** is stored in the repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 