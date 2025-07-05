import { z } from "zod";

export const individualSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  dob: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  socialMedia: z.array(z.string().url().optional().or(z.literal(""))).default([]),
});

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Organization name is required"),
  registration: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const blacklistPostSchema = z.object({
  caseTitle: z.string().min(1, "Case title is required"),
  incidentDate: z.string().optional(),
  caseStatus: z.enum(["investigating", "confirmed", "resolved"]).default("investigating"),
  briefDescription: z.string().optional(),
  individuals: z.array(individualSchema).default([]),
  aliases: z.array(z.string()).default([]),
  organizations: z.array(organizationSchema).default([]),
  summaryStatement: z.string().optional(),
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
export type BlacklistPost = z.infer<typeof blacklistPostSchema>;
export type Template = z.infer<typeof templateSchema>;
