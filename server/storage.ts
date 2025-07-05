import { templates, type Template, type InsertTemplate, type SelectTemplate } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Template storage interface for blacklist posts

export interface IStorage {
  getTemplate(id: number): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getTemplate(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    if (!template) return undefined;

    return {
      id: template.id.toString(),
      name: template.name,
      data: JSON.parse(template.data),
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }

  async getAllTemplates(): Promise<Template[]> {
    const dbTemplates = await db.select().from(templates);
    return dbTemplates.map(template => ({
      id: template.id.toString(),
      name: template.name,
      data: JSON.parse(template.data),
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    }));
  }

  async createTemplate(templateData: InsertTemplate): Promise<Template> {
    const [template] = await db
      .insert(templates)
      .values({
        name: templateData.name,
        data: typeof templateData.data === 'string' ? templateData.data : JSON.stringify(templateData.data),
      })
      .returning();

    return {
      id: template.id.toString(),
      name: template.name,
      data: JSON.parse(template.data),
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }

  async updateTemplate(id: number, updates: Partial<InsertTemplate>): Promise<Template | undefined> {
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.data) {
      updateData.data = typeof updates.data === 'string' ? updates.data : JSON.stringify(updates.data);
    }
    updateData.updatedAt = new Date();

    const [template] = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, id))
      .returning();

    if (!template) return undefined;

    return {
      id: template.id.toString(),
      name: template.name,
      data: JSON.parse(template.data),
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
    };
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const result = await db.delete(templates).where(eq(templates.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
