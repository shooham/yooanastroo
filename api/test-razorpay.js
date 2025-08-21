import Razorpay from 'razorpay';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== TESTING RAZORPAY CONNECTION ===');
    
    // Check environment variables
    const envCheck = {
      RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET
    };
    
    console.log('Environment variables check:', envCheck);
    console.log('Razorpay Key ID (first 10 chars):', process.env.RAZORPAY_KEY_ID?.substring(0, 10));
    console.log('Razorpay Key Secret (first 10 chars):', process.env.RAZORPAY_KEY_SECRET?.substring(0, 10));

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ 
        error: 'Razorpay credentials not configured',
        envCheck 
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Test connection by fetching recent orders
    try {
      const orders = await razorpay.orders.all({ count: 1 });
      console.log('✅ Razorpay connection successful');
      
      return res.status(200).json({ 
        success: true,
        message: 'Razorpay connection successful',
        ordersCount: orders.count || 0,
        keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 10) + 'xxxxx'
      });
    } catch (razorpayError) {
      console.error('❌ Razorpay connection failed:', razorpayError);
      
      return res.status(500).json({ 
        error: 'Razorpay connection failed',
        details: razorpayError.message,
        errorCode: razorpayError.error?.code,
        errorDescription: razorpayError.error?.description
      });
    }

  } catch (error) {
    console.error('💥 CRITICAL ERROR in test-razorpay:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}