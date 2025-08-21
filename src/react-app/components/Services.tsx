import { Calendar, Target, Book } from 'lucide-react';

export default function Services() {
  const whatYouGet = [
    {
      icon: Book,
      title: "Detailed Vedic Kundali (Lagna & Navamsa)",
      description: "Complete natal chart with Lagna (Ascendant), Navamsa analysis, planetary positions, yogas & doshas explained in plain Hindi/English."
    },
    {
      icon: Calendar,
      title: "Dasha & Transit Timing",
      description: "Vimshottari Dasha timeline, transits, and month/year-level timing for career, relationships, health & finance."
    },
    {
      icon: Target,
      title: "10 Focused Answers & Remedies",
      description: "Personalized, practical answers to your 10 questions plus suggested remedial upayas: mantras, gemstones (ratna), and puja/yantra suggestions when applicable."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Fill Your Details",
      description: "Share name, DOB, birth time (if known), place of birth and up to 10 questions."
    },
    {
      step: "2", 
      title: "Secure Payment ₹399",
      description: "Complete a one-time secure payment via Razorpay."
    },
    {
      step: "3",
      title: "Receive Your Report",
      description: "Our expert astrologers prepare a detailed PDF report and answers — delivered to your email and WhatsApp (if opted-in) within 16 hours."
    }
  ];

  const reportIncludes = [
    "Birth data & chart plot (Lagna chart, Navamsa)",
    "Planetary positions with degrees & Nakshatra notes", 
    "Major Yogas & Dosha alerts (and their meaning)",
    "Vimshottari Dasha overview with key timing windows",
    "Transit analysis for the next 12 months (major influences)",
    "Answers to your 10 questions — clear, actionable guidance",
    "Remedial suggestions (mantras, gemstones, puja recommendations) — optional & advisory",
    "Practical dos & don'ts and simple rituals for specific periods"
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* What You Get Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
            What You Get
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {whatYouGet.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[var(--accent)]/30 transition-all duration-300 group text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-black" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-[var(--text)]">
                  {service.title}
                </h3>
                <p className="text-[var(--muted)] leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
            Clarity in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {howItWorks.map((step, index) => (
            <div
              key={index}
              className="relative bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-[var(--accent)]/30 transition-all duration-300 group text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] rounded-full flex items-center justify-center text-2xl font-bold text-black group-hover:scale-110 transition-transform duration-300">
                {step.step}
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-[var(--text)]">
                {step.title}
              </h3>
              <p className="text-[var(--muted)] leading-relaxed">
                {step.description}
              </p>

              {/* Connection Line */}
              {index < howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] transform -translate-y-1/2" />
              )}
            </div>
          ))}
        </div>

        {/* Birth Time Note */}
        <div className="max-w-3xl mx-auto text-center mb-16 bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <p className="text-[var(--muted)] leading-relaxed">
            <strong>Note regarding birth time:</strong> If your birth time is not exact, our astrologers will mark uncertain segments and provide best-fit interpretations using chart rectification techniques when needed.
          </p>
        </div>

        {/* Detailed Report Content */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
            What's included in your PDF report:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportIncludes.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-[var(--accent)]/30 transition-all duration-300"
              >
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2 flex-shrink-0" />
                <span className="text-[var(--muted)] leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto text-center mt-16 bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <strong>Disclaimer:</strong> Yooanastro provides guidance based on Vedic astrology. This is advisory in nature and not a substitute for professional medical, legal, or financial advice. Remedies are optional & advisory — consult a priest/doctor as needed.
          </p>
        </div>
      </div>
    </section>
  );
}
