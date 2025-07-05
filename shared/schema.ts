import { z } from "zod";

export const animalSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Animal name is required"),
  species: z.string().optional(),
  breed: z.string().optional(),
  age: z.string().optional(),
  color: z.string().optional(),
  gender: z.enum(["male", "female", "unknown"]).optional(),
  microchipId: z.string().optional(),
  medicalConditions: z.string().optional(),
  specialNeeds: z.string().optional(),
  photos: z.array(z.string()).default([]),
});

export const contactPersonSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  socialMedia: z.array(z.string()).default([]),
});

export const rescueOrganizationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Organization name is required"),
  registration: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  socialMedia: z.array(z.string()).default([]),
  capacity: z.string().optional(),
  specializations: z.array(z.string()).default([]),
});

export const rescuePostSchema = z.object({
  title: z.string().min(1, "Post title is required"),
  urgency: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  postType: z.enum(["adoption", "foster", "lost", "found", "emergency", "transport", "volunteer"]).default("adoption"),
  description: z.string().optional(),
  animals: z.array(animalSchema).default([]),
  contactPersons: z.array(contactPersonSchema).default([]),
  organizations: z.array(rescueOrganizationSchema).default([]),
  location: z.string().optional(),
  deadline: z.string().optional(),
  requirements: z.string().optional(),
  additionalInfo: z.string().optional(),
  hashtags: z.array(z.string()).default([]),
});

export const templateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Template name is required"),
  data: rescuePostSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Animal = z.infer<typeof animalSchema>;
export type ContactPerson = z.infer<typeof contactPersonSchema>;
export type RescueOrganization = z.infer<typeof rescueOrganizationSchema>;
export type RescuePost = z.infer<typeof rescuePostSchema>;
export type Template = z.infer<typeof templateSchema>;
