# Mining Web - Admin Panel Setup

## ✅ Automatic Setup Complete!

Your admin panel, database connection, and backend API have been automatically configured. Here's what was set up:

### 📦 What's Included

1. **Database Connection** (`lib/db.ts`)
   - PostgreSQL connection pool
   - Automatic connection management
   - Query execution with logging

2. **Authentication System**
   - Login/Logout API endpoints
   - Session management with tokens
   - Cookie-based authentication
   - Admin user management

3. **Admin Panel**
   - **Dashboard** (`/admin`) - Overview with stats and charts
   - **Products** (`/admin/products`) - Manage products
   - **Users** (`/admin/users`) - Manage admin users
   - **Login** (`/admin/login`) - Secure login page

4. **API Routes**
   - Database health check: `/api/db/test`
   - Database initialization: `/api/db/init`
   - Authentication: `/api/auth/login`, `/api/auth/logout`, `/api/auth/check`
   - Products CRUD: `/api/products`
   - Users: `/api/admin/users`

---

## 🚀 Quick Start

### 1. **Ensure PostgreSQL is Running**
   ```bash
   # Windows: Start PostgreSQL service
   # Or use PgAdmin at http://localhost:5050
   ```

### 2. **Update Environment Variables** (`.env.local`)
   ```
   DATABASE_URL="postgresql://postgres@localhost:5432/mining_web"
   DATABASE_HOST="localhost"
   DATABASE_PORT="5432"
   DATABASE_USER="postgres"
   DATABASE_PASSWORD=""      # Leave empty if no password
   DATABASE_NAME="mining_web"
   ```

### 3. **Create Database** (if not exists)
   ```bash
   # Open PgAdmin and create a new database named "mining_web"
   # Or use psql:
   createdb mining_web -U postgres
   ```

### 4. **Start Development Server**
   ```bash
   pnpm dev
   ```

### 5. **Initialize Database**
   - Navigate to `http://localhost:3003/admin/login`
   - Click "Initialize Database" (happens automatically on first load)
   - Tables will be created automatically

---

## 🔐 Default Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

**⚠️ IMPORTANT:** Change these credentials in production!

---

## 📊 Database Schema

### Tables Created Automatically:

#### `admin_users`
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- password
- email
- created_at
- updated_at
```

#### `sessions`
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- token (UNIQUE)
- expires_at
- created_at
```

#### `products`
```sql
- id (PRIMARY KEY)
- name
- description
- category
- price
- stock_quantity
- created_at
- updated_at
```

---

## 🔗 API Documentation

### Authentication
```javascript
// Login
POST /api/auth/login
Body: { username: "admin", password: "admin123" }

// Check Session
GET /api/auth/check

// Logout
POST /api/auth/logout
```

### Database
```javascript
// Test Connection
GET /api/db/test

// Initialize Tables
POST /api/db/init
```

### Products
```javascript
// Get All Products
GET /api/products

// Create Product
POST /api/products
Body: {
  name: "Quartz",
  category: "Minerals",
  price: 25.00,
  stock_quantity: 100,
  description: "High-quality quartz"
}
```

---

## 🛠️ File Structure

```
app/
├── admin/
│   ├── layout.tsx          # Admin layout with sidebar
│   ├── page.tsx            # Dashboard
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── products/
│   │   └── page.tsx        # Products management
│   └── users/
│       └── page.tsx        # Users management
└── api/
    ├── auth/
    │   ├── login/route.ts
    │   ├── logout/route.ts
    │   └── check/route.ts
    ├── admin/
    │   └── users/route.ts
    ├── products/route.ts
    └── db/
        ├── test/route.ts
        └── init/route.ts

lib/
├── db.ts                   # Database connection pool
└── auth.ts                 # Authentication utilities
```

---

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_HOST` | localhost | PostgreSQL host |
| `DATABASE_PORT` | 5432 | PostgreSQL port |
| `DATABASE_USER` | postgres | Database user |
| `DATABASE_PASSWORD` | (empty) | Database password |
| `DATABASE_NAME` | mining_web | Database name |
| `NEXTAUTH_SECRET` | auto-generated | Session secret |
| `NEXTAUTH_URL` | http://localhost:3003 | App URL |

---

## ⚡ Features

✅ Automatic database connection pooling
✅ Session-based authentication
✅ Secure password handling
✅ Token-based API authentication
✅ Responsive admin dashboard
✅ Product management
✅ User management
✅ Real-time database sync
✅ Error handling and logging

---

## 🐛 Troubleshooting

### "Cannot connect to database"
1. Ensure PostgreSQL is running
2. Check database credentials in `.env.local`
3. Verify database `mining_web` exists
4. Check connection string format

### "Login failed"
1. Verify default credentials (admin/admin123)
2. Check database initialization completed
3. Look at browser console for errors

### "Database initialization not working"
1. Navigate to `/api/db/init` manually
2. Check browser DevTools console
3. Verify PostgreSQL connection

---

## 🔄 Customization

### Change Default Password
Edit `app/api/db/init/route.ts` and update the INSERT statement:
```typescript
INSERT INTO admin_users (username, password, email)
VALUES ('admin', 'your_new_password', 'admin@mining.com')
```

### Add More Routes
Create new files in `app/admin/` and `app/api/` following the same pattern.

### Connect to Existing Database
Update `.env.local` with your database credentials and run `/api/db/init` to create tables.

---

## 📞 Support

For issues or questions:
1. Check database connection: `/api/db/test`
2. Review console logs in VS Code terminal
3. Verify `.env.local` configuration
4. Check PostgreSQL is running

---

**Ready to go! Start your development server and visit: http://localhost:3003/admin/login** 🎉
