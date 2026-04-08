# 🔧 BuildTrack - Troubleshooting Guide

## Problem: Cannot Add or Save Anything on Vercel

If you're getting errors when trying to create projects or save data on https://buildtrack-omega.vercel.app/, follow these steps:

---

## 🚨 Step 1: Check Application Health

Visit this URL to see what's wrong:
```
https://buildtrack-omega.vercel.app/api/health
```

This will show you:
- ✅ If the database is connected
- ✅ If environment variables are configured
- ✅ If database tables exist

### Possible Responses:

**Response 1: Status "healthy"**
```
{
  "status": "healthy",
  "database": {
    "connected": true,
    "url": "configured",
    "tables": {
      "Project": true,
      "Block": true,
      "GrosOeuvreFloor": true
    }
  }
}
```
✅ Everything is working! Try refreshing the page.

---

**Response 2: Status "unhealthy"**
```
{
  "status": "unhealthy",
  "database": {
    "connected": false,
    "url": "configured"
  },
  "error": "..."
}
```
❌ **Problem:** Database connection failed

**Solution:**
1. Check your Vercel Environment Variables
2. Make sure DATABASE_URL is correct
3. Use the POOLED connection string (port 6543)

---

**Response 3: Status "tables_missing"**
```
{
  "status": "tables_missing",
  "database": {
    "connected": true,
    "url": "configured",
    "tables": {
      "Project": false,
      "Block": false,
      "GrosOeuvreFloor": false
    }
  }
}
```
❌ **Problem:** Database tables don't exist

**Solution:** You need to run the migration script (see Step 2 below)

---

## 📋 Step 2: Run the Migration Script (CRITICAL!)

This is the **most common issue** - the database tables haven't been created yet.

### 2.1 Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/sql/new
2. You'll see an empty SQL editor

### 2.2 Get the Migration Script

**Option A: From GitHub**
1. Go to: https://github.com/yac13inem-ux/BuildTrack
2. Open the file `supabase_migration.sql`
3. Click "Copy" button
4. Paste it into the Supabase SQL Editor

**Option B: From Your Local Project**
1. Open the file `supabase_migration.sql` in your project
2. Copy the entire content
3. Paste it into the Supabase SQL Editor

### 2.3 Run the Script

1. Click the **"Run"** button (▶️) in the SQL Editor
2. Wait for it to complete (should take 5-10 seconds)
3. You should see: `Database migration completed successfully!`

### 2.4 Verify Tables Were Created

1. In Supabase Dashboard, click **Table Editor** on the left
2. You should see these tables:
   - User
   - Project
   - Block
   - Unit
   - Report
   - Problem
   - GrosOeuvreFloor

---

## 🔑 Step 3: Verify Vercel Environment Variables

### 3.1 Check Your Vercel Settings

1. Go to: https://vercel.com/dashboard
2. Click on your **BuildTrack** project
3. Go to **Settings** → **Environment Variables**

### 3.2 Verify These Variables Are Set

| Variable Name | Value |
|--------------|-------|
| `DATABASE_URL` | `postgresql://postgres.fziikvgrnwkqfzfnebjw:lL5OvpM9vSzCKYGW@aws-0-us-east-1.pooler.supabase.com:6543/postgres` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fziikvgrnwkqfzfnebjw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_Ajim28MARlzKgCDULfqqtA_NILNke6C` |

### 3.3 Important Notes:

✅ **Must use POOLED connection** (contains `.pooler.` and port `6543`)
✅ **Must add to ALL environments** (Production, Preview, Development)
✅ **No extra quotes** around the values
✅ **No trailing spaces**

### 3.4 If Variables Are Missing or Wrong:

1. Add or edit each variable
2. Use the exact values from the table above
3. Select all environments: Production, Preview, Development
4. Click **Save**

---

## 🔄 Step 4: Redeploy the Application

After fixing any issues:

1. Go to **Deployments** tab in Vercel
2. Find your latest deployment
3. Click the three dots (⋮) → **Redeploy**
4. Wait for deployment to complete (usually 1-2 minutes)
5. Refresh https://buildtrack-omega.vercel.app/

---

## 🧪 Step 5: Test the Application

### 5.1 Test Health Check Again

Visit: https://buildtrack-omega.vercel.app/api/health

You should see:
```
{
  "status": "healthy",
  "database": {
    "connected": true,
    "url": "configured",
    "tables": {
      "Project": true,
      "Block": true,
      "GrosOeuvreFloor": true
    }
  }
}
```

### 5.2 Test Creating a Project

1. Go to: https://buildtrack-omega.vercel.app/
2. Click "Create New Project" (or equivalent button)
3. Fill in:
   - Project name: "Test Project"
   - Description: "Testing the application"
   - Location: "Test Location"
4. Click "Save" or "Create"
5. You should see the project appear in the list

### 5.3 Verify Data in Supabase

1. Go to: https://supabase.com/dashboard/project/fziikvgrnwkqfzfnebjw/table-editor
2. Click on the **Project** table
3. You should see your "Test Project"

---

## 🐛 Common Issues & Solutions

### Issue: "Database connection error"

**Cause:** Wrong DATABASE_URL or network issue

**Solution:**
1. Verify DATABASE_URL in Vercel
2. Make sure it's the POOLED connection (port 6543)
3. Check that Supabase project is active (not paused)

---

### Issue: "Table does not exist"

**Cause:** Migration script wasn't run

**Solution:**
1. Run the `supabase_migration.sql` script in Supabase SQL Editor
2. Verify tables were created in Table Editor

---

### Issue: "Cannot read properties of undefined"

**Cause:** Frontend error, possibly related to missing data

**Solution:**
1. Open browser console (F12)
2. Check for specific error messages
3. Refresh the page
4. Clear browser cache

---

### Issue: "503 Service Unavailable" or "500 Internal Server Error"

**Cause:** Server-side error, database connection issue

**Solution:**
1. Check /api/health endpoint
2. Review Vercel deployment logs
3. Verify environment variables

---

### Issue: Changes don't appear immediately

**Cause:** Browser caching or CDN delay

**Solution:**
1. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Wait 1-2 minutes for Vercel CDN

---

## 📊 Diagnostic Checklist

Before asking for help, check these:

- [ ] Visited /api/health endpoint - what does it say?
- [ ] Ran the migration script in Supabase SQL Editor
- [ ] Verified tables exist in Supabase Table Editor
- [ ] Checked DATABASE_URL in Vercel Environment Variables
- [ ] Used POOLED connection string (port 6543)
- [ ] Added variables to ALL environments (Production, Preview, Development)
- [ ] Redeployed the application
- [ ] Tested creating a project
- [ ] Checked Vercel deployment logs for errors
- [ ] Verified data appears in Supabase Table Editor

---

## 🆘 Still Having Issues?

If you've followed all steps and still can't save data:

1. **Check Vercel Logs:**
   - Go to your Vercel project
   - Click on the deployment
   - View "Function Logs" for any errors

2. **Check Browser Console:**
   - Press F12 to open DevTools
   - Look at the Console tab for errors
   - Look at the Network tab for failed API requests

3. **Screenshot the Error:**
   - Take a screenshot of:
     - The /api/health response
     - The error in browser console
     - The error in Vercel logs

4. **Share Information:**
   - What is the /api/health status?
   - What error message do you see?
   - Can you create a project locally (not on Vercel)?

---

## ✅ Success Indicators

You'll know everything is working when:

✅ `/api/health` returns `"status": "healthy"`
✅ All database tables exist in Supabase
✅ You can create a project on Vercel
✅ Data appears in Supabase Table Editor
✅ Time fields are visible in Gros Œuvre section
✅ All three languages work (Arabic, English, French)

---

## 🎯 Quick Summary

1. **Check health:** https://buildtrack-omega.vercel.app/api/health
2. **Run migration:** In Supabase SQL Editor
3. **Verify variables:** In Vercel Settings
4. **Redeploy:** In Vercel Deployments
5. **Test:** Create a project and verify in Supabase

That's it! Follow these steps and your application will work. 🚀
