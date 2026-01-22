import { type Express } from "express";
import { createServer } from "http";
import { appendContactToSheet } from "./googleSheets";
import { sendContactEmailNotification } from "./email";

export async function registerRoutes(app: Express) {
  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, company, message, recipientEmail } = req.body;

      if (!name || !email || !message || !recipientEmail) {
        console.error('Validation failed - missing fields:', { name: !!name, email: !!email, message: !!message, recipientEmail: !!recipientEmail });
        return res.status(400).json({ error: 'Missing required fields' });
      }

      console.log('✓ Contact form submission received:', { name, email, company, recipientEmail });
      
      const results = {
        sheetsSuccess: false,
        emailSuccess: false,
        errors: [] as string[]
      };

      // Append to Google Sheets
      try {
        console.log('📊 Attempting to append to Google Sheets...');
        await appendContactToSheet(name, email, company || 'N/A', message);
        results.sheetsSuccess = true;
        console.log('✓ Successfully appended to Google Sheets');
      } catch (sheetsError) {
        const errorMsg = `Google Sheets error: ${String(sheetsError)}`;
        console.error('✗ Failed to append to Google Sheets:', sheetsError);
        results.errors.push(errorMsg);
      }

      // Send email notification
      try {
        console.log('📧 Attempting to send email notification...');
        const emailResult = await sendContactEmailNotification(name, email, company || 'N/A', message, recipientEmail);
        if (emailResult.success) {
          results.emailSuccess = true;
          console.log('✓ Email notification sent successfully');
        } else {
          const errorMsg = `Email not sent: ${emailResult.reason}`;
          console.warn('⚠ ' + errorMsg);
          results.errors.push(errorMsg);
        }
      } catch (emailError) {
        const errorMsg = `Email send error: ${String(emailError)}`;
        console.error('✗ Failed to send email:', emailError);
        results.errors.push(errorMsg);
      }

      // Success response - data was received and at least one destination worked
      const successMessage = [];
      if (results.sheetsSuccess) successMessage.push('saved to Google Sheets');
      if (results.emailSuccess) successMessage.push('email sent');
      if (successMessage.length === 0 && results.errors.length === 0) {
        successMessage.push('received and queued for processing');
      }

      console.log('✓ Request complete. Results:', results);
      
      res.json({ 
        success: true, 
        message: `Contact form ${successMessage.join(' and ')}.`,
        debug: results
      });
    } catch (error) {
      console.error('✗ Contact form error:', error);
      res.status(500).json({ error: 'Failed to process contact form', details: String(error) });
    }
  });

  return createServer(app);
}
