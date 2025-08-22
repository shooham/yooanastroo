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
    
    // YOUR ACTUAL PROJECT CREDENTIALS
    const SUPABASE_URL = 'https://eynsmbktdbrhixczuvty.supabase.co';
    const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bnNtYmt0ZGJyaGl4Y3p1dnR5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MDU3NCwiZXhwIjoyMDcwNzI2NTc0fQ.QvQBoOf8zPBCnqcSVbm_C3JxlX-JOELS9IsmjJWn3iU';

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    console.log('🔄 Fetching data from YOUR project: eynsmbktdbrhixczuvty');

    // Get customers and orders from YOUR astrology tables
    const { data: customers, error: customersError } = await supabase
      .from('astrology_customers')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: orders, error: ordersError } = await supabase
      .from('astrology_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (customersError) {
      console.error('❌ Customers fetch failed:', customersError);
      return res.status(500).json({ 
        error: 'Failed to fetch customers',
        details: customersError.message,
        table: 'astrology_customers'
      });
    }

    if (ordersError) {
      console.error('❌ Orders fetch failed:', ordersError);
      return res.status(500).json({ 
        error: 'Failed to fetch orders', 
        details: ordersError.message,
        table: 'astrology_orders'
      });
    }

    // Combine customer and order data
    const consultations = customers.map(customer => {
      const customerOrders = orders.filter(order => order.customer_id === customer.id);
      return {
        ...customer,
        orders: customerOrders,
        total_orders: customerOrders.length,
        paid_orders: customerOrders.filter(o => o.payment_status === 'completed').length,
        total_paid: customerOrders
          .filter(o => o.payment_status === 'completed')
          .reduce((sum, o) => sum + o.amount, 0)
      };
    });

    console.log(`✅ Found ${customers.length} customers and ${orders.length} orders`);

    // Create beautiful HTML interface
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>🌟 Yoana Astro - Customer Dashboard</title>
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
            max-width: 1400px; 
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
        .header h1 { font-size: 3rem; margin-bottom: 10px; }
        .header p { opacity: 0.9; font-size: 1.2rem; }
        .project-info {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            font-family: monospace;
            font-size: 0.9rem;
        }
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
        .stat-number { font-size: 2.5rem; font-weight: bold; color: #4F46E5; }
        .stat-label { color: #64748B; margin-top: 8px; font-weight: 500; }
        .content { padding: 40px; }
        .customer { 
            background: linear-gradient(135deg, #FAFAFA 0%, #F3F4F6 100%); 
            border: 2px solid #E5E7EB; 
            margin-bottom: 25px; 
            border-radius: 15px; 
            overflow: hidden;
            transition: all 0.3s ease;
        }
        .customer:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
            border-color: #4F46E5;
        }
        .customer-header { 
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 25px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        .customer-name { 
            font-size: 1.4rem; 
            font-weight: bold; 
        }
        .customer-meta {
            text-align: right;
            opacity: 0.9;
        }
        .customer-details { 
            padding: 30px; 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 20px; 
        }
        .detail-group {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border-left: 5px solid #4F46E5;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .detail-label { 
            font-weight: 600; 
            color: #6B7280; 
            font-size: 12px; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .detail-value { 
            color: #1F2937; 
            font-size: 1.1rem;
            word-break: break-word;
            font-weight: 500;
        }
        .orders-section {
            background: white;
            margin: 20px 30px 30px 30px;
            padding: 25px;
            border-radius: 12px;
            border: 1px solid #E5E7EB;
        }
        .orders-header {
            font-size: 1.2rem;
            font-weight: bold;
            color: #1F2937;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .order-item {
            background: #F8FAFC;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            border-left: 4px solid #10B981;
        }
        .order-item.pending {
            border-left-color: #F59E0B;
        }
        .questions { 
            background: #F0F9FF; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 30px 30px 30px;
            border: 1px solid #BAE6FD;
        }
        .questions h4 { 
            margin-bottom: 15px; 
            color: #0369A1; 
            font-size: 1.1rem;
        }
        .question { 
            background: white; 
            padding: 15px; 
            margin-bottom: 10px; 
            border-radius: 8px; 
            border-left: 3px solid #0EA5E9; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .no-data { 
            text-align: center; 
            color: #6B7280; 
            padding: 80px; 
            font-size: 1.2rem;
        }
        .refresh-btn {
            background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 30px;
            font-size: 1rem;
            transition: transform 0.2s ease;
        }
        .refresh-btn:hover {
            transform: translateY(-2px);
        }
        .status-badge {
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-completed { background: #10B981; color: white; }
        .status-pending { background: #F59E0B; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Yoana Astro</h1>
            <p>Customer Consultation Dashboard</p>
            <div class="project-info">
                <strong>Project:</strong> eynsmbktdbrhixczuvty.supabase.co<br>
                <strong>Tables:</strong> astrology_customers, astrology_orders
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${consultations.length}</div>
                <div class="stat-label">Total Customers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${orders.filter(o => o.payment_status === 'completed').length}</div>
                <div class="stat-label">Paid Consultations</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${orders.filter(o => o.payment_status === 'pending').length}</div>
                <div class="stat-label">Pending Payments</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">₹${Math.round(orders.filter(o => o.payment_status === 'completed').reduce((sum, o) => sum + o.amount, 0) / 100)}</div>
                <div class="stat-label">Total Revenue</div>
            </div>
        </div>

        <div class="content">
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh Data</button>
            
            ${consultations.length === 0 ? 
              '<div class="no-data">No customers found yet.<br>When customers submit forms on your website, they will appear here automatically.</div>' :
              consultations.map(customer => {
                const latestOrder = customer.orders.length > 0 ? customer.orders[0] : null;
                return `
                <div class="customer">
                    <div class="customer-header">
                        <div class="customer-name">${customer.full_name}</div>
                        <div class="customer-meta">
                            <div>${customer.orders.length} orders • ₹${Math.round(customer.total_paid / 100)} paid</div>
                            <div style="font-size: 0.9rem; margin-top: 5px;">Joined: ${new Date(customer.created_at).toLocaleDateString('en-IN')}</div>
                        </div>
                    </div>
                    
                    <div class="customer-details">
                        <div class="detail-group">
                            <div class="detail-label">📧 Email Address</div>
                            <div class="detail-value">${customer.email || 'Not provided'}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">📱 WhatsApp Number</div>
                            <div class="detail-value">${customer.whatsapp_number}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">🎂 Date of Birth</div>
                            <div class="detail-value">${customer.date_of_birth}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">⏰ Time of Birth</div>
                            <div class="detail-value">${customer.time_of_birth || (customer.unknown_birth_time ? 'Unknown time' : 'Not provided')}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">📍 Place of Birth</div>
                            <div class="detail-value">${customer.place_of_birth}</div>
                        </div>
                        <div class="detail-group">
                            <div class="detail-label">💰 Total Paid</div>
                            <div class="detail-value">₹${Math.round(customer.total_paid / 100)} (${customer.paid_orders} orders)</div>
                        </div>
                    </div>

                    ${customer.orders.length > 0 ? `
                    <div class="orders-section">
                        <div class="orders-header">
                            <span>📋 Orders (${customer.orders.length})</span>
                        </div>
                        ${customer.orders.map(order => `
                            <div class="order-item ${order.payment_status}">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                    <strong>${order.order_number}</strong>
                                    <span class="status-badge status-${order.payment_status}">${order.payment_status}</span>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 0.9rem; color: #6B7280;">
                                    <div><strong>Amount:</strong> ₹${Math.round(order.amount / 100)}</div>
                                    <div><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN')}</div>
                                    ${order.razorpay_payment_id ? `<div><strong>Payment ID:</strong> ${order.razorpay_payment_id}</div>` : ''}
                                    ${order.payment_completed_at ? `<div><strong>Paid:</strong> ${new Date(order.payment_completed_at).toLocaleString('en-IN')}</div>` : ''}
                                </div>
                                ${order.questions && order.questions.length > 0 ? `
                                <div style="margin-top: 15px;">
                                    <strong style="color: #4F46E5;">Customer Questions (${order.questions.length}):</strong>
                                    <div style="margin-top: 10px;">
                                        ${order.questions.map((q, i) => `
                                            <div style="background: white; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #4F46E5;">
                                                <strong>Q${i + 1}:</strong> ${q}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                                ` : '<div style="margin-top: 10px; color: #6B7280; font-style: italic;">No specific questions submitted</div>'}
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
              `;
              }).join('')
            }
        </div>
    </div>

    <script>
        console.log('📊 Customer data loaded:', {
            customers: ${consultations.length},
            orders: ${orders.length},
            paid_orders: ${orders.filter(o => o.payment_status === 'completed').length},
            revenue: '₹${Math.round(orders.filter(o => o.payment_status === 'completed').reduce((sum, o) => sum + o.amount, 0) / 100)}'
        });
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    console.error('💥 Dashboard error:', error);
    return res.status(500).json({
      error: 'Failed to load customer dashboard',
      details: error.message,
      project: 'eynsmbktdbrhixczuvty'
    });
  }
}