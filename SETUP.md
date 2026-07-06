# Ludo King Clone - Environment Configuration

## Backend Setup (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ludo-king
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ludo-king

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Admin Secret (For SECRET endpoints)
ADMIN_SECRET_KEY=your-admin-secret-key-keep-confidential

# Socket.IO Configuration
SOCKET_CORS_ORIGIN=http://localhost:3000

# Optional: Email Service (for future notifications)
# EMAIL_SERVICE=gmail
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
```

## Frontend Setup (.env)

```bash
# API Configuration
API_BASE_URL=http://localhost:5000
SOCKET_URL=http://localhost:5000

# App Configuration
APP_NAME=Ludo King Clone
APP_VERSION=1.0.0
```

## Running the Project

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with configuration above
echo 'PORT=5000' > .env

# Start the server
npm start

# For development with hot-reload
npm run dev
```

### Frontend (Flutter)

```bash
# Navigate to frontend directory
cd frontend

# Get dependencies
flutter pub get

# Run on emulator/device
flutter run

# Build APK
flutter build apk

# Build for iOS
flutter build ios
```

## Database Setup

### MongoDB Local Installation

```bash
# On macOS (using Homebrew)
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows (if installed)
net start MongoDB
```

### Create Database and Collections

```bash
# Connect to MongoDB
mongo

# Switch to database
use ludo-king

# Run schema.sql to create collections
# Copy and paste the schema from database/schema.sql
```

## Testing Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"player1","email":"player1@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player1@test.com","password":"password123"}'

# Set Winner (SECRET)
curl -X POST http://localhost:5000/api/admin/set-winner \
  -H "X-Admin-Secret: your-admin-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"gameId":"game-id-here","winnerId":"user-id-here"}'
```

### Using Postman

1. Import the endpoints from API_DOCUMENTATION.md
2. Create environment variables:
   - `base_url`: `http://localhost:5000`
   - `token`: (Auto-populate after login)
   - `admin_secret`: Your admin secret key
3. Test endpoints with the collection

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `brew services list` (macOS)
- Check connection string in .env
- Verify database name matches

### Port Already in Use
```bash
# Kill process on port 5000
kill -9 $(lsof -t -i:5000)
```

### Flutter Build Issues
```bash
# Clean build
flutter clean
flutter pub get
flutter run
```

## Deployment

### Backend (Heroku)

```bash
# Login to Heroku
heroku login

# Create app
heroku create ludo-king-clone

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main
```

### Frontend (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init

# Build Flutter web
flutter build web

# Deploy
firebase deploy
```
