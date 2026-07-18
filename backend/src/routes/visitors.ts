import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Ensure the page_views table exists — runs once on first request
let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    tableReady = true;
  } catch (err) {
    console.error("ensureTable failed:", err);
  }
}

// POST /api/visitors — public, called from portfolio homepage on each visit
router.post("/", async (_req: Request, res: Response): Promise<void> => {
  // Fire-and-forget — never block the page load
  ensureTable().then(() => {
    prisma.$executeRawUnsafe(`INSERT INTO page_views (created_at) VALUES (NOW())`).catch(
      (err: unknown) => console.error("PageView insert failed (non-fatal):", err)
    );
  });
  res.status(201).json({ ok: true });
});

// GET /api/visitors — admin only, returns total + today + this week
router.get(
  "/",
  requireAdmin as (req: Request, res: Response, next: () => void) => void,
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      await ensureTable();

      const [totalRow] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) as count FROM page_views`
      );
      const [todayRow] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) as count FROM page_views WHERE created_at >= CURRENT_DATE`
      );
      const [weekRow] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) as count FROM page_views WHERE created_at >= NOW() - INTERVAL '7 days'`
      );

      res.json({
        total:    Number(totalRow.count),
        today:    Number(todayRow.count),
        thisWeek: Number(weekRow.count),
      });
    } catch (err) {
      console.error("Visitor fetch error:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

export default router;
