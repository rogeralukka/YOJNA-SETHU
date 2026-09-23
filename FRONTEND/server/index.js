import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initCurrencyWorker, syncCurrencyNow } from "./workers/currencyWorker.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "data/pulse_store.json");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

/**
 * Helper to read pulse store
 */
function getStore() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Server] Error reading store:", err.message);
    return null;
  }
}

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Jan Manch Express Pulse Server",
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/janmanch/pulse
 * Query Params:
 * - timeRange: '1Y' | '3Y' | '5Y' | 'ALL' (default: 'ALL')
 * - metricId: string (optional)
 */
app.get("/api/janmanch/pulse", (req, res) => {
  const { timeRange = "ALL", metricId } = req.query;
  const store = getStore();

  if (!store) {
    return res.status(500).json({
      error: "Unable to read pulse store",
      isLive: false
    });
  }

  let indicators = store.indicators || [];

  if (metricId) {
    indicators = indicators.filter((i) => i.id === metricId);
  }

  // Slice timelines based on requested timeRange
  const processedIndicators = indicators.map((ind) => {
    let timeline = ind.timeline || [];

    if (timeRange === "3Y") {
      timeline = timeline.slice(-3);
    } else if (timeRange === "5Y") {
      timeline = timeline.slice(-5);
    } else if (timeRange === "1Y") {
      timeline = timeline.slice(-1);
    }

    return {
      ...ind,
      timeline
    };
  });

  res.json({
    success: true,
    isLive: true,
    cadence: "multi-cadence",
    lastSynced: store.lastSynced || new Date().toISOString(),
    provenance: store.provenance,
    timeRange,
    indicators: processedIndicators
  });
});

/**
 * POST /api/janmanch/sync
 * Forces an immediate live rate sync
 */
app.post("/api/janmanch/sync", async (req, res) => {
  try {
    const syncResult = await syncCurrencyNow();
    const store = getStore();
    res.json({
      success: true,
      message: "Spot rate sync triggered successfully",
      syncResult,
      lastSynced: store?.lastSynced || new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Start live currency worker
initCurrencyWorker();

// Start Express server
app.listen(PORT, () => {
  console.log(`[JanManch Server] Express backend running on http://localhost:${PORT}`);
  console.log(`[JanManch Server] Telemetry API active at http://localhost:${PORT}/api/janmanch/pulse`);
});
