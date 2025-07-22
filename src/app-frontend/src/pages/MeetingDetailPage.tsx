import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, Play, ArrowLeft, FileText, Video, Copy, Check } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import api from '../api';

interface MeetingDetail {
  id: string;
  meeting_url: string;
  start_time: string;
  recording: {
    file_name: string;
    uploaded_at: string;
  } | null;
  recording_url?: string;
  summary?: {
    summary_text: string;
    transcript: string;
    generated_at: string;
  };
}

export default function MeetingDetailPage() {
  const { meetId } = useParams<{ meetId: string }>();
  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (meetId) {
      fetchMeetingDetail();
    }
  }, [meetId]);

  const fetchMeetingDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/meet/${meetId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMeeting(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Meeting</h1>
          <p className="text-muted-foreground mb-4">{error || 'Meeting not found'}</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meeting Details</h1>
            <p className="text-muted-foreground">{meeting.meeting_url}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {meeting.recording ? "Recorded" : "Processing"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Meeting Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Meeting Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Date: </span>
              <span className="ml-1">{formatDate(meeting.start_time)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Time: </span>
              <span className="ml-1">{formatTime(meeting.start_time)}</span>
            </div>
            {meeting.recording && (
              <div className="flex items-center text-sm">
                <Video className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Recording: </span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto"
                  onClick={() => window.open(meeting.recording_url, '_blank')}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Play Recording
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary and Transcript Tabs */}
      {meeting.summary ? (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="recording">Recording</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Meeting Summary</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(meeting.summary!.summary_text, 'summary')}
                  >
                    {copied === 'summary' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied === 'summary' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <CardDescription>
                  Generated on {formatDate(meeting.summary.generated_at)} at {formatTime(meeting.summary.generated_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {meeting.summary.summary_text}
                </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transcript" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Full Transcript</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(meeting.summary!.transcript, 'transcript')}
                  >
                    {copied === 'transcript' ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copied === 'transcript' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <CardDescription>
                  Complete meeting transcript
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
                    {meeting.summary.transcript}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="recording" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Recording</CardTitle>
                <CardDescription>
                  Securely streamed from Google Cloud
                </CardDescription>
              </CardHeader>
              <CardContent>
                {meeting.recording_url ? (
                  <video
                    src={meeting.recording_url}
                    controls
                    className="w-full rounded-lg shadow-md max-h-[500px] mx-auto"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Recording is still being processed or not available.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Processing Meeting</CardTitle>
            <CardDescription>
              The meeting summary and transcript are being generated. Please check back later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Processing your meeting...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 