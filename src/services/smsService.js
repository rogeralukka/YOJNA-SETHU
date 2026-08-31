// SMS & Mobile OTP Gateway Service (Twilio & Fast2SMS Support)

class SMSService {
  constructor() {
    this.otpStore = new Map(); // identifier -> { otp, expiresAt, attempts }
  }

  generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  saveOTP(identifier, otp, validityMinutes = 10) {
    const expiresAt = Date.now() + validityMinutes * 60 * 1000;
    this.otpStore.set(identifier.toLowerCase(), {
      otp,
      expiresAt,
      attempts: 0
    });
  }

  verifyOTP(identifier, enteredOtp) {
    const record = this.otpStore.get(identifier.toLowerCase());
    if (!record) {
      return { success: false, message: 'No OTP requested or OTP has expired.' };
    }

    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(identifier.toLowerCase());
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    record.attempts += 1;
    if (record.attempts > 5) {
      this.otpStore.delete(identifier.toLowerCase());
      return { success: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
    }

    if (record.otp === enteredOtp.trim()) {
      this.otpStore.delete(identifier.toLowerCase());
      return { success: true, message: 'OTP verified successfully.' };
    }

    return { success: false, message: 'Invalid OTP code. Please try again.' };
  }

  async sendSMS(mobile, message) {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
    const fast2smsKey = process.env.FAST2SMS_API_KEY;

    // 1. Try Fast2SMS (Indian Gateway)
    if (fast2smsKey && process.env.NODE_ENV !== 'test') {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': fast2smsKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'q',
            message,
            numbers: mobile
          })
        });
        const data = await response.json();
        console.log(`[SMSService:Fast2SMS] Dispatched to ${mobile}:`, data);
        return { success: true, gateway: 'fast2sms', response: data };
      } catch (err) {
        console.error(`[SMSService:Fast2SMS] Error:`, err.message);
      }
    }

    // 2. Try Twilio Gateway
    if (twilioAccountSid && twilioAuthToken && twilioPhone && process.env.NODE_ENV !== 'test') {
      try {
        const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`;
        const auth = Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64');
        const params = new URLSearchParams();
        params.append('To', formattedMobile);
        params.append('From', twilioPhone);
        params.append('Body', message);

        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params.toString()
        });
        const data = await response.json();
        console.log(`[SMSService:Twilio] Dispatched to ${formattedMobile}:`, data.sid);
        return { success: true, gateway: 'twilio', sid: data.sid };
      } catch (err) {
        console.error(`[SMSService:Twilio] Error:`, err.message);
      }
    }

    // 3. Development / Sandbox Fallback Log
    console.log(`[SMSService:FallbackLog] Dispatched SMS to ${mobile}: "${message}"`);
    return { success: true, mocked: true };
  }

  async sendOTP(identifier, mobile = null) {
    const otp = this.generateOTP(6);
    this.saveOTP(identifier, otp);

    const message = `Your Government Scheme Portal verification code is: ${otp}. Valid for 10 minutes.`;

    if (mobile) {
      await this.sendSMS(mobile, message);
    }

    return { success: true, otp, message: 'OTP sent successfully.' };
  }
}

export const smsService = new SMSService();
