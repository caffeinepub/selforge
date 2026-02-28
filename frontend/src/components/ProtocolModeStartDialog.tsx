import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert } from 'lucide-react';

interface ProtocolModeStartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (subject: string, topic: string) => void;
}

export default function ProtocolModeStartDialog({ open, onOpenChange, onStart }: ProtocolModeStartDialogProps) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');

  const handleStart = () => {
    if (subject.trim() && topic.trim()) {
      onStart(subject.trim(), topic.trim());
      setSubject('');
      setTopic('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border border-[#7B00FF]/60 max-w-sm shadow-[0_0_30px_#7B00FF30]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#7B00FF]" />
            <DialogTitle className="text-[#7B00FF] tracking-widest uppercase text-sm">Protocol Mode</DialogTitle>
          </div>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            Full-focus lockdown environment. All distractions suppressed.
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="pm-subject" className="text-white/60 text-xs uppercase tracking-widest">Subject</Label>
            <Input
              id="pm-subject"
              placeholder="e.g. Mathematics"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white/5 border-[#7B00FF]/30 text-white placeholder:text-white/20 focus:border-[#7B00FF] focus:ring-[#7B00FF]/20"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pm-topic" className="text-white/60 text-xs uppercase tracking-widest">Topic</Label>
            <Input
              id="pm-topic"
              placeholder="e.g. Calculus — Integration"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-white/5 border-[#7B00FF]/30 text-white placeholder:text-white/20 focus:border-[#7B00FF] focus:ring-[#7B00FF]/20"
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 border-white/20 text-white/50 hover:text-white hover:border-white/40 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={!subject.trim() || !topic.trim()}
              className="flex-1 bg-[#7B00FF] hover:bg-[#7B00FF]/80 text-white border-0 shadow-[0_0_12px_#7B00FF60]"
            >
              Initiate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
