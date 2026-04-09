# LIA FUSION - Landing Page & Speed Mingle Game

A full-stack web application featuring a landing page for event registration and a real-time interactive multiplayer game for speed networking. Built with React, Node.js, Express, and Socket.io.

## Project Overview

### Key Features

- Role-based authentication (Student/Business)
- Event registration and participant management
- Real-time multiplayer game synchronization
- Interactive question rounds with countdown timers
- Photo upload and participant profiles
- Persistent session state

## Tech Stack

### Client

- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **Vite** - Build tool and dev server
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP requests
- **CSS Modules** - Component scoping

### Server

- **Node.js with ES modules** - JavaScript runtime
- **Express 5** - Web framework
- **Socket.io** - WebSocket server
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## Installation

### Clone & Setup

```bash
# Clone the repository
git clone https://github.com/egirardo/mingle-app
cd mingle-app

# Install client dependencies
cd client
npm install

# Install server dependencies
cd server
npm install
```

### Environment Configuration

Create a `.env` file in the `server` & `client` directories:

## Running the Application

### Development Mode

**Terminal 1 - Start the server:**

```bash
cd server
npm run dev
```

The server runs on `http://localhost:5000`

**Terminal 2 - Start the client:**

```bash
cd client
npm run dev
```

## User Journey

### Landing Page & Registration Flow

1. **Home Page** - Welcome screen with event information
2. **Sign Up** - Create account (Student or Business profile)
3. **Event Registration** - Browse and register for upcoming mingle events
4. **Profile Setup** - Upload photo and complete profile information

### Speed Mingle Game Flow

1. **Introduction** - Countdown timer before the game begins
2. **Question Round** - Participants receive icebreaker questions
3. **Task** - Interactive tasks or conversation starters
4. **Loading** - Transition between rounds
5. **Completion** - Game ends, option to explore other participants or return to home

## How It Works

### For Students

1. Create a student account
2. Browse participating companies and their profiles
3. When the event starts, scan the QR code and join the Speed Mingle game
4. Meet and interact with business professionals
5. View and connect with other participants after the game through the explore page

### For Businesses

1. Create a business profile
2. Register for the mingle event to meet students
3. Scan the QR code on the screen and participate in the game
4. Build connections with potential LIA candidates

## License

See the LICENSE file for details.
