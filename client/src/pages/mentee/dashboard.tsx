import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, Clock, Eye, LogOut, User, BookOpen, CheckCircle, AlertCircle, Trophy, Target } from "lucide-react";
import { useLocation } from "wouter";
import { type GroupProject } from "@shared/schema";
import { ProjectCard } from "@/components/project-card";
import { ProjectFiltersComponent } from "@/components/project-filters";
import { TaskApplicationDialog } from "@/components/task-application-dialog";
import type { EnhancedProject, ProjectFilters, ProjectTask } from "@shared/project-types";
import { sampleProjects } from "@/lib/sample-projects";
import { isAuthenticated, getUserData, authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    institution?: string;
    fieldOfStudy?: string;
}

export default function MenteeDashboard() {
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Authentication check
    useEffect(() => {
        const checkAuth = () => {
            console.log('MenteeDashboard: Checking authentication...');
            
            if (!isAuthenticated()) {
                console.log('MenteeDashboard: Not authenticated, redirecting to login');
                setLocation('/login');
                return;
            }

            const userData = getUserData();
            if (!userData) {
                console.log('MenteeDashboard: No user data, redirecting to login');
                setLocation('/login');
                return;
            }

            console.log('MenteeDashboard: User authenticated:', userData);
            console.log('MenteeDashboard: User properties:', {
                id: userData.id,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                institution: userData.institution
            });
            setUser(userData);
            setIsLoading(false);
        };

        checkAuth();
    }, [setLocation]);
    const [projects, setProjects] = useState<EnhancedProject[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<EnhancedProject[]>([]);
    const [filters, setFilters] = useState<ProjectFilters>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
    const [showTaskApplication, setShowTaskApplication] = useState(false);
    const [myTasks, setMyTasks] = useState<any[]>([]);
    const [myProgress, setMyProgress] = useState<any[]>([]);

    // Fetch projects on component mount
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // For now, use sample projects. In production, this would fetch from API
                // const response = await fetch('/api/projects');
                // const data = await response.json();
                
                // Use sample projects for demonstration
                setProjects(sampleProjects);
                setFilteredProjects(sampleProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
                // Fallback to sample projects
                setProjects(sampleProjects);
                setFilteredProjects(sampleProjects);
            }
        };
        fetchProjects();
    }, []);

    // Convert regular project to enhanced project format
    const convertToEnhancedProject = (project: GroupProject): EnhancedProject => {
        return {
            id: project.id,
            title: project.title,
            specialty: 'Gastroenterology', // Default, should come from project data
            leadMentor: 'Dr. Aasma Shaukat', // Default, should come from project data
            projectLead: 'Dr. Umar Farooq', // Default, should come from project data
            collaboration: 'GI REACH × Magister Chirurgiae',
            projectType: project.projectType as any,
            status: project.status as any,
            openRoles: project.maxParticipants - project.currentParticipants,
            totalRoles: project.maxParticipants,
            deadline: project.expectedCompletionDate || '2025-12-20',
            expectedOutcome: 'PubMed-indexed publication',
            priorityLevel: 'high-impact',
            overview: project.description,
            skillsToLearn: [
                'Literature search strategy',
                'Data extraction',
                'Statistical analysis (RevMan/R)',
                'Manuscript writing'
            ],
            tasks: [
                {
                    id: `${project.id}-task-1`,
                    title: 'Abstract screening',
                    description: 'Screen abstracts for inclusion/exclusion criteria',
                    slotsTotal: 4,
                    slotsOpen: 2,
                    timeCommitment: '5 hours/week for 3 weeks',
                    level: 'Beginner',
                    deliverable: 'Completed screening forms with rationale',
                    deadline: '2025-01-15',
                    requirements: ['Complete teaching module', 'Basic understanding of research methodology']
                },
                {
                    id: `${project.id}-task-2`,
                    title: 'Data extraction',
                    description: 'Extract relevant data from selected studies',
                    slotsTotal: 3,
                    slotsOpen: 1,
                    timeCommitment: '8 hours/week for 4 weeks',
                    level: 'Intermediate',
                    deliverable: 'Completed data extraction sheets',
                    deadline: '2025-02-15',
                    requirements: ['Previous research experience', 'Familiarity with medical databases']
                }
            ]
        };
    };

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");

        if (!token || !userData) {
            setLocation("/auth/login");
            return;
        }

        setUser(JSON.parse(userData));
    }, [setLocation]);

    // Filter projects based on search and filters
    useEffect(() => {
        let filtered = projects;

        // Apply search query
        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.leadMentor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.overview.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply filters
        if (filters.specialty?.length) {
            filtered = filtered.filter(project => 
                filters.specialty!.includes(project.specialty)
            );
        }

        if (filters.projectType?.length) {
            filtered = filtered.filter(project => 
                filters.projectType!.includes(project.projectType)
            );
        }

        if (filters.status?.length) {
            filtered = filtered.filter(project => 
                filters.status!.includes(project.status)
            );
        }

        if (filters.mentorName) {
            filtered = filtered.filter(project =>
                project.leadMentor.toLowerCase().includes(filters.mentorName!.toLowerCase())
            );
        }

        setFilteredProjects(filtered);
    }, [projects, searchQuery, filters]);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            toast({
                title: "Logged out successfully",
                description: "You have been logged out. See you next time!",
            });
            setLocation("/");
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if API call fails
            toast({
                title: "Logged out",
                description: "You have been logged out.",
            });
            setLocation("/");
        }
    };

    const handleTaskApplication = (taskId: string) => {
        const task = projects
            .flatMap(p => p.tasks)
            .find(t => t.id === taskId);
        
        if (task) {
            setSelectedTask(task);
            setShowTaskApplication(true);
        }
    };

    const handleSubmitTaskApplication = async (application: any) => {
        try {
            // Here you would submit the application to your API
            console.log('Submitting task application:', application);
            
            // For now, just show success message
            alert('Application submitted successfully!');
            setShowTaskApplication(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again.');
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

    if (!user) {
        return (
            <div className="min-h-screen bg-blue-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                    <p className="mt-2 text-white">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // If no user after loading, don't render anything (redirect will happen)
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-blue-900">
            {/* Header */}
            <header className="bg-blue-800 shadow-lg border-b border-blue-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">GI REACH</h1>
                                    <p className="text-sm text-blue-200">Mentee Dashboard</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        {user.firstName ? user.firstName.charAt(0) : (user.email ? user.email.charAt(0) : 'U')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-white">
                                        {user.firstName && user.lastName
                                            ? `${user.firstName} ${user.lastName}`
                                            : (user.email || 'User')}
                                    </p>
                                    {user.institution && (
                                        <p className="text-xs text-blue-200">{user.institution}</p>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                size="sm"
                                className="text-white hover:text-blue-200 hover:bg-blue-700"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {user?.firstName || 'Mentee'}!
                    </h2>
                    <p className="text-blue-200">
                        Explore available research projects and advance your academic journey.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-blue-800 border-blue-700">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-blue-200">Available Projects</p>
                                    <p className="text-2xl font-bold text-white">{projects.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-800 border-green-700">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-600 rounded-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-green-200">Accepting Mentees</p>
                                    <p className="text-2xl font-bold text-white">
                                        {projects.filter(p => p.status === 'accepting-mentees').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-800 border-purple-700">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-600 rounded-lg">
                                    <Target className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-purple-200">My Tasks</p>
                                    <p className="text-2xl font-bold text-white">{myTasks.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-yellow-800 border-yellow-700">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-600 rounded-lg">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-yellow-200">Completed</p>
                                    <p className="text-2xl font-bold text-white">
                                        {myProgress.filter(p => p.status === 'completed').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Dashboard Tabs */}
                <Tabs defaultValue="available" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-blue-800 border-blue-700">
                        <TabsTrigger value="available" className="text-white data-[state=active]:bg-blue-600">
                            Available Projects
                        </TabsTrigger>
                        <TabsTrigger value="my-tasks" className="text-white data-[state=active]:bg-blue-600">
                            My Tasks
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="text-white data-[state=active]:bg-blue-600">
                            Completed Tasks
                        </TabsTrigger>
                        <TabsTrigger value="certificates" className="text-white data-[state=active]:bg-blue-600">
                            Certificates
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="text-white data-[state=active]:bg-blue-600">
                            Progress
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="available" className="mt-6">
                        {/* Search and Filters */}
                        <ProjectFiltersComponent
                            filters={filters}
                            onFiltersChange={setFilters}
                            onSearch={setSearchQuery}
                            searchQuery={searchQuery}
                        />

                        {/* Projects Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onApplyToTask={handleTaskApplication}
                                    isAuthenticated={true}
                                />
                            ))}
                        </div>

                        {filteredProjects.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-xl text-blue-100">No projects match your current filters.</p>
                                <p className="text-blue-200 mt-2">Try adjusting your search criteria.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="my-tasks" className="mt-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Active Tasks</CardTitle>
                                <CardDescription>
                                    Tasks you're currently working on across different projects
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {myTasks.length === 0 ? (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No active tasks yet.</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Apply to tasks in available projects to get started.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myTasks.map((task, index) => (
                                            <div key={index} className="p-4 border rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold">{task.title}</h4>
                                                    <Badge variant="secondary">{task.status}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Due: {task.deadline}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="completed" className="mt-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Completed Tasks</CardTitle>
                                <CardDescription>
                                    Tasks you've successfully completed with feedback
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No completed tasks yet.</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Complete your first task to see it here with feedback.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="certificates" className="mt-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Certificates & Feedback</CardTitle>
                                <CardDescription>
                                    Your achievements and mentor feedback
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No certificates earned yet.</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Complete projects to earn certificates and recognition.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="progress" className="mt-6">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Authorship Progress</CardTitle>
                                <CardDescription>
                                    Track your contributions and authorship eligibility
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No progress to track yet.</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Start working on tasks to track your authorship progress.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Task Application Dialog */}
            <TaskApplicationDialog
                task={selectedTask}
                isOpen={showTaskApplication}
                onClose={() => {
                    setShowTaskApplication(false);
                    setSelectedTask(null);
                }}
                onSubmit={handleSubmitTaskApplication}
            />
        </div>
    );
}