import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Users, Calendar, Clock, X } from "lucide-react";
import AdminLayout from "@/components/admin-layout";
import { type GroupProject } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import type { EnhancedProject, ProjectTask } from "@shared/project-types";

export default function AdminProjects() {
    const [projects, setProjects] = useState<GroupProject[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingProject, setEditingProject] = useState<GroupProject | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        // Basic Information
        title: "",
        description: "",
        projectType: "",
        status: "recruiting",
        
        // Enhanced Project Details
        specialty: "",
        leadMentor: "",
        projectLead: "",
        collaboration: "",
        priorityLevel: "medium-impact",
        expectedOutcome: "",
        
        // Logistics
        maxParticipants: "",
        startDate: "",
        expectedCompletionDate: "",
        isPublic: true,
        
        // Advanced Details
        methodology: "",
        timeline: "",
        authorshipCriteria: "",
        
        // Skills and Resources (comma-separated strings)
        skillsToLearn: "",
        readingMaterials: "",
        templateForms: "",
        teamMembers: ""
    });

    // Task management
    const [tasks, setTasks] = useState<ProjectTask[]>([]);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
    const [taskFormData, setTaskFormData] = useState({
        title: "",
        description: "",
        slotsTotal: 2,
        timeCommitment: "",
        level: "Beginner" as const,
        teachingVideoUrl: "",
        supervisorName: "",
        deliverable: "",
        deadline: "",
        requirements: ""
    });
       

    // Fetch projects on component mount
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await apiRequest('GET', '/api/admin/projects');
            const data = await response.json();
            console.log('Fetched projects:', data);
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            projectType: "",
            status: "recruiting",
            specialty: "",
            leadMentor: "",
            projectLead: "",
            collaboration: "",
            priorityLevel: "medium-impact",
            expectedOutcome: "",
            maxParticipants: "",
            startDate: "",
            expectedCompletionDate: "",
            isPublic: true,
            methodology: "",
            timeline: "",
            authorshipCriteria: "",
            skillsToLearn: "",
            readingMaterials: "",
            templateForms: "",
            teamMembers: ""
        });
        setTasks([]);
    };

    const resetTaskForm = () => {
        setTaskFormData({
            title: "",
            description: "",
            slotsTotal: 2,
            timeCommitment: "",
            level: "Beginner",
            teachingVideoUrl: "",
            supervisorName: "",
            deliverable: "",
            deadline: "",
            requirements: ""
        });
    };

    const handleCreateProject = () => {
        setEditingProject(null);
        resetForm();
        setShowCreateDialog(true);
    };

    const handleEditProject = (project: GroupProject) => {
        setEditingProject(project);
        setFormData({
            title: project.title,
            description: project.description,
            projectType: project.projectType,
            status: project.status || "recruiting",
            specialty: (project as any).specialty || "",
            leadMentor: (project as any).leadMentor || "",
            projectLead: (project as any).projectLead || "",
            collaboration: (project as any).collaboration || "",
            priorityLevel: (project as any).priorityLevel || "medium-impact",
            expectedOutcome: (project as any).expectedOutcome || "",
            maxParticipants: project.maxParticipants?.toString() || "",
            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
            expectedCompletionDate: project.expectedCompletionDate ? new Date(project.expectedCompletionDate).toISOString().split('T')[0] : "",
            isPublic: project.isPublic ?? true,
            methodology: (project as any).methodology || "",
            timeline: (project as any).timeline || "",
            authorshipCriteria: (project as any).authorshipCriteria || "",
            skillsToLearn: (project as any).skillsToLearn?.join(", ") || "",
            readingMaterials: (project as any).readingMaterials?.join(", ") || "",
            templateForms: (project as any).templateForms?.join(", ") || "",
            teamMembers: (project as any).teamMembers?.join(", ") || ""
        });
        setTasks((project as any).tasks || []);
        setShowCreateDialog(true);
    };

    // Task management functions
    const handleAddTask = () => {
        setEditingTask(null);
        resetTaskForm();
        setShowTaskDialog(true);
    };

    const handleEditTask = (task: ProjectTask) => {
        setEditingTask(task);
        setTaskFormData({
            title: task.title,
            description: task.description,
            slotsTotal: task.slotsTotal,
            timeCommitment: task.timeCommitment,
            level: task.level,
            teachingVideoUrl: task.teachingVideoUrl || "",
            supervisorName: task.supervisorName || "",
            deliverable: task.deliverable,
            deadline: task.deadline,
            requirements: task.requirements.join(", ")
        });
        setShowTaskDialog(true);
    };

    const handleSubmitTask = (e: React.FormEvent) => {
        e.preventDefault();

        const taskData: ProjectTask = {
            id: editingTask?.id || `task-${Date.now()}`,
            title: taskFormData.title,
            description: taskFormData.description,
            slotsTotal: taskFormData.slotsTotal,
            slotsOpen: editingTask?.slotsOpen || taskFormData.slotsTotal,
            timeCommitment: taskFormData.timeCommitment,
            level: taskFormData.level,
            teachingVideoUrl: taskFormData.teachingVideoUrl,
            supervisorName: taskFormData.supervisorName,
            deliverable: taskFormData.deliverable,
            deadline: taskFormData.deadline,
            requirements: taskFormData.requirements.split(",").map(r => r.trim()).filter(r => r)
        };

        if (editingTask) {
            setTasks(prev => prev.map(t => t.id === editingTask.id ? taskData : t));
        } else {
            setTasks(prev => [...prev, taskData]);
        }

        setShowTaskDialog(false);
        resetTaskForm();
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId: string) => {
        if (confirm("Are you sure you want to delete this task?")) {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const projectData = {
            // Basic fields
            title: formData.title,
            description: formData.description,
            projectType: formData.projectType,
            maxParticipants: parseInt(formData.maxParticipants),
            startDate: new Date(formData.startDate),
            expectedCompletionDate: new Date(formData.expectedCompletionDate),
            status: formData.status,
            isPublic: formData.isPublic,
            
            // Enhanced fields
            specialty: formData.specialty,
            leadMentor: formData.leadMentor,
            projectLead: formData.projectLead,
            collaboration: formData.collaboration,
            priorityLevel: formData.priorityLevel,
            expectedOutcome: formData.expectedOutcome,
            methodology: formData.methodology,
            timeline: formData.timeline,
            authorshipCriteria: formData.authorshipCriteria,
            skillsToLearn: formData.skillsToLearn.split(",").map(s => s.trim()).filter(s => s),
            readingMaterials: formData.readingMaterials.split(",").map(s => s.trim()).filter(s => s),
            templateForms: formData.templateForms.split(",").map(s => s.trim()).filter(s => s),
            teamMembers: formData.teamMembers.split(",").map(s => s.trim()).filter(s => s),
            tasks: tasks
        };

        try {
            const url = editingProject ? `/api/admin/projects/${editingProject.id}` : '/api/projects';
            const method = editingProject ? 'PUT' : 'POST';
            
            console.log('Creating project with data:', projectData);
            const response = await apiRequest(method, url, projectData);
            const result = await response.json();
            console.log('Project created successfully:', result);
            
            // Refresh the projects list
            await fetchProjects();
            setShowCreateDialog(false);
            resetForm();
            setEditingProject(null);
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project. Please try again.');
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            try {
                await apiRequest('DELETE', `/api/admin/projects/${projectId}`);
                // Refresh the projects list
                await fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project. Please try again.');
            }
        }
    };



    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'recruiting':
                return 'bg-blue-100 text-blue-800';
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'analysis':
                return 'bg-yellow-100 text-yellow-800';
            case 'writing':
                return 'bg-purple-100 text-purple-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout currentPage="projects">
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
                        <p className="text-gray-600">Manage research projects and collaborations</p>
                    </div>
                    <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {projects.filter(p => p.status === 'active').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Recruiting</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {projects.filter(p => p.status === 'recruiting').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Participants</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {projects.reduce((sum, p) => sum + (p.currentParticipants || 0), 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading projects...</p>
                    </div>
                ) : (
                    <>
                        {/* Projects Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {projects.map((project) => (
                        <Card key={project.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge className="bg-blue-100 text-blue-800">
                                        {project.projectType.replace('_', ' ')}
                                    </Badge>
                                    <Badge className={getStatusColor(project.status)}>
                                        {project.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                <CardDescription className="text-gray-600">
                                    <div className="space-y-1">
                                        <div><strong>Project Type:</strong> {project.projectType.replace('_', ' ')}</div>
                                        <div><strong>Status:</strong> {project.status}</div>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span><strong>Participants:</strong> {project.currentParticipants || 0}/{project.maxParticipants || 0}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span><strong>Start:</strong> {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span><strong>Expected Completion:</strong> {project.expectedCompletionDate ? new Date(project.expectedCompletionDate).toLocaleDateString() : 'Not set'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleEditProject(project)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteProject(project.id)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                        </div>

                        {projects.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-4">No projects found</p>
                                <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Project
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {/* Create/Edit Enhanced Project Dialog */}
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProject ? "Edit Enhanced Project" : "Create Enhanced Project"}
                            </DialogTitle>
                            <DialogDescription>
                                Create a comprehensive research project with detailed information and tasks
                            </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="resources">Resources</TabsTrigger>
                                <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
                            </TabsList>

                            <div className="max-h-[60vh] overflow-y-auto mt-4">
                                <form onSubmit={handleSubmit}>
                                    <TabsContent value="basic" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Project Title *</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g., Efficacy of Endoscopic Sleeve Gastroplasty vs POSE-2"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Project Overview *</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Comprehensive description of the research project aims and methodology"
                                                rows={4}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="specialty">Specialty *</Label>
                                                <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select specialty" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                                                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                        <SelectItem value="Oncology">Oncology</SelectItem>
                                                        <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                                                        <SelectItem value="Pulmonology">Pulmonology</SelectItem>
                                                        <SelectItem value="Nephrology">Nephrology</SelectItem>
                                                        <SelectItem value="Neurology">Neurology</SelectItem>
                                                        <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                                                        <SelectItem value="Infectious Disease">Infectious Disease</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="projectType">Project Type *</Label>
                                                <Select value={formData.projectType} onValueChange={(value) => setFormData({ ...formData, projectType: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select project type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="meta_analysis">Meta-analysis</SelectItem>
                                                        <SelectItem value="systematic_review">Systematic Review</SelectItem>
                                                        <SelectItem value="original_research">Original Research</SelectItem>
                                                        <SelectItem value="survey">Survey</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="leadMentor">Lead Mentor *</Label>
                                                <Input
                                                    id="leadMentor"
                                                    value={formData.leadMentor}
                                                    onChange={(e) => setFormData({ ...formData, leadMentor: e.target.value })}
                                                    placeholder="e.g., Dr. Aasma Shaukat (NYU Langone)"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="projectLead">Project Lead *</Label>
                                                <Input
                                                    id="projectLead"
                                                    value={formData.projectLead}
                                                    onChange={(e) => setFormData({ ...formData, projectLead: e.target.value })}
                                                    placeholder="e.g., Dr. Umar Farooq"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="collaboration">Collaboration *</Label>
                                            <Input
                                                id="collaboration"
                                                value={formData.collaboration}
                                                onChange={(e) => setFormData({ ...formData, collaboration: e.target.value })}
                                                placeholder="e.g., GI REACH × Magister Chirurgiae"
                                                required
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="details" className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="status">Status *</Label>
                                                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="accepting-mentees">Accepting Mentees</SelectItem>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="recruiting">Recruiting</SelectItem>
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="priorityLevel">Priority Level *</Label>
                                                <Select value={formData.priorityLevel} onValueChange={(value) => setFormData({ ...formData, priorityLevel: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select priority" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="high-impact">High Impact</SelectItem>
                                                        <SelectItem value="medium-impact">Medium Impact</SelectItem>
                                                        <SelectItem value="low-impact">Low Impact</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="maxParticipants">Max Participants *</Label>
                                                <Input
                                                    id="maxParticipants"
                                                    type="number"
                                                    value={formData.maxParticipants}
                                                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="startDate">Start Date *</Label>
                                                <Input
                                                    id="startDate"
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="expectedCompletionDate">Expected Completion Date *</Label>
                                                <Input
                                                    id="expectedCompletionDate"
                                                    type="date"
                                                    value={formData.expectedCompletionDate}
                                                    onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="expectedOutcome">Expected Outcome *</Label>
                                            <Input
                                                id="expectedOutcome"
                                                value={formData.expectedOutcome}
                                                onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
                                                placeholder="e.g., PubMed-indexed publication"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="methodology">Methodology</Label>
                                            <Textarea
                                                id="methodology"
                                                value={formData.methodology}
                                                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                                                placeholder="Detailed methodology description"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="timeline">Timeline</Label>
                                            <Textarea
                                                id="timeline"
                                                value={formData.timeline}
                                                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                                placeholder="Project timeline and phases"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="authorshipCriteria">Authorship Criteria</Label>
                                            <Textarea
                                                id="authorshipCriteria"
                                                value={formData.authorshipCriteria}
                                                onChange={(e) => setFormData({ ...formData, authorshipCriteria: e.target.value })}
                                                placeholder="Criteria for determining authorship"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="isPublic"
                                                checked={formData.isPublic}
                                                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                            />
                                            <Label htmlFor="isPublic">Make project public</Label>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="resources" className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="skillsToLearn">Skills to Learn (comma-separated)</Label>
                                            <Textarea
                                                id="skillsToLearn"
                                                value={formData.skillsToLearn}
                                                onChange={(e) => setFormData({ ...formData, skillsToLearn: e.target.value })}
                                                placeholder="e.g., Literature search strategy, Data extraction, Statistical analysis"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="readingMaterials">Reading Materials (comma-separated)</Label>
                                            <Textarea
                                                id="readingMaterials"
                                                value={formData.readingMaterials}
                                                onChange={(e) => setFormData({ ...formData, readingMaterials: e.target.value })}
                                                placeholder="e.g., PRISMA Guidelines, Cochrane Handbook"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="templateForms">Template Forms (comma-separated)</Label>
                                            <Textarea
                                                id="templateForms"
                                                value={formData.templateForms}
                                                onChange={(e) => setFormData({ ...formData, templateForms: e.target.value })}
                                                placeholder="e.g., Data Extraction Template, Quality Assessment Form"
                                                rows={2}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="teamMembers">Team Members (comma-separated)</Label>
                                            <Textarea
                                                id="teamMembers"
                                                value={formData.teamMembers}
                                                onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                                                placeholder="e.g., Dr. John Smith - Lead Researcher, Sarah Johnson - Research Coordinator"
                                                rows={3}
                                            />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="tasks" className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">Project Tasks</h3>
                                            <Button type="button" onClick={handleAddTask} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Task
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {tasks.map((task) => (
                                                <Card key={task.id} className="p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-medium">{task.title}</h4>
                                                                <Badge variant="secondary">{task.level}</Badge>
                                                                <Badge variant="outline">{task.slotsTotal} slots</Badge>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                                            <div className="text-xs text-gray-500">
                                                                <span className="mr-4">⏱️ {task.timeCommitment}</span>
                                                                <span>📅 {task.deadline}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEditTask(task)}
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDeleteTask(task.id)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}

                                            {tasks.length === 0 && (
                                                <div className="text-center py-8 text-gray-500">
                                                    <p>No tasks added yet.</p>
                                                    <p className="text-sm">Click "Add Task" to create project tasks.</p>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                            {editingProject ? "Update Project" : "Create Project"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Tabs>
                    </DialogContent>
                </Dialog>

                {/* Task Creation/Edit Dialog */}
                <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTask ? "Edit Task" : "Add New Task"}
                            </DialogTitle>
                            <DialogDescription>
                                Define a specific task that mentees can apply for
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmitTask} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="taskTitle">Task Title *</Label>
                                <Input
                                    id="taskTitle"
                                    value={taskFormData.title}
                                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                                    placeholder="e.g., Abstract screening"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="taskDescription">Task Description *</Label>
                                <Textarea
                                    id="taskDescription"
                                    value={taskFormData.description}
                                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                                    placeholder="Detailed description of what the task involves"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="slotsTotal">Total Slots *</Label>
                                    <Input
                                        id="slotsTotal"
                                        type="number"
                                        value={taskFormData.slotsTotal}
                                        onChange={(e) => setTaskFormData({ ...taskFormData, slotsTotal: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="level">Difficulty Level *</Label>
                                    <Select value={taskFormData.level} onValueChange={(value: any) => setTaskFormData({ ...taskFormData, level: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">Beginner</SelectItem>
                                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                                            <SelectItem value="Advanced">Advanced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timeCommitment">Time Commitment *</Label>
                                    <Input
                                        id="timeCommitment"
                                        value={taskFormData.timeCommitment}
                                        onChange={(e) => setTaskFormData({ ...taskFormData, timeCommitment: e.target.value })}
                                        placeholder="e.g., 5 hours/week for 3 weeks"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="supervisorName">Supervisor Name</Label>
                                    <Input
                                        id="supervisorName"
                                        value={taskFormData.supervisorName}
                                        onChange={(e) => setTaskFormData({ ...taskFormData, supervisorName: e.target.value })}
                                        placeholder="e.g., Dr. Sarah Johnson"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="taskDeadline">Task Deadline *</Label>
                                    <Input
                                        id="taskDeadline"
                                        value={taskFormData.deadline}
                                        onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                                        placeholder="e.g., 2025-01-15"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deliverable">Expected Deliverable *</Label>
                                <Textarea
                                    id="deliverable"
                                    value={taskFormData.deliverable}
                                    onChange={(e) => setTaskFormData({ ...taskFormData, deliverable: e.target.value })}
                                    placeholder="What the mentee should deliver upon completion"
                                    rows={2}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="teachingVideoUrl">Teaching Video URL</Label>
                                <Input
                                    id="teachingVideoUrl"
                                    value={taskFormData.teachingVideoUrl}
                                    onChange={(e) => setTaskFormData({ ...taskFormData, teachingVideoUrl: e.target.value })}
                                    placeholder="https://example.com/tutorial-video"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                                <Textarea
                                    id="requirements"
                                    value={taskFormData.requirements}
                                    onChange={(e) => setTaskFormData({ ...taskFormData, requirements: e.target.value })}
                                    placeholder="e.g., Complete teaching module, Basic understanding of research methodology"
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowTaskDialog(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    {editingTask ? "Update Task" : "Add Task"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}