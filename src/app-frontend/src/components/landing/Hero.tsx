import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Video, FileText, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative pt-24 md:pt-32 pb-16 overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10" />
      
      {/* Animated circles background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl animate-float-slow" />
      </div>

      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-10">
          <div 
            className={cn(
              "space-y-4 max-w-3xl transition-all duration-1000 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 animate-fade-in hover:shadow-[0_0_20px_4px] transition-all duration-300 hover:shadow-primary/60 gap-6 max-w-3xl mx-auto">
              Introducing MeetBot
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter gap-6 max-w-3xl w-full mx-auto">
              Never Miss a Meeting <span className="text-primary">Insight</span> Again
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground gap-6 max-w-3xl w-full mx-auto">
              AI-powered meeting assistant that records, transcribes, and creates summaries so you can focus on the conversation.
            </p>
          </div>

          <div 
            className={cn(
              "flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-300 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <Button size="lg" className="h-12 px-6 gap-6 max-w-3xl mx-auto">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 gap-6 max-w-3xl mx-auto">
              Watch Demo
            </Button>
          </div>

          <div 
            className={cn(
              "grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl transition-all duration-1000 delay-500 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            <div className="flex items-center gap-2 justify-center md:justify-start gap-6 max-w-3xl w-full mx-auto">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm">AI-powered summaries</span>
            </div>
            <div className="flex items-center gap-2 justify-center gap-6 max-w-3xl w-full mx-auto">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm">Automatic transcription</span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-end gap-6 max-w-3xl w-full mx-auto">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-sm">Smart highlights</span>
            </div>
          </div>

          <div 
            className={cn(
              "relative w-full max-w-4xl mx-auto transition-all duration-1000 delay-700 transform",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            {/* Dashboard preview */}
            <div className="relative rounded-xl border shadow-2xl bg-card overflow-x-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-background to-background z-10 opacity-60" />
              <div className="relative aspect-video flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-muted p-4 flex items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs font-medium">MeetBot Dashboard</div>
                  <div className="w-16"></div>
                </div>
                
                {/* Content */}
                <div className="flex flex-1 divide-x">
                  {/* Sidebar */}
                  <div className="w-1/5 bg-card p-2 hidden sm:block">
                    <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-muted/50 rounded mb-2"></div>
                    <div className="h-4 w-4/6 bg-muted/50 rounded mb-4"></div>
                    
                    <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-muted/50 rounded mb-2"></div>
                    <div className="h-4 w-4/6 bg-muted/50 rounded"></div>
                  </div>
                  
                  {/* Main content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 w-32 bg-muted rounded"></div>
                      <div className="h-8 w-24 bg-primary rounded-md"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-muted/20 rounded-lg p-3 flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Video className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="h-4 w-16 bg-muted rounded mb-1"></div>
                          <div className="h-6 w-12 bg-muted/70 rounded"></div>
                        </div>
                      </div>
                      <div className="bg-muted/20 rounded-lg p-3 flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="h-4 w-16 bg-muted rounded mb-1"></div>
                          <div className="h-6 w-12 bg-muted/70 rounded"></div>
                        </div>
                      </div>
                      <div className="bg-muted/20 rounded-lg p-3 flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <BrainCircuit className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="h-4 w-16 bg-muted rounded mb-1"></div>
                          <div className="h-6 w-12 bg-muted/70 rounded"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-muted/10 rounded-lg p-4">
                      <div className="h-6 w-48 bg-muted rounded mb-4"></div>
                      <div className="h-4 w-full bg-muted/50 rounded mb-2"></div>
                      <div className="h-4 w-5/6 bg-muted/50 rounded mb-2"></div>
                      <div className="h-4 w-4/6 bg-muted/50 rounded mb-4"></div>
                      
                      <div className="h-6 w-32 bg-muted rounded mb-2"></div>
                      <div className="h-4 w-full bg-muted/30 rounded mb-2"></div>
                      <div className="h-4 w-3/4 bg-muted/30 rounded mb-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-primary/50 via-primary/0 to-primary/50 blur-xl rounded-xl opacity-20 animate-glow" />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}