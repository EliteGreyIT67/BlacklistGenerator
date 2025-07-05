import { 
  templates, 
  incidents,
  evidenceFiles,
  incidentTimelines,
  incidentCrossReferences,
  type Template, 
  type InsertTemplate, 
  type SelectTemplate,
  type SelectIncident,
  type InsertIncident,
  type SelectEvidenceFile,
  type InsertEvidenceFile,
  type SelectTimelineEntry,
  type InsertTimelineEntry,
  type SelectCrossReference,
  type InsertCrossReference,
  type BlacklistPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Template storage interface for blacklist posts

export interface IStorage {
  // Template methods
  getTemplate(id: number): Promise<Template | undefined>;
  getAllTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;

  // Incident methods
  getIncident(id: number): Promise<SelectIncident | undefined>;
  getAllIncidents(): Promise<SelectIncident[]>;
  createIncident(incident: InsertIncident): Promise<SelectIncident>;
  updateIncident(id: number, incident: Partial<InsertIncident>): Promise<SelectIncident | undefined>;
  deleteIncident(id: number): Promise<boolean>;

  // Evidence file methods
  getEvidenceFile(id: number): Promise<SelectEvidenceFile | undefined>;
  getEvidenceFilesByIncident(incidentId: number): Promise<SelectEvidenceFile[]>;
  createEvidenceFile(evidenceFile: InsertEvidenceFile): Promise<SelectEvidenceFile>;
  updateEvidenceFile(id: number, evidenceFile: Partial<InsertEvidenceFile>): Promise<SelectEvidenceFile | undefined>;
  deleteEvidenceFile(id: number): Promise<boolean>;

  // Timeline methods
  getTimelineEntry(id: number): Promise<SelectTimelineEntry | undefined>;
  getTimelineByIncident(incidentId: number): Promise<SelectTimelineEntry[]>;
  createTimelineEntry(entry: InsertTimelineEntry): Promise<SelectTimelineEntry>;
  updateTimelineEntry(id: number, entry: Partial<InsertTimelineEntry>): Promise<SelectTimelineEntry | undefined>;
  deleteTimelineEntry(id: number): Promise<boolean>;

  // Cross-reference methods
  getCrossReference(id: number): Promise<SelectCrossReference | undefined>;
  getCrossReferencesByIncident(incidentId: number): Promise<SelectCrossReference[]>;
  createCrossReference(crossRef: InsertCrossReference): Promise<SelectCrossReference>;
  deleteCrossReference(id: number): Promise<boolean>;
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

  // Incident methods
  async getIncident(id: number): Promise<SelectIncident | undefined> {
    const [incident] = await db.select().from(incidents).where(eq(incidents.id, id));
    return incident;
  }

  async getAllIncidents(): Promise<SelectIncident[]> {
    return await db.select().from(incidents).orderBy(desc(incidents.createdAt));
  }

  async createIncident(incidentData: InsertIncident): Promise<SelectIncident> {
    const [incident] = await db
      .insert(incidents)
      .values({
        title: incidentData.title,
        data: incidentData.data,
        status: incidentData.status,
        severity: incidentData.severity,
      })
      .returning();
    return incident;
  }

  async updateIncident(id: number, updates: Partial<InsertIncident>): Promise<SelectIncident | undefined> {
    const updateData: any = { updatedAt: new Date() };
    if (updates.title) updateData.title = updates.title;
    if (updates.data) updateData.data = updates.data;
    if (updates.status) updateData.status = updates.status;
    if (updates.severity) updateData.severity = updates.severity;

    const [incident] = await db
      .update(incidents)
      .set(updateData)
      .where(eq(incidents.id, id))
      .returning();
    return incident;
  }

  async deleteIncident(id: number): Promise<boolean> {
    const result = await db.delete(incidents).where(eq(incidents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Evidence file methods
  async getEvidenceFile(id: number): Promise<SelectEvidenceFile | undefined> {
    const [file] = await db.select().from(evidenceFiles).where(eq(evidenceFiles.id, id));
    return file;
  }

  async getEvidenceFilesByIncident(incidentId: number): Promise<SelectEvidenceFile[]> {
    return await db.select().from(evidenceFiles)
      .where(eq(evidenceFiles.incidentId, incidentId))
      .orderBy(desc(evidenceFiles.uploadedAt));
  }

  async createEvidenceFile(fileData: InsertEvidenceFile): Promise<SelectEvidenceFile> {
    const [file] = await db
      .insert(evidenceFiles)
      .values(fileData)
      .returning();
    return file;
  }

  async updateEvidenceFile(id: number, updates: Partial<InsertEvidenceFile>): Promise<SelectEvidenceFile | undefined> {
    const [file] = await db
      .update(evidenceFiles)
      .set(updates)
      .where(eq(evidenceFiles.id, id))
      .returning();
    return file;
  }

  async deleteEvidenceFile(id: number): Promise<boolean> {
    const result = await db.delete(evidenceFiles).where(eq(evidenceFiles.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Timeline methods
  async getTimelineEntry(id: number): Promise<SelectTimelineEntry | undefined> {
    const [entry] = await db.select().from(incidentTimelines).where(eq(incidentTimelines.id, id));
    return entry;
  }

  async getTimelineByIncident(incidentId: number): Promise<SelectTimelineEntry[]> {
    return await db.select().from(incidentTimelines)
      .where(eq(incidentTimelines.incidentId, incidentId))
      .orderBy(desc(incidentTimelines.date));
  }

  async createTimelineEntry(entryData: InsertTimelineEntry): Promise<SelectTimelineEntry> {
    const [entry] = await db
      .insert(incidentTimelines)
      .values(entryData)
      .returning();
    return entry;
  }

  async updateTimelineEntry(id: number, updates: Partial<InsertTimelineEntry>): Promise<SelectTimelineEntry | undefined> {
    const [entry] = await db
      .update(incidentTimelines)
      .set(updates)
      .where(eq(incidentTimelines.id, id))
      .returning();
    return entry;
  }

  async deleteTimelineEntry(id: number): Promise<boolean> {
    const result = await db.delete(incidentTimelines).where(eq(incidentTimelines.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Cross-reference methods
  async getCrossReference(id: number): Promise<SelectCrossReference | undefined> {
    const [crossRef] = await db.select().from(incidentCrossReferences).where(eq(incidentCrossReferences.id, id));
    return crossRef;
  }

  async getCrossReferencesByIncident(incidentId: number): Promise<SelectCrossReference[]> {
    return await db.select().from(incidentCrossReferences)
      .where(eq(incidentCrossReferences.incidentId, incidentId))
      .orderBy(desc(incidentCrossReferences.createdAt));
  }

  async createCrossReference(crossRefData: InsertCrossReference): Promise<SelectCrossReference> {
    const [crossRef] = await db
      .insert(incidentCrossReferences)
      .values(crossRefData)
      .returning();
    return crossRef;
  }

  async deleteCrossReference(id: number): Promise<boolean> {
    const result = await db.delete(incidentCrossReferences).where(eq(incidentCrossReferences.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
