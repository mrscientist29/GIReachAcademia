import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { ProjectCard } from "@/components/project-card";
import { ProjectFiltersComponent } from "@/components/project-filters";
import { TaskApplicationDialog } from "@/components/task-application-dialog";
import { sampleProjects } from "@/lib/sample-projects";
import type { EnhancedProject, ProjectFilters, ProjectTask } from "@shared/project-types";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export default function Projects() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [projects, setProjects] = useState<EnhancedProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<EnhancedProject[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [showTaskApplication, setShowTaskApplication] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in and fetch projects
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      // Use sample projects for demonstration
      setProjects(sampleProjects);
      setFilteredProjects(sampleProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects(sampleProjects);
      setFilteredProjects(sampleProjects);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleTaskApplication = (taskId: string) => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

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
      console.log('Submitting task application:', application);
      alert('Application submitted successfully!');
      setShowTaskApplication(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleLogin = () => {
    setLocation("/auth/login");
  };

  const handleRegister = () => {
    setLocation("/auth/register");
  };





  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Research Projects</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join collaborative research projects and contribute to advancing medical knowledge. 
            Work alongside experienced researchers and build your academic portfolio.
          </p>
        </div>

        {/* User Status */}
        {user && (
          <div className="mb-8 p-4 bg-blue-800 rounded-lg">
            <p className="text-blue-100">
              Welcome back, {user.firstName || user.email}! You can now apply to project tasks.
            </p>
            <Button
              onClick={() => setLocation("/mentee/dashboard")}
              className="mt-2 bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {/* Search and Filters */}
        <ProjectFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onApplyToTask={handleTaskApplication}
              isAuthenticated={!!user}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-xl text-blue-100">No projects match your current filters.</p>
            <p className="text-blue-200 mt-2">Try adjusting your search criteria or check back soon for new opportunities!</p>
          </div>
        )}
      </div>

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You need to be logged in to apply for project tasks and participate in research projects.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Ready to get started?</h4>
            <p className="text-sm text-gray-600 mb-2">
              Join our research community and start contributing to meaningful medical research projects.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleLogin} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Login
            </Button>
            <Button onClick={handleRegister} variant="outline" className="flex-1">
              Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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