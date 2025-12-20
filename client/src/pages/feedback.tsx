import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Star } from "lucide-react";

interface FeedbackQuestion {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'rating';
  label: string;
  required: boolean;
  options?: string[];
}

interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  questions: FeedbackQuestion[];
  isActive: boolean;
}

export default function FeedbackPage() {
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [responses, setResponses] = useState<Record<string, Record<string, any>>>({});
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveFeedbackForms();
  }, []);

  const fetchActiveFeedbackForms = async () => {
    try {
      const response = await fetch('/api/feedback-forms/active');
      if (response.ok) {
        const forms = await response.json();
        setFeedbackForms(forms);
        // Initialize responses for each form
        const initialResponses: Record<string, Record<string, any>> = {};
        forms.forEach((form: FeedbackForm) => {
          initialResponses[form.id] = {};
        });
        setResponses(initialResponses);
      }
    } catch (error) {
      console.error('Error fetching feedback forms:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback forms. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseChange = (formId: string, questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [questionId]: value
      }
    }));
  };

  const handleSubmit = async (formId: string, e: React.FormEvent) => {
    e.preventDefault();
    
    const form = feedbackForms.find(f => f.id === formId);
    if (!form) return;

    const formResponses = responses[formId] || {};

    // Validate required fields
    const missingRequired = form.questions
      .filter(q => q.required && !formResponses[q.id])
      .map(q => q.label);

    if (missingRequired.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingRequired.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(prev => ({ ...prev, [formId]: true }));

    try {
      const response = await fetch('/api/feedback-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: formId,
          responses: formResponses
        }),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "Your feedback has been submitted successfully.",
        });
        // Clear responses for this form
        setResponses(prev => ({
          ...prev,
          [formId]: {}
        }));
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, [formId]: false }));
    }
  };

  const renderQuestion = (formId: string, question: FeedbackQuestion) => {
    const value = responses[formId]?.[question.id];

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleResponseChange(formId, question.id, e.target.value)}
            placeholder="Enter your response..."
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleResponseChange(formId, question.id, e.target.value)}
            placeholder="Enter your response..."
            rows={4}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={(val) => handleResponseChange(formId, question.id, val)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={(value || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    if (checked) {
                      handleResponseChange(formId, question.id, [...currentValues, option]);
                    } else {
                      handleResponseChange(formId, question.id, currentValues.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={(val) => handleResponseChange(formId, question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleResponseChange(formId, question.id, rating)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`h-6 w-6 ${
                    rating <= (value || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            {value && (
              <span className="ml-2 text-sm text-gray-600">
                {value} out of 5
              </span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (feedbackForms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Feedback Forms Available
            </h2>
            <p className="text-gray-600">
              There are currently no active feedback forms. Please check back later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Feedback Forms
          </h1>
          <p className="text-lg text-gray-600">
            We value your feedback! Please fill out any of the forms below.
          </p>
        </div>

        <div className="space-y-8">
          {feedbackForms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>{form.title}</span>
                </CardTitle>
                {form.description && (
                  <p className="text-gray-600 mt-2">{form.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSubmit(form.id, e)} className="space-y-6">
                  {form.questions.map((question) => (
                    <div key={question.id} className="space-y-2">
                      <Label className="text-base font-medium">
                        {question.label}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                      {renderQuestion(form.id, question)}
                    </div>
                  ))}

                  <div className="pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={isSubmitting[form.id]}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting[form.id] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}