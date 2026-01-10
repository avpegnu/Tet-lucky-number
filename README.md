# Tet Lucky Money Application 🧧

A festive web application for distributing Tet Lucky Money (Lì Xì) with role-based theming and interactive red envelope animations.

## 🎊 Features

- **Multi-tenancy**: Admins manage only their own users
- **Role-based themes**: Different experiences for LOVER, FRIEND, and COLLEAGUE
- **One-time play**: Users can draw lucky money only once
- **Bank info collection**: Users submit banking details after winning
- **Festive animations**: Red envelope shake/open effects with confetti
- **Secure authentication**: JWT-based auth with role-based access control
- **Auto-logout protection**: Invalid tokens automatically redirect to login

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install

# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/lucky-money
# JWT_SECRET=your-secure-secret-key-here
# JWT_EXPIRATION=7d
# PORT=3000
# FRONTEND_URL=http://localhost:5173

# Seed admin account (username: admin, password: admin123)
npm run seed:admin

# Start development server
npm run start:dev
```

Backend runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file with:
# VITE_API_URL=http://localhost:3000

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
LuckyMoney/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/           # JWT authentication & guards
│   │   │   ├── dto/
│   │   │   ├── guards/     # AdminGuard, UserGuard, JwtAuthGuard
│   │   │   └── strategies/
│   │   ├── admin/          # Admin CRUD for users
│   │   │   └── dto/
│   │   ├── lucky-money/    # Game logic & bank info
│   │   │   └── dto/
│   │   └── schemas/        # MongoDB models
│   └── .env
├── frontend/         # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/          # Login, Dashboard, Game
│   │   ├── hooks/          # useAuth context
│   │   └── services/       # Axios API client
│   └── .env
```

## 🎮 Usage Flow

### Admin Flow

1. Login at `/admin/login` (default: admin/admin123)
2. View dashboard with all created users
3. Create new users with:
   - Username and password
   - Role (LOVER/FRIEND/COLLEAGUE)
   - Available amounts (e.g., 50000, 100000, 200000)
4. View user statistics:
   - Lucky money status (played/not played)
   - Won amount
   - Bank information submitted

### User Flow

1. Login at `/user/login` with credentials from admin
2. See personalized Tet greeting based on role
3. Tap red envelope to draw lucky money (one-time only)
4. See animated confetti with won amount
5. Submit bank information (bank name + account number)
6. View thank you screen with submitted details

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth with configurable expiration
- **Password Hashing**: Bcrypt with salt rounds for secure storage
- **Role-based Guards**: AdminGuard and UserGuard protect endpoints
- **Ownership Validation**: Admins can only manage their own users
- **CORS Protection**: Configured for specific frontend origin
- **Input Validation**: class-validator for all DTOs
- **Auto-logout**: Invalid/expired tokens redirect to login

## 🎨 Tech Stack

**Backend:**

- NestJS + TypeScript
- MongoDB + Mongoose
- JWT + Passport
- Bcrypt
- class-validator

**Frontend:**

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Axios
- React Router DOM

## 🛠️ API Endpoints

### Auth

- `POST /auth/admin/login` - Admin login
- `POST /auth/user/login` - User login

### Admin (requires admin JWT)

- `GET /admin/users` - Get all users created by admin
- `GET /admin/users/:id` - Get specific user
- `POST /admin/users` - Create new user
- `PUT /admin/users/:id` - Update user password/amounts

### Lucky Money (requires user JWT)

- `GET /lucky/config` - Get role-based theme config
- `GET /lucky/status` - Get user's current status
- `POST /lucky/draw` - Draw lucky money (one-time)
- `POST /lucky/bank-info` - Submit bank information

## 📊 Data Models

### Admin Schema

```typescript
{
  username: string(unique);
  password: string(hashed);
  timestamps: true;
}
```

### User Schema

```typescript
{
  username: string (unique)
  password: string (hashed)
  role: 'LOVER' | 'FRIEND' | 'COLLEAGUE'
  createdBy: ObjectId (Admin)
  availableAmounts: number[]
  luckyMoneyStatus: 'NOT_PLAYED' | 'PLAYED'
  wonAmount: number (default: 0)
  bankInfo: {
    bankName: string
    accountNumber: string
  } | null
  timestamps: true
}
```

## 🐛 Common Issues & Solutions

### Issue: Auto-logout on page reload

**Fixed**: Added proper token validation and error handling in axios interceptors

### Issue: Bank info not saving

**Fixed**: Added @Schema decorator to BankInfo class with `_id: false`

### Issue: Admin can't see created users

**Fixed**: Improved error handling and loading states in AdminDashboard

### Issue: TypeScript import errors

**Fixed**: Changed to `import type` for decorator-only usage

## 🚀 Deployment

### Backend

- Use environment variables for production
- Set strong JWT_SECRET
- Configure MongoDB connection string
- Enable HTTPS in production

### Frontend

- Update VITE_API_URL to production backend
- Build with `npm run build`
- Serve static files with nginx/CDN

## 📝 Development Notes

- All DTOs use class-validator for validation
- Guards extend JwtAuthGuard for consistent auth
- Frontend uses context API for auth state
- Axios interceptors handle 401 auto-logout
- Framer Motion for smooth animations
- Tailwind custom colors for Tet theme
- Framer Motion
- React Router

## 📝 Initial Admin Creation

Use MongoDB to create the first admin:

```javascript
const bcrypt = require("bcrypt");
const password = await bcrypt.hash("yourpassword", 10);
// Insert into admin collection with hashed password
```

## 📖 Documentation

See [walkthrough.md](file:///C:/Users/Vanh/.gemini/antigravity/brain/3c605509-bab8-4e74-b900-1b3aef816397/walkthrough.md) for detailed documentation including:

- Complete API endpoints
- Authentication flow
- Frontend architecture
- Testing checklist
- Deployment guide

## 🎯 API Endpoints

**Auth:**

- `POST /auth/admin/login`
- `POST /auth/user/login`

**Admin (Protected):**

- `GET /admin/users`
- `POST /admin/users`
- `PUT /admin/users/:id`

**Lucky Money (Protected):**

- `GET /lucky/config`
- `POST /lucky/draw`
- `POST /lucky/bank-info`

## 🌟 Highlights

- ✨ Beautiful Tet-themed UI with red & gold colors
- 🎆 Smooth animations powered by Framer Motion
- 🎁 Interactive red envelope opening effect
- 🎊 Confetti celebration on lucky money reveal
- 📱 Fully responsive design
- 🔐 Secure multi-tenant architecture

---

**Chúc Mừng Năm Mới! 🧧**
