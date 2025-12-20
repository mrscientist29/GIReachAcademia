import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Stethoscope, Settings, FileText, Users, Heart, Award, Star, Zap, Shield, Target, LogIn, UserPlus, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { logoStore, type LogoSettings } from "@/lib/logo-store";
import { useToast } from "@/hooks/use-toast";
import { globalSettingsStore } from "@/lib/settings-store";
import { authApi, getUserData, isAuthenticated } from "@/lib/api";

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
  Target
};

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function NavigationDynamic() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [logoSettings, setLogoSettings] = useState<LogoSettings>({
    type: 'icon',
    iconName: 'Stethoscope',
    iconColor: 'text-white',
    iconBackground: 'bg-blue-600',
    primaryText: 'GI REACH',
    secondaryText: 'Academic Excellence',
    primaryTextColor: 'text-gray-900',
    secondaryTextColor: 'text-gray-600',
    fontSize: 'text-2xl',
    fontWeight: 'font-bold',
    borderRadius: 'rounded-xl',
    showSecondaryText: true,
    imageWidth: 48,
    imageHeight: 48
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/programs", label: "Programs" },
    { href: "/projects", label: "Projects" },
    { href: "/publications", label: "Publications" },
    { href: "/webinars", label: "Webinars" },
    { href: "/resources", label: "Resources" },
    { href: "/feedback", label: "Feedback" },
    { href: "/contact", label: "Contact" },
  ];

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const userData = getUserData();
        if (userData) {
          console.log('Navigation: User logged in:', userData);
          setUser(userData);
        } else {
          console.log('Navigation: No user data found');
          setUser(null);
        }
      } else {
        console.log('Navigation: No user logged in');
        setUser(null);
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userToken' || e.key === 'userData') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check periodically for auth changes
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Load logo settings on component mount and listen for changes
  useEffect(() => {
    const loadLogoSettings = async () => {
      try {
        // Always fetch from database via global settings store
        await globalSettingsStore.initialize();
        const settings = await globalSettingsStore.getSetting('logo');
        
        if (settings) {
          console.log('Navigation: Loading logo settings from database:', settings);
          setLogoSettings({ ...logoSettings, ...settings });
        } else {
          console.log('Navigation: No logo settings in database, using defaults');
          // Initialize default settings in database
          const defaultSettings = {
            type: 'icon',
            iconName: 'Stethoscope',
            iconColor: 'text-white',
            iconBackground: 'bg-blue-600',
            primaryText: 'GI REACH',
            secondaryText: 'Academic Excellence',
            primaryTextColor: 'text-gray-900',
            secondaryTextColor: 'text-gray-600',
            fontSize: 'text-2xl',
            fontWeight: 'font-bold',
            borderRadius: 'rounded-xl',
            showSecondaryText: true,
            imageWidth: 48,
            imageHeight: 48
          };
          setLogoSettings(defaultSettings);
          
          // Save defaults to database for future consistency
          try {
            await globalSettingsStore.saveSetting('logo', defaultSettings);
            console.log('Navigation: Default logo settings saved to database');
          } catch (error) {
            console.warn('Navigation: Failed to save default settings:', error);
          }
        }
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Navigation: Error loading logo settings:', error);
        // Keep current settings as fallback
      }
    };

    // Make loadLogoSettings globally accessible for debugging
    (window as any).forceLogoRefresh = loadLogoSettings;
    
    // Add debug logging for mobile
    console.log('Navigation: Component mounted, user agent:', navigator.userAgent);
    console.log('Navigation: Current location:', window.location.href);

    // Initial load
    loadLogoSettings();

    // Listen for global settings updates
    const handleSettingsUpdate = (e: CustomEvent) => {
      console.log('Navigation: Global settings update received:', e.detail);
      if (e.detail.type === 'logo') {
        setLogoSettings({ ...logoSettings, ...e.detail.settings });
        setRefreshKey(prev => prev + 1);
      }
    };

    // Listen for settings initialization
    const handleSettingsInitialized = (e: CustomEvent) => {
      console.log('Navigation: Settings initialized:', e.detail);
      if (e.detail.settings.logo) {
        setLogoSettings({ ...logoSettings, ...e.detail.settings.logo });
        setRefreshKey(prev => prev + 1);
      }
    };

    // Listen for specific setting updates
    const handleSettingUpdate = (e: CustomEvent) => {
      console.log('Navigation: Setting update received:', e.detail);
      if (e.detail.key === 'logo') {
        setLogoSettings({ ...logoSettings, ...e.detail.value });
        setRefreshKey(prev => prev + 1);
      }
    };

    // Listen for page visibility changes (mobile app switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Navigation: Page became visible, refreshing settings...');
        loadLogoSettings();
      }
    };

    // Listen for window focus (tab switching)
    const handleFocus = () => {
      console.log('Navigation: Window focused, refreshing settings...');
      loadLogoSettings();
    };

    window.addEventListener('globalSettingsUpdate', handleSettingsUpdate as EventListener);
    window.addEventListener('settingsInitialized', handleSettingsInitialized as EventListener);
    window.addEventListener('settingUpdated', handleSettingUpdate as EventListener);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('globalSettingsUpdate', handleSettingsUpdate as EventListener);
      window.removeEventListener('settingsInitialized', handleSettingsInitialized as EventListener);
      window.removeEventListener('settingUpdated', handleSettingUpdate as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const closeSheet = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out. See you next time!",
      });
      setUser(null);
      setLocation("/");
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      toast({
        title: "Logged out",
        description: "You have been logged out.",
      });
      setUser(null);
      setLocation("/");
    }
  };

  const handleDashboard = () => {
    setLocation("/mentee/dashboard");
  };

  // Temporary: Clear any existing session on component mount for testing
  useEffect(() => {
    // Uncomment these lines to force logout for testing
    // localStorage.removeItem("userToken");
    // localStorage.removeItem("userData");
    // setUser(null);
  }, []);

  const renderLogo = (isMobile = false) => {
    const sizeClasses = isMobile ? "w-10 h-10" : "w-12 h-12";
    const textSizeClasses = isMobile ? "text-lg" : logoSettings.fontSize || "text-2xl";
    
    return (
      <div className="flex items-center space-x-3">
        {/* Logo Icon/Image */}
        {logoSettings.type === 'icon' && (
          <div className={`${sizeClasses} ${logoSettings.iconBackground || 'bg-blue-600'} ${logoSettings.borderRadius || 'rounded-xl'} flex items-center justify-center`}>
            {(() => {
              const IconComponent = iconMap[logoSettings.iconName as keyof typeof iconMap] || Stethoscope;
              return <IconComponent className={`${isMobile ? 'h-5 w-5' : 'h-7 w-7'} ${logoSettings.iconColor || 'text-white'}`} />;
            })()}
          </div>
        )}
        
        {logoSettings.type === 'image' && logoSettings.imageUrl && (
          <img 
            src={logoSettings.imageUrl} 
            alt="Logo"
            className={`${sizeClasses} object-cover ${logoSettings.borderRadius || 'rounded-xl'}`}
            style={{
              width: logoSettings.imageWidth || 48,
              height: logoSettings.imageHeight || 48
            }}
          />
        )}
        
        {logoSettings.type === 'text' && (
          <div className={`${sizeClasses} ${logoSettings.iconBackground || 'bg-blue-600'} ${logoSettings.borderRadius || 'rounded-xl'} flex items-center justify-center`}>
            <span className={`${logoSettings.fontWeight || 'font-bold'} ${logoSettings.iconColor || 'text-white'} text-lg`}>
              {logoSettings.primaryText.charAt(0)}
            </span>
          </div>
        )}

        {/* Logo Text */}
        <div>
          <h1 className={`${textSizeClasses} ${logoSettings.fontWeight || 'font-bold'} ${logoSettings.primaryTextColor || 'text-gray-900'}`}>
            {logoSettings.primaryText}
          </h1>
          {logoSettings.showSecondaryText && logoSettings.secondaryText && (
            <p className={`text-sm ${logoSettings.secondaryTextColor || 'text-gray-600'}`}>
              {logoSettings.secondaryText}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl overflow-x-hidden" data-testid="navigation" style={{ backgroundColor: 'rgba(30, 58, 138, 0.95)', color: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 min-w-0">
          {/* Logo Section - Fixed Width */}
          <div className="flex-shrink-0 w-[120px] xl:w-[140px]">
            <Link href="/" data-testid="logo-link">
              {renderLogo(false)}
            </Link>
            {/* Debug button for development */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => {
                  console.log('Debug: Force refreshing logo...');
                  (window as any).forceLogoRefresh?.();
                }}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded mt-1"
                style={{ fontSize: '10px' }}
              >
                🔄
              </button>
            )}
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center px-2">
            <div className="flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  <span
                    className={`px-1 xl:px-2 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${
                      location === item.href
                        ? "text-cyan-300 bg-white/20 shadow-lg backdrop-blur-sm"
                        : "text-white hover:text-cyan-300 hover:bg-white/10 hover:shadow-md"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Authentication Section - Right Side */}
          <div className="hidden lg:flex flex-shrink-0 min-w-[160px] xl:min-w-[180px] justify-end">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {user.firstName ? user.firstName.charAt(0) : user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden xl:block">
                    <p className="text-sm font-medium text-white">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user.email}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={handleDashboard}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-cyan-300 hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Dashboard
                </Button>
                
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-cyan-300 hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Link href="/login" data-testid="nav-link-login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-cyan-300 hover:bg-white/10 px-2 py-2 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap text-xs xl:text-sm"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </Button>
                </Link>
                
                <Link href="/register" data-testid="nav-link-signup">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-3 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap text-xs xl:text-sm"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2" data-testid="mobile-menu-button">
                  <Menu className="h-6 w-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center space-x-3 pb-6 border-b border-gray-200">
                    {renderLogo(true)}
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeSheet}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                    >
                      <span
                        className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                          location === item.href
                            ? "text-cyan-400 bg-blue-800"
                            : "text-white hover:text-cyan-400 hover:bg-blue-800"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  
                  {/* Mobile Authentication Buttons */}
                  {user ? (
                    <div className="space-y-4 pt-4 border-t border-blue-700">
                      <div className="flex items-center space-x-3 px-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-600 text-white">
                            {user.firstName ? user.firstName.charAt(0) : user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.firstName && user.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user.email}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => {
                          handleDashboard();
                          closeSheet();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                      >
                        Dashboard
                      </Button>
                      
                      <Button
                        onClick={() => {
                          handleLogout();
                          closeSheet();
                        }}
                        variant="outline"
                        className="w-full border-blue-600 text-white hover:bg-blue-700 py-3 rounded-lg font-semibold"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-4 border-t border-blue-700">
                      <Link href="/login" onClick={closeSheet} data-testid="mobile-nav-link-login">
                        <Button
                          variant="outline"
                          className="w-full border-blue-600 text-white hover:bg-blue-700 py-3 rounded-lg font-semibold"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      
                      <Link href="/register" onClick={closeSheet} data-testid="mobile-nav-link-signup">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}