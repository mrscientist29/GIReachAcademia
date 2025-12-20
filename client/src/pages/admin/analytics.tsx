import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/admin-layout";
import { 
  BarChart3, 
  Users, 
  Eye, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";

function AnalyticsContent() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock analytics data
  const stats = {
    totalVisitors: 12543,
    pageViews: 45678,
    bounceRate: 34.2,
    avgSessionDuration: '3:42',
    visitorGrowth: 12.5,
    pageViewGrowth: 8.3,
    bounceRateChange: -2.1,
    sessionGrowth: 15.7
  };

  const topPages = [
    { page: '/', views: 8945, percentage: 19.6 },
    { page: '/about', views: 6234, percentage: 13.6 },
    { page: '/programs', views: 5678, percentage: 12.4 },
    { page: '/publications', views: 4321, percentage: 9.5 },
    { page: '/resources', views: 3456, percentage: 7.6 }
  ];

  const trafficSources = [
    { source: 'Direct', visitors: 4567, percentage: 36.4 },
    { source: 'Google Search', visitors: 3456, percentage: 27.5 },
    { source: 'Social Media', visitors: 2345, percentage: 18.7 },
    { source: 'Referral', visitors: 1234, percentage: 9.8 },
    { source: 'Email', visitors: 941, percentage: 7.5 }
  ];

  const deviceStats = [
    { device: 'Desktop', users: 7526, percentage: 60.0 },
    { device: 'Mobile', users: 3759, percentage: 30.0 },
    { device: 'Tablet', users: 1258, percentage: 10.0 }
  ];

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVisitors.toLocaleString()}</p>
                  <div className={`flex items-center mt-2 ${getGrowthColor(stats.visitorGrowth)}`}>
                    {getGrowthIcon(stats.visitorGrowth)}
                    <span className="text-sm ml-1">+{stats.visitorGrowth}%</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pageViews.toLocaleString()}</p>
                  <div className={`flex items-center mt-2 ${getGrowthColor(stats.pageViewGrowth)}`}>
                    {getGrowthIcon(stats.pageViewGrowth)}
                    <span className="text-sm ml-1">+{stats.pageViewGrowth}%</span>
                  </div>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.bounceRate}%</p>
                  <div className={`flex items-center mt-2 ${getGrowthColor(stats.bounceRateChange)}`}>
                    {getGrowthIcon(stats.bounceRateChange)}
                    <span className="text-sm ml-1">{stats.bounceRateChange}%</span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Session</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgSessionDuration}</p>
                  <div className={`flex items-center mt-2 ${getGrowthColor(stats.sessionGrowth)}`}>
                    {getGrowthIcon(stats.sessionGrowth)}
                    <span className="text-sm ml-1">+{stats.sessionGrowth}%</span>
                  </div>
                </div>
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{page.page}</p>
                        <p className="text-sm text-gray-600">{page.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{page.percentage}%</p>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${page.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{source.source}</p>
                        <p className="text-sm text-gray-600">{source.visitors.toLocaleString()} visitors</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{source.percentage}%</p>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-green-600 rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Device Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deviceStats.map((device) => {
                const getDeviceIcon = (deviceType: string) => {
                  switch (deviceType) {
                    case 'Desktop': return <Monitor className="h-8 w-8 text-blue-600" />;
                    case 'Mobile': return <Smartphone className="h-8 w-8 text-green-600" />;
                    case 'Tablet': return <Smartphone className="h-8 w-8 text-purple-600" />;
                    default: return <Monitor className="h-8 w-8 text-gray-600" />;
                  }
                };

                return (
                  <div key={device.device} className="text-center">
                    <div className="flex justify-center mb-4">
                      {getDeviceIcon(device.device)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{device.device}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{device.users.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{device.percentage}% of users</p>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                      <div 
                        className="h-2 bg-blue-600 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <AdminLayout currentPage="analytics">
      <AnalyticsContent />
    </AdminLayout>
  );
}