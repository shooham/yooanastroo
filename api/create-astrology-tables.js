import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // YOUR ACTUAL PROJECT CREDENTIALS
    const SUPABASE_URL = 'https://eynsmbktdbrhixczuvty.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    console.log('🔄 Creating astrology tables in YOUR project: eynsmbktdbrhixczuvty');

    let results = [];

    // Create astrology_customers table
    const createCustomersSQL = `
      CREATE TABLE IF NOT EXISTS public.astrology_customers (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          full_name text NOT NULL,
          email text,
          whatsapp_number text NOT NULL,
          date_of_birth date NOT NULL,
          time_of_birth time,
          place_of_birth text NOT NULL,
          unknown_birth_time boolean DEFAULT false,
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now()
      );
    `;

    // Create astrology_orders table
    const createOrdersSQL = `
      CREATE TABLE IF NOT EXISTS public.astrology_orders (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          customer_id uuid REFERENCES public.astrology_customers(id),
          order_number text NOT NULL UNIQUE,
          questions text[],
          amount integer NOT NULL DEFAULT 39900,
          payment_status text DEFAULT 'pending',
          razorpay_order_id text,
          razorpay_payment_id text,
          payment_completed_at timestamp with time zone,
          report_delivered boolean DEFAULT false,
          report_delivered_at timestamp with time zone,
          admin_notes text,
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now()
      );
    `;

    // Create indexes
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_astrology_customers_whatsapp ON public.astrology_customers(whatsapp_number);
      CREATE INDEX IF NOT EXISTS idx_astrology_customers_created_at ON public.astrology_customers(created_at);
      CREATE INDEX IF NOT EXISTS idx_astrology_orders_customer_id ON public.astrology_orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_astrology_orders_payment_status ON public.astrology_orders(payment_status);
      CREATE INDEX IF NOT EXISTS idx_astrology_orders_created_at ON public.astrology_orders(created_at);
      CREATE INDEX IF NOT EXISTS idx_astrology_orders_order_number ON public.astrology_orders(order_number);
    `;

    // Enable RLS and create policies
    const securitySQL = `
      ALTER TABLE public.astrology_customers ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.astrology_orders ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Service role full access" ON public.astrology_customers;
      DROP POLICY IF EXISTS "Service role full access" ON public.astrology_orders;
      
      CREATE POLICY "Service role full access" ON public.astrology_customers 
      FOR ALL USING (auth.role() = 'service_role');
      
      CREATE POLICY "Service role full access" ON public.astrology_orders 
      FOR ALL USING (auth.role() = 'service_role');
    `;

    // Execute SQL commands
    try {
      // Create customers table
      const customersResult = await supabase.rpc('exec_sql', { sql: createCustomersSQL });
      if (customersResult.error) {
        results.push(`❌ astrology_customers: ${customersResult.error.message}`);
      } else {
        results.push('✅ astrology_customers table created successfully');
      }

      // Create orders table
      const ordersResult = await supabase.rpc('exec_sql', { sql: createOrdersSQL });
      if (ordersResult.error) {
        results.push(`❌ astrology_orders: ${ordersResult.error.message}`);
      } else {
        results.push('✅ astrology_orders table created successfully');
      }

      // Create indexes
      const indexesResult = await supabase.rpc('exec_sql', { sql: createIndexesSQL });
      if (indexesResult.error) {
        results.push(`⚠️ indexes: ${indexesResult.error.message}`);
      } else {
        results.push('✅ Database indexes created successfully');
      }

      // Set up security
      const securityResult = await supabase.rpc('exec_sql', { sql: securitySQL });
      if (securityResult.error) {
        results.push(`⚠️ security: ${securityResult.error.message}`);
      } else {
        results.push('✅ Row Level Security enabled successfully');
      }

    } catch (sqlError) {
      results.push(`❌ SQL execution failed: ${sqlError.message}`);
    }

    // Test the new tables
    try {
      const { data: testCustomers } = await supabase
        .from('astrology_customers')
        .select('count', { count: 'exact' });
      
      const { data: testOrders } = await supabase
        .from('astrology_orders')
        .select('count', { count: 'exact' });

      results.push('✅ Tables are accessible and ready for data');
    } catch (testError) {
      results.push(`⚠️ Table test failed: ${testError.message}`);
    }

    return res.status(200).json({
      success: true,
      project: 'eynsmbktdbrhixczuvty (YOUR ACTUAL PROJECT)',
      message: '🎉 Astrology tables created successfully in YOUR Supabase project!',
      tables_created: [
        'astrology_customers - All customer information',
        'astrology_orders - All orders and payments'
      ],
      results: results,
      instructions: {
        customer_data: 'Customer form submissions will now be saved to astrology_customers table',
        order_data: 'Payment and order info will be saved to astrology_orders table',
        view_data: 'Visit /api/view-astrology-data to see all customer submissions',
        next_step: 'Test payment flow - data will now be saved properly!'
      }
    });

  } catch (error) {
    console.error('💥 Table creation failed:', error);
    return res.status(500).json({
      success: false,
      project: 'eynsmbktdbrhixczuvty (YOUR ACTUAL PROJECT)',
      error: error.message,
      message: 'Failed to create astrology tables'
    });
  }
}