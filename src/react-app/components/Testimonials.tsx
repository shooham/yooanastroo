import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "The Kundali was incredibly accurate. The career timing they predicted helped me change jobs at the right time. The report felt personal, not generic.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Raj Patel", 
      location: "Delhi",
      rating: 5,
      text: "Their timing for my relationship phase was spot on. The suggestions were practical and easy to follow.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Anita Desai",
      location: "Bengaluru", 
      rating: 5,
      text: "Deep insights into my life path and spiritual growth. The astrologer explained Nakshatra and Dasha in such clarity.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Vikram Singh",
      location: "Chennai",
      rating: 5,
      text: "Professional, very accurate, and delivered promptly. Helped me plan my business expansion.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Kavya Reddy",
      location: "Hyderabad", 
      rating: 5,
      text: "The reading was incredibly accurate and gave me the clarity I needed about my career transition. The explanations were clear, not vague.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Arjun Mehta",
      location: "Pune",
      rating: 5,
      text: "The depth of the Navamsa & Nakshatra explanations helped me focus on my spiritual progress. Delivered quickly and clearly.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--glass)] to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found clarity and direction 
            through our personalized Vedic guidance and expert astrological insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[var(--accent)]/30 transition-all duration-300 relative group hover:scale-105 transform"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[var(--accent)]/30 group-hover:text-[var(--accent)]/50 transition-colors duration-300" />
              
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent)]/30 group-hover:border-[var(--accent)]/50 transition-colors duration-300"
                />
                <div>
                  <h4 className="text-lg font-semibold text-[var(--text)]">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-[var(--muted)]">
                    {testimonial.location}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[var(--gold)] fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <blockquote className="text-[var(--muted)] leading-relaxed italic">
                "{testimonial.text}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--gold)] rounded-full"></div>
              <span>Trusted by 10,000+ customers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--accent)] rounded-full"></div>
              <span>16-hour delivery guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>100% confidential</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
