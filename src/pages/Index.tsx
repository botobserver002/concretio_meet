import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VideoCall } from '@/components/VideoCall';
import { Notepad } from '@/components/Notepad';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Phone, AlertTriangle } from 'lucide-react';
import concretioLogo from '@/assets/concretio-logo.png';
import { MdCode } from 'react-icons/md';

const Index = () => {
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<{
    status: 'Good' | 'Bad';
    packetLoss: number;
  } | null>(null);

  const videoCallRef = useRef<{
    joinCall: () => void;
    leaveCall: () => void;
  }>(null);

  const handleJoinCall = () => {
    videoCallRef.current?.joinCall();
  };

  const handleLeaveCall = () => {
    videoCallRef.current?.leaveCall();
  };

  const handleForceRefresh = () => {
    // Remove event listeners to allow refresh
    window.removeEventListener('beforeunload', () => {});
    // Clear any data if needed
    localStorage.removeItem('notepad-content');
    localStorage.removeItem('notepad-mode');
    // Force refresh
    window.location.reload();
  };

  // Add beforeunload event listener and keyboard shortcuts to warn users about data loss
  useEffect(() => {
    const hasImportantData = () => {
      // Check if there's any data that would be lost
      const hasRoomData = isJoined || roomUrl.trim() !== '';
      const hasNotepadData = isNotepadOpen;
      // Check if there's saved content in localStorage
      const savedContent = localStorage.getItem('notepad-content');
      const hasNotepadContent = savedContent && savedContent !== '// You can write code or take notes here' && savedContent.trim() !== '';
      
      return hasRoomData || hasNotepadData || hasNotepadContent;
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasImportantData()) {
        const message = 'Are you sure you want to leave? All your data (call session, room URL, and code notes) will be lost.';
        event.preventDefault();
        event.returnValue = message; // For older browsers
        return message;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+R (refresh) or F5 (refresh)
      if ((event.ctrlKey && event.key === 'r') || event.key === 'F5') {
        if (hasImportantData()) {
          event.preventDefault();
          setShowLeaveWarning(true);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isJoined, roomUrl, isNotepadOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={concretioLogo} alt="Concret.io" className="h-8" />
            <h1 className="text-xl font-bold text-foreground">Concretio Meet</h1>
          </div>

          {!isJoined && (
            <div className="flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-3">
                <Input
                  placeholder="Enter Daily.co room URL..."
                  value={roomUrl}
                  onChange={(e) => setRoomUrl(e.target.value)}
                  className="w-80 max-w-md border-primary focus:border-primary focus:ring-primary placeholder:text-white"
                />
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
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {isJoined && networkStatus && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-md">
                <div
                  className={`w-2 h-2 rounded-full ${
                    networkStatus.status === 'Good' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  Network: {networkStatus.status}
                </span>
              </div>
            )}
            <Button
              variant={isNotepadOpen ? 'default' : 'secondary'}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1 h-full">
          {/* Video Call Panel */}
          <ResizablePanel defaultSize={isNotepadOpen ? 70 : 100} minSize={30}>
            <div className="h-full w-full p-6">
              <VideoCall
                ref={videoCallRef}
                roomUrl={roomUrl}
                onJoinedChange={setIsJoined}
                isJoined={isJoined}
                onLeaveCall={handleLeaveCall}
                onNetworkStatsChange={setNetworkStatus}
              />
            </div>
          </ResizablePanel>

          {/* Handle */}
          {isNotepadOpen && <ResizableHandle withHandle />}

          {/* Notepad Panel */}
          {isNotepadOpen && (
            <ResizablePanel defaultSize={30} minSize={20} maxSize={60}>
              <div className="h-full w-full">
                <Notepad
                  isOpen={isNotepadOpen}
                  onClose={() => setIsNotepadOpen(false)}
                />
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Leave Warning Dialog */}
      <AlertDialog open={showLeaveWarning} onOpenChange={setShowLeaveWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Are you sure you want to leave?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Refreshing or leaving this page will result in the loss of all your data including:
              <ul className="list-disc list-inside mt-2 space-y-1">
                {isJoined && <li>Current video call session</li>}
                {roomUrl && <li>Room URL information</li>}
                {(isNotepadOpen || localStorage.getItem('notepad-content')) && <li>All code notes and content</li>}
                <li>Any unsaved work</li>
              </ul>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Stay on Page
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleForceRefresh}
            >
              Leave Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
