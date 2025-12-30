import type { Express, Request } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, type AuthenticatedRequest } from "./auth";
import { upload, processImage, generateThumbnail } from "./middleware/upload";
import path from "path";
import { 
  insertContactSubmissionSchema,
  insertJoinApplicationSchema,
  insertFeedbackSubmissionSchema,
  insertFeedbackFormSchema,
  insertFeedbackResponseSchema,
  insertMentorshipProgramSchema,
  insertMentorshipEnrollmentSchema,
  insertManuscriptRequestSchema,
  insertGroupProjectSchema,
  insertGroupProjectParticipantSchema,
  insertWebinarSchema,
  insertWebinarRegistrationSchema,
  insertResourceSchema,
  insertUserAchievementSchema,
  insertUserProgressSchema,
  insertWebsiteSettingsSchema,
  insertPageContentSchema,
  insertMediaLibrarySchema
} from "@shared/schema";

// AuthenticatedRequest is now imported from ./auth

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "User ID not found" });
      }
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req: AuthenticatedRequest, res) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get("/api/admin/testimonials", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials/:id/approve", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const testimonial = await storage.approveTestimonial(req.params.id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve testimonial" });
    }
  });

  // Publications routes
  app.get("/api/publications", async (req: AuthenticatedRequest, res) => {
    try {
      const { type } = req.query;
      const publications = type 
        ? await storage.getPublicationsByType(type as string)
        : await storage.getPublications();
      res.json(publications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch publications" });
    }
  });

  // Contact submission route
  app.post("/api/contact", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ 
        message: "Contact submission received successfully",
        id: submission.id 
      });
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid contact submission data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Join application route
  app.post("/api/join", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertJoinApplicationSchema.parse(req.body);
      const application = await storage.createJoinApplication(validatedData);
      res.status(201).json({ 
        message: "Join application submitted successfully",
        id: application.id 
      });
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid join application data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Feedback submission route
  app.post("/api/feedback", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertFeedbackSubmissionSchema.parse(req.body);
      const feedback = await storage.createFeedbackSubmission(validatedData);
      res.status(201).json({ 
        message: "Feedback submitted successfully",
        id: feedback.id 
      });
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid feedback data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/admin/feedback", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const feedback = await storage.getFeedbackSubmissions();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback submissions" });
    }
  });

  app.post("/api/admin/feedback/:id/approve", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const feedback = await storage.approveFeedbackSubmission(req.params.id);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve feedback" });
    }
  });

  // Mentorship program routes
  app.get("/api/mentorship/programs", async (req: AuthenticatedRequest, res) => {
    try {
      const programs = await storage.getActiveMentorshipPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mentorship programs" });
    }
  });

  app.post("/api/mentorship/programs", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertMentorshipProgramSchema.parse(req.body);
      const program = await storage.createMentorshipProgram({
        ...validatedData,
        mentorId: req.user?.claims?.sub
      });
      res.status(201).json(program);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid mentorship program data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/mentorship/enroll", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertMentorshipEnrollmentSchema.parse(req.body);
      const enrollment = await storage.enrollInMentorshipProgram({
        ...validatedData,
        menteeId: req.user?.claims?.sub
      });
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to enroll in mentorship program",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/mentorship/my-enrollments", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const enrollments = await storage.getMentorshipEnrollments(req.user?.claims?.sub);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Manuscript support routes
  app.post("/api/manuscripts", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertManuscriptRequestSchema.parse(req.body);
      const manuscript = await storage.createManuscriptRequest({
        ...validatedData,
        userId: req.user?.claims?.sub
      });
      res.status(201).json(manuscript);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid manuscript request data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/manuscripts", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const manuscripts = await storage.getManuscriptRequests(req.user?.claims?.sub);
      res.json(manuscripts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch manuscript requests" });
    }
  });

  app.get("/api/admin/manuscripts", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const manuscripts = await storage.getManuscriptRequests();
      res.json(manuscripts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch manuscript requests" });
    }
  });

  app.put("/api/manuscripts/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      const manuscript = await storage.updateManuscriptRequest(req.params.id, updates);
      if (!manuscript) {
        return res.status(404).json({ message: "Manuscript request not found" });
      }
      res.json(manuscript);
    } catch (error) {
      res.status(500).json({ message: "Failed to update manuscript request" });
    }
  });

  // Group project routes
  app.get("/api/projects", async (req: AuthenticatedRequest, res) => {
    try {
      const projects = await storage.getActiveGroupProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group projects" });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertGroupProjectSchema.parse(req.body);
      const project = await storage.createGroupProject({
        ...validatedData,
        leadResearcherId: req.user?.claims?.sub
      });
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid group project data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/projects/:id/join", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertGroupProjectParticipantSchema.parse(req.body);
      const participant = await storage.joinGroupProject({
        ...validatedData,
        projectId: req.params.id,
        userId: req.user?.claims?.sub
      });
      res.status(201).json(participant);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to join group project",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/projects/:id/participants", async (req: AuthenticatedRequest, res) => {
    try {
      const participants = await storage.getGroupProjectParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project participants" });
    }
  });

  // Admin project management routes
  app.get("/api/admin/projects", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const projects = await storage.getGroupProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.put("/api/admin/projects/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      const project = await storage.updateGroupProject(req.params.id, updates);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/admin/projects/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteGroupProject(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Webinar routes
  app.get("/api/webinars", async (req: AuthenticatedRequest, res) => {
    try {
      const webinars = await storage.getUpcomingWebinars();
      res.json(webinars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch webinars" });
    }
  });

  app.post("/api/webinars", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertWebinarSchema.parse(req.body);
      const webinar = await storage.createWebinar({
        ...validatedData,
        presenterId: req.user?.claims?.sub
      });
      res.status(201).json(webinar);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid webinar data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/webinars/:id/register", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const registration = await storage.registerForWebinar({
        webinarId: req.params.id,
        userId: req.user?.claims?.sub
      });
      res.status(201).json(registration);
    } catch (error) {
      res.status(400).json({ 
        message: "Failed to register for webinar",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/webinars/my-registrations", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const registrations = await storage.getWebinarRegistrations(req.user?.claims?.sub);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch webinar registrations" });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req: AuthenticatedRequest, res) => {
    try {
      const { category } = req.query;
      const resources = category 
        ? await storage.getResourcesByCategory(category as string)
        : await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.post("/api/resources", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource({
        ...validatedData,
        uploadedById: req.user?.claims?.sub
      });
      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid resource data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/resources/:id/download", async (req: AuthenticatedRequest, res) => {
    try {
      const resource = await storage.incrementResourceDownload(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json({ message: "Download counted", resource });
    } catch (error) {
      res.status(500).json({ message: "Failed to record download" });
    }
  });

  // User achievement routes
  app.get("/api/achievements", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.user?.claims?.sub);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.post("/api/achievements", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertUserAchievementSchema.parse(req.body);
      const achievement = await storage.createUserAchievement({
        ...validatedData,
        userId: req.user?.claims?.sub
      });
      res.status(201).json(achievement);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid achievement data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // User progress routes
  app.get("/api/progress", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const progress = await storage.getUserProgress(req.user?.claims?.sub);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateUserProgress({
        ...validatedData,
        userId: req.user?.claims?.sub
      });
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid progress data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin routes for managing applications
  app.get("/api/admin/join-applications", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { role } = req.query;
      const applications = role 
        ? await storage.getJoinApplicationsByRole(role as string)
        : await storage.getJoinApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch join applications" });
    }
  });

  app.post("/api/admin/join-applications/:id/process", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const application = await storage.markJoinApplicationProcessed(req.params.id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to process application" });
    }
  });

  app.get("/api/admin/contacts", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const contacts = await storage.getContactSubmissions();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  app.post("/api/admin/contacts/:id/process", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const contact = await storage.markContactSubmissionProcessed(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to process contact submission" });
    }
  });

  // Feedback Forms routes
  app.get("/api/feedback-forms/active", async (req: AuthenticatedRequest, res) => {
    try {
      const forms = await storage.getActiveFeedbackForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active feedback forms" });
    }
  });

  app.post("/api/feedback-responses", async (req: AuthenticatedRequest, res) => {
    try {
      const { formId, responses } = req.body;
      
      if (!formId || !responses) {
        return res.status(400).json({ message: "Form ID and responses are required" });
      }

      const response = await storage.createFeedbackResponse({
        formId,
        responses
      });

      res.status(201).json({ 
        message: "Feedback response submitted successfully",
        id: response.id 
      });
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid feedback response data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/admin/feedback-forms", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const forms = await storage.getFeedbackForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback forms" });
    }
  });

  app.post("/api/admin/feedback-forms", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('User claims:', req.user?.claims);
      
      const { createdById: _, ...bodyWithoutCreatedById } = req.body;
      const formData = {
        ...bodyWithoutCreatedById,
        // In development, set createdById to null
        createdById: process.env.NODE_ENV === 'development' ? null : req.user?.claims?.sub
      };
      
      console.log('Processed form data:', JSON.stringify(formData, null, 2));
      
      // Validate the form data
      const validatedData = insertFeedbackFormSchema.parse(formData);
      
      const form = await storage.createFeedbackForm(validatedData);
      res.status(201).json(form);
    } catch (error) {
      console.error('Form creation error:', error);
      res.status(400).json({ 
        message: "Invalid feedback form data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/admin/feedback-forms/:id/toggle", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { isActive } = req.body;
      const form = await storage.toggleFeedbackFormStatus(req.params.id, isActive);
      if (!form) {
        return res.status(404).json({ message: "Feedback form not found" });
      }
      res.json(form);
    } catch (error) {
      res.status(500).json({ message: "Failed to update feedback form status" });
    }
  });

  app.delete("/api/admin/feedback-forms/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteFeedbackForm(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Feedback form not found" });
      }
      res.json({ message: "Feedback form deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete feedback form" });
    }
  });

  app.get("/api/admin/feedback-responses/:formId?", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const responses = await storage.getFeedbackResponses(req.params.formId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback responses" });
    }
  });

  app.delete("/api/admin/feedback-responses/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteFeedbackResponse(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Feedback response not found" });
      }
      res.json({ message: "Feedback response deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete feedback response" });
    }
  });

  // Website settings routes
  app.get("/api/admin/settings/:settingKey?", async (req: AuthenticatedRequest, res) => {
    try {
      if (req.params.settingKey) {
        const settings = await storage.getWebsiteSettings(req.params.settingKey);
        if (!settings) {
          // If logo settings don't exist, initialize with defaults
          if (req.params.settingKey === 'logo') {
            const defaultLogoSettings = {
              type: 'icon',
              iconName: 'Stethoscope',
              iconColor: 'text-white',
              iconBackground: 'bg-blue-600',
              primaryText: 'GI REACH',
              secondaryText: 'Academic Excellence',
              primaryTextColor: 'text-gray-900',
              secondaryTextColor: 'text-gray-600',
              fontSize: 'text-2xl',
              fontWeight: 'font-bold',
              borderRadius: 'rounded-xl',
              showSecondaryText: true,
              imageWidth: 48,
              imageHeight: 48
            };
            
            try {
              const newSettings = await storage.saveWebsiteSettings({
                settingKey: 'logo',
                settingValue: defaultLogoSettings,
                updatedById: req.user?.claims?.sub || null
              });
              return res.json(newSettings);
            } catch (initError) {
              console.error('Failed to initialize default logo settings:', initError);
            }
          }
          return res.status(404).json({ message: "Settings not found" });
        }
        res.json(settings);
      } else {
        const allSettings = await storage.getAllWebsiteSettings();
        res.json(allSettings);
      }
    } catch (error) {
      console.error('Error fetching website settings:', error);
      res.status(500).json({ message: "Failed to fetch website settings" });
    }
  });

  app.post("/api/admin/settings", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertWebsiteSettingsSchema.parse({
        ...req.body,
        updatedById: req.user?.claims?.sub || null
      });
      const settings = await storage.saveWebsiteSettings(validatedData);
      
      console.log(`Settings saved: ${validatedData.settingKey}`, validatedData.settingValue);
      
      res.status(201).json(settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      res.status(400).json({ 
        message: "Invalid settings data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/admin/settings/:settingKey", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { settingValue } = req.body;
      const settings = await storage.updateWebsiteSettings(
        req.params.settingKey, 
        settingValue, 
        req.user?.claims?.sub
      );
      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Page content routes
  app.get("/api/content/:pageId?", async (req: AuthenticatedRequest, res) => {
    try {
      if (req.params.pageId) {
        const content = await storage.getPageContent(req.params.pageId);
        if (!content) {
          return res.status(404).json({ message: "Page content not found" });
        }
        res.json(content);
      } else {
        const allContent = await storage.getAllPageContents();
        res.json(allContent);
      }
    } catch (error) {
      console.error('Error fetching page content:', error);
      res.status(500).json({ message: "Failed to fetch page content" });
    }
  });

  app.post("/api/admin/content", async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertPageContentSchema.parse({
        ...req.body,
        updatedById: req.user?.claims?.sub || null
      });
      const content = await storage.savePageContent(validatedData);
      
      console.log(`Page content saved: ${validatedData.pageId}`);
      
      res.status(201).json(content);
    } catch (error) {
      console.error('Error saving page content:', error);
      res.status(400).json({ 
        message: "Invalid page content data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/admin/content/:pageId", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = {
        ...req.body,
        updatedById: req.user?.claims?.sub
      };
      const content = await storage.updatePageContent(req.params.pageId, updates);
      if (!content) {
        return res.status(404).json({ message: "Page content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to update page content" });
    }
  });

  app.delete("/api/admin/content/:pageId", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deletePageContent(req.params.pageId);
      if (!success) {
        return res.status(404).json({ message: "Page content not found" });
      }
      res.json({ message: "Page content deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete page content" });
    }
  });

  // Media library routes
  app.get("/api/admin/media", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const media = await storage.getMediaLibrary();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media library" });
    }
  });

  // Serve uploaded images
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Bulk upload endpoint
  app.post("/api/admin/media/bulk", isAuthenticated, upload.array('files', 10), async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadedMedia = [];
      
      for (const file of req.files) {
        try {
          // Process each image
          const processedImage = await processImage(file.buffer, file.originalname, {
            width: 1920,
            height: 1080,
            quality: 85,
            format: 'jpeg'
          });

          // Generate thumbnail
          const thumbnail = await generateThumbnail(file.buffer, file.originalname);

          // Prepare data for database
          const mediaData = {
            fileName: processedImage.filename,
            originalName: file.originalname,
            fileType: 'image',
            mimeType: file.mimetype,
            fileSize: processedImage.size,
            fileUrl: processedImage.url,
            altText: '',
            description: '',
            uploadedById: req.user?.claims?.sub
          };

          // Validate and save to database
          const validatedData = insertMediaLibrarySchema.parse(mediaData);
          const media = await storage.uploadMedia(validatedData);
          
          uploadedMedia.push({
            ...media,
            thumbnailUrl: thumbnail.url,
            dimensions: processedImage.dimensions
          });
        } catch (fileError) {
          console.error(`Error processing file ${file.originalname}:`, fileError);
          // Continue with other files
        }
      }

      res.status(201).json({
        message: `Successfully uploaded ${uploadedMedia.length} of ${req.files.length} files`,
        media: uploadedMedia
      });
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(400).json({ 
        message: "Failed to upload media files",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/admin/media/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const media = await storage.getMediaItem(req.params.id);
      if (!media) {
        return res.status(404).json({ message: "Media item not found" });
      }
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media item" });
    }
  });

  app.post("/api/admin/media", isAuthenticated, upload.single('file'), async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Process the uploaded image
      const processedImage = await processImage(req.file.buffer, req.file.originalname, {
        width: 1920,
        height: 1080,
        quality: 85,
        format: 'jpeg'
      });

      // Generate thumbnail
      const thumbnail = await generateThumbnail(req.file.buffer, req.file.originalname);

      // Prepare data for database
      const mediaData = {
        fileName: processedImage.filename,
        originalName: req.file.originalname,
        fileType: 'image',
        mimeType: req.file.mimetype,
        fileSize: processedImage.size,
        fileUrl: processedImage.url,
        altText: req.body.altText || '',
        description: req.body.description || '',
        uploadedById: req.user?.claims?.sub
      };

      // Validate and save to database
      const validatedData = insertMediaLibrarySchema.parse(mediaData);
      const media = await storage.uploadMedia(validatedData);
      
      // Return the media item with additional metadata
      res.status(201).json({
        ...media,
        thumbnailUrl: thumbnail.url,
        dimensions: processedImage.dimensions
      });
    } catch (error) {
      console.error('Media upload error:', error);
      res.status(400).json({ 
        message: "Failed to upload media",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.put("/api/admin/media/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const media = await storage.updateMediaItem(req.params.id, req.body);
      if (!media) {
        return res.status(404).json({ message: "Media item not found" });
      }
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to update media item" });
    }
  });

  app.delete("/api/admin/media/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteMediaItem(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Media item not found" });
      }
      res.json({ message: "Media item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media item" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
