import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import { generateToken } from '../middleware/auth.js';
import { logAudit } from '../services/auditService.js';
import { emailService } from '../services/emailService.js';
import { smsService } from '../services/smsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const { fullName, email, mobile, password, confirmPassword } = req.body;

    if (!fullName || !email || !mobile || !password) {
      return sendError(res, 'Full name, email, mobile number, and password are required.', 400);
    }

    if (confirmPassword && password !== confirmPassword) {
      return sendError(res, 'Passwords do not match.', 400);
    }

    const emailNormalized = email.trim().toLowerCase();
    const mobileTrimmed = mobile.trim();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailNormalized },
          { mobile: mobileTrimmed }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === emailNormalized) {
        return sendError(res, 'An account with this email address already exists.', 409);
      }
      return sendError(res, 'An account with this mobile number already exists.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: emailNormalized,
        mobile: mobileTrimmed,
        password: hashedPassword,
        role: 'user'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        mobile: true,
        role: true,
        category: true,
        state: true,
        annualIncome: true,
        age: true,
        gender: true,
        createdAt: true
      }
    });

    // Send Welcome Email in background
    emailService.sendWelcomeEmail(user).catch(err => console.error(err));

    await logAudit(req, {
      userId: user.id,
      action: 'USER_REGISTER',
      details: `New citizen registration: ${user.fullName} (${user.email})`
    });

    const token = generateToken({ id: user.id, role: user.role });

    return sendSuccess(res, { user, token }, 'Registration successful! Welcome to the Scheme Portal.', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, email, mobile, password } = req.body;
    const loginIdentifier = (identifier || email || mobile || '').trim();

    if (!loginIdentifier || !password) {
      return sendError(res, 'Email/Mobile and password are required.', 400);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginIdentifier.toLowerCase() },
          { mobile: loginIdentifier }
        ]
      }
    });

    if (!user) {
      return sendError(res, 'Invalid credentials. User not found.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 'Invalid password. Please try again.', 401);
    }

    await logAudit(req, {
      userId: user.id,
      action: 'USER_LOGIN',
      details: `Successful citizen login for: ${user.email}`
    });

    const token = generateToken({ id: user.id, role: user.role });

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      category: user.category,
      state: user.state,
      annualIncome: user.annualIncome,
      age: user.age,
      gender: user.gender,
      accountHolderName: user.accountHolderName,
      accountNumber: user.accountNumber,
      ifscCode: user.ifscCode,
      bankName: user.bankName
    };

    return sendSuccess(res, { user: safeUser, token }, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { identifier, mobile, email } = req.body;
    const target = (identifier || mobile || email || '').trim();

    if (!target) {
      return sendError(res, 'Mobile number or Email address is required to dispatch OTP.', 400);
    }

    const otpRes = await smsService.sendOTP(target, mobile);

    // Also send via email if target looks like email
    if (target.includes('@')) {
      await emailService.sendOtpEmail(target, otpRes.otp);
    }

    return sendSuccess(res, {
      identifier: target,
      otp: process.env.NODE_ENV === 'production' ? undefined : otpRes.otp,
      expiresIn: '10 minutes'
    }, 'One-Time Password (OTP) dispatched successfully.');
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return sendError(res, 'Identifier and OTP code are required.', 400);
    }

    const verification = smsService.verifyOTP(identifier, otp);
    if (!verification.success) {
      return sendError(res, verification.message, 400);
    }

    // Find user if existing
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { mobile: identifier }
        ]
      }
    });

    let token = null;
    if (user) {
      token = generateToken({ id: user.id, role: user.role });
      await logAudit(req, {
        userId: user.id,
        action: 'OTP_LOGIN',
        details: `Successful OTP verification login for: ${identifier}`
      });
    }

    return sendSuccess(res, {
      verified: true,
      user: user ? {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      } : null,
      token
    }, 'OTP verified successfully.');
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { adminId, email, password } = req.body;
    const loginId = (adminId || email || '').trim();

    if (!loginId || !password) {
      return sendError(res, 'Admin ID / Email and password are required.', 400);
    }

    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginId.toLowerCase() },
          { mobile: loginId }
        ],
        role: { in: ['admin', 'super_admin'] }
      }
    });

    if (!adminUser) {
      return sendError(res, 'Admin account not found or insufficient privileges.', 403);
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return sendError(res, 'Invalid admin password.', 401);
    }

    await logAudit(req, {
      userId: adminUser.id,
      action: 'ADMIN_LOGIN',
      details: `Administrator logged in with role: ${adminUser.role}`
    });

    const token = generateToken({ id: adminUser.id, role: adminUser.role });

    return sendSuccess(res, {
      admin: {
        id: adminUser.id,
        fullName: adminUser.fullName,
        email: adminUser.email,
        mobile: adminUser.mobile,
        role: adminUser.role,
        privileges: {
          canManageSchemes: adminUser.role === 'super_admin',
          canReviewApplications: true
        }
      },
      token
    }, `Admin login successful as ${adminUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}.`);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        documents: {
          select: {
            id: true,
            docType: true,
            fileName: true,
            fileUrl: true,
            mimeType: true,
            uploadedAt: true
          }
        },
        _count: {
          select: {
            businessCards: true,
            applications: true,
            bookmarks: true,
            notifications: { where: { isRead: false } }
          }
        }
      }
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const { password, ...safeUser } = user;
    return sendSuccess(res, safeUser, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};
