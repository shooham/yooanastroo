import Header from '@/react-app/components/Header';
import Hero from '@/react-app/components/Hero';
import VideoTestimonials from '@/react-app/components/VideoTestimonials';
import Testimonials from '@/react-app/components/Testimonials';
import About from '@/react-app/components/About';
import Services from '@/react-app/components/Services';
import Contact from '@/react-app/components/Contact';
import Footer from '@/react-app/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <VideoTestimonials />
      <Testimonials />
      <About />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
