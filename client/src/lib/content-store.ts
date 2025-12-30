// Content Management System for dynamic page editing

export interface ContentSection {
  id: string;
  type: 'hero' | 'text' | 'stats' | 'services' | 'contact' | 'testimonials';
  title: string;
  content: string;
  imageUrl?: string;
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    padding?: string;
  };
  data?: any; // For complex data like stats, services, etc.
}

export interface PageContent {
  id: string;
  name: string;
  sections: ContentSection[];
}

// Default content for all pages
const defaultContent: Record<string, PageContent> = {
  home: {
    id: 'home',
    name: 'Homepage',
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        title: 'Advancing Medical Research Through Excellence',
        content: 'Join Pakistan\'s premier research community dedicated to advancing gastroenterology and medical sciences through collaborative research, mentorship, and academic excellence.',
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        styles: {
          backgroundColor: 'from-blue-50 to-indigo-100',
          textColor: 'text-gray-900',
          fontSize: 'text-4xl lg:text-6xl'
        }
      },
      {
        id: 'about-1',
        type: 'text',
        title: 'Leading Medical Research in Pakistan',
        content: 'GI REACH is Pakistan\'s premier gastroenterology research organization, dedicated to advancing medical knowledge through collaborative research, education, and clinical excellence.',
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'services-1',
        type: 'services',
        title: 'Our Services',
        content: 'Comprehensive support for researchers at every stage of their academic journey',
        styles: {
          backgroundColor: 'bg-gray-50',
          textColor: 'text-gray-900'
        },
        data: {
          services: [
            {
              id: 'mentorship',
              title: 'Research Mentorship',
              description: 'One-on-one guidance from experienced researchers to accelerate your academic growth and research methodology skills.',
              icon: 'GraduationCap',
              color: 'blue'
            },
            {
              id: 'publication',
              title: 'Publication Support',
              description: 'End-to-end manuscript preparation, peer review, and publication guidance with transparent co-authorship policies.',
              icon: 'FileText',
              color: 'green'
            },
            {
              id: 'education',
              title: 'Educational Programs',
              description: 'Workshops, webinars, and training sessions on research methodologies, statistical analysis, and academic writing.',
              icon: 'BookOpen',
              color: 'purple'
            }
          ]
        }
      },
      {
        id: 'stats-1',
        type: 'stats',
        title: 'Our Impact',
        content: 'Making a difference in medical research across Pakistan and beyond',
        styles: {
          backgroundColor: 'bg-blue-600',
          textColor: 'text-white'
        },
        data: {
          stats: [
            { label: 'Published Papers', value: '500+' },
            { label: 'Active Researchers', value: '200+' },
            { label: 'Partner Institutions', value: '50+' },
            { label: 'Years of Excellence', value: '15+' }
          ]
        }
      },
      {
        id: 'contact-1',
        type: 'contact',
        title: 'Get in Touch',
        content: 'Ready to advance your research career? Contact us to learn more about our programs and how we can support your academic journey.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        },
        data: {
          phone: '+92 (21) 1234-5678',
          email: 'info@gireach.pk',
          address: 'Karachi, Pakistan'
        }
      }
    ]
  },
  about: {
    id: 'about',
    name: 'About Us',
    sections: [
      {
        id: 'about-hero',
        type: 'hero',
        title: 'About GI REACH',
        content: 'Pakistan\'s premier gastroenterology research organization dedicated to advancing medical knowledge through collaborative research, education, and clinical excellence.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        styles: {
          backgroundColor: 'from-green-50 to-emerald-100',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'about-mission',
        type: 'text',
        title: 'Our Mission',
        content: 'To advance gastroenterology research in Pakistan through collaborative excellence, innovative methodologies, and comprehensive support for researchers at all career stages.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'about-vision',
        type: 'text',
        title: 'Our Vision',
        content: 'To be the leading platform for gastroenterology research in Pakistan, fostering a community of excellence that contributes to global medical knowledge and improves patient outcomes.',
        styles: {
          backgroundColor: 'bg-gray-50',
          textColor: 'text-gray-900'
        }
      }
    ]
  },
  programs: {
    id: 'programs',
    name: 'Programs',
    sections: [
      {
        id: 'programs-hero',
        type: 'hero',
        title: 'Research Programs',
        content: 'Comprehensive programs designed to support researchers at every stage of their academic journey.',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        styles: {
          backgroundColor: 'from-purple-50 to-pink-100',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'programs-mentorship',
        type: 'text',
        title: 'Mentorship Program',
        content: 'Our flagship mentorship program connects early-career researchers with experienced mentors in gastroenterology. Participants receive personalized guidance on research methodology, career development, and publication strategies.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'programs-fellowship',
        type: 'text',
        title: 'Research Fellowship',
        content: 'Competitive fellowship opportunities for outstanding researchers to conduct cutting-edge research in gastroenterology. Fellows receive funding, resources, and institutional support.',
        styles: {
          backgroundColor: 'bg-gray-50',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'programs-training',
        type: 'text',
        title: 'Training Workshops',
        content: 'Regular workshops covering research methodology, statistical analysis, grant writing, and publication strategies. Open to all members of the research community.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      }
    ]
  },
  publications: {
    id: 'publications',
    name: 'Publications',
    sections: [
      {
        id: 'publications-hero',
        type: 'hero',
        title: 'Research Publications',
        content: 'Discover our extensive collection of peer-reviewed research publications in gastroenterology and related fields.',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        styles: {
          backgroundColor: 'from-blue-50 to-cyan-100',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'publications-stats',
        type: 'stats',
        title: 'Publication Impact',
        content: 'Our research contributions to the global medical community',
        styles: {
          backgroundColor: 'bg-blue-600',
          textColor: 'text-white'
        },
        data: {
          stats: [
            { label: 'Published Papers', value: '500+' },
            { label: 'Citations', value: '2,500+' },
            { label: 'Impact Factor', value: '4.2' },
            { label: 'Journals', value: '50+' }
          ]
        }
      },
      {
        id: 'publications-support',
        type: 'text',
        title: 'Publication Support',
        content: 'We provide comprehensive support for researchers looking to publish their work, including manuscript preparation, peer review coordination, and journal selection guidance.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      }
    ]
  },
  resources: {
    id: 'resources',
    name: 'Resources',
    sections: [
      {
        id: 'resources-hero',
        type: 'hero',
        title: 'Research Resources',
        content: 'Access comprehensive resources to support your research journey, from methodology guides to statistical tools.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        styles: {
          backgroundColor: 'from-green-50 to-teal-100',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'resources-library',
        type: 'text',
        title: 'Digital Library',
        content: 'Access our extensive digital library containing research papers, methodology guides, statistical resources, and educational materials.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'resources-tools',
        type: 'text',
        title: 'Research Tools',
        content: 'Utilize our collection of research tools including statistical software, data collection templates, and analysis frameworks.',
        styles: {
          backgroundColor: 'bg-gray-50',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'resources-guidelines',
        type: 'text',
        title: 'Guidelines & Protocols',
        content: 'Follow our established guidelines and protocols for conducting ethical and rigorous research in gastroenterology.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      }
    ]
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    sections: [
      {
        id: 'contact-hero',
        type: 'hero',
        title: 'Contact Us',
        content: 'Get in touch with our team to learn more about our programs, research opportunities, and how we can support your academic journey.',
        imageUrl: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        styles: {
          backgroundColor: 'from-orange-50 to-red-100',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'contact-info',
        type: 'contact',
        title: 'Contact Information',
        content: 'Reach out to us through any of the following channels. We\'re here to help and answer any questions you may have.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        },
        data: {
          phone: '+92 (21) 1234-5678',
          email: 'info@gireach.pk',
          address: 'Karachi, Pakistan',
          hours: 'Monday - Friday: 9:00 AM - 5:00 PM'
        }
      },
      {
        id: 'contact-form',
        type: 'text',
        title: 'Send us a Message',
        content: 'Use our contact form to send us a message directly. We typically respond within 24-48 hours.',
        styles: {
          backgroundColor: 'bg-gray-50',
          textColor: 'text-gray-900'
        }
      }
    ]
  },
  join: {
    id: 'join',
    name: 'Join Us',
    sections: [
      {
        id: 'join-hero',
        type: 'hero',
        title: 'Join Our Community',
        content: 'Become part of Pakistan\'s premier gastroenterology research community and advance your academic career.',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        styles: {
          backgroundColor: 'from-indigo-50 to-purple-100',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'join-benefits',
        type: 'text',
        title: 'Membership Benefits',
        content: 'As a member of GI REACH, you\'ll gain access to exclusive research opportunities, mentorship programs, publication support, and a network of leading researchers in gastroenterology.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'join-requirements',
        type: 'text',
        title: 'Membership Requirements',
        content: 'We welcome researchers at all career stages, from medical students to senior faculty. Basic requirements include a commitment to ethical research practices and active participation in our community.',
        styles: {
          backgroundColor: 'bg-gray-50',
          textColor: 'text-gray-900'
        }
      },
      {
        id: 'join-process',
        type: 'text',
        title: 'Application Process',
        content: 'The application process is straightforward: submit your application form, provide your research interests and background, and participate in a brief interview with our membership committee.',
        styles: {
          backgroundColor: 'bg-white',
          textColor: 'text-gray-900'
        }
      }
    ]
  }
};

// Content store using database-first approach
class ContentStore {
  private storageKey = 'gireach-content';
  private cachedContent: Record<string, PageContent> = {};
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private savingPages = new Set<string>(); // Track pages currently being saved

  // Initialize content from database
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInitialize();
    return this.initPromise;
  }

  private async _doInitialize(): Promise<void> {
    try {
      console.log('ContentStore: Initializing content from database...');
      
      const response = await fetch('/api/content');
      if (response.ok) {
        const contentArray = await response.json();
        const content: Record<string, PageContent> = {};
        
        contentArray.forEach((page: any) => {
          content[page.pageId] = {
            id: page.pageId,
            name: page.pageName,
            sections: page.sections || []
          };
        });

        console.log('ContentStore: Loaded pages from database:', Object.keys(content));
        console.log('ContentStore: Home page sections:', content.home?.sections?.length || 0);

        // Initialize missing pages with defaults
        for (const pageId of Object.keys(defaultContent)) {
          if (!content[pageId]) {
            console.log(`ContentStore: Initializing missing page: ${pageId}`);
            content[pageId] = defaultContent[pageId];
            // Save missing page to database
            try {
              await this.savePageToDatabase(pageId, defaultContent[pageId]);
              console.log(`ContentStore: Saved default content for ${pageId} to database`);
            } catch (error) {
              console.warn(`ContentStore: Failed to save default content for ${pageId}:`, error);
            }
          }
        }

        this.cachedContent = content;
        this.isInitialized = true;
        
        // Cache to localStorage as backup
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(content));
          console.log('ContentStore: Content cached to localStorage');
        } catch (storageError) {
          console.warn('ContentStore: Failed to cache to localStorage:', storageError);
        }
        
        console.log('ContentStore: Initialization complete');
      } else {
        console.warn('ContentStore: Failed to load from database:', response.status);
        // Initialize with defaults and save to database
        await this.initializeWithDefaults();
      }
    } catch (error) {
      console.error('ContentStore: Error initializing from database:', error);
      // Initialize with defaults
      await this.initializeWithDefaults();
    }
  }

  private async initializeWithDefaults(): Promise<void> {
    console.log('ContentStore: Initializing with default content...');
    this.cachedContent = { ...defaultContent };
    this.isInitialized = true;
    
    // Try to save defaults to database
    for (const [pageId, content] of Object.entries(defaultContent)) {
      try {
        await this.savePageToDatabase(pageId, content);
        console.log(`ContentStore: Saved default ${pageId} to database`);
      } catch (error) {
        console.warn(`ContentStore: Failed to save default ${pageId}:`, error);
      }
    }
    
    // Cache to localStorage
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(defaultContent));
    } catch (error) {
      console.warn('ContentStore: Failed to cache defaults to localStorage:', error);
    }
  }

  private initializeLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        localStorage.setItem(this.storageKey, JSON.stringify(defaultContent));
        this.cachedContent = defaultContent;
        console.log('ContentStore: Initialized with default content');
      } else {
        const content = JSON.parse(stored);
        let needsUpdate = false;
        
        for (const pageId of Object.keys(defaultContent)) {
          if (!content[pageId]) {
            content[pageId] = defaultContent[pageId];
            needsUpdate = true;
            console.log(`ContentStore: Added missing page: ${pageId}`);
          }
        }
        
        if (needsUpdate) {
          localStorage.setItem(this.storageKey, JSON.stringify(content));
        }
        
        this.cachedContent = content;
      }
    } catch (error) {
      console.error('ContentStore: Error initializing content:', error);
      localStorage.setItem(this.storageKey, JSON.stringify(defaultContent));
      this.cachedContent = defaultContent;
    }
  }

  async getPageContent(pageId: string): Promise<PageContent | null> {
    // Ensure store is initialized
    await this.initialize();
    
    // Check cache first
    if (this.cachedContent[pageId]) {
      return this.cachedContent[pageId];
    }

    try {
      console.log(`ContentStore: Fetching ${pageId} from database...`);
      
      // Always try database first for consistency across devices
      const response = await fetch(`/api/content/${pageId}`);
      if (response.ok) {
        const data = await response.json();
        const pageContent = {
          id: data.pageId,
          name: data.pageName,
          sections: data.sections || []
        };
        
        console.log(`ContentStore: Loaded ${pageId} from database`);
        
        // Update cache
        this.cachedContent[pageId] = pageContent;
        
        // Cache to localStorage as backup
        try {
          const stored = localStorage.getItem(this.storageKey);
          const allContent = stored ? JSON.parse(stored) : {};
          allContent[pageId] = pageContent;
          localStorage.setItem(this.storageKey, JSON.stringify(allContent));
        } catch (storageError) {
          console.warn('ContentStore: Failed to cache to localStorage:', storageError);
        }
        
        return pageContent;
      } else if (response.status === 404) {
        // Content not found in database, initialize with defaults
        console.log(`ContentStore: ${pageId} not found in database, initializing with defaults`);
        const defaultPageContent = defaultContent[pageId];
        if (defaultPageContent) {
          try {
            await this.savePageToDatabase(pageId, defaultPageContent);
            this.cachedContent[pageId] = defaultPageContent;
            return defaultPageContent;
          } catch (error) {
            console.warn(`ContentStore: Failed to save default ${pageId}:`, error);
          }
        }
      } else {
        console.warn(`ContentStore: Database returned status ${response.status} for ${pageId}`);
      }
    } catch (error) {
      console.warn(`ContentStore: Error fetching ${pageId} from database:`, error);
    }

    // Fallback to defaults if everything else fails
    const defaultPageContent = defaultContent[pageId];
    if (defaultPageContent) {
      console.log(`ContentStore: Using default content for ${pageId}`);
      return defaultPageContent;
    }

    console.warn(`ContentStore: No content found for ${pageId}`);
    return null;
  }

  // Synchronous version for backward compatibility
  getPageContentSync(pageId: string): PageContent | null {
    // First check cache
    if (this.cachedContent[pageId]) {
      console.log(`ContentStore: Returning cached content for ${pageId}`);
      return this.cachedContent[pageId];
    }

    // Then check localStorage
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const content = JSON.parse(stored);
        const pageContent = content[pageId];
        if (pageContent && pageContent.sections) {
          console.log(`ContentStore: Returning localStorage content for ${pageId}`);
          this.cachedContent[pageId] = pageContent; // Cache it
          return pageContent;
        }
      }
    } catch (error) {
      console.warn('ContentStore: Error reading localStorage:', error);
    }

    // Finally fallback to defaults
    const defaultPageContent = defaultContent[pageId];
    if (defaultPageContent) {
      console.log(`ContentStore: Returning default content for ${pageId}`);
      // Ensure sections array exists
      if (!defaultPageContent.sections) {
        defaultPageContent.sections = [];
      }
      this.cachedContent[pageId] = defaultPageContent; // Cache it
      return defaultPageContent;
    }

    console.warn(`ContentStore: No content found for ${pageId}`);
    return null;
  }

  private async savePageToDatabase(pageId: string, content: PageContent): Promise<void> {
    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId: pageId,
          pageName: content.name,
          sections: content.sections
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save to database');
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  }

  // Add cache invalidation method
  invalidateCache(pageId?: string): void {
    if (pageId) {
      delete this.cachedContent[pageId];
      console.log(`ContentStore: Invalidated cache for ${pageId}`);
    } else {
      this.cachedContent = {};
      console.log('ContentStore: Invalidated all cache');
    }
    
    // Clear localStorage cache
    try {
      if (pageId) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const content = JSON.parse(stored);
          delete content[pageId];
          localStorage.setItem(this.storageKey, JSON.stringify(content));
        }
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch (error) {
      console.warn('ContentStore: Failed to clear localStorage cache:', error);
    }
  }

  async savePageContent(pageId: string, content: PageContent): Promise<void> {
    // Prevent recursive calls
    if (this.savingPages.has(pageId)) {
      console.warn(`ContentStore: Already saving ${pageId}, skipping duplicate call`);
      return;
    }

    this.savingPages.add(pageId);
    
    try {
      console.log(`ContentStore: Saving ${pageId} to database...`);
      
      // Save to database (primary storage)
      await this.savePageToDatabase(pageId, content);
      
      console.log(`ContentStore: Successfully saved ${pageId} to database`);
      
      // Invalidate cache to ensure fresh data
      this.invalidateCache(pageId);
      
      // Update cache with new content
      this.cachedContent[pageId] = content;
      
      // Cache to localStorage as backup
      try {
        const stored = localStorage.getItem(this.storageKey);
        const allContent = stored ? JSON.parse(stored) : {};
        allContent[pageId] = content;
        localStorage.setItem(this.storageKey, JSON.stringify(allContent));
        console.log(`ContentStore: ${pageId} cached to localStorage`);
      } catch (storageError) {
        console.warn('ContentStore: Failed to cache to localStorage:', storageError);
      }
      
      // Notify components about the update
      this.notifyContentUpdate(pageId, content);
      
    } catch (error) {
      console.error(`ContentStore: Error saving ${pageId} to database:`, error);
      throw error;
    } finally {
      // Always remove from saving set
      this.savingPages.delete(pageId);
    }
  }

  // Notify components about content updates
  private notifyContentUpdate(pageId: string, content: PageContent): void {
    // Dispatch custom event for immediate updates
    const event = new CustomEvent('contentUpdated', { 
      detail: { pageId, content } 
    });
    console.log(`ContentStore: Dispatching contentUpdated event for ${pageId}`);
    window.dispatchEvent(event);
    
    // Dispatch global content update event
    setTimeout(() => {
      const globalEvent = new CustomEvent('globalContentUpdate', { 
        detail: { type: pageId, content } 
      });
      window.dispatchEvent(globalEvent);
    }, 100);
  }

  async getAllPages(): Promise<PageContent[]> {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const contentArray = await response.json();
        return contentArray.map((page: any) => ({
          id: page.pageId,
          name: page.pageName,
          sections: page.sections || []
        }));
      }
    } catch (error) {
      console.warn('Failed to fetch all pages from database, using localStorage:', error);
    }

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(this.storageKey);
      const content = stored ? JSON.parse(stored) : defaultContent;
      return Object.values(content);
    } catch (error) {
      console.error('Error loading all content:', error);
      return Object.values(defaultContent);
    }
  }

  async resetToDefault(): Promise<void> {
    try {
      // Reset all pages in database
      for (const [pageId, content] of Object.entries(defaultContent)) {
        await this.savePageToDatabase(pageId, content);
      }
      
      // Reset cache and localStorage
      this.cachedContent = defaultContent;
      localStorage.setItem(this.storageKey, JSON.stringify(defaultContent));
    } catch (error) {
      console.error('Error resetting to default:', error);
      // Fallback to localStorage only
      this.cachedContent = defaultContent;
      localStorage.setItem(this.storageKey, JSON.stringify(defaultContent));
    }
  }
}

export const contentStore = new ContentStore();

// Store the original async method before overriding
const originalSavePageContent = contentStore.savePageContent.bind(contentStore);
const originalGetPageContent = contentStore.getPageContent.bind(contentStore);

// Backward compatibility - expose synchronous methods
(contentStore as any).getPageContentSync = contentStore.getPageContentSync.bind(contentStore);
(contentStore as any).savePageContentSync = (pageId: string, content: PageContent) => {
  // Call the original async method but don't require await for backward compatibility
  originalSavePageContent(pageId, content).catch(console.error);
};

// Hook for using content in components
export function usePageContent(pageId: string) {
  const getContent = () => contentStore.getPageContentSync(pageId);
  const getContentAsync = () => contentStore.getPageContent(pageId);
  const saveContent = (content: PageContent) => contentStore.savePageContent(pageId, content);
  
  return { getContent, getContentAsync, saveContent };
}