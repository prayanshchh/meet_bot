import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

export default function MeetPage() {
  const [meetLink, setMeetLink] = useState('');

  const handleSubmit = async () => {
    if (!meetLink) return;
    try {
      await axios.post(
        'http://127.0.0.1:8000/meet',
        { meeting_url: meetLink },
        { withCredentials: true }
      );
      toast.success('Bot is joining the meeting. Please allow access.');
      setMeetLink('');
    } catch (err) {
      toast.error('Failed to start bot. Make sure the meeting link is valid.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-lg shadow-xl border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Start a Meeting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your meeting link here..."
            value={meetLink}
            onChange={(e) => setMeetLink(e.target.value)}
            className="min-h-[80px]"
          />
          <p className="text-sm text-muted-foreground">
            ⚠️ Our bot will join the meeting immediately. Please make sure to admit the bot.
          </p>
          <Button className="w-full cursor-pointer" onClick={handleSubmit}>
            Let the Bot Join
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
