# 🌟 Yooanastro - Vedic Astrology Platform

A modern web application for personalized Vedic Kundali readings and astrological consultations.

## ✨ Features

- 📊 **Personalized Kundali Generation** - Detailed Vedic astrology charts
- 💬 **10 Custom Questions** - Get answers to your specific life questions  
- 💳 **Secure Payments** - Integrated with Razorpay for safe transactions
- 📱 **WhatsApp Integration** - Receive reports directly on WhatsApp
- ⚡ **16-Hour Delivery** - Fast turnaround time for reports
- 🎨 **Modern UI** - Beautiful, responsive design with cosmic animations

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Backend:** Hono.js, Supabase
- **Payment:** Razorpay Integration
- **Deployment:** Vercel
- **Database:** PostgreSQL (Supabase)

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/spexyvishal24-art/Johanna-Astroversal.git
cd Johanna-Astroversal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
- Supabase credentials
- Razorpay API keys
- Other required environment variables

5. Start the development server:
```bash
npm run dev
```

## 📦 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables

Set these in your Vercel dashboard:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## 🏗️ Project Structure

```
├── src/
│   ├── react-app/          # React frontend
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # App entry point
│   ├── worker/            # Cloudflare Worker (backup)
│   └── shared/            # Shared types and utilities
├── api/                   # Vercel API functions
├── public/               # Static assets
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

- `POST /api/create-order` - Create new kundali order
- `POST /api/verify-payment` - Verify Razorpay payment

## 📊 Database Schema

### Orders Table
- Customer information
- Payment status
- Order tracking

### Consultation Forms  
- Detailed form submissions
- Questions and responses
- Delivery status

## 🔐 Security Features

- Payment signature verification
- CORS protection
- Environment variable security
- Input validation and sanitization

## 📱 Payment Integration

- Razorpay payment gateway
- Webhook verification
- Automatic status updates
- Failed payment handling

## 🎨 UI Features

- Responsive design
- Cosmic animations
- Loading states
- Error handling
- Form validation

## 📞 Support

For support, email support@yooanastro.com or contact +91 75997 66522

## 📄 License

This project is proprietary and confidential.

---

Made with ❤️ for Vedic Astrology enthusiasts
