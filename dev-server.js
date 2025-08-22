import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import API handlers
const createOrderHandler = await import('./api/create-order.js');
const verifyPaymentHandler = await import('./api/verify-payment.js');
const testHandler = await import('./api/test.js');

// API Routes
app.post('/api/create-order', createOrderHandler.default);
app.post('/api/verify-payment', verifyPaymentHandler.default);
app.all('/api/test', testHandler.default);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Development API server running',
    env: {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`);
  console.log(`📋 Environment check:`);
  console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅' : '❌'}`);
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌'}`);
  console.log(`   RAZORPAY_KEY_ID: ${process.env.RAZORPAY_KEY_ID ? '✅' : '❌'}`);
  console.log(`   RAZORPAY_KEY_SECRET: ${process.env.RAZORPAY_KEY_SECRET ? '✅' : '❌'}`);
});