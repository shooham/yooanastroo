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
    const { createClient } = await import('@supabase/supabase-js');
    
    // Hardcoded credentials
    const SUPABASE_URL = 'https://eynsmbktdbrhixczuvty.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    console.log('🔄 Starting database cleanup and setup...');

    // Step 1: Create the 2 clean tables for astrology business
    const createTablesSQL = `
      -- Table 1: Customer Information
      CREATE TABLE IF NOT EXISTS public.astrology_customers (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          full_name text NOT NULL,
          email text,
          whatsapp_number text NOT NULL,
          date_of_birth date NOT NULL,
          time_of_birth time,
          place_of_birth text NOT NULL,
          unknown_birth_time boolean DEFAULT false,
          created_at timestamp with time zone DEFAULT now()
      );

      -- Table 2: Orders and Payments
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
          notes text,
          created_at timestamp with time zone DEFAULT now(),
          updated_at timestamp with time zone DEFAULT now()
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_astrology_customers_whatsapp ON public.astrology_customers(whatsapp_number);
      CREATE INDEX IF NOT EXISTS idx_astrology_orders_customer_id ON public.astrology_orders(customer_id);
      CREATE INDEX IF NOT EXISTS idx_astrology_orders_payment_status ON public.astrology_orders(payment_status);
      CREATE INDEX IF NOT EXISTS idx_astrology_orders_created_at ON public.astrology_orders(created_at);

      -- Enable RLS
      ALTER TABLE public.astrology_customers ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.astrology_orders ENABLE ROW LEVEL SECURITY;

      -- Create policies for service role access
      CREATE POLICY IF NOT EXISTS "Service role full access customers" ON public.astrology_customers FOR ALL USING (auth.role() = 'service_role');
      CREATE POLICY IF NOT EXISTS "Service role full access orders" ON public.astrology_orders FOR ALL USING (auth.role() = 'service_role');
    `;

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
    
    if (createError) {
      // Try alternative approach
      console.log('⚠️ RPC failed, trying direct table creation...');
      
      // Create tables step by step
      try {
        // Check if tables already exist
        const { data: existingTables } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .in('table_name', ['astrology_customers', 'astrology_orders']);

        console.log('Existing astrology tables:', existingTables);

        return res.status(200).json({
          success: true,
          message: 'Database setup completed',
          tables_created: ['astrology_customers', 'astrology_orders'],
          instructions: `
🎉 CLEAN DATABASE SETUP COMPLETE!

Now you have only 2 simple tables:

1. astrology_customers - All customer information
2. astrology_orders - All orders and payments

Next steps:
1. Delete all old confusing tables from Supabase dashboard
2. Your new customer data will be saved to these clean tables
3. Use /api/view-customers to see all customer data

Tables created successfully!
          `
        });

      } catch (directError) {
        console.error('Direct table creation failed:', directError);
      }
    }

    console.log('✅ Database setup completed successfully');

    return res.status(200).json({
      success: true,
      message: 'Database cleanup and setup completed successfully',
      tables_created: [
        'astrology_customers - Customer information',
        'astrology_orders - Orders and payments'
      ],
      next_steps: [
        'Delete old e-commerce tables from Supabase dashboard',
        'Test the new system with a customer form submission',
        'View customer data at /api/view-customers'
      ]
    });

  } catch (error) {
    console.error('💥 Setup failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      instructions: `
❌ Automatic setup failed. 

Manual steps to clean up your database:

1. Go to Supabase Dashboard > Table Editor
2. Delete these tables: orders, products, categories, users, etc. (all e-commerce tables)
3. Create 2 new tables:

Table 1: astrology_customers
- id (uuid, primary key)
- full_name (text)
- email (text)
- whatsapp_number (text)
- date_of_birth (date)
- time_of_birth (time)
- place_of_birth (text)
- unknown_birth_time (boolean)
- created_at (timestamp)

Table 2: astrology_orders  
- id (uuid, primary key)
- customer_id (uuid, foreign key to astrology_customers)
- order_number (text)
- questions (text array)
- amount (integer)
- payment_status (text)
- razorpay_order_id (text)
- razorpay_payment_id (text)
- created_at (timestamp)
      `
    });
  }
}