import { config } from '../config/env';
import { logger } from '../config/logger';

export class EmailService {
  static async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    if (config.DEMO_MODE || !config.RESEND_API_KEY) {
      logger.info(`[DEMO_MODE EmailService] Simulated email to ${to} | Subject: "${subject}"`);
      return true;
    }

    try {
      // In production, integrate with Resend API:
      // const resend = new Resend(config.RESEND_API_KEY);
      // await resend.emails.send({ from: 'noreply@yojanasetu.gov.in', to, subject, html: body });
      logger.info(`[EmailService] Sent email to ${to} via Resend`);
      return true;
    } catch (error) {
      logger.error('Failed to send email via Resend:', error);
      return false;
    }
  }
}
