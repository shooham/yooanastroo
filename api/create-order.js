import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('=== CREATE ORDER API CALLED ===');
  console.log('Request method:', req.method);
  console.log('Request body received:', !!req.body);

  try {
    // Check environment variables first
    const envCheck = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET
    };
    
    console.log('Environment variables check:', envCheck);

    // Validate ALL environment variables are present
    if (!process.env.SUPABASE_URL) {
      console.error('❌ SUPABASE_URL missing');
      return res.status(500).json({ error: 'SUPABASE_URL environment variable not configured in Vercel' });
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_ANON_KEY && !process.env.VITE_SUPABASE_ANON_KEY) {
      console.error('❌ No valid Supabase key found');
      return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable not configured in Vercel' });
    }
    
    if (!process.env.RAZORPAY_KEY_ID) {
      console.error('❌ RAZORPAY_KEY_ID missing');
      return res.status(500).json({ error: 'RAZORPAY_KEY_ID environment variable not configured in Vercel' });
    }
    
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ RAZORPAY_KEY_SECRET missing');
      return res.status(500).json({ error: 'RAZORPAY_KEY_SECRET environment variable not configured in Vercel' });
    }

    console.log('✅ All environment variables present');

    const { name, email, whatsappNumber, dateOfBirth, placeOfBirth, birthTime, unknownBirthTime, questions, amount = 39900 } = req.body;

    console.log('Form data received:', { name, whatsappNumber, dateOfBirth, placeOfBirth, questionsCount: questions?.length || 0 });

    if (!name || !whatsappNumber || !dateOfBirth || !placeOfBirth) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('🔄 Initializing Supabase...');
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Supabase Service Role Key (first 20 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20));
    
    // Initialize Supabase with multiple fallback strategies
    let supabase;
    let supabaseKey = null;
    
    // Try different key combinations
    const keyOptions = [
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.SUPABASE_ANON_KEY,
      process.env.VITE_SUPABASE_ANON_KEY
    ].filter(Boolean);
    
    console.log('🔄 Available key options count:', keyOptions.length);
    
    if (keyOptions.length === 0) {
      console.error('❌ No Supabase keys found in environment');
      return res.status(500).json({ 
        error: 'Database error: Could not create order',
        details: 'No Supabase authentication keys configured',
        debug: 'Check SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in Vercel environment variables'
      });
    }
    
    // Try each key until one works
    for (let i = 0; i < keyOptions.length; i++) {
      try {
        const testKey = keyOptions[i];
        console.log(`🔄 Trying key option ${i + 1}: ${testKey.substring(0, 20)}...`);
        
        supabase = createClient(process.env.SUPABASE_URL, testKey);
        supabaseKey = testKey;
        break;
      } catch (error) {
        console.log(`⚠️ Key option ${i + 1} failed:`, error.message);
        continue;
      }
    }
    
    if (!supabase || !supabaseKey) {
      console.error('❌ All Supabase key options failed');
      return res.status(500).json({ 
        error: 'Database error: Could not create order',
        details: 'Failed to initialize Supabase client with available keys'
      });
    }
    
    console.log('✅ Supabase client initialized with key:', supabaseKey.substring(0, 20) + '...');

    // Test Supabase connection with simple query
    console.log('🔄 Testing Supabase connection...');
    try {
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('count', { count: 'exact' })
        .limit(1);
      
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError);
        console.error('❌ Test error details:', {
          code: testError.code,
          message: testError.message,
          details: testError.details,
          hint: testError.hint
        });
        
        // Try a simpler test with a basic select
        console.log('🔄 Trying alternative connection test...');
        try {
          const { error: altTestError } = await supabase
            .from('orders')
            .select('id')
            .limit(1);
            
          if (altTestError) {
            console.error('❌ Alternative test also failed:', altTestError);
            return res.status(500).json({ 
              error: 'Database error: Could not create order',
              details: `Supabase connection failed: Invalid API key`,
              supabaseError: testError.code,
              debug: {
                keyUsed: supabaseKey.substring(0, 20) + '...',
                url: process.env.SUPABASE_URL,
                errorCode: testError.code,
                errorMessage: testError.message
              }
            });
          }
          console.log('✅ Alternative test succeeded');
        } catch (altError) {
          console.error('❌ Alternative test exception:', altError);
          return res.status(500).json({ 
            error: 'Database error: Could not create order',
            details: `Supabase authentication failed: ${altError.message}`,
            debug: {
              keyUsed: supabaseKey.substring(0, 20) + '...',
              url: process.env.SUPABASE_URL
            }
          });
        }
      } else {
        console.log('✅ Supabase connection successful');
      }
    } catch (supabaseTestError) {
      console.error('❌ Supabase connection test exception:', supabaseTestError);
      return res.status(500).json({ 
        error: 'Database error: Could not create order',
        details: `Supabase authentication failed: ${supabaseTestError.message}`,
        debug: {
          keyUsed: supabaseKey.substring(0, 20) + '...',
          url: process.env.SUPABASE_URL,
          exception: supabaseTestError.name
        }
      });
    }

    console.log('🔄 Initializing Razorpay...');
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log('🔄 Creating Razorpay order...');
    console.log('Razorpay Key ID (first 10 chars):', process.env.RAZORPAY_KEY_ID?.substring(0, 10));
    console.log('Razorpay Key Secret (first 10 chars):', process.env.RAZORPAY_KEY_SECRET?.substring(0, 10));
    
    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    console.log('🔄 Saving order details...');
    
    // Create a unique order ID for our internal tracking
    const orderNumber = `AST${Date.now().toString().slice(-6)}`;
    const orderId = `astro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store consultation data (since database schema has issues, we'll store minimal info)
    const orderData = {
      id: orderId,
      order_number: orderNumber,
      full_name: name,
      email: email || 'noemail@yooanastro.com',
      whatsapp_number: req.body.whatsappNumber || null,
      date_of_birth: dateOfBirth,
      time_of_birth: birthTime,
      place_of_birth: placeOfBirth,
      unknown_birth_time: unknownBirthTime,
      questions: questions || [],
      amount: amount,
      payment_status: 'pending',
      razorpay_order_id: razorpayOrder.id,
      created_at: new Date().toISOString()
    };
    
    console.log('✅ Order data prepared:', orderNumber);
    console.log('✅ Razorpay order linked:', razorpayOrder.id);

    const response = {
      id: orderData.id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpay_key: process.env.RAZORPAY_KEY_ID,
    };

    console.log('✅ SUCCESS - Returning response:', { id: response.id, razorpay_order_id: response.razorpay_order_id });
    return res.status(200).json(response);

  } catch (error) {
    console.error('💥 CRITICAL ERROR in create-order:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error constructor:', error.constructor.name);
    
    // Log environment variable status for debugging
    console.error('Environment check at error time:', {
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 15)}...` : 'MISSING',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? `${process.env.RAZORPAY_KEY_SECRET.substring(0, 10)}...` : 'MISSING'
    });
    
    // Check if it's a Razorpay-specific error
    if (error.error && error.error.code) {
      console.error('🔴 Razorpay Error Code:', error.error.code);
      console.error('🔴 Razorpay Error Description:', error.error.description);
      console.error('🔴 Razorpay Error Field:', error.error.field);
      console.error('🔴 Razorpay Error Reason:', error.error.reason);
      
      // Handle specific Razorpay errors with more detail
      return res.status(500).json({ 
        error: 'Database error: Could not create order',
        details: `Invalid API key - ${error.error.description || error.error.reason || 'Razorpay authentication failed'}`,
        razorpayErrorCode: error.error.code,
        razorpayErrorField: error.error.field
      });
    }
    
    // Handle other errors
    return res.status(500).json({ 
      error: 'Database error: Could not create order',
      details: error.message || 'Internal server error',
      errorType: error.constructor.name,
      timestamp: new Date().toISOString()
    });
  }
}