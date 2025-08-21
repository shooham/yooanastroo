import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--glass)] backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/yooanastro-logo.png" 
              alt="Yooanastro Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
              Yooanastro
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#video-testimonials" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300">Stories</a>
            <a href="#testimonials" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300">Reviews</a>
            <a href="#about" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300">About</a>
            <a href="#services" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300">Services</a>
            <a href="#contact" className="text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-300">Contact</a>
          </nav>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-[var(--easing)] ${
          isMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute inset-0 bg-[var(--bg)]/95 backdrop-blur-lg" />
        <nav className={`relative h-full flex flex-col items-center justify-center gap-8 transform transition-transform duration-300 ease-[var(--easing)] ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-8'
        }`}>
          <a 
            href="#video-testimonials" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            Stories
          </a>
          <a 
            href="#testimonials" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            Reviews
          </a>
          <a 
            href="#about" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            About
          </a>
          <a 
            href="#services" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            Services
          </a>
          <a 
            href="#contact" 
            onClick={() => setIsMenuOpen(false)}
            className="text-2xl font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-300"
          >
            Contact
          </a>
        </nav>
      </div>
    </>
  );
}
