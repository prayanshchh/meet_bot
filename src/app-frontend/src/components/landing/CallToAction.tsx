import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MailCheck, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function CallToAction() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
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

  return (
    <section id="pricing" className="px-50 py-20 relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent -z-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container px-4 md:px-6">
        <div
          className={cn(
            "max-w-4xl mx-auto rounded-xl border bg-card overflow-hidden shadow-lg transition-all duration-700 transform relative",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="absolute -top-40 -right-40 h-80 w-80 bg-primary/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 bg-secondary/10 rounded-full blur-3xl opacity-50" />

          <div className="p-8 md:p-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="space-y-4 md:w-1/2">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary transition-all duration-300 hover-shadow-[0_0_10px_2px] hover:shadow-[0_0_20px_4px] hover:shadow-primary/60
">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  <span>Limited Time Offer</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Start using MeetBot for free
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Join thousands of professionals who save time and capture valuable meeting insights with MeetBot.
                </p>

                <div
                  className={cn(
                    "flex flex-wrap gap-4 transition-opacity duration-700 delay-300",
                    isVisible ? "opacity-100" : "opacity-0"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm">14-day free trial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm">Cancel anytime</span>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "space-y-4 md:w-2/5 transition-all duration-700 delay-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                <div className="border bg-card rounded-lg p-6 space-y-4">
                  <div className="flex flex-col items-center">
                    <h3 className="font-semibold text-xl">Early Access Pricing</h3>
                    <div className="flex items-end gap-1 my-2">
                      <span className="text-3xl font-bold">$12</span>
                      <span className="text-muted-foreground mb-1">/month</span>
                    </div>
                    <div className="bg-destructive/10 text-destructive rounded-md px-2 py-0.5 text-xs font-medium hover:shadow-[0_0_20px_4px] transition-all duration-500 hover:shadow-primary/60
">
                      50% off regular price
                    </div>
                  </div>

                  <form className="space-y-3">
                    <div className="relative">
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10"
                      />
                      <MailCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                    <Button className="w-full">
                      Get Started Free
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
