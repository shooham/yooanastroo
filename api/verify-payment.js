import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
    
    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id, order_id });

    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.log('Signature mismatch:', { expected: expectedSignature, received: razorpay_signature });
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    console.log('Signature verified successfully');

    // Update order payment status
    const { error: orderError } = await supabase
      .from('orders')
      .update({ 
        payment_status: 'completed',
        payment_id: razorpay_payment_id,
        amount_display: '₹399 PAID ✅'
      })
      .eq('id', order_id);

    if (orderError) {
      console.error('Order update error:', orderError);
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    // Update consultation form
    const { error } = await supabase
      .from('consultation_forms')
      .update({ 
        delivery_status: 'undelivered',
        payment_info: '₹399 PAID ✅'
      })
      .eq('order_id', order_id);

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Failed to update payment status' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
}