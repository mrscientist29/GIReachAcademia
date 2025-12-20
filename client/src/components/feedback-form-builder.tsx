import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  AlignLeft, 
  Circle, 
  CheckSquare, 
  List, 
  Star,
  Save,
  Eye
} from "lucide-react";

interface FeedbackQuestion {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'rating';
  label: string;
  required: boolean;
  options?: string[];
}

interface FeedbackForm {
  title: string;
  description: string;
  questions: FeedbackQuestion[];
}

interface FeedbackFormBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: FeedbackForm) => void;
}

const questionTypes = [
  { value: 'text', label: 'Short Text', icon: Type },
  { value: 'textarea', label: 'Long Text', icon: AlignLeft },
  { value: 'radio', label: 'Multiple Choice', icon: Circle },
  { value: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  { value: 'select', label: 'Dropdown', icon: List },
  { value: 'rating', label: 'Rating', icon: Star },
];

export default function FeedbackFormBuilder({ isOpen, onClose, onSave }: FeedbackFormBuilderProps) {
  const [form, setForm] = useState<FeedbackForm>({
    title: '',
    description: '',
    questions: [
      {
        id: 'email-field',
        type: 'text',
        label: 'Email Address',
        required: true,
        options: undefined
      }
    ]
  });
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addQuestion = (type: FeedbackQuestion['type']) => {
    const newQuestion: FeedbackQuestion = {
      id: generateId(),
      type,
      label: '',
      required: false,
      options: ['radio', 'checkbox', 'select'].includes(type) ? ['Option 1'] : undefined
    };

    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (id: string, updates: Partial<FeedbackQuestion>) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (id: string) => {
    // Prevent deletion of the mandatory email field
    if (id === 'email-field') {
      toast({
        title: "Cannot Delete",
        description: "Email field is mandatory and cannot be deleted.",
        variant: "destructive",
      });
      return;
    }
    
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const addOption = (questionId: string) => {
    const question = form.questions.find(q => q.id === questionId);
    if (question && question.options) {
      updateQuestion(questionId, {
        options: [...question.options, `Option ${question.options.length + 1}`]
      });
    }
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = form.questions.find(q => q.id === questionId);
    if (question && question.options) {
      const newOptions = [...question.options];
      newOptions[optionIndex] = value;
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = form.questions.find(q => q.id === questionId);
    if (question && question.options && question.options.length > 1) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex);
      updateQuestion(questionId, { options: newOptions });
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a form title.",
        variant: "destructive",
      });
      return;
    }

    if (form.questions.length <= 1) {
      toast({
        title: "Validation Error",
        description: "Please add at least one question in addition to the email field.",
        variant: "destructive",
      });
      return;
    }

    const invalidQuestions = form.questions.filter(q => !q.label.trim());
    if (invalidQuestions.length > 0) {
      toast({
        title: "Validation Error",
        description: "All questions must have a label.",
        variant: "destructive",
      });
      return;
    }

    console.log('Saving form:', form);
    onSave(form);
    setForm({ 
      title: '', 
      description: '', 
      questions: [
        {
          id: 'email-field',
          type: 'text',
          label: 'Email Address',
          required: true,
          options: undefined
        }
      ] 
    });
    onClose();
  };

  const renderQuestionEditor = (question: FeedbackQuestion) => {
    const isEmailField = question.id === 'email-field';
    
    return (
      <Card key={question.id} className={`mb-4 ${isEmailField ? 'border-blue-200 bg-blue-50' : ''}`}>
        <CardContent className="p-4">
          {isEmailField && (
            <div className="mb-3 p-2 bg-blue-100 rounded-md">
              <p className="text-sm text-blue-800 font-medium">
                📧 Mandatory Email Field - This field is required for all feedback forms
              </p>
            </div>
          )}
          
          <div className="flex items-start space-x-4">
            <GripVertical className="h-5 w-5 text-gray-400 mt-2 cursor-move" />
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label>Question Label</Label>
                  <Input
                    value={question.label}
                    onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
                    placeholder="Enter your question..."
                    disabled={isEmailField}
                  />
                </div>
                
                <div className="w-40">
                  <Label>Type</Label>
                  <Select
                    value={question.type}
                    onValueChange={(value) => updateQuestion(question.id, { 
                      type: value as FeedbackQuestion['type'],
                      options: ['radio', 'checkbox', 'select'].includes(value) ? ['Option 1'] : undefined
                    })}
                    disabled={isEmailField}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {question.options && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2 mt-2">
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(question.id, index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        {question.options!.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(question.id, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(question.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`required-${question.id}`}
                  checked={question.required}
                  onCheckedChange={(checked) => updateQuestion(question.id, { required: !!checked })}
                  disabled={isEmailField}
                />
                <Label htmlFor={`required-${question.id}`}>
                  Required {isEmailField && '(Always)'}
                </Label>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => deleteQuestion(question.id)}
              className={`${isEmailField ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-700'}`}
              disabled={isEmailField}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h2>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {form.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label className="text-base font-medium">
                {question.label}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              
              {question.type === 'text' && (
                <Input placeholder="Enter your response..." disabled />
              )}
              
              {question.type === 'textarea' && (
                <Textarea placeholder="Enter your response..." rows={3} disabled />
              )}
              
              {question.type === 'radio' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="radio" disabled className="text-blue-600" />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'checkbox' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" disabled className="text-blue-600" />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'select' && (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option..." />
                  </SelectTrigger>
                </Select>
              )}
              
              {question.type === 'rating' && (
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star key={rating} className="h-6 w-6 text-gray-300" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create Feedback Form</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Form
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {previewMode ? (
          <div className="p-6">
            {renderPreview()}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Form Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Form Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter form title..."
                  />
                </div>
                <div>
                  <Label>Description (Optional)</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter form description..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Questions</span>
                  <div className="flex items-center space-x-2">
                    {questionTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant="outline"
                        size="sm"
                        onClick={() => addQuestion(type.value as FeedbackQuestion['type'])}
                        title={`Add ${type.label}`}
                      >
                        <type.icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {form.questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No questions added yet. Click the buttons above to add questions.</p>
                  </div>
                ) : (
                  <div>
                    {form.questions.map(renderQuestionEditor)}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}