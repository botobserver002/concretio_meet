import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Download, Trash2, Code, FileText } from 'lucide-react';

interface NotepadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Notepad = ({ isOpen, onClose }: NotepadProps) => {
  const [content, setContent] = useState('// Welcome to your notepad!\n// You can write code or take notes here\n\nfunction helloWorld() {\n  console.log("Hello from your video call!");\n}\n\n// Meeting Notes:\n// - \n// - \n// - ');
  const [mode, setMode] = useState<'code' | 'notes'>('code');

  const saveContent = () => {
    localStorage.setItem('notepad-content', content);
    localStorage.setItem('notepad-mode', mode);
  };

  const downloadContent = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode === 'code' ? 'code' : 'notes'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearContent = () => {
    setContent('');
  };

  if (!isOpen) return null;

  return (
    <div className="h-full bg-notepad-bg border-l border-border flex flex-col animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-foreground">Notepad</h3>
            <div className="flex items-center space-x-1">
              <Button
                variant={mode === 'code' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setMode('code')}
              >
                <Code className="w-3 h-3 mr-1" />
                Code
              </Button>
              <Button
                variant={mode === 'notes' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setMode('notes')}
              >
                <FileText className="w-3 h-3 mr-1" />
                Notes
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={mode === 'code' ? 'Write your code here...' : 'Take your notes here...'}
          className="w-full h-full resize-none bg-background border-border font-mono text-sm focus:ring-code-highlight"
          style={{ minHeight: '500px' }}
        />
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {content.split('\n').length} lines • {content.length} characters
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={clearContent}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={saveContent}>
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="default" size="sm" onClick={downloadContent}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};