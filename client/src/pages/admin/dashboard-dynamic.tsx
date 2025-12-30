import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin-layout";
import { analyticsStore, type AnalyticsData } from "@/lib/analytics-store";
import { 
  Edit,
  Image,
  Plus,
  Eye,
  Trash2,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  RefreshCw,
  Activity,
  Globe,
  HardDrive,
  Clock,
  Zap
} from "lucide-react";

function DashboardContent() {
  const [, setLocation] = useLocation();
  const [dashboardData, setDashboardData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      await analyticsStore.initialize();
      const data = await analyticsStore.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Dashboard: Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      await analyticsStore.refreshData();
      const data = await analyticsStore.getDashboardData();
      setDashboardData(data);
      
      // Log refresh activity
      analyticsStore.logActivity({
        action: 'Dashboard data refreshed',
        user: 'Admin',
        type: 'system'
      });
    } catch (error) {
      console.error('Dashboard: Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const navigateToPage = (page: string) => {
    // Log navigation activity
    analyticsStore.logActivity({
      action: `Navigated to ${page}`,
      user: 'Admin',
      type: 'system'
    });
    setLocation(`/admin/${page}`);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentActivity, systemInfo, trends } = dashboardData;

  const mainStats = [
    { 
      label: "Total Users", 
      value: stats.totalUsers.toLocaleString(), 
      change: trends.usersGrowth, 
      color: "blue", 
      icon: Users 
    },
    { 
      label: "Publications", 
      value: stats.totalPublications.toLocaleString(), 
      change: trends.publicationsGrowth, 
      color: "green", 
      icon: FileText 
    },
    { 
      label: "Active Programs", 
      value: stats.activePrograms.toLocaleString(), 
      change: trends.programsGrowth, 
      color: "purple", 
      icon: Settings 
    },
    { 
      label: "Feedback", 
      value: stats.totalFeedback.toLocaleString(), 
      change: trends.feedbackGrowth, 
      color: "orange", 
      icon: MessageSquare 
    },
  ];

  const additionalStats = [
    { label: "Media Files", value: stats.mediaFiles.toLocaleString(), icon: Image },
    { label: "Page Views", value: stats.pageViews.toLocaleString(), icon: Eye },
    { label: "Unique Visitors", value: stats.uniqueVisitors.toLocaleString(), icon: Users },
    { label: "Bounce Rate", value: `${stats.bounceRate}%`, icon: TrendingDown },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600">Real-time insights and analytics for your website</p>
          </div>
          <Button 
            onClick={refreshData} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            
            return (
              <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendIcon className={`h-4 w-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{stat.change}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Stats */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Website Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {additionalStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigateToPage("page-editor")}
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 h-auto flex-col space-y-3"
              >
                <Edit className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Edit Pages</div>
                  <div className="text-sm opacity-90">Manage website content</div>
                </div>
              </Button>
              <Button 
                onClick={() => navigateToPage("media-library")}
                variant="outline" 
                className="p-6 h-auto flex-col space-y-3 hover:bg-gray-50"
              >
                <Image className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">Manage Media</div>
                  <div className="text-sm text-gray-600">Upload and organize files</div>
                </div>
              </Button>
              <Button 
                onClick={() => navigateToPage("analytics")}
                variant="outline" 
                className="p-6 h-auto flex-col space-y-3 hover:bg-gray-50"
              >
                <BarChart3 className="h-8 w-8" />
                <div className="text-center">
                  <div className="font-semibold">View Analytics</div>
                  <div className="text-sm text-gray-600">Detailed insights</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigateToPage("analytics")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => {
                    const getActivityIcon = (type: string) => {
                      switch (type) {
                        case 'user': return Users;
                        case 'content': return FileText;
                        case 'media': return Image;
                        case 'feedback': return MessageSquare;
                        case 'system': return Settings;
                        default: return Activity;
                      }
                    };
                    
                    const ActivityIcon = getActivityIcon(activity.type);
                    
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-${activity.type === 'user' ? 'blue' : activity.type === 'content' ? 'green' : activity.type === 'media' ? 'purple' : 'gray'}-100 rounded-full flex items-center justify-center`}>
                            <ActivityIcon className={`h-4 w-4 text-${activity.type === 'user' ? 'blue' : activity.type === 'content' ? 'green' : activity.type === 'media' ? 'purple' : 'gray'}-600`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-600">by {activity.user}</p>
                            {activity.details && (
                              <p className="text-xs text-gray-500">{activity.details}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {analyticsStore.formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigateToPage("settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600">Website Status</span>
                  </div>
                  <Badge className={`${systemInfo.websiteStatus === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {systemInfo.websiteStatus.charAt(0).toUpperCase() + systemInfo.websiteStatus.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600">Last Backup</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {analyticsStore.formatTimeAgo(systemInfo.lastBackup)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600">Storage Used</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    {analyticsStore.formatStorageSize(systemInfo.storageUsed)} / {analyticsStore.formatStorageSize(systemInfo.storageTotal)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600">Active Sessions</span>
                  </div>
                  <span className="text-sm text-gray-900">{systemInfo.activeSessions}</span>
                </div>

                {/* Storage Usage Bar */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Storage Usage</span>
                    <span className="text-sm text-gray-900">
                      {Math.round((systemInfo.storageUsed / systemInfo.storageTotal) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(systemInfo.storageUsed / systemInfo.storageTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => navigateToPage("analytics")}
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button 
                    onClick={() => navigateToPage("settings")}
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500">
          Last updated: {systemInfo.lastUpdate.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardDynamic() {
  return (
    <AdminLayout currentPage="dashboard">
      <DashboardContent />
    </AdminLayout>
  );
}