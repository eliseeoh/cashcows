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