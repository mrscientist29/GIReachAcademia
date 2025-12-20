// Enhanced project types for the research mentorship platform

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  slotsTotal: number;
  slotsOpen: number;
  timeCommitment: string; // e.g., "5 hours/week for 3 weeks"
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  teachingVideoUrl?: string;
  supervisorName?: string;
  deliverable: string;
  deadline: string;
  requirements: string[];
}

export interface EnhancedProject {
  id: string;
  title: string;
  specialty: string;
  leadMentor: string;
  projectLead: string;
  collaboration: string;
  projectType: 'meta-analysis' | 'systematic-review' | 'original-research' | 'survey';
  status: 'accepting-mentees' | 'active' | 'completed' | 'recruiting';
  openRoles: number;
  totalRoles: number;
  deadline: string;
  expectedOutcome: string;
  priorityLevel: 'high-impact' | 'medium-impact' | 'low-impact';
  overview: string;
  skillsToLearn: string[];
  tasks: ProjectTask[];
  methodology?: string;
  timeline?: string;
  readingMaterials?: string[];
  templateForms?: string[];
  authorshipCriteria?: string;
  teamMembers?: string[];
}

export interface TaskApplication {
  id: string;
  taskId: string;
  projectId: string;
  menteeId: string;
  status: 'pending' | 'accepted' | 'rejected';
  applicationText: string;
  exampleWork?: string;
  appliedAt: string;
}

export interface MenteeProgress {
  id: string;
  menteeId: string;
  projectId: string;
  taskId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'feedback-received';
  completedAt?: string;
  feedback?: string;
  rating?: number;
}

export interface ProjectFilters {
  specialty?: string[];
  projectType?: string[];
  mentorName?: string;
  institution?: string;
  difficultyLevel?: string[];
  timeCommitment?: string[];
  status?: string[];
}