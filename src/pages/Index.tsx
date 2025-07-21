import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoCall } from '@/components/VideoCall';
import { Notepad } from '@/components/Notepad';
import { NotebookPen, Settings, Phone, PhoneOff } from 'lucide-react';
import concretioLogo from '@/assets/concretio-logo.png';
import { MdCode } from "react-icons/md";
const Index = () => {
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const videoCallRef = useRef<{ joinCall: () => void; leaveCall: () => void }>(null);

  const handleJoinCall = () => {
    if (videoCallRef.current) {
      videoCallRef.current.joinCall();
    }
  };

  const handleLeaveCall = () => {
    if (videoCallRef.current) {
      videoCallRef.current.leaveCall();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={concretioLogo} alt="Concret.io" className="h-8" />
            <h1 className="text-xl font-bold text-foreground">Concretio Interview</h1>
          </div>
          
          <div className="flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-3">
              <Input
                placeholder="Enter Daily.co room URL..."
                value={roomUrl}
                onChange={(e) => setRoomUrl(e.target.value)}
                className="w-80 max-w-md border-primary focus:border-primary focus:ring-primary placeholder:text-white"
              />
              {!isJoined ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleJoinCall}
                  disabled={!roomUrl}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Join Call
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleLeaveCall}
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  Leave
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isNotepadOpen ? "default" : "secondary"}
              size="sm"
              onClick={() => setIsNotepadOpen(!isNotepadOpen)}
            >
              <MdCode size={20} color="#fbfbfeff" />

              Code
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Video Call Area */}
        <div className={`flex-1 p-6 transition-all duration-300 ${isNotepadOpen ? 'mr-0' : 'mr-0'}`}>
          <VideoCall 
            ref={videoCallRef}
            roomUrl={roomUrl} 
            onJoinedChange={setIsJoined}
          />
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