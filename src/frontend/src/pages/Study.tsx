import { useState } from 'react';
import { useAppStore } from '../lib/store';
import { Plus, Trash2, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function Study() {
  const { getTodayData, addStudyTopic, updateStudyTopic, deleteStudyTopic } = useAppStore();
  const todayData = getTodayData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newChapter, setNewChapter] = useState('');

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

  const doneTopics = todayData.studyTopics.filter((t) => t.status === 'done');
  const pendingTopics = todayData.studyTopics.filter((t) => t.status === 'pending');
  const laterTopics = todayData.studyTopics.filter((t) => t.status === 'later');

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Study</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-neon-green text-black hover:bg-neon-green/90 h-8">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card-dark border-border-subtle">
            <DialogHeader>
              <DialogTitle>Add Study Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g., English, Math"
                  className="bg-black border-border-subtle"
                />
              </div>
              <div>
                <Label htmlFor="chapter">Chapter/Topic</Label>
                <Input
                  id="chapter"
                  value={newChapter}
                  onChange={(e) => setNewChapter(e.target.value)}
                  placeholder="e.g., Chapter 2, Algebra"
                  className="bg-black border-border-subtle"
                />
              </div>
              <Button onClick={handleAddTopic} className="w-full bg-neon-green text-black hover:bg-neon-green/90">
                Add Topic
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Summary */}
      <Card className="bg-card-dark border-border-subtle">
        <CardContent className="card-compact">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-neon-green">{doneTopics.length}</div>
              <div className="text-[10px] text-muted-foreground">Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-yellow">{pendingTopics.length}</div>
              <div className="text-[10px] text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{laterTopics.length}</div>
              <div className="text-[10px] text-muted-foreground">Later</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Topics */}
      {pendingTopics.length > 0 && (
        <div className="space-y-2">
          <h2 className="section-title text-neon-yellow">To Do Today</h2>
          {pendingTopics.map((topic) => (
            <Card key={topic.id} className="bg-card-dark border-border-subtle">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{topic.subject}</h3>
                    <p className="text-xs text-muted-foreground">{topic.chapter}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkDone(topic.id)}
                      className="border-neon-green text-neon-green hover:bg-neon-green/20 h-7 w-7 p-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkLater(topic.id)}
                      className="border-border-subtle hover:bg-accent h-7 w-7 p-0"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteStudyTopic(topic.id)}
                      className="border-destructive text-destructive hover:bg-destructive/20 h-7 w-7 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Done Topics */}
      {doneTopics.length > 0 && (
        <div className="space-y-2">
          <h2 className="section-title text-neon-green">Completed</h2>
          {doneTopics.map((topic) => (
            <Card key={topic.id} className="bg-card-dark border-neon-green/30">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 opacity-70">
                    <h3 className="text-sm font-semibold line-through">{topic.subject}</h3>
                    <p className="text-xs text-muted-foreground line-through">{topic.chapter}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkDone(topic.id)}
                      className="border-neon-green bg-neon-green/20 text-neon-green h-7 w-7 p-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteStudyTopic(topic.id)}
                      className="border-destructive text-destructive hover:bg-destructive/20 h-7 w-7 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Later Topics */}
      {laterTopics.length > 0 && (
        <div className="space-y-2">
          <h2 className="section-title text-muted-foreground">For Later</h2>
          {laterTopics.map((topic) => (
            <Card key={topic.id} className="bg-card-dark border-border-subtle opacity-60">
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold">{topic.subject}</h3>
                    <p className="text-xs text-muted-foreground">{topic.chapter}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkLater(topic.id)}
                      className="border-border-subtle bg-accent h-7 w-7 p-0"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteStudyTopic(topic.id)}
                      className="border-destructive text-destructive hover:bg-destructive/20 h-7 w-7 p-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {todayData.studyTopics.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No study topics yet.</p>
          <p className="text-xs">Add your first topic to get started.</p>
        </div>
      )}
    </div>
  );
}
