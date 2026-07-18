import { Router, Request, Response } from "express";
import { z } from "zod";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma.js";
import { requireAdmin, AuthRequest } from "../middleware/auth.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Resend — used in production (cloud IPs can't use Gmail SMTP reliably)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Nodemailer — fallback for local dev when RESEND_API_KEY is not set
const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s/g, ""),
  },
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 10000,
});

const buildEmailHtml = (name: string, senderEmail: string, message: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #6366f1; padding: 24px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 20px;">New Portfolio Message</h1>
    </div>
    <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">From</p>
      <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #111827;">${name}</p>
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Email</p>
      <p style="margin: 0 0 16px; font-size: 14px; color: #6366f1;">${senderEmail}</p>
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
      <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6; background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">${message}</p>
      <p style="margin: 24px 0 0; font-size: 12px; color: #9ca3af;">Hit reply to respond directly to ${name}.</p>
    </div>
  </div>
`;

// POST /api/contact — public
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.errors[0].message });
    return;
  }

  const { name, email, message } = parsed.data;
  
  // Recipient must match the verified email on your Resend dashboard for onboarding domain sandbox
  const recipient = process.env.EMAIL_USER || "michaelbazze@gmail.com";

  try {
    // Save to DB — fire-and-forget
    prisma.message.create({ data: { name, email, message } }).catch((err: unknown) => {
      console.error("DB save failed (non-fatal):", err);
    });

    if (resend) {
      console.log("Sending via Resend to:", recipient);
      
      const response = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [recipient],
        reply_to: email,
        subject: `New message from ${name} — Portfolio`,
        html: buildEmailHtml(name, email, message),
      });

      // Handle Resend specific inline errors explicitly
      if (response.error) {
        console.error("Resend delivery failure data:", response.error);
        throw new Error(`Resend API Error: ${response.error.message}`);
      }
      
      console.log("Resend delivery successful. Transaction ID:", response.data?.id);

    } else if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_PASS.replace(/\s/g, "") !== "your_gmail_app_password_here"
    ) {
      console.log("Sending via nodemailer to:", recipient);
      const sendTimeout = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("sendMail timeout after 12s")), 12000)
      );
      
      await Promise.race([
        gmailTransporter.sendMail({
          from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
          to: recipient,
          replyTo: email,
          subject: `New message from ${name} — Portfolio`,
          html: buildEmailHtml(name, email, message),
        }),
        sendTimeout,
      ]);
      console.log("Nodemailer: email sent successfully");
    } else {
      console.warn("No email provider configured — RESEND_API_KEY and EMAIL_PASS both missing");
      throw new Error("Mailing provider credentials are unset on active configuration instance.");
    }

    res.json({ message: "Message received. Thank you!" });
  } catch (err: any) {
    console.error("Contact submission pipeline error:", err.message || err);
    
    // Send a 500 status so the client knows mail dispatch dropped
    res.status(500).json({ 
      message: "Server received your message, but email delivery failed. Please try again later." 
    });
  }
});

// GET /api/contact — admin only
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