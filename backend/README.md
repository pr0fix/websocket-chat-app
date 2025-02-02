# Chat App Backend

This is the backend server for my websocket chat application. It currently provides APIs for user authentication, message handling, and real-time communication.

## Features

- User authentication (signup, login)
- Real-time messaging with websocket
- RESTful APIs for managing users and messages
- Message history with MongoDB integration

## Technologies Used

- Node.js
- Express.js
- MongoDB
- socket.io

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/pr0fix/websocket-chat-app.git
   ```
2. Navigate to the project directory:
   ```sh
   cd websocket-chat-app/backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### Configuration

1. Create a `.env` file in the backend folder and add the following environment variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the server:
   ```sh
   npm start
   ```
2. The server will be running on `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/signup` - Creates a new user, logs them in and returns a token to be used in following requests
- `POST /api/login` - Logs a user in and creates a new token for them

### Conversation

- `GET /api/conversation` - Get current conversation
- `POST /api/conversation` - Creates a new conversation between two or more users
- `POST /api/conversation/:id/messages` - Sends a message to the conversation defined by id

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a user by ID
- `POST /api/add-friend` - Add a user to your list of friends