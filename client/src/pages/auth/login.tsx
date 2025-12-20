import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { BookOpen, Stethoscope, Settings, FileText, Users, Heart, Award, Star, Zap, Shield, Target } from "lucide-react";
import { globalSettingsStore } from "@/lib/settings-store";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Icon mapping for logo icons
const iconMap = {
  Stethoscope,
  Settings,
  FileText,
  Users,
  Heart,
  Award,
  Star,
  Zap,
  Shield,
  Target,
  BookOpen
};

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoSettings, setLogoSettings] = useState({
    type: 'icon',
    iconName: 'Stethoscope',
    iconColor: 'text-white',
    iconBackground: 'bg-blue-600',
    primaryText: 'GI REACH',
    secondaryText: 'Academic Excellence',
    borderRadius: 'rounded-xl',
    showSecondaryText: true,
    imageWidth: 48,
    imageHeight: 48
  });

  // Load logo settings
  useEffect(() => {
    const loadLogoSettings = async () => {
      try {
        const settings = await globalSettingsStore.getSetting('logo');
        if (settings) {
          setLogoSettings({ ...logoSettings, ...settings });
        }
      } catch (error) {
        console.warn('Login: Failed to load logo settings:', error);
      }
    };

    loadLogoSettings();

    // Listen for logo updates
    const handleSettingsUpdate = (e: CustomEvent) => {
      if (e.detail.type === 'logo') {
        setLogoSettings({ ...logoSettings, ...e.detail.settings });
      }
    };

    window.addEventListener('globalSettingsUpdate', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('globalSettingsUpdate', handleSettingsUpdate as EventListener);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await authApi.login(email, password);

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        
        // Redirect based on user role
        if (result.data.user.role === 'admin') {
          setLocation('/admin/dashboard');
        } else {
          setLocation('/mentee/dashboard');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.message || 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your GI REACH account to continue your research journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={() => setLocation('/auth/register')}
              >
                Sign up here
              </Button>
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Demo Mode:</strong> Enter any email and password to login and explore the platform.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}