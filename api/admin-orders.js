export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    // Hardcoded credentials as backup
    const BACKUP_CREDENTIALS = {
      SUPABASE_URL: 'https://eynsmbktdbrhixczuvty.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU'
    };

    const config = {
      SUPABASE_URL: process.env.SUPABASE_URL || BACKUP_CREDENTIALS.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || BACKUP_CREDENTIALS.SUPABASE_SERVICE_ROLE_KEY
    };

    const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY);

    // Get astrology consultation orders
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .like('order_number', 'AST%')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Parse customer data from notes field
    const consultations = orders.map(order => {
      let customerData = {};
      
      try {
        if (order.notes) {
          customerData = JSON.parse(order.notes);
        }
      } catch (parseError) {
        // If JSON parsing fails, try to extract from tracking_number
        if (order.tracking_number) {
          const parts = order.tracking_number.split('|');
          customerData = {
            customer_name: parts[0] || 'Unknown',
            whatsapp_number: parts[1] || 'Unknown',
            place_of_birth: parts[2] || 'Unknown'
          };
        }
      }

      return {
        id: order.id,
        order_number: order.order_number,
        customer_name: customerData.customer_name || 'Unknown',
        email: customerData.email || 'Not provided',
        whatsapp_number: customerData.whatsapp_number || 'Not provided',
        date_of_birth: customerData.date_of_birth || 'Not provided',
        time_of_birth: customerData.time_of_birth || 'Not provided',
        place_of_birth: customerData.place_of_birth || 'Not provided',
        unknown_birth_time: customerData.unknown_birth_time || false,
        questions: customerData.questions || [],
        payment_status: order.payment_status,
        order_status: order.status,
        amount: order.total_amount,
        razorpay_payment_id: order.payment_id,
        created_at: order.created_at,
        updated_at: order.updated_at
      };
    });

    // Create HTML response for easy viewing
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Yoana Astro - Customer Consultations</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; margin-bottom: 30px; }
        .stats { display: flex; gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #4F46E5; color: white; padding: 20px; border-radius: 8px; text-align: center; flex: 1; }
        .consultation { border: 1px solid #ddd; margin-bottom: 20px; padding: 20px; border-radius: 8px; background: #fafafa; }
        .consultation-header { display: flex; justify-content: between; align-items: center; margin-bottom: 15px; }
        .consultation-title { font-size: 18px; font-weight: bold; color: #333; }
        .status { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status.completed { background: #10B981; color: white; }
        .status.pending { background: #F59E0B; color: white; }
        .details { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-bottom: 15px; }
        .detail-item { background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #4F46E5; }
        .detail-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
        .detail-value { color: #333; margin-top: 5px; }
        .questions { background: white; padding: 15px; border-radius: 4px; margin-top: 15px; }
        .questions h4 { margin: 0 0 10px 0; color: #333; }
        .question { background: #f8f9fa; padding: 8px 12px; margin-bottom: 8px; border-radius: 4px; border-left: 3px solid #4F46E5; }
        .no-data { text-align: center; color: #666; padding: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Yoana Astro - Customer Consultations</h1>
        
        <div class="stats">
            <div class="stat-card">
                <h3>${consultations.length}</h3>
                <p>Total Consultations</p>
            </div>
            <div class="stat-card">
                <h3>${consultations.filter(c => c.payment_status === 'completed').length}</h3>
                <p>Paid Orders</p>
            </div>
            <div class="stat-card">
                <h3>${consultations.filter(c => c.payment_status === 'pending').length}</h3>
                <p>Pending Payments</p>
            </div>
        </div>

        ${consultations.length === 0 ? 
          '<div class="no-data">No customer consultations found yet. Customer data will appear here after form submissions.</div>' :
          consultations.map(consultation => `
            <div class="consultation">
                <div class="consultation-header">
                    <div class="consultation-title">${consultation.order_number} - ${consultation.customer_name}</div>
                    <span class="status ${consultation.payment_status}">${consultation.payment_status.toUpperCase()}</span>
                </div>
                
                <div class="details">
                    <div class="detail-item">
                        <div class="detail-label">Email</div>
                        <div class="detail-value">${consultation.email}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">WhatsApp</div>
                        <div class="detail-value">${consultation.whatsapp_number}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Date of Birth</div>
                        <div class="detail-value">${consultation.date_of_birth}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Time of Birth</div>
                        <div class="detail-value">${consultation.time_of_birth || 'Not provided'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Place of Birth</div>
                        <div class="detail-value">${consultation.place_of_birth}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Amount</div>
                        <div class="detail-value">₹${(consultation.amount / 100).toFixed(0)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Submitted</div>
                        <div class="detail-value">${new Date(consultation.created_at).toLocaleString()}</div>
                    </div>
                    ${consultation.razorpay_payment_id ? `
                    <div class="detail-item">
                        <div class="detail-label">Payment ID</div>
                        <div class="detail-value">${consultation.razorpay_payment_id}</div>
                    </div>
                    ` : ''}
                </div>
                
                ${consultation.questions && consultation.questions.length > 0 ? `
                <div class="questions">
                    <h4>Customer Questions (${consultation.questions.length}):</h4>
                    ${consultation.questions.map((q, i) => `
                        <div class="question">${i + 1}. ${q}</div>
                    `).join('')}
                </div>
                ` : '<div class="questions"><p style="color: #666;">No specific questions submitted</p></div>'}
            </div>
          `).join('')
        }
    </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    console.error('💥 Admin orders error:', error);
    return res.status(500).json({
      error: 'Failed to fetch customer consultations',
      details: error.message
    });
  }
}