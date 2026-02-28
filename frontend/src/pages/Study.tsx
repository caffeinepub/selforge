import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Plus, Trash2, Check, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import ProtocolModeStartDialog from '../components/ProtocolModeStartDialog';
import ProtocolMode from './ProtocolMode';

export default function Study() {
  const { getTodayData, addStudyTopic, updateStudyTopic, deleteStudyTopic, oledMode } = useAppStore();
  const todayData = getTodayData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [isProtocolDialogOpen, setIsProtocolDialogOpen] = useState(false);
  const [protocolActive, setProtocolActive] = useState(false);
  const [protocolSubject, setProtocolSubject] = useState('');
  const [protocolTopic, setProtocolTopic] = useState('');

  const handleAddTopic = () => {
    if (newSubject.trim() && newChapter.trim()) {
      addStudyTopic({
        subject: newSubject.trim(),
        chapter: newChapter.trim(),
        status: 'pending',
      });
      setNewSubject('');
      setNewChapter('');
      setIsAddDialogOpen(false);
    }
  };

  const handleMarkDone = (id: string) => {
    const topic = todayData.studyTopics.find((t) => t.id === id);
    if (topic) {
      updateStudyTopic(id, { status: topic.status === 'done' ? 'pending' : 'done' });
    }
  };

  const handleMarkLater = (id: string) => {
    const topic = todayData.studyTopics.find((t) => t.id === id);
    if (topic) {
      updateStudyTopic(id, { status: topic.status === 'later' ? 'pending' : 'later' });
    }
  };

  const handleProtocolStart = (subject: string, topic: string) => {
    setProtocolSubject(subject);
    setProtocolTopic(topic);
    setProtocolActive(true);
  };

  const handleProtocolExit = () => {
    setProtocolActive(false);
    setProtocolSubject('');
    setProtocolTopic('');
  };

  const doneTopics = todayData.studyTopics.filter((t) => t.status === 'done');
  const pendingTopics = todayData.studyTopics.filter((t) => t.status === 'pending');
  const laterTopics = todayData.studyTopics.filter((t) => t.status === 'later');

  // OLED border style for study (Electric Violet)
  const oledCardClass = oledMode
    ? 'border-[#7B00FF] shadow-[0_0_8px_#7B00FF60,inset_0_0_4px_#7B00FF10]'
    : 'border-border-subtle';

  // Protocol Mode overlay
  if (protocolActive) {
    return (
      <ProtocolMode
        subject={protocolSubject}
        topic={protocolTopic}
        onExit={handleProtocolExit}
      />
    );
  }

  return (
    <div className={`page-container ${oledMode ? 'bg-black' : ''}`}>
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="heading-1">Study</h1>
        <div className="flex items-center gap-2">
          {/* Protocol Mode button */}
          <button
            onClick={() => setIsProtocolDialogOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#7B00FF]/50 bg-[#7B00FF]/10 text-[#7B00FF] text-[10px] font-semibold tracking-widest uppercase hover:bg-[#7B00FF]/20 hover:border-[#7B00FF] transition-all duration-200"
            style={{ boxShadow: '0 0 8px #7B00FF30' }}
          >
            <ShieldAlert className="w-3 h-3" />
            Protocol
          </button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/90 h-8">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className={`max-w-md ${oledMode ? 'bg-black border-[#7B00FF]/60' : 'bg-card-dark border-border-subtle'}`}>
              <DialogHeader>
                <DialogTitle className="text-neon-green">Add Study Topic</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-gray-300">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Mathematics"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className={`${oledMode ? 'bg-black border-[#7B00FF]/30' : 'bg-black border-border-subtle'}`}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter" className="text-gray-300">Topic / Chapter</Label>
                  <Input
                    id="chapter"
                    placeholder="e.g. Chapter 5 - Integration"
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    className={`${oledMode ? 'bg-black border-[#7B00FF]/30' : 'bg-black border-border-subtle'}`}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTopic}
                    disabled={!newSubject.trim() || !newChapter.trim()}
                    className="flex-1 bg-neon-green text-black hover:bg-neon-green/90"
                  >
                    Add Topic
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Protocol Mode Start Dialog */}
      <ProtocolModeStartDialog
        open={isProtocolDialogOpen}
        onOpenChange={setIsProtocolDialogOpen}
        onStart={handleProtocolStart}
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Done', value: doneTopics.length, color: 'text-neon-green' },
          { label: 'Pending', value: pendingTopics.length, color: 'text-neon-yellow' },
          { label: 'Later', value: laterTopics.length, color: 'text-white/50' },
        ].map((stat) => (
          <Card key={stat.label} className={`${oledMode ? 'bg-black' : 'bg-card-dark'} ${oledCardClass}`}>
            <CardContent className="pt-3 pb-3 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Topics */}
      {pendingTopics.length > 0 && (
        <div className="space-y-2">
          <h2 className="heading-2 text-white/70">Pending</h2>
          {pendingTopics.map((topic) => (
            <Card key={topic.id} className={`${oledMode ? 'bg-black' : 'bg-card-dark'} ${oledCardClass} transition-colors duration-200`}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex gap-1.5 mt-0.5 flex-shrink-0">
                    <button
                      onClick={() => handleMarkDone(topic.id)}
                      className="w-5 h-5 rounded border border-border-subtle/60 flex items-center justify-center hover:border-neon-green/60 hover:bg-neon-green/10 transition-colors"
                    >
                      <Check className="w-3 h-3 text-neon-green opacity-40" />
                    </button>
                    <button
                      onClick={() => handleMarkLater(topic.id)}
                      className="w-5 h-5 rounded border border-border-subtle/60 flex items-center justify-center hover:border-neon-yellow/60 hover:bg-neon-yellow/10 transition-colors"
                    >
                      <Clock className="w-3 h-3 text-neon-yellow opacity-40" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="heading-3 text-white truncate">{topic.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">{topic.chapter}</p>
                  </div>
                  <button
                    onClick={() => deleteStudyTopic(topic.id)}
                    className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Done Topics */}
      {doneTopics.length > 0 && (
        <div className="space-y-2">
          <h2 className="heading-2 text-white/70">Completed</h2>
          {doneTopics.map((topic) => (
            <Card key={topic.id} className={`${oledMode ? 'bg-black' : 'bg-card-dark'} ${oledCardClass} opacity-70`}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleMarkDone(topic.id)}
                    className="w-5 h-5 rounded border border-neon-green/60 bg-neon-green/20 flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <Check className="w-3 h-3 text-neon-green" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="heading-3 text-white/60 line-through truncate">{topic.subject}</p>
                    <p className="text-xs text-muted-foreground/60 truncate">{topic.chapter}</p>
                  </div>
                  <button
                    onClick={() => deleteStudyTopic(topic.id)}
                    className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Later Topics */}
      {laterTopics.length > 0 && (
        <div className="space-y-2">
          <h2 className="heading-2 text-white/70">Later</h2>
          {laterTopics.map((topic) => (
            <Card key={topic.id} className={`${oledMode ? 'bg-black' : 'bg-card-dark'} ${oledCardClass} opacity-60`}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleMarkLater(topic.id)}
                    className="w-5 h-5 rounded border border-neon-yellow/60 bg-neon-yellow/10 flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <Clock className="w-3 h-3 text-neon-yellow" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="heading-3 text-white/50 truncate">{topic.subject}</p>
                    <p className="text-xs text-muted-foreground/50 truncate">{topic.chapter}</p>
                  </div>
                  <button
                    onClick={() => deleteStudyTopic(topic.id)}
                    className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {todayData.studyTopics.length === 0 && (
        <Card className={`${oledMode ? 'bg-black' : 'bg-card-dark'} ${oledCardClass}`}>
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-muted-foreground text-sm">No topics added yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Tap + to add your first study topic</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
