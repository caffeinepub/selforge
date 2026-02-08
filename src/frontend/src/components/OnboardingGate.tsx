import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../lib/store';
import { Sparkles } from 'lucide-react';

export default function OnboardingGate() {
  const {
    setUserName,
    setDeepseekApiKey,
    setNutritionixAppId,
    setNutritionixAppKey,
    setApiNinjasKey,
    completeOnboarding,
  } = useAppStore();

  const [name, setName] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [nutritionixId, setNutritionixId] = useState('');
  const [nutritionixKey, setNutritionixKey] = useState('');
  const [ninjasKey, setNinjasKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // Validate all fields
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!deepseekKey.trim()) {
      setError('Please enter your DeepSeek API key');
      return;
    }
    if (!nutritionixId.trim()) {
      setError('Please enter your Nutritionix App ID');
      return;
    }
    if (!nutritionixKey.trim()) {
      setError('Please enter your Nutritionix App Key');
      return;
    }
    if (!ninjasKey.trim()) {
      setError('Please enter your API Ninjas key');
      return;
    }

    // Save all values
    setUserName(name.trim());
    setDeepseekApiKey(deepseekKey.trim());
    setNutritionixAppId(nutritionixId.trim());
    setNutritionixAppKey(nutritionixKey.trim());
    setApiNinjasKey(ninjasKey.trim());
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
            <CardTitle className="text-2xl font-bold">Welcome to Selforge</CardTitle>
            <CardDescription className="text-muted-foreground">
              Let's get you set up. Please provide your name and API credentials to continue.
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
                className="bg-black border-border-subtle"
              />
            </div>

            {/* DeepSeek API Key */}
            <div className="space-y-2">
              <Label htmlFor="deepseek" className="text-sm font-medium">
                DeepSeek API Key
              </Label>
              <Input
                id="deepseek"
                type="password"
                placeholder="sk-..."
                value={deepseekKey}
                onChange={(e) => setDeepseekKey(e.target.value)}
                className="bg-black border-border-subtle"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{' '}
                <a
                  href="https://platform.deepseek.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-green hover:underline"
                >
                  platform.deepseek.com
                </a>
              </p>
            </div>

            {/* Nutritionix App ID */}
            <div className="space-y-2">
              <Label htmlFor="nutritionix-id" className="text-sm font-medium">
                Nutritionix App ID
              </Label>
              <Input
                id="nutritionix-id"
                type="text"
                placeholder="Your Nutritionix App ID"
                value={nutritionixId}
                onChange={(e) => setNutritionixId(e.target.value)}
                className="bg-black border-border-subtle"
              />
            </div>

            {/* Nutritionix App Key */}
            <div className="space-y-2">
              <Label htmlFor="nutritionix-key" className="text-sm font-medium">
                Nutritionix App Key
              </Label>
              <Input
                id="nutritionix-key"
                type="password"
                placeholder="Your Nutritionix App Key"
                value={nutritionixKey}
                onChange={(e) => setNutritionixKey(e.target.value)}
                className="bg-black border-border-subtle"
              />
              <p className="text-xs text-muted-foreground">
                Get your credentials from{' '}
                <a
                  href="https://www.nutritionix.com/business/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-green hover:underline"
                >
                  nutritionix.com
                </a>
              </p>
            </div>

            {/* API Ninjas Key */}
            <div className="space-y-2">
              <Label htmlFor="ninjas" className="text-sm font-medium">
                API Ninjas Key
              </Label>
              <Input
                id="ninjas"
                type="password"
                placeholder="Your API Ninjas key"
                value={ninjasKey}
                onChange={(e) => setNinjasKey(e.target.value)}
                className="bg-black border-border-subtle"
              />
              <p className="text-xs text-muted-foreground">
                Get your key from{' '}
                <a
                  href="https://api-ninjas.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-green hover:underline"
                >
                  api-ninjas.com
                </a>
              </p>
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
