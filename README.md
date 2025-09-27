# Admin Panel Backend

A robust Node.js/Express.js backend API for admin panel with user management and authentication.

## 🚀 Features

- **JWT Authentication** - Secure admin login system
- **User Management** - Complete CRUD operations for users
- **Admin Settings** - Profile and password management
- **MySQL Database** - Reliable data storage
- **Input Validation** - Server-side validation with express-validator
- **Password Hashing** - Secure password storage with bcryptjs

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing

## 🔧 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=admin_panel
   DEFAULT_ADMIN_PASSWORD=default_password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=24h
   ```

3. Create MySQL database and run the SQL schema from `database.sql`

4. Start the server:
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin
- `POST /api/auth/verify` - Verify token

### Users
- `GET /api/users` - Get all users (pagination/search)
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Settings
- `GET /api/settings` - Get admin settings
- `PUT /api/settings/profile` - Update admin profile
- `PUT /api/settings/password` - Update admin password

## 🔐 Default Admin

- **Email:** admin@admin.com
- **Password:** please contact me for the password

## 🌐 Deployment

Deployed on **Render** with automatic deployments from Git repository.

## 📁 Project Structure

```
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Authentication middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Helper functions
├── server.js        # Main server file
└── package.json     # Dependencies
```