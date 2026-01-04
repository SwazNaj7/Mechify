'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function CompleteProfilePage() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const router = useRouter();

  // Load user's display name from auth metadata
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.user_metadata?.full_name || user?.user_metadata?.name) {
        setDisplayName(user.user_metadata.full_name || user.user_metadata.name);
      }
    };
    loadUser();
  }, []);

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      const supabase = createClient();
      
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();
      
      setUsernameAvailable(!data);
      setIsCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    if (!usernameAvailable) {
      toast.error('Username is not available');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Not authenticated');
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.toLowerCase(),
          full_name: displayName || username,
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') {
          toast.error('Username already taken');
        } else {
          toast.error(error.message);
        }
        return;
      }

      toast.success('Profile completed!');
      router.push('/dashboard');
      router.refresh();
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUsername = (value: string) => {
    return /^[a-zA-Z0-9_]+$/.test(value);
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-lg space-y-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="space-y-1 p-6 pb-4">
              <CardTitle className="text-2xl text-center">Complete Your Profile</CardTitle>
              <CardDescription className="text-center">
                Choose a username to identify yourself
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5 px-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    This is how your name will appear to others
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="trader_pro"
                      value={username}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
                        setUsername(value);
                      }}
                      required
                      minLength={3}
                      maxLength={20}
                      className="bg-background/50 pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isCheckingUsername && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                      )}
                      {!isCheckingUsername && usernameAvailable === true && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                      {!isCheckingUsername && usernameAvailable === false && (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    3-20 characters, letters, numbers, and underscores only
                  </p>
                  {username && !isValidUsername(username) && (
                    <p className="text-xs text-red-500">
                      Invalid characters in username
                    </p>
                  )}
                  {usernameAvailable === false && (
                    <p className="text-xs text-red-500">
                      This username is already taken
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !usernameAvailable || !username}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Complete Profile
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AuroraBackground>
  );
}
