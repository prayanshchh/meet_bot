import { useState, useEffect, useRef } from 'react';
import { Calendar, BookOpen, Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function Step({ number, title, description, icon, isActive, onClick }: StepProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all",
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-muted/20"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center text-white font-bold transition-colors",
          isActive
            ? "bg-primary"
            : "bg-muted"
        )}
      >
        {number}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto rotate through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      number: 1,
      title: "Connect Your Calendar",
      description: "Integrate with Google Calendar, Outlook, or any calendar service to access your meeting schedule.",
      icon: <Calendar className="h-5 w-5 text-primary" />
    },
    {
      number: 2,
      title: "Authorize Access",
      description: "Grant MeetBot permission to join meetings and record on your behalf with secure OAuth.",
      icon: <BookOpen className="h-5 w-5 text-primary" />
    },
    {
      number: 3,
      title: "MeetBot Attends",
      description: "MeetBot automatically joins your meetings, announces itself, and begins recording.",
      icon: <Bot className="h-5 w-5 text-primary" />
    },
    {
      number: 4,
      title: "Receive AI Summary",
      description: "After the meeting, receive a detailed AI summary with key points and action items.",
      icon: <Sparkles className="h-5 w-5 text-primary" />
    }
  ];

  return (
    <section id="how-it-works" className="px-50 py-20 bg-muted/5" ref={sectionRef}>
      <div className="container px-4 md:px-6">
        <div
          className={cn(
            "text-center max-w-3xl mx-auto mb-16 transition-all duration-700",
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How MeetBot Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Getting started with MeetBot is simple. Follow these steps to never miss important meeting details again.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div
            className={cn(
              "space-y-4 transition-all duration-700 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}
          >
            {steps.map((step) => (
              <Step
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isActive={activeStep === step.number}
                onClick={() => setActiveStep(step.number)}
              />
            ))}
          </div>

          <div
            className={cn(
              "bg-card border rounded-xl overflow-hidden transition-all duration-700 delay-500 relative",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}
          >
            {/* Step illustration */}
            <div className="aspect-square p-6 relative">
              {activeStep === 1 && (
                <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-4/5 h-4/5 bg-muted/20 rounded-lg p-4 relative">
                    <div className="h-8 w-full bg-primary/20 rounded-md mb-4"></div>
                    <div className="grid grid-cols-7 gap-1">
                      {[...Array(31)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "aspect-square rounded flex items-center justify-center text-xs border",
                            i % 3 === 0
                              ? "bg-primary/10 border-primary/20"
                              : "bg-transparent border-muted"
                          )}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full h-12 w-12 flex items-center justify-center animate-pulse-slow">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-4/5 bg-muted/20 rounded-lg p-6 flex flex-col items-center relative">
                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <div className="h-6 w-3/4 bg-muted rounded mb-4"></div>
                    <div className="h-4 w-full bg-muted/50 rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-muted/50 rounded mb-6"></div>
                    <div className="flex gap-3">
                      <div className="h-10 w-24 bg-muted rounded"></div>
                      <div className="h-10 w-24 bg-primary rounded animate-pulse-slow"></div>
                    </div>
                    <div className="absolute -top-3 -right-3 h-8 w-8 bg-primary text-white flex items-center justify-center rounded-full">
                      2
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-4/5 bg-muted/20 rounded-lg overflow-hidden">
                    <div className="h-8 bg-muted/50 flex items-center justify-between px-4">
                      <div className="flex space-x-1">
                        <div className="h-3 w-3 rounded-full bg-destructive"></div>
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="h-4 w-32 bg-muted rounded"></div>
                      <div className="h-4 w-4 bg-muted rounded"></div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-3 items-start mb-8">
                        <div className="h-10 w-10 bg-muted rounded-full flex-shrink-0"></div>
                        <div className="h-20 w-full bg-muted/30 rounded"></div>
                      </div>
                      <div className="flex gap-3 items-start mb-8">
                        <div className="h-10 w-10 bg-primary/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-6 w-6 text-primary animate-bounce-slow" />
                        </div>
                        <div className="h-10 w-4/5 bg-primary/10 border border-primary/20 rounded"></div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <div className="h-10 w-10 bg-muted rounded-full flex-shrink-0"></div>
                        <div className="h-16 w-full bg-muted/30 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-4/5 h-4/5 bg-card border-2 border-primary/30 rounded-lg p-4 flex flex-col relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-8 w-40 bg-primary/20 rounded flex items-center px-2">
                        <div className="h-4 w-4 bg-primary rounded-full mr-2"></div>
                        <div className="h-3 w-24 bg-muted"></div>
                      </div>
                      <div className="h-8 w-8 bg-muted/30 rounded-full flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="h-6 w-32 bg-primary/20 rounded mb-2"></div>
                        <div className="h-4 w-full bg-muted/30 rounded mb-1"></div>
                        <div className="h-4 w-5/6 bg-muted/30 rounded"></div>
                      </div>

                      <div>
                        <div className="h-6 w-40 bg-primary/20 rounded mb-2"></div>
                        <div className="h-4 w-full bg-muted/30 rounded mb-1"></div>
                        <div className="h-4 w-4/6 bg-muted/30 rounded"></div>
                      </div>

                      <div>
                        <div className="h-6 w-36 bg-primary/20 rounded mb-2"></div>
                        <div className="h-4 w-full bg-muted/30 rounded mb-1"></div>
                        <div className="h-4 w-5/6 bg-muted/30 rounded mb-1"></div>
                        <div className="h-4 w-3/6 bg-muted/30 rounded"></div>
                      </div>
                    </div>

                    <div className="h-10 w-full bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-between px-4 mt-4">
                      <div className="h-4 w-20 bg-muted rounded"></div>
                      <div className="h-6 w-6 bg-primary rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress indicators */}
            <div className="h-2 w-full bg-muted/20 flex">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={cn(
                    "h-full transition-all duration-500",
                    activeStep === step.number ? "bg-primary" : "bg-transparent",
                    "w-1/4"
                  )}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
