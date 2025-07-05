import { z } from "zod";
import { pgTable, text, timestamp, serial, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const individualSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  aliases: z.array(z.string()).default([]),
  dob: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  socialMedia: z.array(z.string()).default([]),
  role: z.string().optional(), // Director, Volunteer, Foster, etc.
  licenseNumber: z.string().optional(),
});

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Organization name is required"),
  aliases: z.array(z.string()).default([]),
  registration: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  socialMedia: z.array(z.string()).default([]),
  operatingStatus: z.enum(["active", "suspended", "closed", "under_investigation"]).default("active"),
  licensingInfo: z.string().optional(),
});

export const evidenceFileSchema = z.object({
  id: z.string(),
  filename: z.string(),
  type: z.enum(["photo", "document", "video", "audio", "screenshot", "other"]),
  description: z.string().optional(),
  uploadDate: z.string(),
  fileSize: z.number().optional(),
  isVerified: z.boolean().default(false),
  source: z.string().optional(), // Who provided this evidence
});

export const timelineEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string(),
  evidenceIds: z.array(z.string()).default([]),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  type: z.enum(["incident", "report", "action_taken", "follow_up", "resolution"]).default("incident"),
});

export const crossReferenceSchema = z.object({
  id: z.string(),
  relatedIncidentId: z.string(),
  relationship: z.enum(["related", "duplicate", "follow_up", "pattern", "same_individual", "same_organization"]),
  description: z.string().optional(),
});

export const violationSchema = z.object({
  id: z.string(),
  type: z.enum(["neglect", "abuse", "fraud", "unlicensed_operation", "false_advertising", "poor_conditions", "other"]),
  description: z.string().min(1, "Violation description is required"),
  date: z.string().optional(),
  location: z.string().optional(),
  evidence: z.array(evidenceFileSchema).default([]),
  timeline: z.array(timelineEntrySchema).default([]),
  crossReferences: z.array(crossReferenceSchema).default([]),
  reportedBy: z.string().optional(),
  officialAction: z.string().optional(),
  officialActionDate: z.string().optional(),
  followUpRequired: z.boolean().default(false),
  followUpDate: z.string().optional(),
});

export const blacklistPostSchema = z.object({
  alertTitle: z.string().min(1, "Alert title is required"),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  status: z.enum(["investigating", "confirmed", "blacklisted", "resolved", "ongoing"]).default("investigating"),
  dateReported: z.string().optional(),
  location: z.string().optional(),
  briefDescription: z.string().optional(),
  individuals: z.array(individualSchema).default([]),
  organizations: z.array(organizationSchema).default([]),
  violations: z.array(violationSchema).default([]),
  animalWelfareImpact: z.string().optional(),
  recommendedActions: z.string().optional(),
  warningStatement: z.string().optional(),
  hashtags: z.array(z.string()).default([]),
});

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Template name is required"),
  data: blacklistPostSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Drizzle database tables
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  data: text("data").notNull(), // JSON string of BlacklistPost
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  data: jsonb("data").notNull(), // JSON of complete BlacklistPost
  status: text("status").notNull().default("investigating"),
  severity: text("severity").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const evidenceFiles = pgTable("evidence_files", {
  id: serial("id").primaryKey(),
  incidentId: integer("incident_id").references(() => incidents.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  isVerified: boolean("is_verified").default(false),
  source: text("source"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const incidentTimelines = pgTable("incident_timelines", {
  id: serial("id").primaryKey(),
  incidentId: integer("incident_id").references(() => incidents.id),
  date: timestamp("date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull().default("medium"),
  type: text("type").notNull().default("incident"),
  evidenceIds: jsonb("evidence_ids").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const incidentCrossReferences = pgTable("incident_cross_references", {
  id: serial("id").primaryKey(),
  incidentId: integer("incident_id").references(() => incidents.id),
  relatedIncidentId: integer("related_incident_id").references(() => incidents.id),
  relationship: text("relationship").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas and types
export type Individual = z.infer<typeof individualSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type Violation = z.infer<typeof violationSchema>;
export type EvidenceFile = z.infer<typeof evidenceFileSchema>;
export type TimelineEntry = z.infer<typeof timelineEntrySchema>;
export type CrossReference = z.infer<typeof crossReferenceSchema>;
export type BlacklistPost = z.infer<typeof blacklistPostSchema>;
export type Template = z.infer<typeof templateSchema>;

// Drizzle types
export type SelectIncident = typeof incidents.$inferSelect;
export type SelectEvidenceFile = typeof evidenceFiles.$inferSelect;
export type SelectTimelineEntry = typeof incidentTimelines.$inferSelect;
export type SelectCrossReference = typeof incidentCrossReferences.$inferSelect;

// Drizzle insert schemas
export const insertTemplateSchema = createInsertSchema(templates).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertEvidenceFileSchema = createInsertSchema(evidenceFiles).omit({ 
  id: true, 
  uploadedAt: true 
});

export const insertTimelineEntrySchema = createInsertSchema(incidentTimelines).omit({ 
  id: true, 
  createdAt: true 
});

export const insertCrossReferenceSchema = createInsertSchema(incidentCrossReferences).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type InsertEvidenceFile = z.infer<typeof insertEvidenceFileSchema>;
export type InsertTimelineEntry = z.infer<typeof insertTimelineEntrySchema>;
export type InsertCrossReference = z.infer<typeof insertCrossReferenceSchema>;
export type SelectTemplate = typeof templates.$inferSelect;
