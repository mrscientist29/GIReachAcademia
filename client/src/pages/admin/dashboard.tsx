import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin-layout";
import { 
  Edit,
  Image,
  Plus,
  Eye,
  Trash2,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Settings
} from "lucide-react";

function DashboardContent() {
  const [, setLocation] = useLocation();

  const navigateToPage = (page: string) => {
    setLocation(`/admin/${page}`);
  };

  const stats = [
    { label: "Total Users", value: "1,234", change: "+12%", color: "blue", icon: Users },
    { label: "Publications", value: "567", change: "+8%", color: "green", icon: FileText },
    { label: "Active Programs", value: "23", change: "+15%", color: "purple", icon: Settings },
    { label: "Feedback", value: "89", change: "+5%", color: "orange", icon: MessageSquare },
  ];

  const recentActivities = [
    { action: "New user registration", user: "Dr. Sarah Ahmed", time: "2 minutes ago" },
    { action: "Publication submitted", user: "Ahmad Khan", time: "15 minutes ago" },
    { action: "Feedback received", user: "Dr. Fatima Malik", time: "1 hour ago" },
    { action: "Program enrollment", user: "Dr. Hassan Ali", time: "2 hours ago" },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
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
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">by {activity.user}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Overview */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Website Status</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Backup</span>
                  <span className="text-sm text-gray-900">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="text-sm text-gray-900">2.4 GB / 10 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="text-sm text-gray-900">12</span>
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
                    View Analytics
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
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout currentPage="dashboard">
      <DashboardContent />
    </AdminLayout>
  );
}