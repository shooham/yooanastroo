import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function VideoTestimonials() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [mutedStates, setMutedStates] = useState<boolean[]>([true, true, true, true]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const testimonialVideos = [
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      poster: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
      name: "Priya Sharma",
      location: "Mumbai, India",
      title: "Career Transformation"
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
      name: "Raj Patel",
      location: "Delhi, India", 
      title: "Love & Relationships"
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
      name: "Anita Desai",
      location: "Bangalore, India",
      title: "Life Purpose Discovery"
    },
    {
      src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      poster: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
      name: "Vikram Singh",
      location: "Chennai, India",
      title: "Business Success"
    }
  ];

  const handlePlayPause = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingVideo === index) {
      video.pause();
      setPlayingVideo(null);
    } else {
      // Pause all other videos
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) {
          v.pause();
        }
      });
      
      video.play();
      setPlayingVideo(index);
    }
  };

  const handleMuteToggle = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    const newMutedStates = [...mutedStates];
    newMutedStates[index] = !newMutedStates[index];
    video.muted = newMutedStates[index];
    setMutedStates(newMutedStates);
  };

  return (
    <section id="video-testimonials" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--glass)] to-transparent" />
      <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--gold)]/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] bg-clip-text text-transparent">
              Real Stories, Real Transformations
            </h2>
            <p className="text-lg md:text-xl text-[var(--muted)] max-w-3xl mx-auto">
              Watch how our astrological guidance has transformed lives and brought clarity to thousands of souls seeking their cosmic purpose.
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonialVideos.map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-[var(--glass)] backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-500 transform hover:scale-[1.02]"
              >
                {/* Video Container */}
                <div className="relative aspect-[9/16] overflow-hidden">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    className="w-full h-full object-cover"
                    poster={testimonial.poster}
                    muted={mutedStates[index]}
                    loop
                    playsInline
                    onEnded={() => setPlayingVideo(null)}
                  >
                    <source src={testimonial.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Video Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Play/Pause Button */}
                  <button
                    onClick={() => handlePlayPause(index)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[var(--accent)]/90 rounded-full flex items-center justify-center hover:bg-[var(--accent)] transition-all duration-300 group-hover:scale-110"
                  >
                    {playingVideo === index ? (
                      <Pause className="w-8 h-8 text-black" />
                    ) : (
                      <Play className="w-8 h-8 text-black ml-1" />
                    )}
                  </button>

                  {/* Mute/Unmute Button */}
                  <button
                    onClick={() => handleMuteToggle(index)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300"
                  >
                    {mutedStates[index] ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>

                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-[var(--glass)] backdrop-blur-md border border-white/20 rounded-xl p-3">
                      <h4 className="font-semibold text-white text-sm mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-300 text-xs mb-1">
                        {testimonial.location}
                      </p>
                      <p className="text-[var(--accent)] text-xs font-medium">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--gold)]/10 rounded-3xl" />
                  <div className="absolute inset-0 shadow-[0_0_50px_rgba(167,139,250,0.3)] rounded-3xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-[var(--muted)] mb-6 text-lg">
              Join thousands who have discovered their cosmic destiny
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[var(--accent)] to-[var(--gold)] text-black font-bold rounded-xl shadow-[var(--shadow)] hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Start Your Journey
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
