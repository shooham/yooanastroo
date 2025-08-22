# Deployment Instructions for Yooanastro

## Environment Variables Required in Vercel

Go to your Vercel Dashboard → Project Settings → Environment Variables and add these:

### Supabase Configuration
```
SUPABASE_URL=https://eynsmbktdbrhixczuvty.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA1NzQsImV4cCI6MjA3MDcyNjU3NH0.0CW5FrtCIEVSA6i54FXEvT6xayLLrC9X0ceB7i1_J3k
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA1NzQsImV4cCI6MjA3MDcyNjU3NH0.0CW5FrtCIEVSA6i54FXEvT6xayLLrC9X0ceB7i1_J3k
SUPABASE_SERVICE_ROLE_KEY=[GET FROM SUPABASE DASHBOARD]
```

### Razorpay Configuration
```
RAZORPAY_KEY_ID=rzp_test_NjWnGjHPeR8zzv
RAZORPAY_KEY_SECRET=[GET FROM RAZORPAY DASHBOARD]
```

### Other
```
NODE_ENV=production
```

## Steps to Deploy

1. **Get Missing Keys:**
   - Go to Supabase Dashboard → Project Settings → API → Copy the `service_role` key
   - Go to Razorpay Dashboard → Account & Settings → API Keys → Copy the Key Secret

2. **Set Environment Variables:**
   - Add all variables above to Vercel
   - Set environment to: Production, Preview, Development

3. **Deploy:**
   - Push your code to GitHub
   - Vercel will auto-deploy

## Test Your Deployment

1. Visit your deployed URL
2. Fill out the form
3. Click "Pay ₹399"
4. Razorpay popup should open

## Troubleshooting

- Check Vercel Function Logs for API errors
- Verify all environment variables are set
- Test API endpoint: `https://your-domain.vercel.app/api/test`