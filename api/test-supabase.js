import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== TESTING SUPABASE CONNECTION ===');
    
    // Check environment variables
    const envCheck = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY
    };
    
    console.log('Environment variables check:', envCheck);
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Service Role Key (first 20 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20));
    console.log('Anon Key (first 20 chars):', process.env.SUPABASE_ANON_KEY?.substring(0, 20));

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ 
        error: 'Supabase credentials not configured',
        envCheck 
      });
    }

    // Test with Service Role Key (what we use in the API)
    console.log('🔄 Testing with Service Role Key...');
    const supabaseService = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
      // First test basic auth with a simple query
      const { data: authTest, error: authError } = await supabaseService.auth.getUser();
      console.log('Auth test result:', authTest, authError);
      
      // Test database access with a simple schema query instead of orders table
      const { data: serviceData, error: serviceError } = await supabaseService
        .rpc('version');
      
      if (serviceError) {
        console.error('❌ Service Role connection failed:', serviceError);
        return res.status(500).json({ 
          error: 'Supabase Service Role connection failed',
          details: serviceError.message,
          code: serviceError.code,
          hint: serviceError.hint
        });
      }
      
      console.log('✅ Service Role connection successful');
      
      // Test with Anon Key for comparison
      console.log('🔄 Testing with Anon Key...');
      const supabaseAnon = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
      );

      const { data: anonData, error: anonError } = await supabaseAnon
        .from('orders')
        .select('count', { count: 'exact' })
        .limit(1);
      
      return res.status(200).json({ 
        success: true,
        message: 'Supabase connections tested',
        serviceRoleResult: 'SUCCESS',
        anonResult: anonError ? `FAILED: ${anonError.message}` : 'SUCCESS',
        serviceRoleKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20),
        anonKeyPrefix: process.env.SUPABASE_ANON_KEY?.substring(0, 20)
      });

    } catch (supabaseError) {
      console.error('❌ Supabase connection error:', supabaseError);
      
      return res.status(500).json({ 
        error: 'Supabase connection failed',
        details: supabaseError.message,
        name: supabaseError.name
      });
    }

  } catch (error) {
    console.error('💥 CRITICAL ERROR in test-supabase:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}