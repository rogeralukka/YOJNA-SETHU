import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass }
      });
      console.log(`[EmailService] Initialized live SMTP transport via ${host}:${port}`);
    } else {
      this.transporter = null;
      // In development / testing mode, messages will be safely logged
    }
  }

  async sendMail({ to, subject, html, text }) {
    const fromAddress = process.env.EMAIL_FROM || '"Government Scheme Portal" <noreply@gov.in>';

    if (this.transporter && process.env.NODE_ENV !== 'test') {
      try {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to,
          subject,
          text: text || html.replace(/<[^>]*>?/gm, ''),
          html
        });
        console.log(`[EmailService] Live email dispatched to ${to} (Message ID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        console.error(`[EmailService] Failed to send live email to ${to}:`, error.message);
        return { success: false, error: error.message };
      }
    } else {
      // Local dev & test fallback
      console.log(`[EmailService:FallbackLog] To: ${to} | Subject: "${subject}"`);
      return { success: true, mocked: true };
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 16px;">
          <h2 style="color: #1e40af; margin: 0;">Government Scheme Portal</h2>
          <p style="color: #64748b; margin: 4px 0 0;">Official Citizen Welfare & Entitlements Gateway</p>
        </div>
        <div style="padding: 24px 0;">
          <p>Dear <strong>${user.fullName}</strong>,</p>
          <p>Welcome to the Government Scheme Portal. Your verified citizen account has been successfully registered.</p>
          <p>You can now discover central and state government schemes, check personalized eligibility, register your business profiles, and apply directly with auto-filled verification documents.</p>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5000'}" style="background: #1e40af; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Access Your Dashboard →</a>
          </div>
          <p style="color: #64748b; font-size: 0.9em;">If you did not register this account, please ignore this email.</p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 0.8em; color: #94a3b8; text-align: center;">
          © 2026 Government of India Scheme Portal. Digital India Initiative.
        </div>
      </div>
    `;

    return this.sendMail({
      to: user.email,
      subject: 'Welcome to the Government Scheme Portal',
      html
    });
  }

  async sendApplicationSubmittedEmail(user, schemeName, applicationId) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="border-bottom: 2px solid #1e40af; padding-bottom: 16px;">
          <h2 style="color: #1e40af; margin: 0;">Application Submission Acknowledgment</h2>
          <p style="color: #64748b; margin: 4px 0 0;">Reference ID: <code>${applicationId}</code></p>
        </div>
        <div style="padding: 24px 0;">
          <p>Dear <strong>${user.fullName}</strong>,</p>
          <p>Your welfare scheme application for <strong>${schemeName}</strong> has been successfully submitted and entered into the government review pipeline.</p>
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <div><strong>Scheme:</strong> ${schemeName}</div>
            <div><strong>Application ID:</strong> ${applicationId}</div>
            <div><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">PENDING ADMINISTRATIVE REVIEW</span></div>
            <div><strong>Submission Date:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
          <p>You will receive automated notifications and email updates as the departmental verification officer reviews your submitted documents.</p>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 0.8em; color: #94a3b8; text-align: center;">
          National Informatics Gateway. No reply required.
        </div>
      </div>
    `;

    return this.sendMail({
      to: user.email,
      subject: `Application Submitted: ${schemeName} (ID: ${applicationId.slice(0, 8)})`,
      html
    });
  }

  async sendApplicationDecisionEmail(user, schemeName, status, adminComment = '') {
    const isApproved = status === 'approved';
    const statusColor = isApproved ? '#16a34a' : '#dc2626';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <div style="border-bottom: 2px solid ${statusColor}; padding-bottom: 16px;">
          <h2 style="color: ${statusColor}; margin: 0;">Application Status Update</h2>
          <p style="color: #64748b; margin: 4px 0 0;">Scheme: ${schemeName}</p>
        </div>
        <div style="padding: 24px 0;">
          <p>Dear <strong>${user.fullName}</strong>,</p>
          <p>The administrative review for your application under <strong>${schemeName}</strong> is complete.</p>
          <div style="background: #f8fafc; border-left: 4px solid ${statusColor}; padding: 16px; border-radius: 4px; margin: 16px 0;">
            <div><strong>Final Decision:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status.toUpperCase()}</span></div>
            ${adminComment ? `<div style="margin-top: 8px;"><strong>Official Department Remarks:</strong> "${adminComment}"</div>` : ''}
          </div>
          ${isApproved ? '<p>Congratulations! Necessary sanction and DBT benefits will be processed per scheme guidelines.</p>' : '<p>If you believe there was an error in document submission, you may review your profile documents and re-apply.</p>'}
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 0.8em; color: #94a3b8; text-align: center;">
          Government Scheme Portal Notification Service
        </div>
      </div>
    `;

    return this.sendMail({
      to: user.email,
      subject: `Application ${isApproved ? 'Approved 🎉' : 'Decision'}: ${schemeName}`,
      html
    });
  }

  async sendOtpEmail(email, otp) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
        <h2 style="color: #1e40af; margin-top: 0;">Government Scheme Portal</h2>
        <p style="color: #64748b;">Your One-Time Password (OTP) for Secure Verification</p>
        <div style="background: #f1f5f9; padding: 20px; font-size: 32px; letter-spacing: 8px; font-weight: 800; color: #1e40af; border-radius: 6px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #475569; font-size: 0.9em;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
      </div>
    `;

    return this.sendMail({
      to: email,
      subject: `Your Login / Verification OTP: ${otp}`,
      html
    });
  }
}

export const emailService = new EmailService();
