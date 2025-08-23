import { createClient } from '@supabase/supabase-js';

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
    const SUPABASE_URL = 'https://eynsmbktdbrhixczuvty.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { orderId, reportStatus, deliveryMethod, notes } = req.body;

    if (!orderId || !reportStatus) {
      return res.status(400).json({ error: 'Order ID and report status are required' });
    }

    // Valid statuses
    const validStatuses = ['not_delivered', 'in_progress', 'delivered'];
    if (!validStatuses.includes(reportStatus)) {
      return res.status(400).json({ error: 'Invalid report status' });
    }

    // Update the order
    const updateData = {
      report_status: reportStatus,
      report_delivered: reportStatus === 'delivered',
      updated_at: new Date().toISOString()
    };

    // Add optional fields
    if (deliveryMethod) updateData.delivery_method = deliveryMethod;
    if (notes) updateData.delivery_notes = notes;
    if (reportStatus === 'delivered') {
      updateData.report_delivered_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('astrology_orders')
      .update(updateData)
      .eq('id', orderId)
      .select(`
        *,
        astrology_customers (
          full_name,
          whatsapp_number,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Update failed:', error);
      return res.status(500).json({ 
        error: 'Failed to update report status', 
        details: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: `Report status updated to: ${reportStatus}`,
      order: data
    });

  } catch (error) {
    console.error('Status update error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}