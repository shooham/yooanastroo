import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import { CreateOrderSchema, VerifyPaymentSchema } from '../shared/types';

// Define the environment variables type
type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// Apply CORS middleware
app.use('/api/*', cors());

// Endpoint to create an order
app.post('/api/create-order', zValidator('json', CreateOrderSchema), async (c) => {
  try {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
    const data = c.req.valid('json');

    const razorpay = new Razorpay({
      key_id: c.env.RAZORPAY_KEY_ID,
      key_secret: c.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: data.amount, // Amount is in paisa from frontend
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    });

    // First create order entry with Razorpay order ID
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        full_name: data.name,
        email: data.email || 'noemail@yooanastro.com', // Provide default email if not provided
        date_of_birth: data.dateOfBirth,
        time_of_birth: data.birthTime,
        place_of_birth: data.placeOfBirth,
        questions: data.questions.length > 0 ? data.questions.join('. ') : 'Customer questions will be answered in the personalized kundali report.',
        amount: data.amount,
        amount_display: `₹${(data.amount / 100).toFixed(0)} PAID`, // Display as ₹399 PAID
        payment_status: 'pending',
        order_status: 'received',
        payment_id: razorpayOrder.id // Store Razorpay order ID
      })
      .select('id')
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return c.json({ error: 'Could not create order.' }, 500);
    }

    // Then create consultation form entry linked to order
    const { error: dbError } = await supabase
      .from('consultation_forms')
      .insert({
        full_name: data.name,
        whatsapp_number: data.whatsappNumber,
        email: data.email,
        place_of_birth: data.placeOfBirth,
        date_of_birth: data.dateOfBirth,
        time_of_birth: data.birthTime,
        unknown_birth_time: data.unknownBirthTime,
        questions_json: JSON.stringify(data.questions),
        q1: data.questions[0] || null,
        q2: data.questions[1] || null,
        q3: data.questions[2] || null,
        q4: data.questions[3] || null,
        q5: data.questions[4] || null,
        q6: data.questions[5] || null,
        q7: data.questions[6] || null,
        q8: data.questions[7] || null,
        q9: data.questions[8] || null,
        q10: data.questions[9] || null,
        order_id: orderData.id,
        payment_info: '₹399 PENDING ⏳' // Initial payment status
      });

    if (dbError) {
      console.error('Supabase error:', dbError);
      return c.json({ error: 'Could not save order details.' }, 500);
    }

    return c.json({
      id: orderData.id, // Return order ID for payment verification
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpay_key: c.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error('Create order error:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Endpoint to verify payment
app.post('/api/verify-payment', zValidator('json', VerifyPaymentSchema), async (c) => {
  try {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = c.req.valid('json');
    
    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id, order_id });

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(c.env.RAZORPAY_KEY_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
    const digest = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (digest !== razorpay_signature) {
      console.log('Signature mismatch:', { expected: digest, received: razorpay_signature });
      return c.json({ error: 'Invalid signature' }, 400);
    }
    
    console.log('Signature verified successfully');

    // Update order payment status
    const { error: orderError } = await supabase
      .from('orders')
      .update({ 
        payment_status: 'completed',
        payment_id: razorpay_payment_id,
        amount_display: '₹399 PAID ✅' // Clear indication of successful payment
      })
      .eq('id', order_id);

    if (orderError) {
      console.error('Order update error:', orderError);
      return c.json({ error: 'Failed to update order status' }, 500);
    }

    // Also update consultation form if needed
    const { error } = await supabase
      .from('consultation_forms')
      .update({ 
        delivery_status: 'undelivered', // Will be delivered later by astrologer
        payment_info: '₹399 PAID ✅' // Update payment status
      })
      .eq('order_id', order_id);

    if (error) {
      console.error('Supabase update error:', error);
      return c.json({ error: 'Failed to update payment status' }, 500);
    }

    return c.json({ success: true });

  } catch (error) {
    console.error('Verify payment error:', error);
    return c.json({ error: 'Payment verification failed' }, 500);
  }
});

app.get('/thank-you', (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You!</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #1a1a1a;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .container {
          padding: 2rem;
          background-color: #2a2a2a;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, var(--accent), var(--gold));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }
        .contact-info {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        .contact-info strong {
          color: var(--gold);
        }
        .warning {
          background: rgba(255, 165, 0, 0.1);
          border: 1px solid rgba(255, 165, 0, 0.3);
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 1.5rem;
          font-size: 0.9rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✓</div>
        <h1>Payment received — Thank you!</h1>
        <p>
          Thank you for choosing Yooanastro. Your personalized Vedic Kundali and answers to your questions 
          will be delivered to your email (and WhatsApp if opted) within <strong>16 hours</strong>.
        </p>
        
        <div class="warning">
          <strong>Important:</strong> All sales are final — no refunds after report preparation/delivery. 
          For payment errors or duplicate charges, contact us immediately.
        </div>
        
        <div class="contact-info">
          <p>If you do not receive your report, check spam or contact us:</p>
          <p><strong>Phone:</strong> +91 75997 66522</p>
          <p><strong>Email:</strong> support@yooanastro.com</p>
          <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
            We appreciate your trust in our cosmic insights and Vedic guidance.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  return c.html(html);
});

export default app;
