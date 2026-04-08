# 🗄️ SmartBuild - Supabase Project Configuration

## 📊 Project Information

### Project Details
- **Project Name**: SmartBuild
- **Project Ref**: `bycjhpqrzyptobgtgxbt`
- **Region**: Europe West 1
- **Database**: PostgreSQL
- **Status**: Active

## 🔑 Connection Strings

### 1. Connection Pooling URL (for Vercel Serverless)
```
postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Use this for**: Vercel deployment, production applications, serverless environments

### 2. Direct Connection URL (for Migrations)
```
postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

**Use this**: Database migrations, administrative tasks, Prisma db push

### 3. Project URL
```
https://bycjhpqrzyptobgtgxbt.supabase.co
```

## 🔐 API Keys

### Anon Key (Public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y2pocHFyenlwdG9iZ3RneGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzI1NTUsImV4cCI6MjA5MTI0ODU1NX0.mNIPbMT4rOa_P3U0xZUZRXw78kfvv0wHg9PbZFV1edY
```

**Use for**: Client-side API calls, browser-based authentication

### Service Role Key (Backend Only)
⚠️ **WARNING**: Never expose this key on the client side!
Get it from: https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt/settings/api

## 🗂️ Environment Variables

### For Local Development (.env)
```bash
# Supabase Connection Pooling (for Vercel serverless)
DATABASE_URL="postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for migrations)
DIRECT_URL="postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

# Supabase Client Configuration
NEXT_PUBLIC_SUPABASE_URL="https://bycjhpqrzyptobgtgxbt.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y2pocHFyenlwdG9iZ3RneGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzI1NTUsImV4cCI6MjA5MTI0ODU1NX0.mNIPbMT4rOa_P3U0xZUZRXw78kfvv0wHg9PbZFV1edY"
```

### For Vercel Deployment
Add all the above environment variables in your Vercel project settings.

## 🗄️ Database Schema

After running the migration script, you'll have these tables:

1. **User** - User accounts and roles
2. **Project** - Construction projects
3. **Block** - Building blocks within projects
4. **Unit** - Individual units within blocks
5. **Report** - Project reports (PV_VISITE, PV_CONSTAT, RAPPORT_MENSUEL)
6. **Problem** - Problem tracking with status management
7. **GrosOeuvreFloor** - Floor tracking with time fields

## 🚀 Quick Start

### 1. Setup Database Tables
```bash
# Open Supabase SQL Editor
https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt/sql/new

# Run the migration script
# Copy and paste contents of: supabase-migration.sql
```

### 2. Local Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

### 3. Deploy to Vercel
1. Import project: https://vercel.com/new
2. Select repository: `yac13inem-ux/smartbuild`
3. Add environment variables (see above)
4. Deploy!

## 📚 Documentation Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt
- **SQL Editor**: https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt/editor
- **API Settings**: https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt/settings/api
- **Database Settings**: https://supabase.com/dashboard/project/bycjhpqrzyptobgtgxbt/settings/database

## 🔧 Useful Commands

### Supabase CLI
```bash
# Login to Supabase
supabase login

# Link to project
supabase link --project-ref bycjhpqrzyptobgtgxbt

# Push migrations
supabase db push

# Generate types
supabase gen types typescript --local > src/types/supabase.ts
```

### Prisma CLI
```bash
# Push schema to database (use DIRECT_URL)
DATABASE_URL="postgresql://postgres.bycjhpqrzyptobgtgxbt:TdwdU5jFL7nAVEQA@aws-0-eu-west-1.pooler.supabase.com:5432/postgres" bun run db:push

# Generate Prisma Client
bunx prisma generate

# Open Prisma Studio
bunx prisma studio
```

## ⚠️ Important Notes

1. **Connection Pooling**: Always use the pooled connection (`:6543?pgbouncer=true`) for Vercel and serverless environments
2. **Direct Connection**: Use direct connection (`:5432`) only for migrations and administrative tasks
3. **Security**: Never commit `.env` file with real credentials
4. **Anon Key**: Safe to use on client-side for public operations
5. **Service Role Key**: Never expose on client-side - use only on server

## 📞 Support

For issues or questions:
- GitHub: https://github.com/yac13inem-ux/smartbuild/issues
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs

---

**Generated**: 2025-02-04
**Project**: SmartBuild
**Version**: 1.0.0
