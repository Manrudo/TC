import sgMail from "@sendgrid/mail";

// Env vars required:
// SENDGRID_API_KEY=Su-bAHQOSwuSRlYSZd6i4g
// SENDGRID_FROM_EMAIL=hello@mellemdata.com

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function sendContactEmailNotification(
  name: string,
  email: string,
  company: string,
  message: string,
  recipientEmail: string
): Promise<{ success: boolean; reason?: string }> {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM_EMAIL;

  if (!apiKey || !from) {
    return { success: false, reason: "SendGrid not configured (missing env vars)" };
  }

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
  `;

  await sgMail.send({
    to: recipientEmail,
    from,
    subject: `New Consultation Request from ${name}`,
    replyTo: email,
    html,
  });

  return { success: true };
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
