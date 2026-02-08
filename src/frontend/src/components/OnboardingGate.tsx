import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../lib/store';
import { Sparkles } from 'lucide-react';

export default function OnboardingGate() {
  const { setUserName, completeOnboarding } = useAppStore();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validate required field
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Save name and complete onboarding
    setUserName(name.trim());
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card-dark border-border-subtle">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center border-2 border-neon-green">
                <Sparkles className="w-8 h-8 text-neon-green" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to Nuvio</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your name to get started with your self-improvement journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="bg-black border-border-subtle"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-semibold"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
