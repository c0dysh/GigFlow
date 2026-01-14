# Docker Setup Guide for GigFlow

This guide explains how to run GigFlow using Docker and Docker Compose.

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)

## Quick Start (Production)

1. **Clone and navigate to the project:**
   ```bash
   cd gigflow
   ```

2. **Set environment variables (optional):**
   Create a `.env` file in the root directory:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Development Mode

For development with hot-reload:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This will:
- Mount source code as volumes for hot-reload
- Run development servers with nodemon and Vite
- Frontend will be available on port 5173

## Individual Service Commands

### Start only MongoDB:
```bash
docker-compose up mongodb
```

### Start backend only:
```bash
docker-compose up backend
```

### Start frontend only:
```bash
docker-compose up frontend
```

### Build specific service:
```bash
docker-compose build backend
docker-compose build frontend
```

## Useful Docker Commands

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop services:
```bash
docker-compose down
```

### Stop and remove volumes (clean slate):
```bash
docker-compose down -v
```

### Rebuild without cache:
```bash
docker-compose build --no-cache
```

### Execute commands in containers:
```bash
# Backend shell
docker-compose exec backend sh

# MongoDB shell
docker-compose exec mongodb mongosh

# Frontend shell
docker-compose exec frontend sh
```

## Environment Variables

### Backend Environment Variables:
- `MONGODB_URI`: MongoDB connection string (default: `mongodb://mongodb:27017/gigflow`)
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS (default: `http://localhost:3000`)
- `NODE_ENV`: Environment mode (production/development)

### Frontend Environment Variables:
- `VITE_API_URL`: Backend API URL (default: `http://localhost:5000/api`)

## Docker Images

### Production Images:
- **Backend**: Multi-stage build with Node.js 20 Alpine
- **Frontend**: Multi-stage build with Nginx Alpine
- **MongoDB**: Official MongoDB 7 image

### Development Images:
- **Backend**: Node.js 20 Alpine with nodemon
- **Frontend**: Node.js 20 Alpine with Vite dev server

## Volumes

- `mongodb_data`: Persistent storage for MongoDB data
- Development volumes: Source code mounted for hot-reload

## Network

All services are connected via a bridge network (`gigflow-network`) for internal communication.

## Health Checks

- **MongoDB**: Checks database connectivity
- **Backend**: HTTP health check on `/api/health`
- **Frontend**: HTTP health check on nginx

## Troubleshooting

### Port already in use:
```bash
# Change ports in docker-compose.yml
ports:
  - "3001:80"  # Instead of 3000:80
```

### MongoDB connection issues:
```bash
# Check if MongoDB is healthy
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb
```

### Rebuild after dependency changes:
```bash
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
```

### Clear all Docker data:
```bash
# Remove containers, networks, and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Production Deployment

For production deployment:

1. **Set strong JWT_SECRET:**
   ```env
   JWT_SECRET=$(openssl rand -base64 32)
   ```

2. **Use environment-specific compose file:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

3. **Set up reverse proxy (nginx/traefik) for SSL**

4. **Use external MongoDB (MongoDB Atlas) for production**

5. **Enable resource limits:**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '0.5'
         memory: 512M
   ```

## Docker Compose Files

- `docker-compose.yml`: Main production configuration
- `docker-compose.dev.yml`: Development overrides
- `docker-compose.prod.yml`: Production overrides (create as needed)
