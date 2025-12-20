import { 
  type User, 
  type UpsertUser,
  type InsertUser,
  type Testimonial,
  type InsertTestimonial,
  type Publication,
  type InsertPublication,
  type ContactSubmission,
  type InsertContactSubmission,
  type JoinApplication,
  type InsertJoinApplication,
  type FeedbackSubmission,
  type InsertFeedbackSubmission,
  type FeedbackForm,
  type InsertFeedbackForm,
  type FeedbackResponse,
  type InsertFeedbackResponse,
  type MentorshipProgram,
  type InsertMentorshipProgram,
  type MentorshipEnrollment,
  type InsertMentorshipEnrollment,
  type ManuscriptRequest,
  type InsertManuscriptRequest,
  type GroupProject,
  type InsertGroupProject,
  type GroupProjectParticipant,
  type InsertGroupProjectParticipant,
  type Webinar,
  type InsertWebinar,
  type WebinarRegistration,
  type InsertWebinarRegistration,
  type Resource,
  type InsertResource,
  type UserAchievement,
  type InsertUserAchievement,
  type UserProgress,
  type InsertUserProgress,
  type WebsiteSettings,
  type InsertWebsiteSettings,
  type PageContent,
  type InsertPageContent,
  type MediaLibrary,
  type InsertMediaLibrary,
  users,
  testimonials,
  publications,
  contactSubmissions,
  joinApplications,
  feedbackSubmissions,
  feedbackForms,
  feedbackResponses,
  mentorshipPrograms,
  mentorshipEnrollments,
  manuscriptRequests,
  groupProjects,
  groupProjectParticipants,
  webinars,
  webinarRegistrations,
  resources,
  userAchievements,
  userProgress,
  websiteSettings,
  pageContents,
  mediaLibrary
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { fileStorage } from "./file-storage";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  approveTestimonial(id: string): Promise<Testimonial | undefined>;
  
  // Publication operations
  getPublications(): Promise<Publication[]>;
  getPublicationsByType(type: string): Promise<Publication[]>;
  createPublication(publication: InsertPublication): Promise<Publication>;
  
  // Contact submission operations
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  markContactSubmissionProcessed(id: string): Promise<ContactSubmission | undefined>;
  
  // Join application operations
  createJoinApplication(application: InsertJoinApplication): Promise<JoinApplication>;
  getJoinApplications(): Promise<JoinApplication[]>;
  getJoinApplicationsByRole(role: string): Promise<JoinApplication[]>;
  markJoinApplicationProcessed(id: string): Promise<JoinApplication | undefined>;
  
  // Feedback submission operations
  createFeedbackSubmission(feedback: InsertFeedbackSubmission): Promise<FeedbackSubmission>;
  getFeedbackSubmissions(): Promise<FeedbackSubmission[]>;
  getApprovedFeedbackSubmissions(): Promise<FeedbackSubmission[]>;
  approveFeedbackSubmission(id: string): Promise<FeedbackSubmission | undefined>;

  // Mentorship program operations
  getMentorshipPrograms(): Promise<MentorshipProgram[]>;
  getActiveMentorshipPrograms(): Promise<MentorshipProgram[]>;
  createMentorshipProgram(program: InsertMentorshipProgram): Promise<MentorshipProgram>;
  enrollInMentorshipProgram(enrollment: InsertMentorshipEnrollment): Promise<MentorshipEnrollment>;
  getMentorshipEnrollments(userId: string): Promise<MentorshipEnrollment[]>;

  // Manuscript request operations
  createManuscriptRequest(request: InsertManuscriptRequest): Promise<ManuscriptRequest>;
  getManuscriptRequests(userId?: string): Promise<ManuscriptRequest[]>;
  updateManuscriptRequest(id: string, updates: Partial<InsertManuscriptRequest>): Promise<ManuscriptRequest | undefined>;

  // Group project operations
  getGroupProjects(): Promise<GroupProject[]>;
  getActiveGroupProjects(): Promise<GroupProject[]>;
  createGroupProject(project: InsertGroupProject): Promise<GroupProject>;
  updateGroupProject(id: string, updates: Partial<InsertGroupProject>): Promise<GroupProject | undefined>;
  deleteGroupProject(id: string): Promise<boolean>;
  joinGroupProject(participant: InsertGroupProjectParticipant): Promise<GroupProjectParticipant>;
  getGroupProjectParticipants(projectId: string): Promise<GroupProjectParticipant[]>;

  // Webinar operations
  getWebinars(): Promise<Webinar[]>;
  getUpcomingWebinars(): Promise<Webinar[]>;
  createWebinar(webinar: InsertWebinar): Promise<Webinar>;
  registerForWebinar(registration: InsertWebinarRegistration): Promise<WebinarRegistration>;
  getWebinarRegistrations(userId: string): Promise<WebinarRegistration[]>;

  // Resource operations
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  incrementResourceDownload(id: string): Promise<Resource | undefined>;

  // User achievement operations
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;

  // User progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // Website settings operations
  getWebsiteSettings(settingKey: string): Promise<WebsiteSettings | undefined>;
  getAllWebsiteSettings(): Promise<WebsiteSettings[]>;
  saveWebsiteSettings(settings: InsertWebsiteSettings): Promise<WebsiteSettings>;
  updateWebsiteSettings(settingKey: string, settingValue: any, updatedById?: string): Promise<WebsiteSettings | undefined>;

  // Page content operations
  getPageContent(pageId: string): Promise<PageContent | undefined>;
  getAllPageContents(): Promise<PageContent[]>;
  savePageContent(content: InsertPageContent): Promise<PageContent>;
  updatePageContent(pageId: string, updates: Partial<InsertPageContent>): Promise<PageContent | undefined>;
  deletePageContent(pageId: string): Promise<boolean>;

  // Media library operations
  getMediaLibrary(): Promise<MediaLibrary[]>;
  getMediaItem(id: string): Promise<MediaLibrary | undefined>;
  uploadMedia(media: InsertMediaLibrary): Promise<MediaLibrary>;
  updateMediaItem(id: string, updates: Partial<InsertMediaLibrary>): Promise<MediaLibrary | undefined>;
  deleteMediaItem(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isApproved, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonialData: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values({
        ...testimonialData,
        imageUrl: testimonialData.imageUrl || null,
        isApproved: false,
      })
      .returning();
    return testimonial;
  }

  async approveTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set({ isApproved: true })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  // Publication operations
  async getPublications(): Promise<Publication[]> {
    return await db.select().from(publications).orderBy(desc(publications.year));
  }

  async getPublicationsByType(type: string): Promise<Publication[]> {
    return await db
      .select()
      .from(publications)
      .where(eq(publications.type, type))
      .orderBy(desc(publications.year));
  }

  async createPublication(publicationData: InsertPublication): Promise<Publication> {
    const [publication] = await db
      .insert(publications)
      .values({
        ...publicationData,
        impactFactor: publicationData.impactFactor || null,
        doi: publicationData.doi || null,
        abstract: publicationData.abstract || null,
      })
      .returning();
    return publication;
  }

  // Contact submission operations
  async createContactSubmission(submissionData: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values({
        ...submissionData,
        phone: submissionData.phone || null,
        isProcessed: false,
      })
      .returning();
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async markContactSubmissionProcessed(id: string): Promise<ContactSubmission | undefined> {
    const [submission] = await db
      .update(contactSubmissions)
      .set({ isProcessed: true })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return submission;
  }

  // Join application operations
  async createJoinApplication(applicationData: InsertJoinApplication): Promise<JoinApplication> {
    const [application] = await db
      .insert(joinApplications)
      .values({
        ...applicationData,
        phone: applicationData.phone || null,
        institution: applicationData.institution || null,
        experience: applicationData.experience || null,
        motivation: applicationData.motivation || null,
        isProcessed: false,
      })
      .returning();
    return application;
  }

  async getJoinApplications(): Promise<JoinApplication[]> {
    return await db.select().from(joinApplications).orderBy(desc(joinApplications.createdAt));
  }

  async getJoinApplicationsByRole(role: string): Promise<JoinApplication[]> {
    return await db
      .select()
      .from(joinApplications)
      .where(eq(joinApplications.role, role))
      .orderBy(desc(joinApplications.createdAt));
  }

  async markJoinApplicationProcessed(id: string): Promise<JoinApplication | undefined> {
    const [application] = await db
      .update(joinApplications)
      .set({ isProcessed: true })
      .where(eq(joinApplications.id, id))
      .returning();
    return application;
  }

  // Feedback submission operations
  async createFeedbackSubmission(feedbackData: InsertFeedbackSubmission): Promise<FeedbackSubmission> {
    const [feedback] = await db
      .insert(feedbackSubmissions)
      .values({
        ...feedbackData,
        isApproved: false,
      })
      .returning();
    return feedback;
  }

  async getFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
    return await db.select().from(feedbackSubmissions).orderBy(desc(feedbackSubmissions.createdAt));
  }

  async getApprovedFeedbackSubmissions(): Promise<FeedbackSubmission[]> {
    return await db
      .select()
      .from(feedbackSubmissions)
      .where(eq(feedbackSubmissions.isApproved, true))
      .orderBy(desc(feedbackSubmissions.createdAt));
  }

  async approveFeedbackSubmission(id: string): Promise<FeedbackSubmission | undefined> {
    const [feedback] = await db
      .update(feedbackSubmissions)
      .set({ isApproved: true })
      .where(eq(feedbackSubmissions.id, id))
      .returning();
    return feedback;
  }

  // Mentorship program operations
  async getMentorshipPrograms(): Promise<MentorshipProgram[]> {
    return await db.select().from(mentorshipPrograms).orderBy(desc(mentorshipPrograms.createdAt));
  }

  async getActiveMentorshipPrograms(): Promise<MentorshipProgram[]> {
    return await db
      .select()
      .from(mentorshipPrograms)
      .where(eq(mentorshipPrograms.isActive, true))
      .orderBy(asc(mentorshipPrograms.startDate));
  }

  async createMentorshipProgram(programData: InsertMentorshipProgram): Promise<MentorshipProgram> {
    const [program] = await db
      .insert(mentorshipPrograms)
      .values(programData)
      .returning();
    return program;
  }

  async enrollInMentorshipProgram(enrollmentData: InsertMentorshipEnrollment): Promise<MentorshipEnrollment> {
    const [enrollment] = await db
      .insert(mentorshipEnrollments)
      .values(enrollmentData)
      .returning();
    return enrollment;
  }

  async getMentorshipEnrollments(userId: string): Promise<MentorshipEnrollment[]> {
    return await db
      .select()
      .from(mentorshipEnrollments)
      .where(eq(mentorshipEnrollments.menteeId, userId))
      .orderBy(desc(mentorshipEnrollments.enrolledAt));
  }

  // Manuscript request operations
  async createManuscriptRequest(requestData: InsertManuscriptRequest): Promise<ManuscriptRequest> {
    const [request] = await db
      .insert(manuscriptRequests)
      .values(requestData)
      .returning();
    return request;
  }

  async getManuscriptRequests(userId?: string): Promise<ManuscriptRequest[]> {
    if (userId) {
      return await db
        .select()
        .from(manuscriptRequests)
        .where(eq(manuscriptRequests.userId, userId))
        .orderBy(desc(manuscriptRequests.createdAt));
    }
    return await db.select().from(manuscriptRequests).orderBy(desc(manuscriptRequests.createdAt));
  }

  async updateManuscriptRequest(id: string, updates: Partial<InsertManuscriptRequest>): Promise<ManuscriptRequest | undefined> {
    const [request] = await db
      .update(manuscriptRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(manuscriptRequests.id, id))
      .returning();
    return request;
  }

  // Group project operations
  async getGroupProjects(): Promise<GroupProject[]> {
    return await db.select().from(groupProjects).orderBy(desc(groupProjects.createdAt));
  }

  async getActiveGroupProjects(): Promise<GroupProject[]> {
    return await db
      .select()
      .from(groupProjects)
      .where(eq(groupProjects.isPublic, true))
      .orderBy(asc(groupProjects.startDate));
  }

  async createGroupProject(projectData: InsertGroupProject): Promise<GroupProject> {
    const [project] = await db
      .insert(groupProjects)
      .values(projectData)
      .returning();
    return project;
  }

  async updateGroupProject(id: string, updates: Partial<InsertGroupProject>): Promise<GroupProject | undefined> {
    const [project] = await db
      .update(groupProjects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(groupProjects.id, id))
      .returning();
    return project;
  }

  async deleteGroupProject(id: string): Promise<boolean> {
    const result = await db
      .delete(groupProjects)
      .where(eq(groupProjects.id, id));
    return result.rowCount > 0;
  }

  async joinGroupProject(participantData: InsertGroupProjectParticipant): Promise<GroupProjectParticipant> {
    const [participant] = await db
      .insert(groupProjectParticipants)
      .values(participantData)
      .returning();
    return participant;
  }

  async getGroupProjectParticipants(projectId: string): Promise<GroupProjectParticipant[]> {
    return await db
      .select()
      .from(groupProjectParticipants)
      .where(and(
        eq(groupProjectParticipants.projectId, projectId),
        eq(groupProjectParticipants.isActive, true)
      ))
      .orderBy(asc(groupProjectParticipants.joinedAt));
  }

  // Webinar operations
  async getWebinars(): Promise<Webinar[]> {
    return await db.select().from(webinars).orderBy(desc(webinars.scheduledDate));
  }

  async getUpcomingWebinars(): Promise<Webinar[]> {
    const now = new Date();
    return await db
      .select()
      .from(webinars)
      .where(and(
        eq(webinars.isPublic, true),
        eq(webinars.status, 'scheduled')
      ))
      .orderBy(asc(webinars.scheduledDate));
  }

  async createWebinar(webinarData: InsertWebinar): Promise<Webinar> {
    const [webinar] = await db
      .insert(webinars)
      .values(webinarData)
      .returning();
    return webinar;
  }

  async registerForWebinar(registrationData: InsertWebinarRegistration): Promise<WebinarRegistration> {
    const [registration] = await db
      .insert(webinarRegistrations)
      .values(registrationData)
      .returning();
    return registration;
  }

  async getWebinarRegistrations(userId: string): Promise<WebinarRegistration[]> {
    return await db
      .select()
      .from(webinarRegistrations)
      .where(eq(webinarRegistrations.userId, userId))
      .orderBy(desc(webinarRegistrations.registeredAt));
  }

  // Resource operations
  async getResources(): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.isPublic, true))
      .orderBy(desc(resources.createdAt));
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(and(
        eq(resources.category, category),
        eq(resources.isPublic, true)
      ))
      .orderBy(desc(resources.createdAt));
  }

  async createResource(resourceData: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(resourceData)
      .returning();
    return resource;
  }

  async incrementResourceDownload(id: string): Promise<Resource | undefined> {
    const [resource] = await db
      .update(resources)
      .set({ downloadCount: sql`${resources.downloadCount} + 1` })
      .where(eq(resources.id, id))
      .returning();
    return resource;
  }

  // User achievement operations
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));
  }

  async createUserAchievement(achievementData: InsertUserAchievement): Promise<UserAchievement> {
    const [achievement] = await db
      .insert(userAchievements)
      .values(achievementData)
      .returning();
    return achievement;
  }

  // User progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.updatedAt));
  }

  async updateUserProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values({ ...progressData, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.progressType, userProgress.referenceId],
        set: {
          ...progressData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  // Feedback Forms methods
  async createFeedbackForm(formData: InsertFeedbackForm): Promise<FeedbackForm> {
    // Don't deactivate other forms - allow multiple active forms
    const [form] = await db
      .insert(feedbackForms)
      .values({ ...formData, isActive: true })
      .returning();
    return form;
  }

  async getFeedbackForms(): Promise<(FeedbackForm & { responseCount: number })[]> {
    const forms = await db
      .select({
        id: feedbackForms.id,
        title: feedbackForms.title,
        description: feedbackForms.description,
        questions: feedbackForms.questions,
        isActive: feedbackForms.isActive,
        createdById: feedbackForms.createdById,
        createdAt: feedbackForms.createdAt,
        updatedAt: feedbackForms.updatedAt,
        responseCount: sql<number>`COALESCE(COUNT(${feedbackResponses.id}), 0)`,
      })
      .from(feedbackForms)
      .leftJoin(feedbackResponses, eq(feedbackForms.id, feedbackResponses.formId))
      .groupBy(feedbackForms.id)
      .orderBy(desc(feedbackForms.createdAt));
    
    return forms;
  }

  async getActiveFeedbackForms(): Promise<FeedbackForm[]> {
    const forms = await db
      .select()
      .from(feedbackForms)
      .where(eq(feedbackForms.isActive, true))
      .orderBy(desc(feedbackForms.createdAt));
    return forms;
  }

  async getActiveFeedbackForm(): Promise<FeedbackForm | null> {
    const [form] = await db
      .select()
      .from(feedbackForms)
      .where(eq(feedbackForms.isActive, true))
      .limit(1);
    return form || null;
  }

  async toggleFeedbackFormStatus(formId: string, isActive: boolean): Promise<FeedbackForm | null> {
    // Don't deactivate other forms - allow multiple active forms
    const [form] = await db
      .update(feedbackForms)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(feedbackForms.id, formId))
      .returning();
    return form || null;
  }

  async deleteFeedbackForm(formId: string): Promise<boolean> {
    // Delete associated responses first
    await db
      .delete(feedbackResponses)
      .where(eq(feedbackResponses.formId, formId));

    const result = await db
      .delete(feedbackForms)
      .where(eq(feedbackForms.id, formId));
    return result.rowCount > 0;
  }

  // Feedback Responses methods
  async createFeedbackResponse(responseData: InsertFeedbackResponse): Promise<FeedbackResponse> {
    const [response] = await db
      .insert(feedbackResponses)
      .values(responseData)
      .returning();
    return response;
  }

  async getFeedbackResponses(formId?: string): Promise<FeedbackResponse[]> {
    const query = db
      .select()
      .from(feedbackResponses)
      .orderBy(desc(feedbackResponses.submittedAt));

    if (formId) {
      query.where(eq(feedbackResponses.formId, formId));
    }

    return await query;
  }

  async deleteFeedbackResponse(responseId: string): Promise<boolean> {
    const result = await db
      .delete(feedbackResponses)
      .where(eq(feedbackResponses.id, responseId));
    return result.rowCount > 0;
  }

  // Website settings operations
  async getWebsiteSettings(settingKey: string): Promise<WebsiteSettings | undefined> {
    const [settings] = await db
      .select()
      .from(websiteSettings)
      .where(and(
        eq(websiteSettings.settingKey, settingKey),
        eq(websiteSettings.isActive, true)
      ));
    return settings;
  }

  async getAllWebsiteSettings(): Promise<WebsiteSettings[]> {
    return await db
      .select()
      .from(websiteSettings)
      .where(eq(websiteSettings.isActive, true))
      .orderBy(desc(websiteSettings.updatedAt));
  }

  async saveWebsiteSettings(settingsData: InsertWebsiteSettings): Promise<WebsiteSettings> {
    const [settings] = await db
      .insert(websiteSettings)
      .values({
        ...settingsData,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: websiteSettings.settingKey,
        set: {
          settingValue: settingsData.settingValue,
          updatedById: settingsData.updatedById,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }

  async updateWebsiteSettings(settingKey: string, settingValue: any, updatedById?: string): Promise<WebsiteSettings | undefined> {
    const [settings] = await db
      .update(websiteSettings)
      .set({ 
        settingValue, 
        updatedById,
        updatedAt: new Date() 
      })
      .where(eq(websiteSettings.settingKey, settingKey))
      .returning();
    return settings;
  }

  // Page content operations
  async getPageContent(pageId: string): Promise<PageContent | undefined> {
    const [content] = await db
      .select()
      .from(pageContents)
      .where(and(
        eq(pageContents.pageId, pageId),
        eq(pageContents.isPublished, true)
      ));
    return content;
  }

  async getAllPageContents(): Promise<PageContent[]> {
    return await db
      .select()
      .from(pageContents)
      .where(eq(pageContents.isPublished, true))
      .orderBy(desc(pageContents.updatedAt));
  }

  async savePageContent(contentData: InsertPageContent): Promise<PageContent> {
    const [content] = await db
      .insert(pageContents)
      .values({
        ...contentData,
        isPublished: true,
      })
      .onConflictDoUpdate({
        target: pageContents.pageId,
        set: {
          pageName: contentData.pageName,
          sections: contentData.sections,
          updatedById: contentData.updatedById,
          updatedAt: new Date(),
        },
      })
      .returning();
    return content;
  }

  async updatePageContent(pageId: string, updates: Partial<InsertPageContent>): Promise<PageContent | undefined> {
    const [content] = await db
      .update(pageContents)
      .set({ 
        ...updates, 
        updatedAt: new Date() 
      })
      .where(eq(pageContents.pageId, pageId))
      .returning();
    return content;
  }

  async deletePageContent(pageId: string): Promise<boolean> {
    const result = await db
      .delete(pageContents)
      .where(eq(pageContents.pageId, pageId));
    return result.rowCount > 0;
  }

  // Media library operations
  async getMediaLibrary(): Promise<MediaLibrary[]> {
    return await db
      .select()
      .from(mediaLibrary)
      .orderBy(desc(mediaLibrary.createdAt));
  }

  async getMediaItem(id: string): Promise<MediaLibrary | undefined> {
    const [media] = await db
      .select()
      .from(mediaLibrary)
      .where(eq(mediaLibrary.id, id));
    return media;
  }

  async uploadMedia(mediaData: InsertMediaLibrary): Promise<MediaLibrary> {
    const [media] = await db
      .insert(mediaLibrary)
      .values(mediaData)
      .returning();
    return media;
  }

  async updateMediaItem(id: string, updates: Partial<InsertMediaLibrary>): Promise<MediaLibrary | undefined> {
    const [media] = await db
      .update(mediaLibrary)
      .set(updates)
      .where(eq(mediaLibrary.id, id))
      .returning();
    return media;
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    const result = await db
      .delete(mediaLibrary)
      .where(eq(mediaLibrary.id, id));
    return result.rowCount > 0;
  }
}

// Initialize database storage with sample data
export class DatabaseStorageWithSeed extends DatabaseStorage {
  private async seedDatabase() {
    try {
      // Create development user if it doesn't exist
      if (process.env.NODE_ENV === 'development') {
        try {
          const existingUser = await this.getUser('dev-user-123');
          if (!existingUser) {
            await db.insert(users).values({
              id: 'dev-user-123',
              email: 'dev@example.com',
              firstName: 'Dev',
              lastName: 'User',
              role: 'admin'
            });
            console.log("Created development user");
          }
        } catch (error) {
          console.log("Development user creation error:", error);
        }
      }

      // Check if data already exists
      const existingTestimonials = await this.getTestimonials();
      if (existingTestimonials.length > 0) {
        return; // Data already seeded
      }

      // Seed testimonials
      const testimonialData = [
        {
          name: "Dr. Sarah Ahmed",
          role: "Medical Student",
          institution: "Aga Khan University",
          content: "GI REACH transformed my research journey. The mentorship program helped me publish 3 papers in high-impact journals within 6 months.",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        },
        {
          name: "Ahmad Khan",
          role: "Resident",
          institution: "King Edward Medical University",
          content: "The manuscript support service is exceptional. They guided me through every step of the publication process with clear co-author policies.",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        },
        {
          name: "Dr. Fatima Malik",
          role: "Research Fellow",
          institution: "Dow University",
          content: "The webinars are incredibly insightful. I learned advanced research methodologies that elevated the quality of my work significantly.",
          rating: 5,
          imageUrl: "https://images.unsplash.com/photo-1594824475933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        }
      ];

      for (const testimonial of testimonialData) {
        const created = await this.createTestimonial(testimonial);
        await this.approveTestimonial(created.id);
      }

      // Seed publications
      const publicationData = [
        {
          title: "Novel Therapeutic Approaches in Gastroenterology",
          authors: "Dr. Sarah Ahmed, Dr. Hassan Ali, et al.",
          journal: "Journal of Gastroenterology Research",
          year: 2024,
          type: "Research Paper",
          impactFactor: "4.2",
          doi: "10.1234/jgr.2024.001",
          abstract: "This study investigates novel therapeutic approaches in gastroenterology...",
        },
        {
          title: "Efficacy of Immunotherapy in Cancer Treatment",
          authors: "Dr. Fatima Malik, Dr. Omar Sheikh, et al.",
          journal: "Oncology Review",
          year: 2024,
          type: "Meta-Analysis",
          impactFactor: "6.1",
          doi: "10.1234/or.2024.002",
          abstract: "A comprehensive meta-analysis examining the efficacy of immunotherapy...",
        },
        {
          title: "COVID-19 Impact on Mental Health",
          authors: "Ahmad Khan, Dr. Zara Khan, et al.",
          journal: "International Medical Conference",
          year: 2023,
          type: "Poster",
          impactFactor: null,
          doi: null,
          abstract: "Poster presentation examining the mental health impacts of COVID-19...",
        }
      ];

      for (const publication of publicationData) {
        await this.createPublication(publication);
      }

      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  constructor() {
    super();
    // Seed the database after construction
    this.seedDatabase();
  }
}

// Hybrid storage that uses database when available, file storage as fallback
export class HybridStorage extends DatabaseStorageWithSeed {
  private isDatabaseAvailable(): boolean {
    return !!process.env.DATABASE_URL;
  }

  // Override user methods to use file storage when database is not available
  async getUser(id: string): Promise<User | undefined> {
    if (this.isDatabaseAvailable()) {
      return super.getUser(id);
    }
    return fileStorage.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (this.isDatabaseAvailable()) {
      return super.getUserByEmail(email);
    }
    return fileStorage.getUserByEmail(email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    if (this.isDatabaseAvailable()) {
      return super.createUser(userData);
    }
    return fileStorage.createUser(userData);
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    if (this.isDatabaseAvailable()) {
      return super.updateUser(id, updates);
    }
    return fileStorage.updateUser(id, updates);
  }

  // Override website settings methods to use file storage when database is not available
  async getWebsiteSettings(settingKey: string): Promise<WebsiteSettings | undefined> {
    if (this.isDatabaseAvailable()) {
      return super.getWebsiteSettings(settingKey);
    }
    return fileStorage.getWebsiteSettings(settingKey);
  }

  async getAllWebsiteSettings(): Promise<WebsiteSettings[]> {
    if (this.isDatabaseAvailable()) {
      return super.getAllWebsiteSettings();
    }
    return fileStorage.getAllWebsiteSettings();
  }

  async saveWebsiteSettings(settingsData: InsertWebsiteSettings): Promise<WebsiteSettings> {
    if (this.isDatabaseAvailable()) {
      return super.saveWebsiteSettings(settingsData);
    }
    return fileStorage.saveWebsiteSettings(settingsData);
  }

  async updateWebsiteSettings(settingKey: string, settingValue: any, updatedById?: string): Promise<WebsiteSettings | undefined> {
    if (this.isDatabaseAvailable()) {
      return super.updateWebsiteSettings(settingKey, settingValue, updatedById);
    }
    return fileStorage.updateWebsiteSettings(settingKey, settingValue, updatedById);
  }

  // Override page content methods to use file storage when database is not available
  async getPageContent(pageId: string): Promise<PageContent | undefined> {
    if (this.isDatabaseAvailable()) {
      return super.getPageContent(pageId);
    }
    return fileStorage.getPageContent(pageId);
  }

  async getAllPageContents(): Promise<PageContent[]> {
    if (this.isDatabaseAvailable()) {
      return super.getAllPageContents();
    }
    return fileStorage.getAllPageContents();
  }

  async savePageContent(contentData: InsertPageContent): Promise<PageContent> {
    if (this.isDatabaseAvailable()) {
      return super.savePageContent(contentData);
    }
    return fileStorage.savePageContent(contentData);
  }

  async updatePageContent(pageId: string, updates: Partial<InsertPageContent>): Promise<PageContent | undefined> {
    if (this.isDatabaseAvailable()) {
      return super.updatePageContent(pageId, updates);
    }
    return fileStorage.updatePageContent(pageId, updates);
  }

  async deletePageContent(pageId: string): Promise<boolean> {
    if (this.isDatabaseAvailable()) {
      return super.deletePageContent(pageId);
    }
    return fileStorage.deletePageContent(pageId);
  }
}

export const storage = new HybridStorage();