import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { themeStore } from "@/lib/theme-store";
import { globalSettingsStore } from "@/lib/settings-store";
import { contentStore } from "@/lib/content-store";
import NavigationDynamic from "@/components/navigation-dynamic";
import Footer from "@/components/footer";
import WhatsAppFloat from "@/components/whatsapp-float";
import HomeDynamic from "@/pages/home-dynamic";
import About from "@/pages/about";
import Programs from "@/pages/programs";
import Projects from "@/pages/projects";
import Publications from "@/pages/publications";
import Resources from "@/pages/resources";
import Contact from "@/pages/contact";
import Join from "@/pages/join";
import Webinars from "@/pages/webinars";
import FeedbackPage from "@/pages/feedback";
import NotFound from "@/pages/not-found";

// Auth Components
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import ForgotPassword from "@/pages/auth/forgot-password";

// Mentee Components
import MenteeDashboard from "@/pages/mentee/dashboard";

// Admin Components
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import PageEditorFunctional from "@/pages/admin/page-editor-functional";
import MediaLibrary from "@/pages/admin/media-library";
import AdminProjects from "@/pages/admin/projects";
import WebinarManagement from "@/pages/admin/webinars";
import UserManagement from "@/pages/admin/users";
import Feedback from "@/pages/admin/feedback";
import Analytics from "@/pages/admin/analytics";
import Settings from "@/pages/admin/settings";

// Admin redirect component
function AdminRedirect() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation("/admin/dashboard");
  }, [setLocation]);
  
  return <div>Redirecting...</div>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>
      <NavigationDynamic />
      <main className="flex-1 main-content" style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Initialize theme and settings on app load
  useEffect(() => {
    const initializeApp = async () => {
      console.log('App: Initializing application...');
      
      // Initialize global settings first
      try {
        await globalSettingsStore.initialize();
        console.log('App: Global settings initialized');
      } catch (error) {
        console.error('App: Failed to initialize global settings:', error);
      }
      
      // Initialize content store
      try {
        await contentStore.initialize();
        console.log('App: Content store initialized');
      } catch (error) {
        console.error('App: Failed to initialize content store:', error);
      }
      
      // Initialize theme
      themeStore.initializeTheme();
      
      // Only apply Deep Navy Blue theme to public pages, not admin pages
      if (!window.location.pathname.startsWith('/admin')) {
        themeStore.applyDeepNavyTheme();
      } else {
        // Preserve admin styling
        themeStore.preserveAdminStyling();
      }
      
      console.log('App: Application initialization complete');
    };

    initializeApp();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Mentee Routes (no navigation/footer) */}
          <Route path="/mentee/dashboard" component={MenteeDashboard} />
          
          {/* Admin Routes (no navigation/footer) */}
          <Route path="/admin" component={AdminRedirect} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/page-editor" component={PageEditorFunctional} />
          <Route path="/admin/media-library" component={MediaLibrary} />
          <Route path="/admin/projects" component={AdminProjects} />
          <Route path="/admin/webinars" component={WebinarManagement} />
          <Route path="/admin/users" component={UserManagement} />
          <Route path="/admin/feedback" component={Feedback} />
          <Route path="/admin/analytics" component={Analytics} />
          <Route path="/admin/settings" component={Settings} />
          
          {/* Public Routes (with navigation/footer) - includes auth pages */}
          <Route>
            <PublicLayout>
              <Switch>
                <Route path="/" component={HomeDynamic} />
                <Route path="/about" component={About} />
                <Route path="/programs" component={Programs} />
                <Route path="/projects" component={Projects} />
                <Route path="/publications" component={Publications} />
                <Route path="/resources" component={Resources} />
                <Route path="/contact" component={Contact} />
                <Route path="/join" component={Join} />
                <Route path="/webinars" component={Webinars} />
                <Route path="/feedback" component={FeedbackPage} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/auth/login" component={Login} />
                <Route path="/auth/register" component={Register} />
                <Route path="/auth/forgot-password" component={ForgotPassword} />
                <Route component={NotFound} />
              </Switch>
            </PublicLayout>
          </Route>
        </Switch>
        
        {/* WhatsApp Float Button - appears on all pages */}
        <WhatsAppFloat phoneNumber="447377924476" />
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
