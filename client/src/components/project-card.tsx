import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  Clock, 
  Award, 
  BookOpen, 
  Target, 
  ChevronDown, 
  ChevronUp,
  Play,
  User,
  FileText,
  TrendingUp
} from "lucide-react";
import type { EnhancedProject, ProjectTask } from "@shared/project-types";

interface ProjectCardProps {
  project: EnhancedProject;
  onApplyToTask?: (taskId: string) => void;
  isAuthenticated?: boolean;
}

export function ProjectCard({ project, onApplyToTask, isAuthenticated = false }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepting-mentees':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'recruiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high-impact':
        return 'bg-red-100 text-red-800';
      case 'medium-impact':
        return 'bg-orange-100 text-orange-800';
      case 'low-impact':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const handleTaskApply = (task: ProjectTask) => {
    if (onApplyToTask) {
      onApplyToTask(task.id);
    }
  };

  return (
    <>
      <Card className="bg-white hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace('-', ' ')}
              </Badge>
              <Badge className={getPriorityColor(project.priorityLevel)}>
                {project.priorityLevel.replace('-', ' ')}
              </Badge>
            </div>
            <div className="text-right text-sm text-gray-600">
              <div className="font-semibold text-blue-600">
                {project.openRoles}/{project.totalRoles} Open
              </div>
            </div>
          </div>
          
          <CardTitle className="text-xl text-gray-900 mb-2">
            {project.title}
          </CardTitle>
          
          <CardDescription>
            <div className="space-y-1 text-sm">
              <div><strong>Specialty:</strong> {project.specialty}</div>
              <div><strong>Lead Mentor:</strong> {project.leadMentor}</div>
              <div><strong>Project Lead:</strong> {project.projectLead}</div>
              <div><strong>Collaboration:</strong> {project.collaboration}</div>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Overview */}
            <div>
              <p className="text-gray-700 text-sm">
                {isExpanded ? project.overview : `${project.overview.substring(0, 150)}...`}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto text-blue-600 hover:text-blue-800"
              >
                {isExpanded ? (
                  <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
                ) : (
                  <>Show More <ChevronDown className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="h-4 w-4 mr-2" />
                <span>{project.expectedOutcome}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Skills You'll Learn:</h4>
              <div className="flex flex-wrap gap-1">
                {project.skillsToLearn.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {project.skillsToLearn.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.skillsToLearn.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Available Tasks Preview */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Available Tasks:</h4>
              <div className="space-y-2">
                {project.tasks.slice(0, 2).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{task.title}</span>
                        <Badge className={getLevelColor(task.level)} variant="secondary">
                          {task.level}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        {task.slotsOpen}/{task.slotsTotal} slots • {task.timeCommitment}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTask(task)}
                      disabled={!isAuthenticated || task.slotsOpen === 0}
                    >
                      {task.slotsOpen === 0 ? 'Full' : 'Apply'}
                    </Button>
                  </div>
                ))}
                {project.tasks.length > 2 && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDetailDialog(true)}
                      className="text-blue-600"
                    >
                      View all {project.tasks.length} tasks
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setShowDetailDialog(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl">{project.title}</DialogTitle>
            <DialogDescription>
              {project.specialty} • {project.leadMentor}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="authorship">Authorship</TabsTrigger>
            </TabsList>

            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Project Summary</h4>
                  <p className="text-gray-700">{project.overview}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {project.projectType.replace('-', ' ')}</div>
                      <div><strong>Status:</strong> {project.status.replace('-', ' ')}</div>
                      <div><strong>Priority:</strong> {project.priorityLevel.replace('-', ' ')}</div>
                      <div><strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Mentorship</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Lead Mentor:</strong> {project.leadMentor}</div>
                      <div><strong>Project Lead:</strong> {project.projectLead}</div>
                      <div><strong>Collaboration:</strong> {project.collaboration}</div>
                      <div><strong>Expected Outcome:</strong> {project.expectedOutcome}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Skills You'll Learn</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsToLearn.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {project.methodology && (
                  <div>
                    <h4 className="font-semibold mb-2">Methodology</h4>
                    <p className="text-gray-700">{project.methodology}</p>
                  </div>
                )}

                {project.timeline && (
                  <div>
                    <h4 className="font-semibold mb-2">Timeline</h4>
                    <p className="text-gray-700">{project.timeline}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                <div className="grid gap-4">
                  {project.tasks.map((task) => (
                    <Card key={task.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <CardDescription>{task.description}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getLevelColor(task.level)}>
                              {task.level}
                            </Badge>
                            <div className="text-sm text-gray-600">
                              {task.slotsOpen}/{task.slotsTotal} slots
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Time Commitment:</strong> {task.timeCommitment}
                            </div>
                            <div>
                              <strong>Deadline:</strong> {task.deadline}
                            </div>
                          </div>
                          
                          <div>
                            <strong className="text-sm">Deliverable:</strong>
                            <p className="text-sm text-gray-700">{task.deliverable}</p>
                          </div>

                          {task.requirements.length > 0 && (
                            <div>
                              <strong className="text-sm">Requirements:</strong>
                              <ul className="text-sm text-gray-700 list-disc list-inside">
                                {task.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {task.teachingVideoUrl && (
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4 mr-2" />
                                Teaching Video
                              </Button>
                            )}
                            {task.supervisorName && (
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="h-4 w-4 mr-1" />
                                Supervisor: {task.supervisorName}
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleTaskApply(task)}
                            disabled={!isAuthenticated || task.slotsOpen === 0}
                            className="w-full"
                          >
                            {task.slotsOpen === 0 ? 'Task Full' : 'Apply for Task'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Reading Materials</h4>
                  {project.readingMaterials && project.readingMaterials.length > 0 ? (
                    <ul className="space-y-2">
                      {project.readingMaterials.map((material, index) => (
                        <li key={index} className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm">{material}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No reading materials available yet.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Template Forms</h4>
                  {project.templateForms && project.templateForms.length > 0 ? (
                    <ul className="space-y-2">
                      {project.templateForms.map((form, index) => (
                        <li key={index} className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm">{form}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No template forms available yet.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Project Progress</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Tasks Completed:</strong> 4/8
                      </div>
                      <div>
                        <strong>Active Participants:</strong> {project.totalRoles - project.openRoles}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Your Progress</h4>
                  <p className="text-gray-600">Login to view your personal progress and completed tasks.</p>
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Team Members</h4>
                  {project.teamMembers && project.teamMembers.length > 0 ? (
                    <div className="grid gap-2">
                      {project.teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                          <User className="h-4 w-4 mr-2 text-gray-600" />
                          <span className="text-sm">{member}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Team member visibility is optional and may be hidden.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="authorship" className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Authorship Criteria</h4>
                  {project.authorshipCriteria ? (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">{project.authorshipCriteria}</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Authorship will be determined based on contribution level and quality. 
                        All participants who complete their assigned tasks satisfactorily will be 
                        considered for co-authorship according to ICMJE guidelines.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Contribution Tracking</h4>
                  <p className="text-sm text-gray-600">
                    Your contributions will be tracked throughout the project to ensure fair 
                    authorship determination. This includes task completion, quality of work, 
                    and additional contributions to the project.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Task Application Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for Task: {selectedTask.title}</DialogTitle>
              <DialogDescription>
                {selectedTask.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Level:</strong> {selectedTask.level}</div>
                <div><strong>Time Commitment:</strong> {selectedTask.timeCommitment}</div>
                <div><strong>Slots Available:</strong> {selectedTask.slotsOpen}/{selectedTask.slotsTotal}</div>
                <div><strong>Deadline:</strong> {selectedTask.deadline}</div>
              </div>
              
              <div>
                <strong>Deliverable:</strong>
                <p className="text-sm text-gray-700 mt-1">{selectedTask.deliverable}</p>
              </div>

              {selectedTask.requirements.length > 0 && (
                <div>
                  <strong>Requirements:</strong>
                  <ul className="text-sm text-gray-700 list-disc list-inside mt-1">
                    {selectedTask.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  onClick={() => handleTaskApply(selectedTask)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!isAuthenticated}
                >
                  {isAuthenticated ? 'Apply for Task' : 'Login Required'}
                </Button>
                <Button variant="outline" onClick={() => setSelectedTask(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}