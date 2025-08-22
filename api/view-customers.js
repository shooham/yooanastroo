export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

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

    let customers = [];
    let orders = [];

    // Try to get data from clean tables first
    try {
      console.log('🔄 Fetching from clean astrology tables...');
      
      const { data: customersData, error: customersError } = await supabase
        .from('astrology_customers')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: ordersData, error: ordersError } = await supabase
        .from('astrology_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!customersError && !ordersError) {
        customers = customersData || [];
        orders = ordersData || [];
        console.log('✅ Data fetched from clean tables');
      } else {
        throw new Error('Clean tables not available');
      }

    } catch (cleanError) {
      console.log('⚠️ Clean tables not available, checking old tables...');
      
      // Fallback to old orders table
      const { data: oldOrders, error: oldError } = await supabase
        .from('orders')
        .select('*')
        .like('order_number', 'AST%')
        .order('created_at', { ascending: false });

      if (!oldError && oldOrders) {
        // Convert old orders to customer format
        customers = oldOrders.map(order => {
          let customerData = {};
          try {
            if (order.notes) {
              customerData = JSON.parse(order.notes);
            }
          } catch (e) {
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
            full_name: customerData.customer_name || 'Unknown',
            email: customerData.email || 'Not provided',
            whatsapp_number: customerData.whatsapp_number || 'Not provided',
            date_of_birth: customerData.date_of_birth || 'Not provided',
            time_of_birth: customerData.time_of_birth || 'Not provided',
            place_of_birth: customerData.place_of_birth || 'Not provided',
            questions: customerData.questions || [],
            order_number: order.order_number,
            payment_status: order.payment_status,
            amount: order.total_amount,
            created_at: order.created_at
          };
        });
        console.log('✅ Data converted from old tables');
      }
    }

    // Create HTML response
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>🌟 Yoana Astro - All Customer Data</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 1.1rem; }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 0; 
            background: #F8FAFC;
            border-bottom: 1px solid #E2E8F0;
        }
        .stat-card { 
            padding: 30px; 
            text-align: center; 
            border-right: 1px solid #E2E8F0;
        }
        .stat-card:last-child { border-right: none; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #4F46E5; }
        .stat-label { color: #64748B; margin-top: 5px; }
        .content { padding: 40px; }
        .customer { 
            background: #FAFAFA; 
            border: 1px solid #E5E7EB; 
            margin-bottom: 20px; 
            border-radius: 15px; 
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .customer:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        .customer-header { 
            background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
            padding: 20px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        .customer-name { 
            font-size: 1.3rem; 
            font-weight: bold; 
            color: #1F2937; 
        }
        .status { 
            padding: 6px 16px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold; 
            text-transform: uppercase;
        }
        .status.completed { background: #10B981; color: white; }
        .status.pending { background: #F59E0B; color: white; }
        .customer-details { 
            padding: 25px; 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
        }
        .detail-group {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #4F46E5;
        }
        .detail-label { 
            font-weight: 600; 
            color: #6B7280; 
            font-size: 11px; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .detail-value { 
            color: #1F2937; 
            font-size: 1rem;
            word-break: break-word;
        }
        .questions { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            margin-top: 20px; 
            border: 1px solid #E5E7EB;
        }
        .questions h4 { 
            margin-bottom: 15px; 
            color: #1F2937; 
            font-size: 1.1rem;
        }
        .question { 
            background: #F8FAFC; 
            padding: 12px 15px; 
            margin-bottom: 10px; 
            border-radius: 8px; 
            border-left: 3px solid #4F46E5; 
        }
        .no-data { 
            text-align: center; 
            color: #6B7280; 
            padding: 60px; 
            font-size: 1.1rem;
        }
        .refresh-btn {
            background: #4F46E5;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .refresh-btn:hover {
            background: #4338CA;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Yoana Astro</h1>
            <p>Complete Customer Consultation Management</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${customers.length}</div>
                <div class="stat-label">Total Customers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${customers.filter(c => c.payment_status === 'completed').length}</div>
                <div class="stat-label">Paid Consultations</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${customers.filter(c => c.payment_status === 'pending').length}</div>
                <div class="stat-label">Pending Payments</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">₹${Math.round(customers.reduce((sum, c) => sum + (parseInt(c.amount) || 39900), 0) / 100)}</div>
                <div class="stat-label">Total Revenue</div>
            </div>
        </div>

        <div class="content">
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>
            
            ${customers.length === 0 ? 
              '<div class="no-data">No customers found yet. When customers submit forms, they will appear here automatically.</div>' :
              customers.map(customer => `
                <div class="customer">
                    <div class="customer-header">
                        <div class="customer-name">${customer.full_name} ${customer.order_number ? `(${customer.order_number})` : ''}</div>
                        <span class="status ${customer.payment_status || 'pending'}">${(customer.payment_status || 'pending').toUpperCase()}</span>
                    </div>
                    
                    <div class="customer-details">
                        <div class="detail-group">
                            <div class="detail-label">Email Address</div>
                            <div class="detail-value">${customer.email}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">WhatsApp Number</div>
                            <div class="detail-value">${customer.whatsapp_number}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">Date of Birth</div>
                            <div class="detail-value">${customer.date_of_birth}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">Time of Birth</div>
                            <div class="detail-value">${customer.time_of_birth || 'Not provided'}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">Place of Birth</div>
                            <div class="detail-value">${customer.place_of_birth}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">Consultation Fee</div>
                            <div class="detail-value">₹${Math.round((customer.amount || 39900) / 100)}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">Submitted On</div>
                            <div class="detail-value">${new Date(customer.created_at).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    
                    ${customer.questions && customer.questions.length > 0 ? `
                    <div class="questions">
                        <h4>🔮 Customer Questions (${customer.questions.length}):</h4>
                        ${customer.questions.map((q, i) => `
                            <div class="question"><strong>Q${i + 1}:</strong> ${q}</div>
                        `).join('')}
                    </div>
                    ` : '<div class="questions"><p style="color: #6B7280;">No specific questions submitted</p></div>'}
                </div>
              `).join('')
            }
        </div>
    </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    console.error('💥 View customers error:', error);
    return res.status(500).json({
      error: 'Failed to fetch customer data',
      details: error.message
    });
  }
}