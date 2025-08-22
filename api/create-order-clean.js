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

  console.log('=== CLEAN ASTROLOGY ORDER API ===');

  try {
    // Hardcoded credentials
    const BACKUP_CREDENTIALS = {
      SUPABASE_URL: 'https://eynsmbktdbrhixczuvty.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU',
      RAZORPAY_KEY_ID: 'rzp_test_NjWnGjHPeR8zzv',
      RAZORPAY_KEY_SECRET: 'nuYQ855htiqTOjrpLI1lzkjS'
    };

    const config = {
      SUPABASE_URL: process.env.SUPABASE_URL || BACKUP_CREDENTIALS.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || BACKUP_CREDENTIALS.SUPABASE_SERVICE_ROLE_KEY,
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || BACKUP_CREDENTIALS.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || BACKUP_CREDENTIALS.RAZORPAY_KEY_SECRET
    };

    const { name, email, whatsappNumber, dateOfBirth, placeOfBirth, birthTime, unknownBirthTime, questions, amount = 39900 } = req.body;

    console.log('📋 Customer data received:', { name, whatsappNumber, dateOfBirth, placeOfBirth });

    if (!name || !whatsappNumber || !dateOfBirth || !placeOfBirth) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Supabase
    const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);

    // Create Razorpay order first
    console.log('🔄 Creating Razorpay order...');
    const razorpay = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    // Try to save to clean tables, fallback to old method if needed
    let customerId = null;
    let orderId = null;

    try {
      console.log('🔄 Saving to astrology_customers table...');
      
      // Save customer data
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
        throw customerError;
      }

      customerId = customerData.id;
      console.log('✅ Customer saved with ID:', customerId);

      // Save order data
      console.log('🔄 Saving to astrology_orders table...');
      const orderNumber = `AST${Date.now().toString().slice(-6)}`;
      
      const { data: orderData, error: orderError } = await supabase
        .from('astrology_orders')
        .insert({
          customer_id: customerId,
          order_number: orderNumber,
          questions: questions || [],
          amount: amount,
          payment_status: 'pending',
          razorpay_order_id: razorpayOrder.id
        })
        .select('id')
        .single();

      if (orderError) {
        console.error('❌ Order save failed:', orderError);
        throw orderError;
      }

      orderId = orderData.id;
      console.log('✅ Order saved with ID:', orderId);

    } catch (cleanTableError) {
      console.log('⚠️ Clean tables not available, using fallback method...');
      
      // Fallback to old orders table
      const orderNumber = `AST${Date.now().toString().slice(-6)}`;
      
      const fallbackData = {
        service: 'astrology_consultation',
        customer_name: name,
        email: email || 'noemail@yooanastro.com',
        whatsapp_number: whatsappNumber,
        date_of_birth: dateOfBirth,
        time_of_birth: birthTime || null,
        place_of_birth: placeOfBirth,
        unknown_birth_time: unknownBirthTime || false,
        questions: questions || []
      };

      const { data: fallbackOrder, error: fallbackError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          status: 'pending',
          subtotal: amount,
          total_amount: amount,
          payment_status: 'pending',
          payment_method: 'razorpay',
          payment_id: razorpayOrder.id,
          notes: JSON.stringify(fallbackData)
        })
        .select('id')
        .single();

      if (fallbackError) {
        console.error('❌ Fallback save also failed:', fallbackError);
        throw fallbackError;
      }

      orderId = fallbackOrder.id;
      console.log('✅ Fallback save successful with ID:', orderId);
    }

    const response = {
      id: orderId,
      customer_id: customerId,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpay_key: config.RAZORPAY_KEY_ID,
    };

    console.log('✅ SUCCESS - Order created successfully');
    return res.status(200).json(response);

  } catch (error) {
    console.error('💥 CRITICAL ERROR:', error);
    return res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message
    });
  }
}