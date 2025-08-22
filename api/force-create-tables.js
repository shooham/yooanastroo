import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // YOUR ACTUAL PROJECT CREDENTIALS
    const SUPABASE_URL = 'https://eynsmbktdbrhixczuvty.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    console.log('🔄 Force creating tables in YOUR Supabase project: eynsmbktdbrhixczuvty');

    // Execute raw SQL to create tables
    const createTablesSQL = `
      -- Drop existing if any
      DROP TABLE IF EXISTS public.astrology_orders CASCADE;
      DROP TABLE IF EXISTS public.astrology_customers CASCADE;

      -- Create customers table
      CREATE TABLE public.astrology_customers (
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

      -- Create orders table
      CREATE TABLE public.astrology_orders (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          customer_id uuid REFERENCES public.astrology_customers(id) ON DELETE CASCADE,
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

      -- Create indexes
      CREATE INDEX idx_astrology_customers_whatsapp ON public.astrology_customers(whatsapp_number);
      CREATE INDEX idx_astrology_customers_created_at ON public.astrology_customers(created_at);
      CREATE INDEX idx_astrology_orders_customer_id ON public.astrology_orders(customer_id);
      CREATE INDEX idx_astrology_orders_payment_status ON public.astrology_orders(payment_status);
      CREATE INDEX idx_astrology_orders_created_at ON public.astrology_orders(created_at);
    `;

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTablesSQL });

    if (error) {
      console.error('❌ Table creation failed:', error);
      
      // Try alternative method - direct SQL execution
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'apikey': SUPABASE_SERVICE_KEY
          },
          body: JSON.stringify({ sql: createTablesSQL })
        });

        if (response.ok) {
          console.log('✅ Tables created via direct SQL execution');
          return res.status(200).json({
            success: true,
            message: 'Tables created successfully in YOUR Supabase project!',
            project: 'eynsmbktdbrhixczuvty',
            tables: ['astrology_customers', 'astrology_orders'],
            instruction: 'Check your Supabase Table Editor now - you should see the 2 new astrology tables!'
          });
        } else {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
      } catch (directError) {
        console.error('❌ Direct SQL also failed:', directError);
        
        return res.status(500).json({
          success: false,
          message: 'Could not create tables automatically',
          project: 'eynsmbktdbrhixczuvty',
          error: error.message,
          sql_to_run_manually: createTablesSQL,
          instructions: `
Since automatic creation failed, please run this SQL manually in your Supabase SQL Editor:

${createTablesSQL}

This will create the 2 tables you need in your Table Editor.
          `
        });
      }
    }

    console.log('✅ Tables created successfully!');
    
    return res.status(200).json({
      success: true,
      message: 'Astrology tables created successfully in YOUR Supabase project!',
      project: 'eynsmbktdbrhixczuvty',
      tables_created: [
        'astrology_customers - Customer information',
        'astrology_orders - Orders and payments'
      ],
      next_steps: [
        'Check your Supabase Table Editor - you should see the new tables',
        'Test payment flow - customer data will save to these tables',
        'All customer submissions will appear in your Table Editor'
      ]
    });

  } catch (error) {
    console.error('💥 Force table creation failed:', error);
    return res.status(500).json({
      success: false,
      project: 'eynsmbktdbrhixczuvty',
      error: error.message
    });
  }
}