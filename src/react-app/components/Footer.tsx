import { Star, Heart, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                <Star className="w-8 h-8 text-[var(--gold)]" fill="currentColor" />
                <span className="text-2xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
                  Yooanastro
                </span>
              </div>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                Personalized Vedic Kundali and expert astrological guidance delivered in 16 hours.
              </p>
            </div>

            {/* Contact Section */}
            <div className="text-center">
              <h4 className="text-[var(--text)] font-semibold mb-4">Contact</h4>
              <div className="space-y-2">
                <a 
                  href="mailto:support@yooanastro.com" 
                  className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-300 justify-center"
                >
                  <Mail className="w-4 h-4" />
                  support@yooanastro.com
                </a>
                <a 
                  href="tel:+917599766522" 
                  className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-300 justify-center"
                >
                  <Phone className="w-4 h-4" />
                  +91 75997 66522
                </a>
                <p className="text-[var(--muted)] text-sm">
                  Based in India — Serving customers worldwide
                </p>
              </div>
            </div>

            {/* Legal Section */}
            <div className="text-center md:text-right">
              <h4 className="text-[var(--text)] font-semibold mb-4">Important</h4>
              <div className="space-y-2 text-sm text-[var(--muted)]">
                <p><strong>No refunds</strong> after delivery.</p>
                <p>For payment issues contact 7599766522</p>
                <p className="text-xs opacity-70">
                  रिपोर्ट तैयार होने के बाद रिफंड नहीं होगा। संपर्क: 7599766522
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400" fill="currentColor" />
                <span>for cosmic souls</span>
              </div>
              
              <div className="text-center">
                <p className="text-[var(--muted)] text-sm">
                  © 2025 Yooanastro. All rights reserved. Terms • Privacy
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-[var(--muted)] leading-relaxed max-w-4xl mx-auto">
                <strong>No-Refund Policy:</strong> Yooanastro does not offer refunds once the report has been generated and delivered. 
                Exceptional refunds for verified payment errors or duplicate charges will be handled on a case-by-case basis. 
                <strong>Disclaimer:</strong> Yooanastro provides guidance based on Vedic astrology. This is advisory in nature and not a substitute for professional medical, legal, or financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
