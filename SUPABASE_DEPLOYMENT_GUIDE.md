# BuildTrack - Supabase & Vercel Deployment Guide

## 📋 Overview

This guide will help you set up the Supabase database and deploy BuildTrack to Vercel.

---

## 🗄️ Step 1: Set Up Supabase Database

Since the sandbox environment cannot connect to external databases, you need to set up the database manually.

### 1.1 Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw
2. Sign in if prompted

### 1.2 Run the Migration Script

1. In the left sidebar, click on **SQL Editor** (icon looks like `>_`)
2. Click **"New query"** button
3. Copy the entire content from the file `supabase_migration.sql` in your project
4. Paste it into the SQL Editor
5. Click the **"Run"** button (▶️) to execute the script
6. You should see a success message: `Database migration completed successfully!`

The script will create all necessary tables:
- User
- Project
- Block
- Unit
- Report
- Problem
- GrosOeuvreFloor

### 1.3 Verify Tables Were Created

1. In the left sidebar, click on **Table Editor** (icon looks like a grid)
2. You should see all the tables listed on the left side
3. Click on any table to see its structure

### 1.4 Configure Connection Pooling (Recommended)

1. Go to **Database** settings in the left sidebar
2. Click on **Connection pooling**
3. Enable **Transaction mode** (recommended for Vercel serverless)
4. Use the **Pooled connection string** for your DATABASE_URL

The pooled connection string format is:
```
postgresql://postgres.fziikvgrnwkqfzfnebjw:lL5OvpM9vSzCKYGW@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 🚀 Step 2: Configure Vercel Environment Variables

### 2.1 Open Your Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click on your **BuildTrack** project

### 2.2 Add Environment Variables

1. Go to **Settings** > **Environment Variables**
2. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres.fziikvgrnwkqfzfnebjw:lL5OvpM9vSzCKYGW@aws-0-us-east-1.pooler.supabase.com:6543/postgres` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fziikvgrnwkqfzfnebjw.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C` | Production, Preview, Development |

**Important:** Use the **pooled connection string** for `DATABASE_URL` (includes `.pooler.` and port `6543`).

### 2.3 Redeploy the Application

1. Go to **Deployments** tab
2. Click on the three dots (⋮) next to the latest deployment
3. Select **Redeploy**
4. Wait for the deployment to complete

---

## ✅ Step 3: Verify the Deployment

1. After redeployment, click on your production URL
2. Test creating a new project
3. Try adding blocks and floors
4. Verify that data is being saved in Supabase:
   - Go to Supabase Dashboard > Table Editor
   - Check the `Project`, `Block`, and `GrosOeuvreFloor` tables
   - You should see your created data

---

## 🔧 Troubleshooting

### Issue: "Database connection error"

**Solution:**
1. Make sure you're using the **pooled connection string** (includes `.pooler.` and port `6543`)
2. Verify the password is correct in the connection string
3. Check that your Supabase project is active (not paused)

### Issue: "Table doesn't exist"

**Solution:**
1. Run the `supabase_migration.sql` script again in Supabase SQL Editor
2. Check for any error messages in the SQL Editor output
3. Verify tables were created in the Table Editor

### Issue: Data not saving

**Solution:**
1. Check Vercel deployment logs for errors
2. Verify environment variables are correctly set
3. Make sure the DATABASE_URL has the correct format

### Issue: Time fields not appearing

**Solution:**
This should already be fixed! The time fields are now properly displayed in the Gros Œuvre section. If you don't see them:
1. Try creating a new floor to see if the issue is with old data
2. Check the Edit Floor dialog (click on the pencil icon)

---

## 📝 Local Development Setup

To run the application locally with Supabase:

1. Create a `.env` file in your project root with:
```env
DATABASE_URL=postgresql://postgres.fziikvgrnwkqfzfnebjw:lL5OvpM9vSzCKYGW@aws-0-us-east-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://fziikvgrnwkqfzfnebjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun run dev
```

4. Open http://localhost:3000 in your browser

---

## 🔄 Database Schema Overview

### User Table
- Stores user accounts (engineers, contractors, clients)
- Email and role management

### Project Table
- Construction projects
- Related to users and blocks

### Block Table
- Building blocks within projects
- Tracks progress for Gros Œuvre, CES, CET

### Unit Table
- Individual units/apartments within blocks
- Progress tracking per unit

### Report Table
- Various report types (PV_VISITE, PV_CONSTAT, RAPPORT_MENSUEL)
- Images and PDFs support

### Problem Table
- Issues tracking with status (PENDING, IN_PROGRESS, RESOLVED)

### GrosOeuvreFloor Table
- Floor-level tracking for Gros Œuvre phase
- **Iron review:** date and time fields
- **Concrete pour:** date and time fields
- Progress tracking per floor

---

## 🎯 Key Features Confirmed Working

✅ Time fields for iron review and concrete pour (vertically stacked)
✅ Internationalization (Arabic, English, French)
✅ Progress tracking (Gros Œuvre, CES, CET)
✅ Multi-language support
✅ Real-time updates
✅ Mobile-responsive design

---

## 📞 Need Help?

If you encounter any issues:
1. Check the Supabase dashboard for database errors
2. Review Vercel deployment logs
3. Make sure all environment variables are correctly set
4. Verify the migration script ran successfully

---

## 🎉 You're All Set!

Once you've completed these steps:
1. Database is set up in Supabase ✅
2. Environment variables are configured in Vercel ✅
3. Application is redeployed ✅
4. Data is being saved and retrieved correctly ✅

Your BuildTrack application should now be fully functional on Vercel with Supabase!
