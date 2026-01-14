# GigFlow - Mini Freelance Marketplace

GigFlow is a mini-freelance marketplace platform where Clients can post jobs (Gigs) and Freelancers can apply for them (Bids). This project demonstrates complex database relationships, secure authentication, and state management.

## 🚀 Features

### Core Features
- **User Authentication**: Secure sign-up and login with JWT tokens stored in HttpOnly cookies
- **Gig Management**: Create, browse, and search for gigs
- **Bidding System**: Freelancers can submit bids on open gigs
- **Hiring Logic**: Clients can hire freelancers with atomic transactions
- **Real-time Notifications**: Socket.io integration for instant notifications when hired

### Bonus Features
- **Transactional Integrity**: MongoDB transactions prevent race conditions during hiring
- **Real-time Updates**: Socket.io notifications for instant feedback

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Redux Toolkit for state management
- React Router for navigation
- Socket.io-client for real-time updates

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication with HttpOnly cookies
- Socket.io for real-time communication
- MongoDB transactions for data integrity

## 📋 Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)

**No local installation required!** Everything runs in Docker containers including MongoDB.

## 🔧 Installation & Setup

### Quick Start with Docker (Recommended)

**Everything runs in Docker - no local installation needed!**

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd gigflow
   ```

2. **Start all services (MongoDB, Backend, Frontend):**
   ```bash
   docker-compose up --build
   ```

   This single command will:
   - Pull MongoDB image and start the database
   - Build and start the backend API server
   - Build and start the frontend (served via nginx)
   - Set up networking between all services

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017 (if you need direct access)

### Optional: Environment Variables

Create a `.env` file in the root directory (optional):
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

If not provided, default values will be used.

## 🚀 Running the Application

### Production Mode (Docker)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Development Mode (Docker with Hot Reload)

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

This enables:
- Hot reload for backend (nodemon)
- Hot reload for frontend (Vite)
- Source code mounted as volumes

### Local Development (Without Docker)

If you prefer to run locally:

1. **Install Node.js and MongoDB locally**
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env file with MongoDB connection
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs` - Get all open gigs (with optional `?search=query`)
- `GET /api/gigs/:id` - Get single gig details
- `POST /api/gigs` - Create new gig (protected)

### Bids
- `POST /api/bids` - Submit a bid (protected)
- `GET /api/bids/:gigId` - Get all bids for a gig (owner only, protected)
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (protected, atomic transaction)

## 🗄️ Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Gig
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: String (enum: ['open', 'assigned'])
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  price: Number,
  status: String (enum: ['pending', 'hired', 'rejected'])
}
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT tokens stored in HttpOnly cookies
- CORS configuration
- Protected routes with authentication middleware
- MongoDB transactions for atomic operations

## 🎯 Key Implementation Details

### Hiring Logic with Transactional Integrity

The hiring process uses MongoDB transactions to ensure:
1. Only one freelancer can be hired per gig
2. All other bids are automatically rejected
3. Gig status is updated atomically
4. Race conditions are prevented

### Real-time Notifications

Socket.io is integrated to send real-time notifications to freelancers when they are hired. The notification includes:
- Project name
- Bid details
- Instant delivery without page refresh

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing the Application

1. **Register a new user** (Client)
2. **Post a gig** with title, description, and budget
3. **Register another user** (Freelancer)
4. **Browse gigs** and submit a bid
5. **As the Client**, view bids and hire a freelancer
6. **Check Dashboard** for real-time notifications

## 📦 Project Structure

```
gigflow/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store and slices
│   │   ├── services/    # API and Socket services
│   │   └── App.jsx
│   └── package.json
└── README.md
```
