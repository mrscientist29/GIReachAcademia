import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Settings, 
  Image, 
  FileText, 
  Users, 
  MessageSquare, 
  BarChart3,
  Video,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

export default function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");
    
    if (!token || token !== "authenticated") {
      setLocation("/admin/login");
      return;
    }
    
    if (user) {
      setAdminUser(JSON.parse(user));
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from admin panel.",
    });
    setLocation("/admin/login");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
    { id: "page-editor", label: "Page Editor", icon: FileText, path: "/admin/page-editor" },
    { id: "media-library", label: "Media Library", icon: Image, path: "/admin/media-library" },
    { id: "projects", label: "Projects", icon: FileText, path: "/admin/projects" },
    { id: "webinars", label: "Webinars", icon: Video, path: "/admin/webinars" },
    { id: "users", label: "User Management", icon: Users, path: "/admin/users" },
    { id: "feedback", label: "Feedback", icon: MessageSquare, path: "/admin/feedback" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  if (!adminUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex admin-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 admin-sidebar ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-gray-600">GI REACH</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || 
                (currentPage === 'dashboard' && item.id === 'dashboard') ||
                window.location.pathname === item.path;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setLocation(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 admin-main">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 admin-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {currentPage === 'dashboard' ? 'Dashboard Overview' : 
                   currentPage === 'page-editor' ? 'Page Editor' :
                   currentPage === 'media-library' ? 'Media Library' :
                   currentPage === 'projects' ? 'Project Management' :
                   currentPage === 'webinars' ? 'Webinar Management' :
                   currentPage?.replace('-', ' ') || 'Admin Panel'}
                </h1>
                <p className="text-gray-600">Manage your GI REACH website</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                  <p className="text-xs text-gray-600">{adminUser.role}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}