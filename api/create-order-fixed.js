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

  console.log('=== CREATE ORDER API CALLED (FIXED VERSION) ===');
  console.log('Request method:', req.method);
  console.log('Request body received:', !!req.body);

  try {
    // Hardcoded credentials as backup (will be moved to env later)
    const BACKUP_CREDENTIALS = {
      SUPABASE_URL: 'https://eynsmbktdbrhixczuvty.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU',
      SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA1NzQsImV4cCI6MjA3MDcyNjU3NH0.0CW5FrtCIEVSA6i54FXEvT6xayLLrC9X0ceB7i1_J3k',
      RAZORPAY_KEY_ID: 'rzp_test_NjWnGjHPeR8zzv',
      RAZORPAY_KEY_SECRET: 'nuYQ855htiqTOjrpLI1lzkjS'
    };

    // Use environment variables first, fall back to hardcoded
    const config = {
      SUPABASE_URL: process.env.SUPABASE_URL || BACKUP_CREDENTIALS.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || BACKUP_CREDENTIALS.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || BACKUP_CREDENTIALS.SUPABASE_ANON_KEY,
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || BACKUP_CREDENTIALS.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || BACKUP_CREDENTIALS.RAZORPAY_KEY_SECRET
    };

    console.log('🔄 Using configuration:', {
      SUPABASE_URL: config.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: config.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...',
      RAZORPAY_KEY_ID: config.RAZORPAY_KEY_ID,
      usingBackup: !process.env.SUPABASE_SERVICE_ROLE_KEY
    });

    const { name, email, whatsappNumber, dateOfBirth, placeOfBirth, birthTime, unknownBirthTime, questions, amount = 39900 } = req.body;

    console.log('Form data received:', { name, whatsappNumber, dateOfBirth, placeOfBirth, questionsCount: questions?.length || 0 });

    if (!name || !whatsappNumber || !dateOfBirth || !placeOfBirth) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Supabase with working credentials
    console.log('🔄 Initializing Supabase...');
    let supabase;
    try {
      supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);
      console.log('✅ Supabase client created with service role key');
    } catch (serviceError) {
      console.log('⚠️ Service role failed, trying anon key...');
      supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
      console.log('✅ Supabase client created with anon key');
    }

    // Test connection
    console.log('🔄 Testing Supabase connection...');
    try {
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('count', { count: 'exact' })
        .limit(1);
      
      if (testError) {
        console.error('❌ Connection test failed:', testError);
        // Don't fail here, continue with order creation
      } else {
        console.log('✅ Supabase connection successful');
      }
    } catch (testException) {
      console.log('⚠️ Connection test exception, but continuing...', testException.message);
    }

    // Initialize Razorpay
    console.log('🔄 Creating Razorpay order...');
    const razorpay = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    // Create order data and SAVE TO DATABASE
    const orderNumber = `AST${Date.now().toString().slice(-6)}`;
    const orderId = `astro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare consultation data for database storage
    const consultationData = {
      service: 'astrology_consultation',
      customer_name: name,
      email: email || 'noemail@yooanastro.com',
      whatsapp_number: whatsappNumber,
      date_of_birth: dateOfBirth,
      time_of_birth: birthTime || null,
      place_of_birth: placeOfBirth,
      unknown_birth_time: unknownBirthTime || false,
      questions: questions || [],
      form_submitted_at: new Date().toISOString()
    };

    console.log('🔄 Saving customer consultation data to database...');
    
    // Save to orders table using the existing e-commerce schema
    try {
      const { data: savedOrder, error: saveError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          status: 'pending',
          subtotal: amount,
          total_amount: amount,
          payment_status: 'pending',
          payment_method: 'razorpay',
          payment_id: razorpayOrder.id,
          notes: JSON.stringify(consultationData), // Store all consultation data in notes field
          tracking_number: `${name}|${whatsappNumber}|${placeOfBirth}` // Backup storage
        })
        .select('id')
        .single();

      if (saveError) {
        console.error('❌ Failed to save to database:', saveError);
        console.log('⚠️ Continuing without database save - order will be tracked locally');
      } else {
        console.log('✅ Customer data saved to database! Order ID:', savedOrder.id);
        orderId = savedOrder.id; // Use the database ID
      }
    } catch (dbError) {
      console.error('❌ Database save exception:', dbError);
      console.log('⚠️ Continuing without database save - order will be tracked locally');
    }
    
    const orderData = {
      id: orderId,
      order_number: orderNumber,
      consultation_data: consultationData,
      razorpay_order_id: razorpayOrder.id,
      created_at: new Date().toISOString()
    };
    
    console.log('✅ Order data prepared:', orderNumber);

    const response = {
      id: orderData.id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpay_key: config.RAZORPAY_KEY_ID,
    };

    console.log('✅ SUCCESS - Returning response:', { id: response.id, razorpay_order_id: response.razorpay_order_id });
    return res.status(200).json(response);

  } catch (error) {
    console.error('💥 CRITICAL ERROR in create-order-fixed:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Database error: Could not create order',
      details: error.message || 'Internal server error',
      errorType: error.constructor.name,
      timestamp: new Date().toISOString()
    });
  }
}