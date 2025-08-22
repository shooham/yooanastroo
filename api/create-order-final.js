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

  console.log('=== FINAL ASTROLOGY ORDER API ===');
  console.log('Target project: eynsmbktdbrhixczuvty (YOUR ACTUAL PROJECT)');

  try {
    // YOUR ACTUAL PROJECT CREDENTIALS
    const SUPABASE_URL = 'https://eynsmbktdbrhixczuvty.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU';
    const RAZORPAY_KEY_ID = 'rzp_test_NjWnGjHPeR8zzv';
    const RAZORPAY_KEY_SECRET = 'nuYQ855htiqTOjrpLI1lzkjS';

    const { name, email, whatsappNumber, dateOfBirth, placeOfBirth, birthTime, unknownBirthTime, questions, amount = 39900 } = req.body;

    console.log('📋 Customer form data:', { 
      name, 
      whatsappNumber, 
      dateOfBirth, 
      placeOfBirth, 
      questionsCount: questions?.length || 0 
    });

    if (!name || !whatsappNumber || !dateOfBirth || !placeOfBirth) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize YOUR Supabase project
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log('✅ Connected to YOUR project: eynsmbktdbrhixczuvty');

    // Create Razorpay order
    console.log('🔄 Creating Razorpay order...');
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `astro_${Date.now()}`,
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    // Save customer data to astrology_customers table
    console.log('🔄 Saving customer to astrology_customers table...');
    
    const { data: customerData, error: customerError } = await supabase
      .from('astrology_customers')
      .insert({
        full_name: name,
        email: email || null,
        whatsapp_number: whatsappNumber,
        date_of_birth: dateOfBirth,
        time_of_birth: birthTime || null,
        place_of_birth: placeOfBirth,
        unknown_birth_time: unknownBirthTime || false
      })
      .select('id')
      .single();

    if (customerError) {
      console.error('❌ Customer save failed:', customerError);
      return res.status(500).json({ 
        error: 'Failed to save customer data',
        details: customerError.message,
        table: 'astrology_customers'
      });
    }

    const customerId = customerData.id;
    console.log('✅ Customer saved! ID:', customerId);

    // Save order data to astrology_orders table
    console.log('🔄 Saving order to astrology_orders table...');
    
    const orderNumber = `AST${Date.now().toString().slice(-6)}`;
    
    const { data: orderData, error: orderError } = await supabase
      .from('astrology_orders')
      .insert({
        customer_id: customerId,
        order_number: orderNumber,
        questions: questions || [],
        amount: amount,
        payment_status: 'pending',
        razorpay_order_id: razorpayOrder.id,
        report_delivered: false
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('❌ Order save failed:', orderError);
      return res.status(500).json({ 
        error: 'Failed to save order data',
        details: orderError.message,
        table: 'astrology_orders'
      });
    }

    const orderId = orderData.id;
    console.log('✅ Order saved! ID:', orderId);

    // Prepare response for Razorpay
    const response = {
      id: orderId,
      customer_id: customerId,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpay_key: RAZORPAY_KEY_ID,
    };

    console.log('🎉 SUCCESS - Customer data saved to YOUR Supabase project!');
    console.log('📊 Data saved to:', {
      customer_table: 'astrology_customers',
      order_table: 'astrology_orders',
      customer_id: customerId,
      order_id: orderId,
      order_number: orderNumber
    });

    return res.status(200).json(response);

  } catch (error) {
    console.error('💥 CRITICAL ERROR:', error);
    return res.status(500).json({ 
      error: 'Failed to create astrology order',
      details: error.message,
      project: 'eynsmbktdbrhixczuvty'
    });
  }
}