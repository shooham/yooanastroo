export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Test with direct credentials (temporary for debugging)
    const { createClient } = await import('@supabase/supabase-js');
    
    const SUPABASE_URL = 'https://eynsmbktdbrhixczuvty.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTA1NzQsImV4cCI6MjA3MDcyNjU3NH0.0CW5FrtCIEVSA6i54FXEvT6xayLLrC9X0ceB7i1_J3k';

    console.log('🔄 Testing direct Supabase connection...');
    
    // Test 1: Service Role Key
    try {
      const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
      const { data: serviceData, error: serviceError } = await supabaseService
        .from('orders')
        .select('count', { count: 'exact' })
        .limit(1);
      
      if (serviceError) {
        console.log('❌ Service key test failed:', serviceError.message);
      } else {
        console.log('✅ Service key works!');
        return res.status(200).json({
          success: true,
          message: 'Service role key works perfectly',
          keyType: 'service_role',
          keyPrefix: SUPABASE_SERVICE_KEY.substring(0, 20) + '...'
        });
      }
    } catch (serviceException) {
      console.log('❌ Service key exception:', serviceException.message);
    }

    // Test 2: Anon Key
    try {
      const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: anonData, error: anonError } = await supabaseAnon
        .from('orders')
        .select('count', { count: 'exact' })
        .limit(1);
      
      if (anonError) {
        console.log('❌ Anon key test failed:', anonError.message);
      } else {
        console.log('✅ Anon key works!');
        return res.status(200).json({
          success: true,
          message: 'Anonymous key works perfectly',
          keyType: 'anon',
          keyPrefix: SUPABASE_ANON_KEY.substring(0, 20) + '...'
        });
      }
    } catch (anonException) {
      console.log('❌ Anon key exception:', anonException.message);
    }

    // If both fail, return environment comparison
    return res.status(500).json({
      success: false,
      message: 'Both direct keys failed',
      environment: {
        SUPABASE_URL_ENV: process.env.SUPABASE_URL,
        SUPABASE_URL_DIRECT: SUPABASE_URL,
        SERVICE_KEY_ENV: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30) + '...',
        SERVICE_KEY_DIRECT: SUPABASE_SERVICE_KEY.substring(0, 30) + '...',
        ANON_KEY_ENV: process.env.SUPABASE_ANON_KEY?.substring(0, 30) + '...',
        ANON_KEY_DIRECT: SUPABASE_ANON_KEY.substring(0, 30) + '...'
      }
    });

  } catch (error) {
    console.error('💥 Test failed:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}