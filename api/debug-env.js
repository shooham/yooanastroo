export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check environment variables (don't expose full keys for security)
  const envCheck = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_URL_VALUE: process.env.SUPABASE_URL || 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY_PREFIX: process.env.SUPABASE_SERVICE_ROLE_KEY ? 
      process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...' : 'MISSING',
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    SUPABASE_ANON_KEY_PREFIX: process.env.SUPABASE_ANON_KEY ? 
      process.env.SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'MISSING',
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
    RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_ID_VALUE: process.env.RAZORPAY_KEY_ID || 'MISSING',
    RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET,
    RAZORPAY_KEY_SECRET_PREFIX: process.env.RAZORPAY_KEY_SECRET ? 
      process.env.RAZORPAY_KEY_SECRET.substring(0, 10) + '...' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'development',
    VERCEL: !!process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV || 'none'
  };

  return res.status(200).json({
    message: 'Environment variables debug info',
    environment: envCheck,
    timestamp: new Date().toISOString()
  });
}