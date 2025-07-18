import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoCall } from '@/components/VideoCall';
import { Notepad } from '@/components/Notepad';
import { NotebookPen, Settings, Users } from 'lucide-react';

const Index = () => {
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">VideoCode</h1>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter Daily.co room URL..."
                value={roomUrl}
                onChange={(e) => setRoomUrl(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="secondary" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Participants
            </Button>
            <Button variant="secondary" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant={isNotepadOpen ? "default" : "secondary"}
              size="sm"
              onClick={() => setIsNotepadOpen(!isNotepadOpen)}
            >
              <NotebookPen className="w-4 h-4 mr-2" />
              Notepad
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Video Call Area */}
        <div className={`flex-1 p-6 transition-all duration-300 ${isNotepadOpen ? 'mr-0' : 'mr-0'}`}>
          <VideoCall roomUrl={roomUrl} />
        </div>

        {/* Notepad Panel */}
        {isNotepadOpen && (
          <div className="w-96 flex-shrink-0">
            <Notepad 
              isOpen={isNotepadOpen} 
              onClose={() => setIsNotepadOpen(false)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
