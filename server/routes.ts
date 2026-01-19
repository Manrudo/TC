import type { Express } from "express";
import { appendContactToSheet } from "./googleSheets.js";
import { sendContactEmailNotification } from "./email.js";

export function registerRoutes(app: Express) {
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, company, message, recipientEmail } = req.body ?? {};

      if (!name || !email || !message || !recipientEmail) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: name, email, message, recipientEmail",
        });
      }

      const results = {
        sheetsSuccess: false,
        emailSuccess: false,
        errors: [] as string[],
      };

      // Google Sheets
      try {
        await appendContactToSheet(
          String(name),
          String(email),
          company ? String(company) : "N/A",
          String(message)
        );
        results.sheetsSuccess = true;
      } catch (err) {
        results.errors.push(`Google Sheets error: ${String(err)}`);
      }

      // SendGrid email
      try {
        const emailResult = await sendContactEmailNotification(
          String(name),
          String(email),
          company ? String(company) : "N/A",
          String(message),
          String(recipientEmail)
        );
        if (emailResult.success) results.emailSuccess = true;
        else results.errors.push(`Email not sent: ${emailResult.reason ?? "unknown"}`);
      } catch (err) {
        results.errors.push(`Email send error: ${String(err)}`);
      }

      return res.json({
        success: true,
        message: "Contact form received.",
        debug: results,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Failed to process contact form",
        details: String(error),
      });
    }
  });
}
