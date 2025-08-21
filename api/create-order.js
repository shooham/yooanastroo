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

  try {
    // Log environment variable status (without exposing values)
    console.log('Env check:', {
      supabase_url: !!process.env.SUPABASE_URL,
      supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      razorpay_id: !!process.env.RAZORPAY_KEY_ID,
      razorpay_secret: !!process.env.RAZORPAY_KEY_SECRET
    });

    const { name, email, whatsappNumber, dateOfBirth, placeOfBirth, birthTime, unknownBirthTime, questions, amount = 39900 } = req.body;

    if (!name || !whatsappNumber || !dateOfBirth || !placeOfBirth) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate environment variables
    if (!process.env.SUPABASE_URL) {
      console.error('SUPABASE_URL not found');
      return res.status(500).json({ error: 'Server configuration error: SUPABASE_URL missing' });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not found');
      return res.status(500).json({ error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY missing' });
    }
    if (!process.env.RAZORPAY_KEY_ID) {
      console.error('RAZORPAY_KEY_ID not found');
      return res.status(500).json({ error: 'Server configuration error: RAZORPAY_KEY_ID missing' });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET not found');
      return res.status(500).json({ error: 'Server configuration error: RAZORPAY_KEY_SECRET missing' });
    }

    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    });

    // Create order entry
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        full_name: name,
        email: email || 'noemail@yooanastro.com',
        date_of_birth: dateOfBirth,
        time_of_birth: birthTime,
        place_of_birth: placeOfBirth,
        questions: questions.length > 0 ? questions.join('. ') : 'Customer questions will be answered in the personalized kundali report.',
        amount: amount,
        amount_display: `₹${(amount / 100).toFixed(0)} PAID`,
        payment_status: 'pending',
        order_status: 'received',
        payment_id: razorpayOrder.id
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return res.status(500).json({ error: 'Could not create order.' });
    }

    // Create consultation form entry
    const { data: dbData, error: dbError } = await supabase
      .from('consultation_forms')
      .insert({
        full_name: name,
        whatsapp_number: whatsappNumber,
        email: email,
        place_of_birth: placeOfBirth,
        date_of_birth: dateOfBirth,
        time_of_birth: birthTime,
        unknown_birth_time: unknownBirthTime,
        questions_json: JSON.stringify(questions),
        q1: questions[0] || null,
        q2: questions[1] || null,
        q3: questions[2] || null,
        q4: questions[3] || null,
        q5: questions[4] || null,
        q6: questions[5] || null,
        q7: questions[6] || null,
        q8: questions[7] || null,
        q9: questions[8] || null,
        q10: questions[9] || null,
        order_id: orderData.id,
        payment_info: '₹399 PENDING ⏳'
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Supabase error:', dbError);
      return res.status(500).json({ error: 'Could not save order details.' });
    }

    return res.status(200).json({
      id: orderData.id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpay_key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Failed to create order' });
  }
}