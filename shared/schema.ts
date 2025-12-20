import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  integer, 
  boolean, 
  jsonb,
  index 
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table for authentication and user management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin, mentor, mentee
  institution: varchar("institution"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  institution: text("institution").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const publications = pgTable("publications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  authors: text("authors").notNull(),
  journal: text("journal").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull(), // Research Paper, Meta-Analysis, Poster, Review
  impactFactor: text("impact_factor"),
  doi: text("doi"),
  abstract: text("abstract"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  inquiryType: text("inquiry_type").notNull(),
  message: text("message").notNull(),
  isProcessed: boolean("is_processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const joinApplications = pgTable("join_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  role: text("role").notNull(), // Mentee, Consultant, Collaborator, Volunteer
  institution: text("institution"),
  experience: text("experience"),
  motivation: text("motivation"),
  isProcessed: boolean("is_processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedbackSubmissions = pgTable("feedback_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentorship programs table
export const mentorshipPrograms = pgTable("mentorship_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(), // e.g., "12 weeks"
  maxParticipants: integer("max_participants").default(10),
  currentParticipants: integer("current_participants").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  mentorId: varchar("mentor_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mentorship enrollments table
export const mentorshipEnrollments = pgTable("mentorship_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: varchar("program_id").references(() => mentorshipPrograms.id),
  menteeId: varchar("mentee_id").references(() => users.id),
  status: varchar("status").default("pending"), // pending, active, completed, cancelled
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Manuscript support requests table
export const manuscriptRequests = pgTable("manuscript_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  abstract: text("abstract"),
  manuscriptType: varchar("manuscript_type").notNull(), // research_paper, review, meta_analysis
  currentStage: varchar("current_stage").default("draft"), // draft, review, revision, submission
  targetJournal: text("target_journal"),
  deadline: timestamp("deadline"),
  budget: integer("budget"), // in cents
  paymentMethod: varchar("payment_method"), // stripe, paypal, bank_transfer
  paymentStatus: varchar("payment_status").default("pending"), // pending, paid, refunded
  assignedEditorId: varchar("assigned_editor_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Research group projects table
export const groupProjects = pgTable("group_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  projectType: varchar("project_type").notNull(), // meta_analysis, systematic_review, original_research
  status: varchar("status").default("recruiting"), // recruiting, active, analysis, writing, completed
  maxParticipants: integer("max_participants").default(15),
  currentParticipants: integer("current_participants").default(0),
  leadResearcherId: varchar("lead_researcher_id").references(() => users.id),
  startDate: timestamp("start_date"),
  expectedCompletionDate: timestamp("expected_completion_date"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Group project participants table
export const groupProjectParticipants = pgTable("group_project_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => groupProjects.id),
  userId: varchar("user_id").references(() => users.id),
  role: varchar("role").default("contributor"), // lead, co_lead, contributor, reviewer
  contributionType: text("contribution_type"), // data_collection, analysis, writing, review
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Webinars/Educational content table
export const webinars = pgTable("webinars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  presenterId: varchar("presenter_id").references(() => users.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration_minutes").default(60),
  maxAttendees: integer("max_attendees").default(100),
  currentAttendees: integer("current_attendees").default(0),
  meetingLink: text("meeting_link"),
  recordingUrl: text("recording_url"),
  isPublic: boolean("is_public").default(true),
  status: varchar("status").default("scheduled"), // scheduled, live, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Webinar registrations table
export const webinarRegistrations = pgTable("webinar_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  webinarId: varchar("webinar_id").references(() => webinars.id),
  userId: varchar("user_id").references(() => users.id),
  registeredAt: timestamp("registered_at").defaultNow(),
  attended: boolean("attended").default(false),
});

// Resources/Downloads table
export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // template, guide, tool, recording
  fileType: varchar("file_type"), // pdf, docx, mp4, etc.
  fileUrl: text("file_url"),
  downloadCount: integer("download_count").default(0),
  isPublic: boolean("is_public").default(true),
  uploadedById: varchar("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements/badges table
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  achievementType: varchar("achievement_type").notNull(), // first_publication, mentorship_completion, collaboration_award
  title: text("title").notNull(),
  description: text("description"),
  badgeUrl: text("badge_url"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// User progress tracking table
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  progressType: varchar("progress_type").notNull(), // mentorship, manuscript, project
  referenceId: varchar("reference_id"), // ID of the related program/project/manuscript
  completionPercentage: integer("completion_percentage").default(0),
  currentMilestone: text("current_milestone"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feedback forms table
export const feedbackForms = pgTable("feedback_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  questions: jsonb("questions").notNull(), // Array of question objects
  isActive: boolean("is_active").default(false),
  createdById: varchar("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feedback responses table
export const feedbackResponses = pgTable("feedback_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  formId: varchar("form_id").references(() => feedbackForms.id),
  responses: jsonb("responses").notNull(), // Object with questionId: response pairs
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// Website settings table for logo, theme, and other site-wide settings
export const websiteSettings = pgTable("website_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key").unique().notNull(), // logo, theme, navigation, etc.
  settingValue: jsonb("setting_value").notNull(), // JSON object with all settings
  isActive: boolean("is_active").default(true),
  updatedById: varchar("updated_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Page content table for dynamic page content management
export const pageContents = pgTable("page_contents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").unique().notNull(), // home, about, programs, etc.
  pageName: text("page_name").notNull(),
  sections: jsonb("sections").notNull(), // Array of content sections
  isPublished: boolean("is_published").default(true),
  updatedById: varchar("updated_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Media library table for uploaded files and images
export const mediaLibrary = pgTable("media_library", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: varchar("file_type").notNull(), // image, video, document
  mimeType: varchar("mime_type").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  fileUrl: text("file_url").notNull(),
  altText: text("alt_text"),
  description: text("description"),
  uploadedById: varchar("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  isApproved: true,
});

export const insertPublicationSchema = createInsertSchema(publications).omit({
  id: true,
  createdAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
  isProcessed: true,
});

export const insertJoinApplicationSchema = createInsertSchema(joinApplications).omit({
  id: true,
  createdAt: true,
  isProcessed: true,
});

export const insertFeedbackSubmissionSchema = createInsertSchema(feedbackSubmissions).omit({
  id: true,
  createdAt: true,
  isApproved: true,
});

export const insertMentorshipProgramSchema = createInsertSchema(mentorshipPrograms).omit({
  id: true,
  createdAt: true,
  currentParticipants: true,
});

export const insertMentorshipEnrollmentSchema = createInsertSchema(mentorshipEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertManuscriptRequestSchema = createInsertSchema(manuscriptRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGroupProjectSchema = createInsertSchema(groupProjects, {
  startDate: z.coerce.date(),
  expectedCompletionDate: z.coerce.date(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentParticipants: true,
});

export const insertGroupProjectParticipantSchema = createInsertSchema(groupProjectParticipants).omit({
  id: true,
  joinedAt: true,
});

export const insertWebinarSchema = createInsertSchema(webinars).omit({
  id: true,
  createdAt: true,
  currentAttendees: true,
});

export const insertWebinarRegistrationSchema = createInsertSchema(webinarRegistrations).omit({
  id: true,
  registeredAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  downloadCount: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  earnedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertFeedbackFormSchema = createInsertSchema(feedbackForms, {
  createdById: z.string().nullable().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeedbackResponseSchema = createInsertSchema(feedbackResponses).omit({
  id: true,
  submittedAt: true,
});

export const insertWebsiteSettingsSchema = createInsertSchema(websiteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageContentSchema = createInsertSchema(pageContents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMediaLibrarySchema = createInsertSchema(mediaLibrary).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMentorshipProgram = z.infer<typeof insertMentorshipProgramSchema>;
export type MentorshipProgram = typeof mentorshipPrograms.$inferSelect;

export type InsertMentorshipEnrollment = z.infer<typeof insertMentorshipEnrollmentSchema>;
export type MentorshipEnrollment = typeof mentorshipEnrollments.$inferSelect;

export type InsertManuscriptRequest = z.infer<typeof insertManuscriptRequestSchema>;
export type ManuscriptRequest = typeof manuscriptRequests.$inferSelect;

export type InsertGroupProject = z.infer<typeof insertGroupProjectSchema>;
export type GroupProject = typeof groupProjects.$inferSelect;

export type InsertGroupProjectParticipant = z.infer<typeof insertGroupProjectParticipantSchema>;
export type GroupProjectParticipant = typeof groupProjectParticipants.$inferSelect;

export type InsertWebinar = z.infer<typeof insertWebinarSchema>;
export type Webinar = typeof webinars.$inferSelect;

export type InsertWebinarRegistration = z.infer<typeof insertWebinarRegistrationSchema>;
export type WebinarRegistration = typeof webinarRegistrations.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type Publication = typeof publications.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export type InsertJoinApplication = z.infer<typeof insertJoinApplicationSchema>;
export type JoinApplication = typeof joinApplications.$inferSelect;

export type InsertFeedbackSubmission = z.infer<typeof insertFeedbackSubmissionSchema>;
export type FeedbackSubmission = typeof feedbackSubmissions.$inferSelect;

export type InsertFeedbackForm = z.infer<typeof insertFeedbackFormSchema>;
export type FeedbackForm = typeof feedbackForms.$inferSelect;

export type InsertFeedbackResponse = z.infer<typeof insertFeedbackResponseSchema>;
export type FeedbackResponse = typeof feedbackResponses.$inferSelect;

export type InsertWebsiteSettings = z.infer<typeof insertWebsiteSettingsSchema>;
export type WebsiteSettings = typeof websiteSettings.$inferSelect;

export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof pageContents.$inferSelect;

export type InsertMediaLibrary = z.infer<typeof insertMediaLibrarySchema>;
export type MediaLibrary = typeof mediaLibrary.$inferSelect;
// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  institution: z.string().optional(),
  yearOfStudy: z.string().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;