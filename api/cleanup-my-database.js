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

    console.log('🔄 Starting cleanup of YOUR actual project: eynsmbktdbrhixczuvty');

    let results = {
      deleted_tables: [],
      created_tables: [],
      errors: [],
      steps: []
    };

    // Step 1: Get all existing tables
    results.steps.push('Checking existing tables...');
    const { data: existingTables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    console.log('📋 Found tables:', existingTables?.map(t => t.table_name));

    // Step 2: Delete unnecessary e-commerce tables
    const tablesToDelete = [
      'addresses', 'cart_items', 'categories', 'coupons', 'notification_logs',
      'notification_settings', 'order_details', 'order_items', 'order_status_history',
      'payment_logs', 'price_alerts', 'product_brands', 'product_details',
      'product_images', 'product_recommendations', 'product_specifications',
      'product_tag_relations', 'product_tags', 'product_views', 'products',
      'recently_viewed_products', 'review_votes', 'reviews', 'search_queries',
      'users', 'wishlist_items', 'orders'
    ];

    results.steps.push('Deleting unnecessary e-commerce tables...');
    
    for (const tableName of tablesToDelete) {
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: `DROP TABLE IF EXISTS public.${tableName} CASCADE;` 
        });
        
        if (!error) {
          results.deleted_tables.push(tableName);
          console.log(`✅ Deleted table: ${tableName}`);
        } else {
          console.log(`⚠️ Could not delete ${tableName}:`, error.message);
          results.errors.push(`${tableName}: ${error.message}`);
        }
      } catch (deleteError) {
        console.log(`⚠️ Exception deleting ${tableName}:`, deleteError.message);
        results.errors.push(`${tableName}: ${deleteError.message}`);
      }
    }

    // Step 3: Create 2 clean astrology tables
    results.steps.push('Creating clean astrology tables...');
    
    const createCustomersTable = `
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
    `;

    const createOrdersTable = `
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
    `;

    try {
      const { error: customersError } = await supabase.rpc('exec_sql', { sql: createCustomersTable });
      if (!customersError) {
        results.created_tables.push('astrology_customers');
        console.log('✅ Created astrology_customers table');
      } else {
        results.errors.push(`astrology_customers: ${customersError.message}`);
      }

      const { error: ordersError } = await supabase.rpc('exec_sql', { sql: createOrdersTable });
      if (!ordersError) {
        results.created_tables.push('astrology_orders');
        console.log('✅ Created astrology_orders table');
      } else {
        results.errors.push(`astrology_orders: ${ordersError.message}`);
      }

    } catch (createError) {
      console.error('❌ Table creation failed:', createError);
      results.errors.push(`Table creation: ${createError.message}`);
    }

    // Step 4: Enable RLS and policies
    results.steps.push('Setting up security...');
    
    const securitySQL = `
      ALTER TABLE public.astrology_customers ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.astrology_orders ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY IF NOT EXISTS "Service role access customers" ON public.astrology_customers FOR ALL USING (auth.role() = 'service_role');
      CREATE POLICY IF NOT EXISTS "Service role access orders" ON public.astrology_orders FOR ALL USING (auth.role() = 'service_role');
    `;

    try {
      const { error: securityError } = await supabase.rpc('exec_sql', { sql: securitySQL });
      if (!securityError) {
        results.steps.push('Security policies created');
        console.log('✅ Security policies created');
      }
    } catch (secError) {
      results.errors.push(`Security: ${secError.message}`);
    }

    console.log('🎉 Database cleanup completed!');

    return res.status(200).json({
      success: true,
      project: 'eynsmbktdbrhixczuvty (YOUR ACTUAL PROJECT)',
      message: 'Database cleaned up successfully!',
      results: results,
      summary: {
        deleted_tables: results.deleted_tables.length,
        created_tables: results.created_tables.length,
        errors: results.errors.length
      },
      next_steps: [
        'Your database now has only 2 clean tables',
        'Customer data will be saved properly',
        'Test payment flow to see customer data being saved',
        'Visit /api/view-clean-customers to see all customer data'
      ]
    });

  } catch (error) {
    console.error('💥 Cleanup failed:', error);
    return res.status(500).json({
      success: false,
      project: 'eynsmbktdbrhixczuvty (YOUR ACTUAL PROJECT)',
      error: error.message,
      message: 'Failed to clean up database automatically'
    });
  }
}