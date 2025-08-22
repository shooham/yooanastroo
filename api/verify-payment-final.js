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
    
    console.log('=== VERIFY PAYMENT (FINAL) ===');
    console.log('Target project: eynsmbktdbrhixczuvty (YOUR ACTUAL PROJECT)');
    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id, order_id });

    // YOUR ACTUAL PROJECT CREDENTIALS
    const SUPABASE_URL = 'https://eynsmbktdbrhixczuvty.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU';
    const RAZORPAY_KEY_SECRET = 'nuYQ855htiqTOjrpLI1lzkjS';

    // Initialize YOUR Supabase project
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Verify Razorpay signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.log('❌ Signature verification failed');
      return res.status(400).json({ error: 'Invalid payment signature' });
    }
    
    console.log('✅ Payment signature verified successfully');

    // Update order status in YOUR astrology_orders table
    console.log('🔄 Updating payment status in astrology_orders table...');
    
    const { data: updatedOrder, error: updateError } = await supabase
      .from('astrology_orders')
      .update({ 
        payment_status: 'completed',
        razorpay_payment_id: razorpay_payment_id,
        payment_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', order_id)
      .select('customer_id, order_number, amount')
      .single();

    if (updateError) {
      console.error('❌ Order update failed:', updateError);
      return res.status(500).json({ 
        error: 'Failed to update payment status',
        details: updateError.message,
        table: 'astrology_orders'
      });
    }

    console.log('✅ Payment status updated in YOUR database!');
    console.log('📊 Order completed:', {
      order_id: order_id,
      customer_id: updatedOrder.customer_id,
      order_number: updatedOrder.order_number,
      amount: `₹${updatedOrder.amount / 100}`,
      status: 'PAID'
    });

    // Get customer details for confirmation
    const { data: customerData } = await supabase
      .from('astrology_customers')
      .select('full_name, email, whatsapp_number')
      .eq('id', updatedOrder.customer_id)
      .single();

    console.log('👤 Customer who completed payment:', {
      name: customerData?.full_name,
      email: customerData?.email,
      whatsapp: customerData?.whatsapp_number
    });

    return res.status(200).json({ 
      success: true,
      message: 'Payment verified and order updated successfully',
      order_id: order_id,
      customer_id: updatedOrder.customer_id,
      order_number: updatedOrder.order_number,
      payment_status: 'completed',
      amount_paid: `₹${updatedOrder.amount / 100}`,
      customer_name: customerData?.full_name || 'Unknown'
    });

  } catch (error) {
    console.error('💥 Payment verification error:', error);
    return res.status(500).json({ 
      error: 'Payment verification failed',
      details: error.message,
      project: 'eynsmbktdbrhixczuvty'
    });
  }
}