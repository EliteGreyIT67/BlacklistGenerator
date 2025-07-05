import { type Template } from "@shared/schema";

// Template storage interface for animal rescue posts

export interface IStorage {
  getTemplate(id: string): Promise<Template | undefined>;
  getTemplatesByUser(userId: string): Promise<Template[]>;
  createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template>;
  updateTemplate(id: string, template: Partial<Template>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private templates: Map<string, Template>;
  private currentId: number;

  constructor() {
    this.templates = new Map();
    this.currentId = 1;
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async getTemplatesByUser(userId: string): Promise<Template[]> {
    // For now, return all templates since we're not implementing user authentication
    return Array.from(this.templates.values());
  }

  async createTemplate(templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    const id = `template_${this.currentId++}`;
    const now = new Date().toISOString();
    const template: Template = {
      ...templateData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined> {
    const existing = this.templates.get(id);
    if (!existing) return undefined;

    const updated: Template = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    this.templates.set(id, updated);
    return updated;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }
}

export const storage = new MemStorage();
