# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# CashCows

CashCows is a mobile application that aims to gamify the process of finance tracking. Built using React Native and Expo, it connects to a backend API for user authentication.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [MongoDB](https://www.mongodb.com/)

### Clone the Repository
```bash
git clone https://github.com/yourusername/cashcows.git
cd cashcows
```

### Install Dependencies 
```bash 
npm install
```

### Start the Expo Development Server 
```bash
expo start
```
### Backend Setup
```bash
node server.js
```
### Usage
In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

### Features 
- User Registration: Allows users to create an account.
- User Login: Allows users to log in to their account.

### API Endpoints 
Ensure you have a backend server running that handles the following endpoints:

Auth Routes:
- POST /api/auth/register: Register a new user.
   - Request Body: { email, username, password }
- POST /api/auth/login: Log in an existing user.
   - Request Body: { email, password }
- GET /api/auth: Check if server is running.