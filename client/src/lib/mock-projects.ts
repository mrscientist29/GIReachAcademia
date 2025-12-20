// Database-compatible Project interface
export interface Project {
  id: string;
  title: string;
  description: string;
  projectType: string;
  status: string;
  maxParticipants: number;
  currentParticipants: number;
  leadResearcherId?: string;
  startDate: string;
  expectedCompletionDate: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Extended interface for display purposes (can be used for mock data)
export interface ExtendedProject extends Project {
  fullDescription?: string;
  specialty?: string;
  category?: string;
  leadMentor?: string;
  giReachProjectLead?: string;
  collaboration?: string;
  difficulty?: string;
  duration?: string;
  openRoles?: number;
  endDate?: string;
  deadline?: string;
  expectedOutcome?: string;
  priorityLevel?: string;
  requirements?: string[];
  skills?: string[];
}

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Efficacy of Endoscopic Sleeve Gastroplasty vs POSE-2 for Weight Loss: A Meta-Analysis",
    description: "This comprehensive meta-analysis examines the effectiveness of Endoscopic Sleeve Gastroplasty compared to POSE-2 procedures for weight loss outcomes. Mentees will gain hands-on experience in systematic literature review, data extraction, and statistical analysis.",
    projectType: "meta_analysis",
    status: "recruiting",
    maxParticipants: 12,
    currentParticipants: 6,
    startDate: "2024-02-01",
    expectedCompletionDate: "2024-08-01",
    isPublic: true
  },
  {
    id: "2",
    title: "Novel Therapeutic Approaches in Gastroenterology",
    description: "This advanced research project focuses on developing and testing new therapeutic approaches for treating complex gastrointestinal disorders, including inflammatory bowel disease and functional disorders.",
    projectType: "original_research",
    status: "recruiting",
    maxParticipants: 8,
    currentParticipants: 3,
    startDate: "2024-03-15",
    expectedCompletionDate: "2025-03-15",
    isPublic: true
  },
  {
    id: "3",
    title: "Efficacy of Immunotherapy in Cancer Treatment",
    description: "This comprehensive meta-analysis examines the effectiveness of various immunotherapy treatments across different cancer types, analyzing data from multiple clinical trials and real-world studies.",
    projectType: "meta_analysis",
    status: "active",
    maxParticipants: 10,
    currentParticipants: 8,
    startDate: "2023-09-01",
    expectedCompletionDate: "2024-06-01",
    isPublic: true
  }
];