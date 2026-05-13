# 🔐 PgAdmin Setup Guide (No Password)

Since you're using PgAdmin without a password, here's how to set everything up:

## Step 1: Create Database in PgAdmin

1. Open PgAdmin in browser: **http://localhost:5050**
2. Right-click on "Databases" → Create → Database
3. Enter name: **mining_web**
4. Click Save

## Step 2: Configure Environment Variables

Update `c:\MINING\.env.local`:

```env
# Since PgAdmin has no password
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=          # ← Leave EMPTY (no password)
DATABASE_NAME=mining_web
NEXTAUTH_SECRET=your-secret-key-12345
NEXTAUTH_URL=http://localhost:3003
```

## Step 3: Test Connection

Your dev server should already be running. Test the database:

1. Visit: http://localhost:3003/api/db/test

Should return:
```json
{
  "status": "connected",
  "message": "Database connection successful",
  "timestamp": "2024-05-12T..."
}
```

If you get an error, it means:
- PostgreSQL is not running
- Database `mining_web` doesn't exist
- Credentials are wrong

## Step 4: Initialize Database

The database initializes automatically, but you can manually trigger it:

1. Start dev server: `pnpm dev`
2. Visit: http://localhost:3003/admin/login
3. Database tables are created automatically on first load
4. Login with: **admin / admin123**

## Verify Setup in PgAdmin

After initialization, you should see in PgAdmin:

1. Database: `mining_web`
2. Tables:
   - `admin_users`
   - `sessions`
   - `products`

To verify in PgAdmin:
1. Expand `mining_web` database
2. Right-click → Query tool
3. Run: `SELECT * FROM admin_users;`
4. Should show the default admin user

## Connection Troubleshooting

### If getting "cannot connect" error:

1. **Check PostgreSQL is running**
   ```bash
   # Windows - check services
   Get-Service PostgreSQL* | Select Status
   ```

2. **Check PgAdmin connectivity**
   - Visit http://localhost:5050
   - If works, PostgreSQL is running

3. **Verify correct credentials**
   ```bash
   # Test with psql command line
   psql -U postgres -d mining_web
   ```

4. **Check port**
   ```bash
   # PostgreSQL default is 5432
   netstat -ano | findstr :5432
   ```

### If database still won't initialize:

1. Manually create database:
   ```bash
   createdb mining_web -U postgres
   ```

2. Then visit: http://localhost:3003/api/db/init

3. Check browser console (F12) for error messages

## Complete Setup Example

```
1. PostgreSQL running ✓
2. PgAdmin accessible at http://localhost:5050 ✓
3. Database "mining_web" created ✓
4. .env.local configured with empty password ✓
5. Dev server running: pnpm dev ✓
6. Visit: http://localhost:3003/admin/login ✓
7. Database initializes automatically ✓
8. Login with admin/admin123 ✓
```

## Database Connection String Format

For reference, here's what your connection string looks like:

```
postgresql://postgres:@localhost:5432/mining_web
                    ↑
                 No password (empty)
```

## Advanced: Using psql Command Line

If you need direct database access:

```bash
# Connect to mining_web database
psql -U postgres -d mining_web

# View admin users
SELECT * FROM admin_users;

# View products
SELECT * FROM products;

# View sessions
SELECT * FROM sessions;
```

## Resetting Database

If you need to reset everything:

1. In PgAdmin, right-click `mining_web` → Drop
2. Visit: http://localhost:3003/api/db/init
3. New tables are created automatically
4. Login with admin/admin123

---

**Everything should work seamlessly now!** Your database, frontend, and backend are automatically connected and synchronized. 🎉
