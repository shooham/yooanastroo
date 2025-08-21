import { Mail, Phone, Clock, MessageCircle } from 'lucide-react';

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 75997 66522",
      description: "Direct support line",
      link: "tel:+917599766522"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Us",
      details: "+91 75997 66522", 
      description: "Quick WhatsApp support",
      link: "https://wa.me/917599766522"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "support@yooanastro.com",
      description: "Get in touch for any queries",
      link: "mailto:support@yooanastro.com"
    },
    {
      icon: Clock,
      title: "Delivery Time",
      details: "16 Hours",
      description: "Guaranteed report delivery",
      link: null
    }
  ];

  const faqItems = [
    {
      question: "How fast is delivery?",
      answer: "Standard: 16 hours from successful payment. Delivery via email and WhatsApp (if opted)."
    },
    {
      question: "What if I don't know my birth time?",
      answer: "Mark \"Unknown.\" Our astrologers will provide guidance with caveats and use chart rectification if needed (may take longer; we'll notify you)."
    },
    {
      question: "Can I get the report in Hindi?",
      answer: "Yes — select your preferred language in the form or add a note in questions."
    },
    {
      question: "Refunds?",
      answer: "All sales are final. We do not provide refunds after the report is prepared or delivered. Refunds are considered only for technical payment errors or duplicate charges — contact 7599766522 or support@yooanastro.com within 24 hours of payment."
    },
    {
      question: "Will you share my data?",
      answer: "Absolutely not. Your birth data is used only to prepare the report. See Privacy Policy."
    },
    {
      question: "How will I receive the report?",
      answer: "Via email. If you opt for WhatsApp, we will also send a secure link to the number you provide."
    }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Have questions about our Vedic astrology services? We're here to help you on your cosmic journey.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            const ContactCard = (
              <div
                className="bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center hover:border-[var(--accent)]/30 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] rounded-2xl flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--text)]">
                  {info.title}
                </h3>
                <p className="text-[var(--accent)] font-medium mb-1 hover:text-[var(--gold)] transition-colors duration-300">
                  {info.details}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {info.description}
                </p>
              </div>
            );

            return info.link ? (
              <a 
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : '_self'}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {ContactCard}
              </a>
            ) : (
              <div key={index}>
                {ContactCard}
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <div
                key={index}
                className="bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[var(--accent)]/30 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-[var(--text)] mb-3">
                  Q: {faq.question}
                </h4>
                <p className="text-[var(--muted)] leading-relaxed">
                  A: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-[var(--text)]">
              Ready to Unlock Your Cosmic Journey?
            </h3>
            <p className="text-[var(--muted)] mb-6">
              Join thousands who have found clarity through our personalized Vedic Kundali and expert guidance.
            </p>
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-block px-8 py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-black font-bold rounded-lg shadow-[var(--shadow)] hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get Your Kundali Now — ₹399
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
