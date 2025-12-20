// Webinar Management System

export interface CustomQuestion {
  id: string;
  question: string;
  required: boolean;
}

export interface WebinarRegistration {
  id: string;
  webinarId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  experience?: string; // Optional field
  interests: string;
  customQuestionAnswers?: { [questionId: string]: string }; // Answers to custom questions
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Webinar {
  id: string;
  title: string;
  description: string;
  speaker: {
    name: string;
    title: string;
    bio: string;
    image: string;
  };
  date: string;
  time: string;
  duration: number; // in minutes
  timezone: string;
  maxAttendees: number;
  currentAttendees: number;
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
  category: string;
  tags: string[];
  meetingLink: string;
  materials: string[];
  image: string;
  customQuestions: CustomQuestion[]; // Array of custom questions for registration
  includeExperienceField: boolean; // Whether to show years of experience field
  createdAt: string;
  updatedAt: string;
}

// Default webinars for demonstration
const defaultWebinars: Webinar[] = [
  {
    id: 'webinar-1',
    title: 'Advanced Gastroenterology Research Methods',
    description: 'Join us for an in-depth exploration of cutting-edge research methodologies in gastroenterology. This webinar will cover statistical analysis, data collection techniques, and publication strategies.',
    speaker: {
      name: 'Dr. Sarah Ahmed',
      title: 'Professor of Gastroenterology',
      bio: 'Dr. Ahmed is a leading researcher in gastroenterology with over 15 years of experience and 100+ publications.',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300'
    },
    date: '2024-12-25',
    time: '14:00',
    duration: 90,
    timezone: 'PKT',
    maxAttendees: 100,
    currentAttendees: 23,
    status: 'published',
    category: 'Research Methods',
    tags: ['research', 'methodology', 'statistics'],
    meetingLink: 'https://zoom.us/j/123456789',
    materials: ['Research Guidelines.pdf', 'Statistical Analysis Template.xlsx'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    customQuestions: [
      {
        id: 'q1',
        question: 'What specific research methodology challenges are you currently facing?',
        required: true
      },
      {
        id: 'q2',
        question: 'Which statistical software do you currently use?',
        required: false
      }
    ],
    includeExperienceField: true,
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z'
  },
  {
    id: 'webinar-2',
    title: 'Clinical Trial Design in Hepatology',
    description: 'Learn about designing effective clinical trials in hepatology research. Topics include patient recruitment, endpoint selection, and regulatory considerations.',
    speaker: {
      name: 'Dr. Muhammad Khan',
      title: 'Clinical Research Director',
      bio: 'Dr. Khan specializes in hepatology clinical trials with expertise in drug development and regulatory affairs.',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300'
    },
    date: '2024-12-30',
    time: '16:00',
    duration: 120,
    timezone: 'PKT',
    maxAttendees: 75,
    currentAttendees: 12,
    status: 'published',
    category: 'Clinical Trials',
    tags: ['clinical trials', 'hepatology', 'research design'],
    meetingLink: 'https://zoom.us/j/987654321',
    materials: ['Trial Design Checklist.pdf'],
    image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
    customQuestions: [],
    includeExperienceField: false,
    createdAt: '2024-12-16T09:00:00Z',
    updatedAt: '2024-12-16T09:00:00Z'
  }
];

// Mock registrations
const defaultRegistrations: WebinarRegistration[] = [
  {
    id: 'reg-1',
    webinarId: 'webinar-1',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+92-300-1234567',
    organization: 'Karachi Medical College',
    position: 'Resident Doctor',
    experience: '2 years',
    interests: 'Research methodology, Statistical analysis',
    customQuestionAnswers: {
      'q1': 'I struggle with selecting appropriate statistical tests for small sample sizes in clinical studies.',
      'q2': 'SPSS and R'
    },
    registrationDate: '2024-12-18T14:30:00Z',
    status: 'confirmed'
  },
  {
    id: 'reg-2',
    webinarId: 'webinar-1',
    firstName: 'Fatima',
    lastName: 'Ali',
    email: 'fatima.ali@example.com',
    phone: '+92-301-9876543',
    organization: 'Lahore General Hospital',
    position: 'Research Coordinator',
    experience: '5 years',
    interests: 'Clinical research, Data analysis',
    customQuestionAnswers: {
      'q1': 'I need guidance on power analysis and sample size calculations for multi-center trials.',
      'q2': 'SAS and Python'
    },
    registrationDate: '2024-12-19T10:15:00Z',
    status: 'confirmed'
  }
];

// Webinar store using localStorage
class WebinarStore {
  private webinarsKey = 'gireach-webinars';
  private registrationsKey = 'gireach-registrations';

  // Webinar management
  getWebinars(): Webinar[] {
    try {
      const stored = localStorage.getItem(this.webinarsKey);
      const webinars = stored ? JSON.parse(stored) : defaultWebinars;
      
      // Migrate existing webinars to new structure
      return webinars.map((webinar: any) => ({
        ...webinar,
        customQuestions: webinar.customQuestions || (webinar.customQuestion ? [{
          id: 'legacy',
          question: webinar.customQuestion,
          required: false
        }] : []),
        includeExperienceField: webinar.includeExperienceField !== undefined ? webinar.includeExperienceField : true
      }));
    } catch (error) {
      console.error('Error loading webinars:', error);
      return defaultWebinars;
    }
  }

  getWebinar(id: string): Webinar | null {
    const webinars = this.getWebinars();
    return webinars.find(w => w.id === id) || null;
  }

  saveWebinar(webinar: Webinar): void {
    try {
      const webinars = this.getWebinars();
      const existingIndex = webinars.findIndex(w => w.id === webinar.id);
      
      if (existingIndex >= 0) {
        webinars[existingIndex] = { ...webinar, updatedAt: new Date().toISOString() };
      } else {
        webinars.push({ ...webinar, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
      
      localStorage.setItem(this.webinarsKey, JSON.stringify(webinars));
    } catch (error) {
      console.error('Error saving webinar:', error);
    }
  }

  deleteWebinar(id: string): void {
    try {
      const webinars = this.getWebinars().filter(w => w.id !== id);
      localStorage.setItem(this.webinarsKey, JSON.stringify(webinars));
      
      // Also delete related registrations
      const registrations = this.getRegistrations().filter(r => r.webinarId !== id);
      localStorage.setItem(this.registrationsKey, JSON.stringify(registrations));
    } catch (error) {
      console.error('Error deleting webinar:', error);
    }
  }

  // Registration management
  getRegistrations(): WebinarRegistration[] {
    try {
      const stored = localStorage.getItem(this.registrationsKey);
      const registrations = stored ? JSON.parse(stored) : defaultRegistrations;
      
      // Migrate existing registrations to new structure
      return registrations.map((registration: any) => ({
        ...registration,
        customQuestionAnswers: registration.customQuestionAnswers || (registration.customQuestionAnswer ? {
          'legacy': registration.customQuestionAnswer
        } : {})
      }));
    } catch (error) {
      console.error('Error loading registrations:', error);
      return defaultRegistrations;
    }
  }

  getWebinarRegistrations(webinarId: string): WebinarRegistration[] {
    return this.getRegistrations().filter(r => r.webinarId === webinarId);
  }

  registerForWebinar(registration: Omit<WebinarRegistration, 'id' | 'registrationDate' | 'status'>): string {
    try {
      const registrations = this.getRegistrations();
      const newRegistration: WebinarRegistration = {
        ...registration,
        id: `reg-${Date.now()}`,
        registrationDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      registrations.push(newRegistration);
      localStorage.setItem(this.registrationsKey, JSON.stringify(registrations));
      
      // Update webinar attendee count
      const webinars = this.getWebinars();
      const webinarIndex = webinars.findIndex(w => w.id === registration.webinarId);
      if (webinarIndex >= 0) {
        webinars[webinarIndex].currentAttendees += 1;
        localStorage.setItem(this.webinarsKey, JSON.stringify(webinars));
      }
      
      return newRegistration.id;
    } catch (error) {
      console.error('Error registering for webinar:', error);
      throw error;
    }
  }

  updateRegistrationStatus(registrationId: string, status: WebinarRegistration['status']): void {
    try {
      const registrations = this.getRegistrations();
      const registrationIndex = registrations.findIndex(r => r.id === registrationId);
      
      if (registrationIndex >= 0) {
        registrations[registrationIndex].status = status;
        localStorage.setItem(this.registrationsKey, JSON.stringify(registrations));
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
    }
  }

  // Utility methods
  getPublishedWebinars(): Webinar[] {
    return this.getWebinars().filter(w => w.status === 'published');
  }

  getUpcomingWebinars(): Webinar[] {
    const now = new Date();
    return this.getPublishedWebinars().filter(w => {
      const webinarDate = new Date(`${w.date}T${w.time}`);
      return webinarDate > now;
    });
  }

  generateWebinarId(): string {
    return `webinar-${Date.now()}`;
  }
}

export const webinarStore = new WebinarStore();

// Hook for using webinars in components
export function useWebinars() {
  const getWebinars = () => webinarStore.getWebinars();
  const getWebinar = (id: string) => webinarStore.getWebinar(id);
  const saveWebinar = (webinar: Webinar) => webinarStore.saveWebinar(webinar);
  const deleteWebinar = (id: string) => webinarStore.deleteWebinar(id);
  const getRegistrations = (webinarId?: string) => 
    webinarId ? webinarStore.getWebinarRegistrations(webinarId) : webinarStore.getRegistrations();
  const registerForWebinar = (registration: Omit<WebinarRegistration, 'id' | 'registrationDate' | 'status'>) =>
    webinarStore.registerForWebinar(registration);
  const updateRegistrationStatus = (registrationId: string, status: WebinarRegistration['status']) =>
    webinarStore.updateRegistrationStatus(registrationId, status);
  
  return {
    getWebinars,
    getWebinar,
    saveWebinar,
    deleteWebinar,
    getRegistrations,
    registerForWebinar,
    updateRegistrationStatus,
    getPublishedWebinars: () => webinarStore.getPublishedWebinars(),
    getUpcomingWebinars: () => webinarStore.getUpcomingWebinars()
  };
}