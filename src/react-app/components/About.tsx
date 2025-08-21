import { Star, Heart, Clock, Globe, Phone } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Star,
      title: "Expert astrologers with Vedic credentials",
      description: "Our certified astrologers have 10+ years experience in classical Vedic Jyotish"
    },
    {
      icon: Heart,
      title: "Handcrafted PDF report (not AI-generic)",
      description: "Each Kundali is prepared by hand using precise astronomical calculations"
    },
    {
      icon: Globe,
      title: "Delivered in English & Hindi",
      description: "Choose your preferred language for clear, practical guidance"
    },
    {
      icon: Clock,
      title: "16-hour express delivery",
      description: "Fast, reliable delivery to your email and WhatsApp (if opted)"
    }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--glass)] to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
            About Yooanastro
          </h2>
          <div className="text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto leading-relaxed space-y-6">
            <p>
              Yooanastro blends classical Vedic Jyotish — Panchang, Nakshatra analysis, Vimshottari Dasha, 
              Yogas & divisional charts — with modern clarity. Our certified astrologers (10+ years experience) 
              prepare each Kundali by hand, using precise astronomical calculations and real-world guidance.
            </p>
            <p>
              Reports are written plainly with practical next steps, combining ancient wisdom with 
              contemporary understanding for actionable insights.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:border-[var(--accent)]/30 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] rounded-2xl flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--text)]">
                  {feature.title}
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="text-center bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Phone className="w-6 h-6 text-[var(--gold)]" />
            <span className="text-2xl font-semibold text-[var(--text)]">Contact Us</span>
          </div>
          <div className="space-y-2">
            <p className="text-[var(--text)]">
              <a href="tel:+917599766522" className="text-[var(--accent)] hover:text-[var(--gold)] transition-colors duration-300 font-semibold">
                +91 75997 66522
              </a>
            </p>
            <p className="text-[var(--text)]">
              <a href="mailto:support@yooanastro.com" className="text-[var(--accent)] hover:text-[var(--gold)] transition-colors duration-300">
                support@yooanastro.com
              </a>
            </p>
            <p className="text-[var(--muted)] text-sm mt-4">
              Based in India — Serving customers worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
