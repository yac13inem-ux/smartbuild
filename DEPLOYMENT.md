# 🚀 Deployment Guide - BuildTrack

## Database Setup for Production

### Option 1: Use Supabase (Recommended - Free Tier)

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Set your password and region
   - Wait for project to be created

2. **Get Database URL:**
   - Go to Settings → Database
   - Copy the "Connection string" (PostgreSQL)
   - Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

3. **Set Environment Variable in Vercel:**
   - In Vercel project → Settings → Environment Variables
   - Add `DATABASE_URL` with your Supabase connection string

### Option 2: Use Neon (Recommended - Free Tier)

1. **Create a Neon Project:**
   - Go to [neon.tech](https://neon.tech)
   - Click "Create a project"
   - Choose PostgreSQL
   - Copy the connection string

2. **Set Environment Variable:**
   - Add `DATABASE_URL` in Vercel with Neon connection string

### Option 3: Use PlanetScale (MySQL Alternative)

1. **Create a PlanetScale Database:**
   - Go to [planetscale.com](https://planetscale.com)
   - Create a new database
   - Get the connection string

2. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

## Vercel Deployment Steps

### Step 1: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import `BuildTrack` from GitHub

### Step 2: Configure Environment Variables

Add the following environment variables:

```
DATABASE_URL=your-database-connection-string
NODE_ENV=production
```

### Step 3: Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `bun run build`
- **Install Command**: `bun install && bun run db:generate`
- **Output Directory**: `.next`

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

### Step 5: Run Database Migration (First Time Only)

After deployment, you need to create the database schema:

1. Go to Vercel project → Settings → Environment Variables
2. Copy the `DATABASE_URL`
3. Run locally:
   ```bash
   DATABASE_URL="your-production-database-url" bun run db:push
   ```

OR use Vercel CLI:
```bash
vercel env pull .env.local --environment=production
bun run db:push
```

## Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Check that `DATABASE_URL` is set correctly
2. Verify database is accepting connections
3. Check if IP whitelisting is enabled (add Vercel's IP ranges)

### Issue: Build Failed - Prisma Generate Error

**Solution:**
1. Make sure `DATABASE_URL` is set during build
2. Update `vercel.json`:
   ```json
   {
     "installCommand": "bun install && bun run db:generate"
   }
   ```

### Issue: Cannot Add Data

**Solution:**
1. Check browser console for errors
2. Check Vercel function logs
3. Verify API routes are returning correct responses
4. Ensure database schema is created

### Issue: Progress Not Showing

**Solution:**
1. Check if blocks have progress data
2. Verify `floorsData` is properly saved
3. Check API response format

### Issue: Authentication/Session Issues

If using NextAuth:

```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate-a-random-secret
```

Generate secret:
```bash
openssl rand -base64 32
```

## Monitoring

### Check Vercel Logs

1. Go to Vercel project
2. Click on your deployment
3. Click "Logs" tab
4. Filter by:
   - `build` for build errors
   - `runtime` for runtime errors
   - `function` for API errors

### Check Database Performance

For Supabase:
- Dashboard → Database → Logs

For Neon:
- Dashboard → Monitoring

## Custom Domain (Optional)

1. In Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatically provisioned)

## Scaling

### Enable Caching

Add to `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  // ... existing config
  experimental: {
    serverActions: {
      allowedOrigins: ['yourdomain.com'],
    },
  },
};
```

### Enable Edge Functions

For API routes that don't need database:
```typescript
export const runtime = 'edge';
```

## Backup Strategy

### Database Backup

For Supabase:
- Settings → Database → Backups (automated daily)

For Neon:
- Dashboard → Branches (create backup branch)

For Manual Backup:
```bash
pg_dump DATABASE_URL > backup.sql
```

## Security Checklist

- ✅ `DATABASE_URL` is in environment variables (not in code)
- ✅ `.env` files are in `.gitignore`
- ✅ No sensitive data in client-side code
- ✅ CORS is configured if needed
- ✅ Rate limiting is implemented for public APIs
- ✅ Regular backups are enabled

## Support

For issues:
1. Check Vercel logs
2. Check database logs
3. Review this guide
4. Check GitHub Issues

## Update Deployment

When pushing to main:
- Vercel auto-deploys by default
- Check deployment status in Vercel dashboard
- Monitor logs for errors

## Rollback

If deployment fails:
1. Go to Vercel project → Deployments
2. Find the previous successful deployment
3. Click "..." → "Promote to Production"
