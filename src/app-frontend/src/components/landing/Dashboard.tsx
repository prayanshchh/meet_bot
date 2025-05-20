import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, ChevronRight, Download, Share2, 
  BarChart, PieChart, LineChart, Presentation 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
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

  return (
    <section id="dashboard" className="px-50 py-20 relative overflow-hidden" ref={sectionRef}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10" />
      
      <div className="container px-4 md:px-6">
        <div 
          className={cn(
            "text-center max-w-3xl mx-auto mb-16 transition-all duration-700",
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-8"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Meeting Intelligence Dashboard
          </h2>
          <p className="text-xl text-muted-foreground">
            Access all your meeting recordings, transcripts, and AI summaries in one place.
          </p>
        </div>

        <div 
          className={cn(
            "relative max-w-5xl mx-auto transition-all duration-1000",
            isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-16"
          )}
        >
          {/* Dashboard UI */}
          <div className="bg-card border rounded-xl shadow-xl overflow-hidden">
            {/* Dashboard header */}
            <div className="bg-muted/50 p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                </div>
                <span className="font-medium">MeetBot Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8">
                  Reports
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  Settings
                </Button>
                <Button size="sm" className="h-8">
                  New Meeting
                </Button>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="flex divide-x min-h-[500px]">
              {/* Sidebar */}
              <div className="w-1/5 p-4 hidden md:block">
                <div className="space-y-1">
                  <div className="bg-primary/10 text-primary rounded-lg p-2 flex items-center justify-between">
                    <span className="font-medium">Meetings</span>
                    <Table className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg p-2 flex items-center justify-between hover:bg-muted transition-colors">
                    <span>Analytics</span>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="rounded-lg p-2 flex items-center justify-between hover:bg-muted transition-colors">
                    <span>Insights</span>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="rounded-lg p-2 flex items-center justify-between hover:bg-muted transition-colors">
                    <span>Trends</span>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="rounded-lg p-2 flex items-center justify-between hover:bg-muted transition-colors">
                    <span>Presentations</span>
                    <Presentation className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium">Recent Meetings</h3>
                  <Button variant="outline" size="sm">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Meeting cards */}
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      title: "Q2 Planning Session",
                      date: "Today, 10:00 AM",
                      duration: "45 min",
                      participants: 8,
                      hasRecording: true,
                      hasSummary: true,
                    },
                    {
                      title: "Product Team Sync",
                      date: "Yesterday, 2:30 PM",
                      duration: "60 min",
                      participants: 12,
                      hasRecording: true,
                      hasSummary: true,
                    },
                    {
                      title: "Marketing Strategy Discussion",
                      date: "May 15, 11:00 AM",
                      duration: "90 min",
                      participants: 6,
                      hasRecording: true,
                      hasSummary: true,
                    },
                  ].map((meeting, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "border rounded-lg p-4 transition-all hover:border-primary/30 hover:bg-primary/5",
                        isVisible ? "animate-slide-up" : "opacity-0",
                        i === 0 ? "delay-100" : i === 1 ? "delay-200" : "delay-300"
                      )}
                      style={{ animationDelay: `${i * 100 + 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{meeting.title}</h4>
                          <p className="text-muted-foreground text-sm">{meeting.date} • {meeting.duration}</p>
                          <p className="text-muted-foreground text-sm">{meeting.participants} participants</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {meeting.hasRecording && (
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {meeting.hasSummary && (
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="default" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="bg-muted/30 rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">AI Summary</div>
                          <div className="font-medium">Available</div>
                        </div>
                        <div className="bg-muted/30 rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Action Items</div>
                          <div className="font-medium">5 items</div>
                        </div>
                        <div className="bg-muted/30 rounded p-2 text-center">
                          <div className="text-xs text-muted-foreground">Sentiment</div>
                          <div className="font-medium">Positive</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div 
                    className={cn(
                      "bg-muted/20 rounded-lg p-4 transition-all",
                      isVisible ? "animate-slide-up delay-400" : "opacity-0"
                    )}
                  >
                    <div className="text-sm text-muted-foreground">Total Meetings</div>
                    <div className="text-2xl font-semibold">124</div>
                    <div className="text-xs text-primary mt-1">+12% from last month</div>
                  </div>
                  <div 
                    className={cn(
                      "bg-muted/20 rounded-lg p-4 transition-all",
                      isVisible ? "animate-slide-up delay-500" : "opacity-0"
                    )}
                  >
                    <div className="text-sm text-muted-foreground">Hours Saved</div>
                    <div className="text-2xl font-semibold">37.5</div>
                    <div className="text-xs text-primary mt-1">+8% from last month</div>
                  </div>
                  <div 
                    className={cn(
                      "bg-muted/20 rounded-lg p-4 transition-all", 
                      isVisible ? "animate-slide-up delay-600" : "opacity-0"
                    )}
                  >
                    <div className="text-sm text-muted-foreground">AI Summaries</div>
                    <div className="text-2xl font-semibold">98</div>
                    <div className="text-xs text-primary mt-1">+15% from last month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        </div>
      </div>
    </section>
  );
}