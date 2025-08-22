# 🚀 Quick Deploy to Vercel

## Step 1: Get Missing Keys

### Supabase Service Role Key
1. Go to: https://supabase.com/dashboard/project/eynsmbktdbrhixczuvty/settings/api
2. Copy the **service_role** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Razorpay Secret Key  
1. Go to: https://dashboard.razorpay.com/app/keys
2. Copy your **Key Secret** (starts with letters/numbers)

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and login
2. Click "New Project" 
3. Import your GitHub repository
4. Go to **Settings → Environment Variables**
5. Add these variables:

```
NODE_ENV = production
SUPABASE_URL = https://eynsmbktdbrhixczuvty.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA1NzQsImV4cCI6MjA3MDcyNjU3NH0.0CW5FrtCIEVSA6i54FXEvT6xayLLrC9X0ceB7i1_J3k
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA1NzQsImV4cCI6MjA3MDcyNjU3NH0.0CW5FrtCIEVSA6i54FXEvT6xayLLrC9X0ceB7i1_J3k
RAZORPAY_KEY_ID = rzp_test_NjWnGjHPeR8zzv
SUPABASE_SERVICE_ROLE_KEY = [PASTE FROM STEP 1]
RAZORPAY_KEY_SECRET = [PASTE FROM STEP 1]
```

6. Click **Deploy**

### Option B: Using CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## Step 3: Test Your Deployment

1. Visit your deployed URL
2. Fill out the astrology form
3. Click "Pay ₹399"
4. Razorpay popup should open! 🎉

## 🔧 Troubleshooting

### "404 on /api/create-order"
- Check Vercel Function logs
- Ensure all environment variables are set

### "Razorpay not opening"
- Check browser console for errors
- Verify RAZORPAY_KEY_ID is correct

### "Database errors"  
- Verify SUPABASE_SERVICE_ROLE_KEY is set correctly
- Check it starts with `eyJhbGciOiJIUzI1NiI...`

## 🎯 Your Project URLs
- **Supabase Dashboard**: https://supabase.com/dashboard/project/eynsmbktdbrhixczuvty
- **Razorpay Dashboard**: https://dashboard.razorpay.com/app/keys

That's it! Your Razorpay integration should work perfectly after deployment. 🚀