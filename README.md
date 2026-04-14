# LIA FUSION - Landing Page & Speed Mingle Game

A full-stack networking platform built to make speed networking events actually fun. Whether you're a student looking to connect with cool companies or a business hoping to meet talented students. LIA FUSIONs Speed Mingle brings everyone together in real-time with an interactive game experience. Built with React, Node.js, Express, and Socket.io.

## Overview

LIA FUSION lets students and companies come together for structured speed networking events. Think of it like speed dating, but for career connections. The app handles everything—user accounts, real-time game synchronization, icebreaker questions, and post-event networking—making meaningful connections happen.

### Features

- **Secure Accounts** - Separate authentication for students
- **Profile Customization** - Add photos, skills, interests, and company details that stand out
- **Speed Mingle** - Questions and conversation starters with countdown timers to keep things moving
- **Find Your Match** - Browse companies by industry, size, and other filters to find the right fit
- **Stay Connected** - After the game, check out other participants profiles and save them by liking them

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Running](#running)
- [How It Works](#how-it-works)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Tech Stack

### Frontend

- **React 19** - Modern, component-based UI library
- **React Router 7** - Navigation and routing
- **Vite** - Lightning-fast build tool
- **Socket.io Client** - Real-time updates to keep everyone in sync
- **Axios** - Making API requests
- **CSS Modules** - Styling with scoped, isolated styles

### Backend

- **Node.js** - JavaScript runtime (with ES module support)
- **Express 5** - Lightweight web framework
- **Socket.io** - Real-time communication server
- **MongoDB & Mongoose** - NoSQL database and data modeling
- **JWT** - Secure token-based authentication
- **Bcrypt** - Password hashing
- **Multer** - Handling file uploads

## Installation

### Requirements

- **Node.js** v16+
- **npm**
- **MongoDB**
- **Git**

### Get Started

1. Clone the repo:

```bash
git clone https://github.com/egirardo/mingle-app.git
cd mingle-app
```

2. Install dependencies:

```bash
# Frontend packages
cd client
npm install

# Backend packages
cd ../server
npm install
```

3. Set up your environment variables.

Create `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mingle-app
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Quick Start

How to start it:

```bash
# Clone and install
git clone https://github.com/egirardo/mingle-app.git
cd mingle-app

# Setup backend
cd server
npm install
# Update server/.env with MongoDB connection and JWT secret

# Setup frontend
cd ../client
npm install
# Update client/.env with API and Socket URLs

# Run in two separate terminals
# Terminal 1 (from server/): npm run dev
# Terminal 2 (from client/): npm run dev
```

## Running

### Development

Open two terminal windows:

**Terminal 1 - Start the backend:**

```bash
cd server
npm run dev
```

Server will be at `http://localhost:5000`

**Terminal 2 - Start the frontend:**

```bash
cd client
npm run dev
```

App will be at `http://localhost:5173`

## How It Works

### For Students

1. Sign up with your name and email
2. Fill out your profile (add a photo, fun fact, portfolio, interests)
3. Browse companies looking for a LIA place
4. Scan a QR code to join the speed mingle game
5. Chat with company reps for a few minutes each in the game
6. After the game ends, connect with companies you liked and and like their profiles

### For Companies

1. Register your company
2. Attend the event
3. Browse students looking for a LIA place
4. Scan a QR code to join the speed mingle game
5. Meet students in timed rounds—each one is a chance to find talent
6. Follow up with students after the event, and like their profiles

## Troubleshooting

**MongoDB won't connect?**

- Make sure MongoDB is running (`brew services list` on macOS)
- Double-check your `MONGODB_URI` in `server/.env`
- If using MongoDB Atlas, make sure your IP is whitelisted

**Socket.io says connection failed?**

- Both client and server should be running
- Check that `VITE_SOCKET_URL` matches your server
- Look at browser console for CORS errors

**"Cannot find module" error?**

- Try a fresh install: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf client/.vite`
- Check for typos in import statements

## Dev Team

[@Otloir](https://github.com/Otloir)

[@egirardo](https://github.com/egirardo)

## License

This project is licensed under the MIT License—check the [LICENSE](LICENSE) file for the details.
