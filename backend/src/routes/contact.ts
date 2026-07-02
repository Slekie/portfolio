import { Router, Request, Response } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Gmail transporter — uses App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact — public, saves to DB + sends email
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.errors[0].message });
    return;
  }

  const { name, email, message } = parsed.data;

  try {
    // Save to database
    await prisma.message.create({ data: { name, email, message } });

    // Send notification email to Michael
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS !== "your_gmail_app_password_here") {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New message from ${name} — Portfolio`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #6366f1; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New Portfolio Message</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">From</p>
              <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #111827;">${name}</p>
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Email</p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #6366f1;">${email}</p>
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
              <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6; background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">${message}</p>
              <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af;">Hit reply to respond directly to ${name}.</p>
            </div>
          </div>
        `,
      });
    }

    res.json({ message: "Message received. Thank you!" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

// GET /api/contact — admin only, list all messages
router.get(
  "/",
  requireAdmin as (req: Request, res: Response, next: () => void) => void,
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const messages = await prisma.message.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(messages);
    } catch (err) {
      console.error("Fetch messages error:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// PATCH /api/contact/:id/read — admin only
router.patch(
  "/:id/read",
  requireAdmin as (req: Request, res: Response, next: () => void) => void,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const msg = await prisma.message.update({
        where: { id: req.params.id as string },
        data: { read: true },
      });
      
      res.json(msg);
    } catch {
      res.status(404).json({ message: "Message not found." });
    }
  }
);

export default router;
