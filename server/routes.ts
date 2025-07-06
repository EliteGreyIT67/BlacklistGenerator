import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTemplateSchema, 
  insertIncidentSchema, 
  insertEvidenceFileSchema, 
  insertTimelineEntrySchema, 
  insertCrossReferenceSchema 
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { stringify } from 'csv-stringify';
import { parse } from 'csv-parse';

export async function registerRoutes(app: Express): Promise<Server> {
  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid template ID" });
      }

      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid template data", details: error.errors });
      }
      console.error("Error creating template:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid template ID" });
      }

      const updates = insertTemplateSchema.partial().parse(req.body);
      const template = await storage.updateTemplate(id, updates);

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid template data", details: error.errors });
      }
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid template ID" });
      }

      const success = await storage.deleteTemplate(id);
      if (!success) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // Configure multer for file uploads
  const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4', 'audio/mpeg'];
      cb(null, allowedTypes.includes(file.mimetype));
    }
  });

  // Export incidents as CSV
  app.get('/api/incidents/export', async (req, res) => {
    try {
      const incidents = await storage.getAllIncidents();

      const records = incidents.map((incident) => ({
        ID: incident.id,
        Title: incident.title,
        Severity: incident.severity,
        Status: incident.status,
        CreatedAt: incident.createdAt.toISOString(),
      }));

      stringify(records, { header: true }, (err, output) => {
        if (err) {
          res.status(500).json({ error: 'Error generating CSV' });
        } else {
          res.attachment('incidents.csv');
          res.send(output);
        }
      });
    } catch (error) {
      console.error('Error exporting incidents:', error);
      res.status(500).json({ error: 'Failed to export incidents' });
    }
  });

  // Import incidents from CSV
  app.post('/api/incidents/import', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    parse(req.file.buffer, { columns: true }, async (err, records) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing CSV' });
      }

      try {
        for (const record of records) {
          const incidentData = {
            title: record.Title,
            severity: record.Severity,
            status: record.Status,
            createdAt: new Date(record.CreatedAt),
            data: {}, // Add additional fields as necessary
          };

          await storage.createIncident(incidentData);
        }

        res.status(201).json({ message: 'Incidents imported successfully' });
      } catch (error) {
        console.error('Error importing incidents:', error);
        res.status(500).json({ error: 'Failed to import incidents' });
      }
    });
  });

  // Incident routes
  app.get("/api/incidents", async (req, res) => {
    try {
      const incidents = await storage.getAllIncidents();
      res.json(incidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });

  app.get("/api/incidents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid incident ID" });
      }

      const incident = await storage.getIncident(id);
      if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
      }

      res.json(incident);
    } catch (error) {
      console.error("Error fetching incident:", error);
      res.status(500).json({ error: "Failed to fetch incident" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const incidentData = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(incidentData);
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid incident data", details: error.errors });
      }
      console.error("Error creating incident:", error);
      res.status(500).json({ error: "Failed to create incident" });
    }
  });

  app.put("/api/incidents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid incident ID" });
      }

      const updates = insertIncidentSchema.partial().parse(req.body);
      const incident = await storage.updateIncident(id, updates);

      if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
      }

      res.json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid incident data", details: error.errors });
      }
      console.error("Error updating incident:", error);
      res.status(500).json({ error: "Failed to update incident" });
    }
  });

  // Evidence file routes
  app.get("/api/incidents/:id/evidence", async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      if (isNaN(incidentId)) {
        return res.status(400).json({ error: "Invalid incident ID" });
      }

      const evidenceFiles = await storage.getEvidenceFilesByIncident(incidentId);
      res.json(evidenceFiles);
    } catch (error) {
      console.error("Error fetching evidence files:", error);
      res.status(500).json({ error: "Failed to fetch evidence files" });
    }
  });

  app.post("/api/incidents/:id/evidence", upload.single('file'), async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      if (isNaN(incidentId)) {
        return res.status(400).json({ error: "Invalid incident ID" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const evidenceData = {
        incidentId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        type: req.body.type || 'other',
        description: req.body.description,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        source: req.body.source,
      };

      const evidence = await storage.createEvidenceFile(evidenceData);
      res.status(201).json(evidence);
    } catch (error) {
      console.error("Error uploading evidence:", error);
      res.status(500).json({ error: "Failed to upload evidence" });
    }
  });

  app.delete("/api/evidence/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid evidence ID" });
      }

      const success = await storage.deleteEvidenceFile(id);
      if (!success) {
        return res.status(404).json({ error: "Evidence file not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting evidence:", error);
      res.status(500).json({ error: "Failed to delete evidence" });
    }
  });

  // Timeline routes
  app.get("/api/incidents/:id/timeline", async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      if (isNaN(incidentId)) {
        return res.status(400).json({ error: "Invalid incident ID" });
      }

      const timeline = await storage.getTimelineByIncident(incidentId);
      res.json(timeline);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline" });
    }
  });

  app.post("/api/incidents/:id/timeline", async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      if (isNaN(incidentId)) {
        return res.status(400).json({ error: "Invalid incident ID" });
      }

      const timelineData = insertTimelineEntrySchema.parse({
        ...req.body,
        incidentId
      });

      const entry = await storage.createTimelineEntry(timelineData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid timeline data", details: error.errors });
      }
      console.error("Error creating timeline entry:", error);
      res.status(500).json({ error: "Failed to create timeline entry" });
    }
  });

  app.delete("/api/timeline/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid timeline entry ID" });
      }

      const success = await storage.deleteTimelineEntry(id);
      if (!success) {
        return res.status(404).json({ error: "Timeline entry not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting timeline entry:", error);
      res.status(500).json({ error: "Failed to delete timeline entry" });
    }
  });

  // Cross-reference routes
  app.get("/api/incidents/:id/cross-references", async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      if (isNaN(incidentId)) {
        return res.status(400).json({ error: "Invalid incident ID" });
      }

      const crossRefs = await storage.getCrossReferencesByIncident(incidentId);
      res.json(crossRefs);
    } catch (error) {
      console.error("Error fetching cross-references:", error);
      res.status(500).json({ error: "Failed to fetch cross-references" });
    }
  });

  app.post("/api/incidents/:id/cross-references", async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      if (isNaN(incidentId)) {
        return res.status(400).json({ error: "Invalid incident ID" });
      }

      const crossRefData = insertCrossReferenceSchema.parse({
        ...req.body,
        incidentId
      });

      const crossRef = await storage.createCrossReference(crossRefData);
      res.status(201).json(crossRef);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid cross-reference data", details: error.errors });
      }
      console.error("Error creating cross-reference:", error);
      res.status(500).json({ error: "Failed to create cross-reference" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}