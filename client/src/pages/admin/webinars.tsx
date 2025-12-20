import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin-layout";
import { webinarStore, type Webinar, type WebinarRegistration, type CustomQuestion } from "@/lib/webinar-store";
import { 
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  Video,
  Eye,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

function WebinarsContent() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("webinars");
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [registrations, setRegistrations] = useState<WebinarRegistration[]>([]);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Load data
  useEffect(() => {
    loadWebinars();
    loadRegistrations();
  }, []);

  const loadWebinars = () => {
    const webinarData = webinarStore.getWebinars();
    setWebinars(webinarData);
  };

  const loadRegistrations = () => {
    const registrationData = webinarStore.getRegistrations();
    setRegistrations(registrationData);
  };

  const handleCreateWebinar = () => {
    const newWebinar: Webinar = {
      id: webinarStore.generateWebinarId(),
      title: "",
      description: "",
      speaker: {
        name: "",
        title: "",
        bio: "",
        image: ""
      },
      date: "",
      time: "",
      duration: 60,
      timezone: "PKT",
      maxAttendees: 100,
      currentAttendees: 0,
      status: "draft",
      category: "",
      tags: [],
      meetingLink: "",
      materials: [],
      image: "",
      customQuestions: [],
      includeExperienceField: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setSelectedWebinar(newWebinar);
    setIsCreating(true);
  };

  const handleSaveWebinar = (webinar: Webinar) => {
    try {
      webinarStore.saveWebinar(webinar);
      loadWebinars();
      setSelectedWebinar(null);
      setIsCreating(false);
      
      toast({
        title: "Webinar Saved",
        description: `${webinar.title} has been saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save webinar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWebinar = (webinarId: string) => {
    try {
      webinarStore.deleteWebinar(webinarId);
      loadWebinars();
      loadRegistrations();
      
      toast({
        title: "Webinar Deleted",
        description: "Webinar and all registrations have been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete webinar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRegistrationStatus = (registrationId: string, status: WebinarRegistration['status']) => {
    try {
      webinarStore.updateRegistrationStatus(registrationId, status);
      loadRegistrations();
      
      toast({
        title: "Registration Updated",
        description: `Registration status updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update registration status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      published: { color: "bg-green-100 text-green-800", label: "Published" },
      live: { color: "bg-blue-100 text-blue-800", label: "Live" },
      completed: { color: "bg-purple-100 text-purple-800", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getRegistrationStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredWebinars = webinars.filter(webinar => {
    const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         webinar.speaker.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || webinar.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalWebinars: webinars.length,
    publishedWebinars: webinars.filter(w => w.status === 'published').length,
    totalRegistrations: registrations.length,
    confirmedRegistrations: registrations.filter(r => r.status === 'confirmed').length
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Webinar Management</h1>
              <p className="text-gray-600">Create and manage webinars, track registrations</p>
            </div>
            <Button onClick={handleCreateWebinar} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Webinar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Video className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Webinars</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalWebinars}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.publishedWebinars}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Registrations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.confirmedRegistrations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="webinars">Webinars</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="webinars" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search webinars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webinars List */}
            <div className="grid gap-6">
              {filteredWebinars.map((webinar) => (
                <Card key={webinar.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{webinar.title}</h3>
                          {getStatusBadge(webinar.status)}
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{webinar.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(webinar.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {webinar.time} {webinar.timezone}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {webinar.currentAttendees}/{webinar.maxAttendees}
                          </div>
                          <div className="flex items-center">
                            <Video className="h-4 w-4 mr-2" />
                            {webinar.duration} min
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Speaker:</span> {webinar.speaker.name} - {webinar.speaker.title}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            {webinar.customQuestions && webinar.customQuestions.length > 0 && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {webinar.customQuestions.length} Custom Question{webinar.customQuestions.length > 1 ? 's' : ''}
                              </span>
                            )}
                            {webinar.includeExperienceField && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                Experience Field
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedWebinar(webinar);
                            setIsCreating(false);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteWebinar(webinar.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredWebinars.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No webinars found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search or filter criteria." 
                      : "Create your first webinar to get started."
                    }
                  </p>
                  <Button onClick={handleCreateWebinar}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Webinar
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="registrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webinar Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Attendee</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Webinar</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Organization</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Experience</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Custom Answer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Registration Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration) => {
                        const webinar = webinars.find(w => w.id === registration.webinarId);
                        return (
                          <tr key={registration.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {registration.firstName} {registration.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{registration.email}</p>
                                <p className="text-sm text-gray-600">{registration.phone}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-medium text-gray-900">{webinar?.title}</p>
                              <p className="text-sm text-gray-600">
                                {webinar?.date} at {webinar?.time}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-gray-900">{registration.organization}</p>
                              <p className="text-sm text-gray-600">{registration.position}</p>
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {registration.experience || 'N/A'}
                            </td>
                            <td className="py-4 px-4">
                              {registration.customQuestionAnswers && Object.keys(registration.customQuestionAnswers).length > 0 ? (
                                <div className="max-w-xs space-y-1">
                                  {Object.entries(registration.customQuestionAnswers).map(([questionId, answer], index) => {
                                    const webinarQuestion = webinar?.customQuestions?.find(q => q.id === questionId);
                                    return (
                                      <div key={questionId} className="text-sm">
                                        <p className="font-medium text-gray-700 truncate" title={webinarQuestion?.question}>
                                          Q{index + 1}: {webinarQuestion?.question || 'Unknown Question'}
                                        </p>
                                        <p className="text-gray-900 truncate" title={answer}>
                                          {answer}
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {new Date(registration.registrationDate).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                {getRegistrationStatusIcon(registration.status)}
                                <span className="capitalize">{registration.status}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={registration.status}
                                  onValueChange={(status) => 
                                    handleUpdateRegistrationStatus(registration.id, status as WebinarRegistration['status'])
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Webinar Editor Modal */}
      {selectedWebinar && (
        <WebinarEditor
          webinar={selectedWebinar}
          isCreating={isCreating}
          onSave={handleSaveWebinar}
          onCancel={() => {
            setSelectedWebinar(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

// Webinar Editor Component
function WebinarEditor({ 
  webinar, 
  isCreating, 
  onSave, 
  onCancel 
}: { 
  webinar: Webinar;
  isCreating: boolean;
  onSave: (webinar: Webinar) => void;
  onCancel: () => void;
}) {
  const [editedWebinar, setEditedWebinar] = useState<Webinar>(webinar);

  const handleSave = () => {
    if (!editedWebinar.title || !editedWebinar.description || !editedWebinar.date || !editedWebinar.time) {
      alert("Please fill in all required fields");
      return;
    }
    onSave(editedWebinar);
  };

  const addCustomQuestion = () => {
    const newQuestion: CustomQuestion = {
      id: `q${Date.now()}`,
      question: "",
      required: false
    };
    setEditedWebinar({
      ...editedWebinar,
      customQuestions: [...(editedWebinar.customQuestions || []), newQuestion]
    });
  };

  const removeCustomQuestion = (questionId: string) => {
    setEditedWebinar({
      ...editedWebinar,
      customQuestions: (editedWebinar.customQuestions || []).filter(q => q.id !== questionId)
    });
  };

  const updateCustomQuestion = (questionId: string, field: keyof CustomQuestion, value: string | boolean) => {
    setEditedWebinar({
      ...editedWebinar,
      customQuestions: (editedWebinar.customQuestions || []).map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isCreating ? "Create New Webinar" : "Edit Webinar"}
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Webinar Title *</Label>
              <Input
                id="title"
                value={editedWebinar.title}
                onChange={(e) => setEditedWebinar({...editedWebinar, title: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editedWebinar.category}
                onChange={(e) => setEditedWebinar({...editedWebinar, category: e.target.value})}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={editedWebinar.description}
              onChange={(e) => setEditedWebinar({...editedWebinar, description: e.target.value})}
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={editedWebinar.date}
                onChange={(e) => setEditedWebinar({...editedWebinar, date: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={editedWebinar.time}
                onChange={(e) => setEditedWebinar({...editedWebinar, time: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={editedWebinar.duration}
                onChange={(e) => setEditedWebinar({...editedWebinar, duration: parseInt(e.target.value)})}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="maxAttendees">Max Attendees</Label>
              <Input
                id="maxAttendees"
                type="number"
                value={editedWebinar.maxAttendees}
                onChange={(e) => setEditedWebinar({...editedWebinar, maxAttendees: parseInt(e.target.value)})}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedWebinar.status}
                onValueChange={(value) => setEditedWebinar({...editedWebinar, status: value as Webinar['status']})}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Speaker Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="speakerName">Speaker Name</Label>
                <Input
                  id="speakerName"
                  value={editedWebinar.speaker.name}
                  onChange={(e) => setEditedWebinar({
                    ...editedWebinar,
                    speaker: {...editedWebinar.speaker, name: e.target.value}
                  })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="speakerTitle">Speaker Title</Label>
                <Input
                  id="speakerTitle"
                  value={editedWebinar.speaker.title}
                  onChange={(e) => setEditedWebinar({
                    ...editedWebinar,
                    speaker: {...editedWebinar.speaker, title: e.target.value}
                  })}
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="speakerBio">Speaker Bio</Label>
              <Textarea
                id="speakerBio"
                value={editedWebinar.speaker.bio}
                onChange={(e) => setEditedWebinar({
                  ...editedWebinar,
                  speaker: {...editedWebinar.speaker, bio: e.target.value}
                })}
                rows={3}
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                value={editedWebinar.meetingLink}
                onChange={(e) => setEditedWebinar({...editedWebinar, meetingLink: e.target.value})}
                placeholder="https://zoom.us/j/..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={editedWebinar.image}
                onChange={(e) => setEditedWebinar({...editedWebinar, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Registration Form Settings</h3>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Custom Questions</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Add custom questions to collect specific information from registrants.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomQuestion}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </Button>
              </div>

              {(!editedWebinar.customQuestions || editedWebinar.customQuestions.length === 0) ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No custom questions added yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add Question" to create your first custom question.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(editedWebinar.customQuestions || []).map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Question {index + 1}
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomQuestion(question.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateCustomQuestion(question.id, 'question', e.target.value)}
                        placeholder="Enter your question (e.g., 'What specific challenges are you facing in your research?')"
                        rows={2}
                        className="mb-3"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`required-${question.id}`}
                          checked={question.required}
                          onChange={(e) => updateCustomQuestion(question.id, 'required', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor={`required-${question.id}`} className="text-sm text-gray-600">
                          Required field
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="includeExperienceField" className="text-sm font-medium text-gray-700">
                  Include "Years of Experience" field in registration form
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Toggle this if you don't need to collect experience information from registrants.
                </p>
              </div>
              <Switch
                id="includeExperienceField"
                checked={editedWebinar.includeExperienceField}
                onCheckedChange={(checked) => setEditedWebinar({...editedWebinar, includeExperienceField: checked})}
              />
            </div>

          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {isCreating ? "Create Webinar" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Webinars() {
  return (
    <AdminLayout currentPage="webinars">
      <WebinarsContent />
    </AdminLayout>
  );
}