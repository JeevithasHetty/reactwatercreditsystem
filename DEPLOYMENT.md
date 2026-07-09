# AquaFlow Deployment Guide

## Free Deployment Without Railway

This guide covers deploying AquaFlow to **Vercel** (Frontend) and **Render** (Backend).

---

## **Step 1: Deploy Backend to Render** 🚀

### Create Render Account
1. Go to [render.com](https://render.com) and sign up (free)
2. Connect your GitHub account

### Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Select your GitHub repository
3. Configure:
   - **Name**: `aquaflow-backend`
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### Add Environment Variables
In Render dashboard, add these to the service:

```
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aquaflow
JWT_SECRET=your_random_secret_key_min_32_chars
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxx
```

**To get MongoDB URI:**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) (free tier available)
2. Create cluster → Generate connection string
3. Replace `username:password` with your credentials
4. Copy entire URI to `MONGODB_URI`

### Get Backend URL
After deployment, you'll get: `https://aquaflow-backend.onrender.com`
(Update the URL in frontend .env if different)

---

## **Step 2: Deploy Frontend to Vercel** 🌐

### Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Connect your GitHub account

### Deploy Frontend
1. Click **"New Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Add Environment Variables
In Vercel project settings, add:

```
VITE_RAZORPAY_KEY=rzp_test_S9weYLwvCIx5dQ
VITE_API_URL=https://aquaflow-backend.onrender.com/api
```

(Update the API URL if your Render URL is different)

### Deploy
Click **"Deploy"** - it will automatically build and deploy your frontend!

---

## **Step 3: Update CORS** ✅

The backend already has CORS configured for:
- `https://aquaflow-frontend.vercel.app`
- `https://reactwatercreditsystem.vercel.app`

If your Vercel URL is different, update in `backend/server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://YOUR-VERCEL-URL.vercel.app', // Add your URL here
];
```

---

## **Step 4: Initialize Admin User** 👤

1. Visit: `https://aquaflow-backend.onrender.com/create-admin`
2. Response: Admin user created successfully
3. Login with:
   - **Email**: `admin@water.com`
   - **Password**: `password123`

---

## **Cost Breakdown** 💰

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Frontend | ✅ Unlimited | $0/month |
| Render Backend | ✅ 750 hours/month | $0/month |
| MongoDB Atlas | ✅ 5GB storage | $0/month |
| **Total** | **All Free!** | **$0/month** |

---

## **Limitations of Free Tier** ⚠️

- Render spins down after 15 min inactivity (cold start ~30s)
- MongoDB free tier: 5GB storage limit
- Backend may be slow on first request

---

## **Local Development** 🖥️

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## **Troubleshooting** 🔧

### "API connection failed"
- Check `VITE_API_URL` in Vercel environment variables
- Verify Render backend is running (check deployment logs)

### "CORS error"
- Add your frontend URL to `allowedOrigins` in `backend/server.js`
- Redeploy backend

### "MongoDB connection error"
- Verify `MONGODB_URI` format
- Check MongoDB cluster is running
- Ensure IP whitelist includes Render's IP (or allow all: 0.0.0.0/0)

---

## **Next Steps** 🎯

1. ✅ Deploy backend to Render
2. ✅ Set up MongoDB Atlas
3. ✅ Deploy frontend to Vercel
4. ✅ Test signup/login
5. ✅ Update production environment variables
6. 🎉 Launch!

---

**Questions?** Check the logs in:
- Render Dashboard → Logs (backend issues)
- Vercel Dashboard → Deployments → Logs (frontend issues)
