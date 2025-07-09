import { useState, useEffect, useRef } from 'react';
import { Video, BrainCircuit, CalendarCheck} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

function FeatureCard({ title, description, icon, delay }: FeatureCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "bg-card border rounded-xl p-6 transition-all duration-700 transform group",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      )}
    >
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, []);

  const features = [
    {
      title: "Meeting Recording",
      description: "Automatically joins scheduled meetings and records everything with perfect clarity.",
      icon: <Video className="h-6 w-6 text-primary" />,
      delay: 100
    },
    {
      title: "AI Summary",
      description: "Generate concise summaries highlighting key points, action items, and decisions.",
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      delay: 300
    },
    {
      title: "Calendar Integration",
      description: "Seamlessly connects with your calendar to join scheduled meetings automatically.",
      icon: <CalendarCheck className="h-6 w-6 text-primary" />,
      delay: 400
    },

  ];

  return (
    <section id="features" className="px-50 py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80 -z-10" />
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />

      <div className="container px-50 md:px-6">
        <div
          ref={headingRef}
          className={cn(
            "text-center max-w-3xl mx-auto mb-16 transition-all duration-700",
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Supercharge Your Meetings with AI
          </h2>
          <p className="text-xl text-muted-foreground">
            MeetBot combines powerful recording technology with advanced AI to transform your meeting experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
