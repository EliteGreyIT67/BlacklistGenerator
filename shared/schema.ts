import { z } from "zod";

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

export const violationSchema = z.object({
  id: z.string(),
  type: z.enum(["neglect", "abuse", "fraud", "unlicensed_operation", "false_advertising", "poor_conditions", "other"]),
  description: z.string().min(1, "Violation description is required"),
  date: z.string().optional(),
  location: z.string().optional(),
  evidence: z.array(z.string()).default([]), // URLs to evidence
  reportedBy: z.string().optional(),
  officialAction: z.string().optional(),
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

export type Individual = z.infer<typeof individualSchema>;
export type Organization = z.infer<typeof organizationSchema>;
export type Violation = z.infer<typeof violationSchema>;
export type BlacklistPost = z.infer<typeof blacklistPostSchema>;
export type Template = z.infer<typeof templateSchema>;
