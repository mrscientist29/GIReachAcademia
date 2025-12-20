import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Clock, User, Target } from "lucide-react";
import type { ProjectTask } from "@shared/project-types";

interface TaskApplicationDialogProps {
  task: ProjectTask | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: {
    taskId: string;
    applicationText: string;
    exampleWork?: File;
    checklist: Record<string, boolean>;
  }) => void;
}

export function TaskApplicationDialog({ 
  task, 
  isOpen, 
  onClose, 
  onSubmit 
}: TaskApplicationDialogProps) {
  const [applicationText, setApplicationText] = useState('');
  const [exampleWork, setExampleWork] = useState<File | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!task) return null;

  const checklistItems = [
    'I have reviewed the project overview and understand the requirements',
    'I have watched the teaching module (if available)',
    'I can commit to the specified time requirements',
    'I understand the deliverable expectations',
    'I agree to the project timeline and deadlines'
  ];

  const handleSubmit = async () => {
    if (!applicationText.trim()) {
      alert('Please provide a reason for your interest in this task.');
      return;
    }

    const allChecked = checklistItems.every(item => checklist[item]);
    if (!allChecked) {
      alert('Please complete all checklist items before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        taskId: task.id,
        applicationText: applicationText.trim(),
        exampleWork: exampleWork || undefined,
        checklist
      });
      
      // Reset form
      setApplicationText('');
      setExampleWork(null);
      setChecklist({});
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, Word document, or text file');
        return;
      }
      
      setExampleWork(file);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Apply for Task</DialogTitle>
          <DialogDescription>
            Complete the application form below to apply for this research task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <Badge className={getLevelColor(task.level)}>
                {task.level}
              </Badge>
            </div>
            <p className="text-gray-700 mb-3">{task.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                <span>{task.timeCommitment}</span>
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-600" />
                <span>{task.slotsOpen}/{task.slotsTotal} slots available</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-600" />
                <span>Supervisor: {task.supervisorName || 'TBD'}</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                <span>Deadline: {task.deadline}</span>
              </div>
            </div>
          </div>

          {/* Deliverable */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Expected Deliverable</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{task.deliverable}</p>
            </div>
          </div>

          {/* Requirements */}
          {task.requirements.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Task Requirements</Label>
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                {task.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Text */}
          <div>
            <Label htmlFor="application-text" className="text-sm font-medium mb-2 block">
              Why are you interested in this task? *
            </Label>
            <Textarea
              id="application-text"
              placeholder="Please explain your interest in this task, relevant experience, and what you hope to learn..."
              value={applicationText}
              onChange={(e) => setApplicationText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {applicationText.length}/500 characters
            </p>
          </div>

          {/* Example Work Upload */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Upload Example Work (Optional)
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600 mb-2">
                  Upload a sample of your previous work (PDF, Word, or text file)
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Choose File
                </Label>
                {exampleWork && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ {exampleWork.name} ({(exampleWork.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Application Checklist *
            </Label>
            <div className="space-y-3">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox
                    id={`checklist-${index}`}
                    checked={checklist[item] || false}
                    onCheckedChange={(checked) => 
                      setChecklist(prev => ({ ...prev, [item]: checked as boolean }))
                    }
                  />
                  <Label 
                    htmlFor={`checklist-${index}`}
                    className="text-sm cursor-pointer leading-5"
                  >
                    {item}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Video Link */}
          {task.teachingVideoUrl && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">
                📹 Please watch the teaching module before applying:
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(task.teachingVideoUrl, '_blank')}
              >
                Watch Teaching Video
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !applicationText.trim() || !checklistItems.every(item => checklist[item])}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}