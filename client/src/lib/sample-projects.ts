import type { EnhancedProject } from "@shared/project-types";

export const sampleProjects: EnhancedProject[] = [
  {
    id: "project-1",
    title: "Efficacy of Endoscopic Sleeve Gastroplasty vs POSE-2 for Weight Loss: A Meta-Analysis",
    specialty: "Gastroenterology",
    leadMentor: "Dr. Aasma Shaukat (NYU Langone)",
    projectLead: "Dr. Umar Farooq",
    collaboration: "GI REACH × Magister Chirurgiae",
    projectType: "meta-analysis",
    status: "accepting-mentees",
    openRoles: 6,
    totalRoles: 12,
    deadline: "2025-12-20",
    expectedOutcome: "PubMed-indexed publication",
    priorityLevel: "high-impact",
    overview: "This comprehensive meta-analysis aims to compare the efficacy of Endoscopic Sleeve Gastroplasty (ESG) versus POSE-2 procedures for weight loss in obese patients. The study will analyze data from multiple randomized controlled trials and observational studies to provide evidence-based recommendations for clinical practice.",
    skillsToLearn: [
      "Literature search strategy",
      "Data extraction",
      "Statistical analysis (RevMan/R)",
      "Manuscript writing"
    ],
    methodology: "We will conduct a systematic review and meta-analysis following PRISMA guidelines. Studies will be identified through comprehensive database searches, and data will be extracted using standardized forms. Statistical analysis will be performed using RevMan 5.4 and R software.",
    timeline: "Phase 1: Literature search (4 weeks), Phase 2: Data extraction (6 weeks), Phase 3: Statistical analysis (4 weeks), Phase 4: Manuscript writing (6 weeks)",
    readingMaterials: [
      "PRISMA Statement Guidelines",
      "Cochrane Handbook for Systematic Reviews",
      "Introduction to Meta-Analysis by Borenstein et al.",
      "RevMan 5.4 User Guide"
    ],
    templateForms: [
      "Data Extraction Template",
      "Quality Assessment Form",
      "PRISMA Checklist",
      "Search Strategy Template"
    ],
    authorshipCriteria: "Authorship will be determined based on ICMJE guidelines. Contributors who complete assigned tasks satisfactorily and participate in manuscript preparation will be considered for co-authorship. Lead contributors may be eligible for first or second authorship positions.",
    teamMembers: [
      "Dr. Aasma Shaukat - Lead Mentor",
      "Dr. Umar Farooq - Project Lead",
      "Sarah Johnson - Research Coordinator",
      "Michael Chen - Statistical Analyst"
    ],
    tasks: [
      {
        id: "task-1-1",
        title: "Abstract screening",
        description: "Screen abstracts for inclusion/exclusion criteria based on predefined protocol",
        slotsTotal: 4,
        slotsOpen: 2,
        timeCommitment: "5 hours/week for 3 weeks",
        level: "Beginner",
        teachingVideoUrl: "https://example.com/abstract-screening-tutorial",
        supervisorName: "Dr. Sarah Johnson",
        deliverable: "Completed screening forms with rationale for inclusion/exclusion decisions",
        deadline: "2025-01-15",
        requirements: [
          "Complete teaching module on abstract screening",
          "Basic understanding of research methodology",
          "Familiarity with medical terminology"
        ]
      },
      {
        id: "task-1-2",
        title: "Data extraction",
        description: "Extract relevant data from selected studies using standardized forms",
        slotsTotal: 3,
        slotsOpen: 1,
        timeCommitment: "8 hours/week for 4 weeks",
        level: "Intermediate",
        teachingVideoUrl: "https://example.com/data-extraction-tutorial",
        supervisorName: "Dr. Michael Chen",
        deliverable: "Completed data extraction sheets with quality checks",
        deadline: "2025-02-15",
        requirements: [
          "Previous research experience preferred",
          "Familiarity with medical databases",
          "Attention to detail and accuracy"
        ]
      },
      {
        id: "task-1-3",
        title: "Statistical analysis",
        description: "Perform meta-analysis using RevMan and R software",
        slotsTotal: 2,
        slotsOpen: 1,
        timeCommitment: "10 hours/week for 4 weeks",
        level: "Advanced",
        teachingVideoUrl: "https://example.com/statistical-analysis-tutorial",
        supervisorName: "Dr. Michael Chen",
        deliverable: "Forest plots, funnel plots, and statistical analysis report",
        deadline: "2025-03-15",
        requirements: [
          "Experience with statistical software (R/RevMan)",
          "Understanding of meta-analysis methodology",
          "Previous publication experience preferred"
        ]
      },
      {
        id: "task-1-4",
        title: "Manuscript draft (introduction/discussion)",
        description: "Write introduction and discussion sections of the manuscript",
        slotsTotal: 2,
        slotsOpen: 1,
        timeCommitment: "6 hours/week for 5 weeks",
        level: "Intermediate",
        supervisorName: "Dr. Aasma Shaukat",
        deliverable: "Well-written introduction and discussion sections following journal guidelines",
        deadline: "2025-04-01",
        requirements: [
          "Strong academic writing skills",
          "Familiarity with medical literature",
          "Previous manuscript writing experience"
        ]
      },
      {
        id: "task-1-5",
        title: "Proofreading & references",
        description: "Final proofreading and reference formatting",
        slotsTotal: 2,
        slotsOpen: 2,
        timeCommitment: "3 hours/week for 2 weeks",
        level: "Beginner",
        supervisorName: "Sarah Johnson",
        deliverable: "Proofread manuscript with properly formatted references",
        deadline: "2025-04-15",
        requirements: [
          "Excellent attention to detail",
          "Familiarity with reference management software",
          "Strong English language skills"
        ]
      }
    ]
  },
  {
    id: "project-2",
    title: "Impact of Telemedicine on Rural Healthcare Access: A Systematic Review",
    specialty: "Internal Medicine",
    leadMentor: "Dr. Jennifer Martinez (Mayo Clinic)",
    projectLead: "Dr. Ahmed Hassan",
    collaboration: "GI REACH × Rural Health Initiative",
    projectType: "systematic-review",
    status: "recruiting",
    openRoles: 4,
    totalRoles: 8,
    deadline: "2025-11-30",
    expectedOutcome: "High-impact journal publication",
    priorityLevel: "medium-impact",
    overview: "This systematic review will examine the impact of telemedicine interventions on healthcare access and outcomes in rural populations. We will analyze studies from the past 10 years to identify best practices and barriers to implementation.",
    skillsToLearn: [
      "Systematic review methodology",
      "Database searching",
      "Critical appraisal",
      "Evidence synthesis"
    ],
    methodology: "Following PRISMA-P guidelines, we will search multiple databases including PubMed, Embase, and Cochrane Library. Studies will be screened independently by two reviewers, with conflicts resolved by a third reviewer.",
    timeline: "Protocol development (2 weeks), Literature search (3 weeks), Screening (4 weeks), Data extraction (5 weeks), Analysis and writing (8 weeks)",
    readingMaterials: [
      "PRISMA-P Protocol Guidelines",
      "Systematic Review Methods Guide",
      "Telemedicine in Rural Healthcare - Review Article",
      "Critical Appraisal Tools Guide"
    ],
    templateForms: [
      "Protocol Template",
      "Screening Form",
      "Data Extraction Template",
      "Quality Assessment Checklist"
    ],
    authorshipCriteria: "Contributors completing substantial work on screening, data extraction, or writing will be considered for authorship. Order will be determined by level of contribution and manuscript preparation involvement.",
    tasks: [
      {
        id: "task-2-1",
        title: "Protocol development",
        description: "Develop and refine the systematic review protocol",
        slotsTotal: 2,
        slotsOpen: 1,
        timeCommitment: "6 hours/week for 2 weeks",
        level: "Intermediate",
        supervisorName: "Dr. Jennifer Martinez",
        deliverable: "Complete systematic review protocol following PRISMA-P guidelines",
        deadline: "2025-01-10",
        requirements: [
          "Understanding of systematic review methodology",
          "Experience with protocol development",
          "Strong analytical skills"
        ]
      },
      {
        id: "task-2-2",
        title: "Literature search",
        description: "Conduct comprehensive literature search across multiple databases",
        slotsTotal: 2,
        slotsOpen: 2,
        timeCommitment: "4 hours/week for 3 weeks",
        level: "Beginner",
        teachingVideoUrl: "https://example.com/literature-search-tutorial",
        supervisorName: "Dr. Ahmed Hassan",
        deliverable: "Complete search results with detailed search strategies",
        deadline: "2025-01-31",
        requirements: [
          "Familiarity with medical databases",
          "Basic understanding of search strategies",
          "Attention to detail"
        ]
      },
      {
        id: "task-2-3",
        title: "Title and abstract screening",
        description: "Screen titles and abstracts for eligibility",
        slotsTotal: 3,
        slotsOpen: 1,
        timeCommitment: "5 hours/week for 4 weeks",
        level: "Beginner",
        teachingVideoUrl: "https://example.com/screening-tutorial",
        supervisorName: "Research Coordinator",
        deliverable: "Completed screening with inclusion/exclusion decisions",
        deadline: "2025-02-28",
        requirements: [
          "Complete training module",
          "Good reading comprehension",
          "Ability to follow protocols precisely"
        ]
      }
    ]
  },
  {
    id: "project-3",
    title: "Antibiotic Resistance Patterns in ICU Settings: Multi-Center Analysis",
    specialty: "Infectious Disease",
    leadMentor: "Dr. Robert Kim (Johns Hopkins)",
    projectLead: "Dr. Lisa Wang",
    collaboration: "GI REACH × Infectious Disease Society",
    projectType: "original-research",
    status: "active",
    openRoles: 2,
    totalRoles: 10,
    deadline: "2025-10-15",
    expectedOutcome: "PubMed-indexed publication",
    priorityLevel: "high-impact",
    overview: "This multi-center observational study will analyze antibiotic resistance patterns in ICU patients across 15 hospitals. The study aims to identify risk factors and develop predictive models for antibiotic resistance.",
    skillsToLearn: [
      "Clinical data analysis",
      "Statistical modeling",
      "Epidemiological methods",
      "Multi-center study coordination"
    ],
    methodology: "Retrospective analysis of ICU patient data from participating centers. Data will be collected using standardized forms and analyzed using advanced statistical methods including machine learning approaches.",
    timeline: "Data collection (8 weeks), Data cleaning (3 weeks), Statistical analysis (6 weeks), Manuscript preparation (8 weeks)",
    readingMaterials: [
      "Epidemiological Methods in Infectious Disease",
      "Statistical Analysis of Medical Data",
      "Antibiotic Resistance Guidelines",
      "Multi-center Study Design Principles"
    ],
    templateForms: [
      "Data Collection Form",
      "Quality Control Checklist",
      "Statistical Analysis Plan",
      "Site Coordination Template"
    ],
    authorshipCriteria: "Given the complexity of this multi-center study, authorship will be based on substantial contributions to study design, data collection, analysis, or manuscript preparation. Site coordinators and major contributors will be considered for authorship.",
    tasks: [
      {
        id: "task-3-1",
        title: "Data quality assurance",
        description: "Review and validate collected data for accuracy and completeness",
        slotsTotal: 3,
        slotsOpen: 1,
        timeCommitment: "7 hours/week for 6 weeks",
        level: "Intermediate",
        supervisorName: "Dr. Lisa Wang",
        deliverable: "Clean dataset with quality assurance report",
        deadline: "2025-02-01",
        requirements: [
          "Experience with clinical data",
          "Attention to detail",
          "Familiarity with data management software"
        ]
      },
      {
        id: "task-3-2",
        title: "Statistical analysis support",
        description: "Assist with advanced statistical analysis and modeling",
        slotsTotal: 2,
        slotsOpen: 1,
        timeCommitment: "10 hours/week for 5 weeks",
        level: "Advanced",
        supervisorName: "Dr. Robert Kim",
        deliverable: "Statistical analysis results with interpretation",
        deadline: "2025-03-15",
        requirements: [
          "Advanced statistical knowledge",
          "Experience with R or SAS",
          "Understanding of epidemiological methods"
        ]
      }
    ]
  }
];

export const getProjectById = (id: string): EnhancedProject | undefined => {
  return sampleProjects.find(project => project.id === id);
};

export const getProjectsByStatus = (status: string): EnhancedProject[] => {
  return sampleProjects.filter(project => project.status === status);
};

export const getProjectsBySpecialty = (specialty: string): EnhancedProject[] => {
  return sampleProjects.filter(project => project.specialty === specialty);
};