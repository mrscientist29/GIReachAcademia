import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/admin-layout";
import FeedbackFormBuilder from "@/components/feedback-form-builder";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Search, 
  Star, 
  Reply, 
  Archive,
  Filter,
  Calendar,
  User,
  Mail,
  Plus,
  Settings,
  Eye,
  Trash2,
  Download
} from "lucide-react";
import * as XLSX from 'xlsx';

interface FeedbackResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: string;
}

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  summary: string;
  rating: number;
  status: 'new' | 'replied' | 'archived';
  date: string;
  category: 'general' | 'technical' | 'suggestion' | 'complaint';
}

interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  questions: any[];
  isActive: boolean;
  createdAt: string;
  responseCount: number;
}

function FeedbackContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'new' | 'replied' | 'archived'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'technical' | 'suggestion' | 'complaint'>('all');
  const [activeTab, setActiveTab] = useState<'responses' | 'forms'>('responses');
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [feedbackResponses, setFeedbackResponses] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedbackForms();
    fetchFeedbackResponses();
  }, []);

  const fetchFeedbackForms = async () => {
    try {
      const response = await fetch('/api/admin/feedback-forms');
      if (response.ok) {
        const forms = await response.json();
        setFeedbackForms(forms);
      }
    } catch (error) {
      console.error('Error fetching feedback forms:', error);
    }
  };

  const fetchFeedbackResponses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/feedback-responses');
      if (response.ok) {
        const responses = await response.json();
        setFeedbackResponses(responses);
      }
    } catch (error) {
      console.error('Error fetching feedback responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleResponseExpanded = (responseId: string) => {
    setExpandedResponses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(responseId)) {
        newSet.delete(responseId);
      } else {
        newSet.add(responseId);
      }
      return newSet;
    });
  };

  const deleteResponse = async (responseId: string) => {
    if (!confirm('Are you sure you want to delete this response? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/feedback-responses/${responseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Response deleted successfully!",
        });
        fetchFeedbackResponses();
        fetchFeedbackForms(); // Refresh to update response counts
        // Remove from expanded set if it was expanded
        setExpandedResponses(prev => {
          const newSet = new Set(prev);
          newSet.delete(responseId);
          return newSet;
        });
      } else {
        throw new Error('Failed to delete response');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportToExcel = () => {
    if (feedbackResponses.length === 0) {
      toast({
        title: "No Data",
        description: "No feedback responses to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a comprehensive dataset for Excel export
      const exportData = feedbackResponses.map((response, index) => {
        const form = feedbackForms.find(f => f.id === response.formId);
        const formTitle = form?.title || 'Unknown Form';
        const formDescription = form?.description || '';
        
        // Create a map of question IDs to labels and types
        const questionMap = new Map();
        if (form?.questions) {
          form.questions.forEach(question => {
            questionMap.set(question.id, {
              label: question.label,
              type: question.type,
              required: question.required
            });
          });
        }

        // Base information
        const exportRow: Record<string, any> = {
          'Row #': index + 1,
          'Response ID': response.id,
          'Form Name': formTitle,
          'Form Description': formDescription,
          'Submission Date': new Date(response.submittedAt).toLocaleDateString(),
          'Submission Time': new Date(response.submittedAt).toLocaleTimeString(),
          'Full Timestamp': new Date(response.submittedAt).toISOString(),
        };

        // Add all question responses with proper labels
        Object.entries(response.responses).forEach(([questionId, value]) => {
          const questionInfo = questionMap.get(questionId);
          const questionLabel = questionInfo?.label || `Question ${questionId.substring(0, 8)}`;
          const questionType = questionInfo?.type || 'unknown';
          const isRequired = questionInfo?.required ? ' (Required)' : '';
          
          const columnName = `${questionLabel}${isRequired}`;
          
          // Handle different value types
          if (Array.isArray(value)) {
            exportRow[columnName] = value.join(', ');
          } else if (value !== null && value !== undefined) {
            exportRow[columnName] = String(value);
          } else {
            exportRow[columnName] = '';
          }
          
          // Add metadata columns for complex question types
          if (questionType === 'rating') {
            exportRow[`${columnName} (Rating 1-5)`] = exportRow[columnName];
          }
        });

        return exportRow;
      });

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Auto-size columns
      const columnWidths = Object.keys(exportData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15) // Minimum width of 15 characters
      }));
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedback Responses');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `feedback-responses-${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);

      toast({
        title: "Export Successful",
        description: `Exported ${feedbackResponses.length} responses to ${filename}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateForm = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/feedback-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Feedback form created successfully!",
        });
        fetchFeedbackForms();
        fetchFeedbackResponses();
      } else {
        throw new Error('Failed to create form');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create feedback form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFormStatus = async (formId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/feedback-forms/${formId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Form ${!isActive ? 'activated' : 'deactivated'} successfully!`,
        });
        fetchFeedbackForms();
        fetchFeedbackResponses();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update form status.",
        variant: "destructive",
      });
    }
  };

  const deleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/feedback-forms/${formId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Form deleted successfully!",
        });
        fetchFeedbackForms();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete form.",
        variant: "destructive",
      });
    }
  };

  // Convert feedback responses to display format
  const processedFeedback = feedbackResponses.map((response): FeedbackItem => {
    const form = feedbackForms.find(f => f.id === response.formId);
    const formTitle = form?.title || 'Unknown Form';
    
    // Create a map of question IDs to labels from the form definition
    const questionMap = new Map();
    if (form?.questions) {
      form.questions.forEach(question => {
        questionMap.set(question.id, question.label);
      });
    }
    
    // Extract common fields from responses
    let name = 'Anonymous User';
    let email = 'No email provided';
    let rating = 0;
    
    // Create a formatted display of all responses with proper labels
    const formattedResponses: string[] = [];
    
    Object.entries(response.responses).forEach(([questionId, value]) => {
      const questionLabel = questionMap.get(questionId) || `Question ${questionId.substring(0, 8)}...`;
      
      // Check for common field types to extract name, email, rating
      const lowerLabel = questionLabel.toLowerCase();
      if (lowerLabel.includes('name') && !lowerLabel.includes('email')) {
        name = String(value);
      } else if (lowerLabel.includes('email')) {
        email = String(value);
      } else if (lowerLabel.includes('rating') || lowerLabel.includes('satisfaction') || lowerLabel.includes('score')) {
        rating = Number(value) || 0;
      }
      
      // Format the response for display
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          formattedResponses.push(`${questionLabel}: ${value.join(', ')}`);
        } else {
          formattedResponses.push(`${questionLabel}: ${value}`);
        }
      }
    });

    // Create a summary (first 2-3 responses or key fields)
    const summaryResponses = formattedResponses.slice(0, 3);
    const summary = summaryResponses.length > 0 
      ? summaryResponses.join(' • ') 
      : 'No response details available';

    return {
      id: response.id,
      name: name,
      email: email,
      subject: `Response to: ${formTitle}`,
      message: formattedResponses.join('\n'),
      summary: summary,
      rating: rating,
      status: 'new' as const,
      date: response.submittedAt,
      category: 'general' as const
    };
  });

  const filteredFeedback = processedFeedback.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-red-100 text-red-800';
      case 'suggestion': return 'bg-yellow-100 text-yellow-800';
      case 'complaint': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Tab Navigation */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={activeTab === 'responses' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('responses')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Responses
                </Button>
                <Button
                  variant={activeTab === 'forms' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('forms')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Forms
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {activeTab === 'responses' ? (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      fetchFeedbackResponses();
                      fetchFeedbackForms();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={exportToExcel}
                    disabled={feedbackResponses.length === 0}
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setExpandedResponses(new Set())}
                  >
                    Collapse All
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setExpandedResponses(new Set(processedFeedback.map(f => f.id)))}
                  >
                    Expand All
                  </Button>
                </>
              ) : (
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsFormBuilderOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Feedback Form
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters - Only show for responses tab */}
        {activeTab === 'responses' && (
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="suggestion">Suggestion</option>
              <option value="complaint">Complaint</option>
            </select>
          </div>
        </div>
        )}

        {/* Stats Cards - Only show for responses tab */}
        {activeTab === 'responses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-900">{processedFeedback.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {processedFeedback.filter(f => f.status === 'new').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Feedback List - Only show for responses tab */}
        {activeTab === 'responses' && (
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading feedback responses...</p>
              </CardContent>
            </Card>
          ) : filteredFeedback.length > 0 ? (
            filteredFeedback.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{item.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.subject}</h3>
                    
                    {/* Summary view (always visible) */}
                    <div className="text-gray-700 mb-3">
                      <p className="text-sm">{item.summary}</p>
                    </div>

                    {/* Detailed view (expandable) */}
                    {expandedResponses.has(item.id) && (
                      <div className="text-gray-700 mb-4 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 mb-3">Full Response Details:</h4>
                          {item.message.split('\n').map((line, index) => {
                            if (!line.trim()) return null;
                            const [label, ...valueParts] = line.split(': ');
                            const value = valueParts.join(': ');
                            return (
                              <div key={index} className="flex flex-col sm:flex-row">
                                <div className="font-medium text-gray-900 sm:w-1/3 mb-1 sm:mb-0">
                                  {label}:
                                </div>
                                <div className="text-gray-700 sm:w-2/3">
                                  {value}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    

                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleResponseExpanded(item.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {expandedResponses.has(item.id) ? 'Hide Details' : 'View Details'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteResponse(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
                <p className="text-gray-600">No feedback responses have been submitted yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
        )}



        {/* Forms Management */}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            {feedbackForms.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback forms created</h3>
                  <p className="text-gray-600 mb-4">Create your first feedback form to start collecting user feedback.</p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setIsFormBuilderOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Form
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {feedbackForms.map((form) => (
                  <Card key={form.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                            <Badge className={form.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {form.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          {form.description && (
                            <p className="text-gray-600 mb-3">{form.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span>{form.questions.length} questions</span>
                            <span>{form.responseCount} responses</span>
                            <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFormStatus(form.id, form.isActive)}
                          >
                            {form.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setActiveTab('responses');
                              // You could add form-specific filtering here if needed
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Responses ({form.responseCount})
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteForm(form.id)}
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
            )}
          </div>
        )}
      </div>

      {/* Form Builder Dialog */}
      <FeedbackFormBuilder
        isOpen={isFormBuilderOpen}
        onClose={() => setIsFormBuilderOpen(false)}
        onSave={handleCreateForm}
      />
    </div>
  );
}

export default function Feedback() {
  return (
    <AdminLayout currentPage="feedback">
      <FeedbackContent />
    </AdminLayout>
  );
}