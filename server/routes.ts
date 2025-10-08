import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchIndianLaw, getLegalAdvice } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Law Search API
  app.post("/api/law-search", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }

      const result = await searchIndianLaw(query);
      res.json({ result });
    } catch (error: any) {
      console.error("Law search error:", error);
      res.status(500).json({ error: error.message || "Failed to search law" });
    }
  });

  // Legal Chat API
  app.post("/api/legal-chat", async (req, res) => {
    try {
      const { message, language = "en" } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const response = await getLegalAdvice(message, language);
      res.json({ response });
    } catch (error: any) {
      console.error("Legal chat error:", error);
      res.status(500).json({ error: error.message || "Failed to get legal advice" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
