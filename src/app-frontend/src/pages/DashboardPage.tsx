import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, Play, FileText, Plus } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import axios from 'axios';

interface Meeting {
  meeting_id: string;
  meeting_url: string;
  recording_url: string | null;
  start_time?: string;
  summary?: string;
  transcript?: string;
}

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/dashboard', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setMeetings(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMeetingClick = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Recordings</h1>
          <p className="text-muted-foreground">View and manage your meeting recordings</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-48">
              <CardHeader>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchMeetings}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Recordings</h1>
            <p className="text-muted-foreground">
              {meetings.length === 0 
                ? "No recordings yet. Start your first meeting to see it here!"
                : `You have ${meetings.length} recording${meetings.length === 1 ? '' : 's'}`
              }
            </p>
          </div>
          <Button onClick={() => navigate('/meet')} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Meet
          </Button>
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Recordings Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start recording your first meeting to see it appear here
          </p>
          <Button onClick={() => navigate('/meet')}>
            Start Recording
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <Card 
              key={meeting.meeting_id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleMeetingClick(meeting.meeting_id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg truncate">
                    Meeting {meeting.meeting_id.slice(0, 8)}
                  </CardTitle>
                  <Badge variant={meeting.recording_url ? "default" : "secondary"}>
                    {meeting.recording_url ? "Recorded" : "Processing"}
                  </Badge>
                </div>
                <CardDescription className="truncate">
                  {meeting.meeting_url}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meeting.start_time && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(meeting.start_time)}
                    </div>
                  )}
                  {meeting.start_time && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(meeting.start_time)}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMeetingClick(meeting.meeting_id);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {meeting.recording_url && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(meeting.recording_url!, '_blank');
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 