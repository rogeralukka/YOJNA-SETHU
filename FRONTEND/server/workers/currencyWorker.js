import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import cron from "node-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.join(__dirname, "../data/pulse_store.json");

/**
 * Reads the pulse store from disk
 */
function readStore() {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      console.warn("[CurrencyWorker] Store file does not exist yet at", DATA_PATH);
      return null;
    }
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[CurrencyWorker] Error reading pulse store:", err.message);
    return null;
  }
}

/**
 * Writes the updated pulse store to disk
 */
function writeStore(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[CurrencyWorker] Error saving pulse store:", err.message);
    return false;
  }
}

/**
 * Fetches spot USD/INR rate and updates the store
 */
export async function syncCurrencyNow() {
  console.log("[CurrencyWorker] Triggering USD/INR spot rate sync...");
  const store = readStore();
  if (!store) return false;

  try {
    // 1. Query Frankfurter live API
    const response = await axios.get("https://api.frankfurter.dev/v1/latest?from=USD&to=INR", {
      timeout: 4000
    });

    const rate = response.data?.rates?.INR;
    const dateStr = response.data?.date || new Date().toISOString().split("T")[0];

    if (rate && typeof rate === "number") {
      console.log(`[CurrencyWorker] Received live USD/INR rate: ₹${rate.toFixed(2)} (${dateStr})`);

      const inrInd = store.indicators.find((i) => i.id === "inr-usd-rate");
      if (inrInd) {
        // Update or append daily point
        if (!Array.isArray(inrInd.dailyTimeline)) {
          inrInd.dailyTimeline = [];
        }

        const existingIdx = inrInd.dailyTimeline.findIndex((p) => p.date === dateStr);
        if (existingIdx >= 0) {
          inrInd.dailyTimeline[existingIdx].val = Number(rate.toFixed(2));
        } else {
          inrInd.dailyTimeline.push({ date: dateStr, val: Number(rate.toFixed(2)) });
          // keep last 30 daily points
          if (inrInd.dailyTimeline.length > 30) {
            inrInd.dailyTimeline = inrInd.dailyTimeline.slice(-30);
          }
        }

        // Update latest point in annual timeline
        const latestAnnual = inrInd.timeline[inrInd.timeline.length - 1];
        if (latestAnnual && latestAnnual.fy === "FY26") {
          latestAnnual.val = Number(rate.toFixed(1));
        }
      }

      store.lastSynced = new Date().toISOString();
      writeStore(store);
      console.log("[CurrencyWorker] Successfully updated pulse store with live USD/INR rate.");
      return { success: true, rate, date: dateStr };
    }
  } catch (err) {
    console.warn(`[CurrencyWorker] Live currency fetch failed (${err.message}). Retaining cached baseline rate.`);
  }

  // If live fetch was unsuccessful, maintain timestamp & cached state
  return { success: false, cached: true };
}

/**
 * Initializes the background worker with startup sync and 6-hour cron schedule
 */
export function initCurrencyWorker() {
  console.log("[CurrencyWorker] Initializing live currency worker...");

  // Run initial sync on startup
  syncCurrencyNow().catch((err) => {
    console.warn("[CurrencyWorker] Startup sync skipped:", err.message);
  });

  // Run every 6 hours: at minute 0 past every 6th hour (0 */6 * * *)
  cron.schedule("0 */6 * * *", () => {
    console.log("[CurrencyWorker] Running scheduled 6-hour currency sync...");
    syncCurrencyNow();
  });
}
