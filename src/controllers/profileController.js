import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        documents: true,
        businessCards: true
      }
    });

    if (!user) {
      return sendError(res, 'User profile not found.', 404);
    }

    const { password, ...safeUser } = user;
    return sendSuccess(res, safeUser, 'Profile retrieved successfully.');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      mobile,
      category,
      state,
      annualIncome,
      age,
      gender,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName
    } = req.body;

    const dataToUpdate = {};

    if (fullName !== undefined) dataToUpdate.fullName = fullName.trim();
    if (mobile !== undefined) dataToUpdate.mobile = mobile.trim();
    if (category !== undefined) dataToUpdate.category = category;
    if (state !== undefined) dataToUpdate.state = state;
    if (annualIncome !== undefined) dataToUpdate.annualIncome = annualIncome ? parseFloat(annualIncome) : null;
    if (age !== undefined) dataToUpdate.age = age ? parseInt(age, 10) : null;
    if (gender !== undefined) dataToUpdate.gender = gender;

    // Bank Details
    if (accountHolderName !== undefined) dataToUpdate.accountHolderName = accountHolderName;
    if (accountNumber !== undefined) dataToUpdate.accountNumber = accountNumber;
    if (ifscCode !== undefined) dataToUpdate.ifscCode = ifscCode ? ifscCode.toUpperCase() : null;
    if (bankName !== undefined) dataToUpdate.bankName = bankName;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
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
        accountHolderName: true,
        accountNumber: true,
        ifscCode: true,
        bankName: true,
        updatedAt: true
      }
    });

    return sendSuccess(res, updatedUser, 'Profile updated successfully.');
  } catch (error) {
    next(error);
  }
};

export const getProfileCompletion = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        documents: true
      }
    });

    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    const trackedFields = [
      { key: 'fullName', label: 'Full Name', value: user.fullName },
      { key: 'email', label: 'Email Address', value: user.email },
      { key: 'mobile', label: 'Mobile Number', value: user.mobile },
      { key: 'age', label: 'Age', value: user.age },
      { key: 'state', label: 'State', value: user.state },
      { key: 'category', label: 'Social Category (General/OBC/SC/ST/EWS)', value: user.category },
      { key: 'annualIncome', label: 'Annual Income', value: user.annualIncome },
      { key: 'gender', label: 'Gender', value: user.gender },
      { key: 'accountHolderName', label: 'Bank Account Holder Name', value: user.accountHolderName },
      { key: 'accountNumber', label: 'Bank Account Number', value: user.accountNumber },
      { key: 'ifscCode', label: 'Bank IFSC Code', value: user.ifscCode },
      { key: 'bankName', label: 'Bank Name', value: user.bankName },
      { key: 'documents', label: 'Identity / Income Documents', value: user.documents && user.documents.length > 0 ? true : null }
    ];

    const completed = [];
    const missing = [];

    trackedFields.forEach(field => {
      if (field.value !== null && field.value !== undefined && field.value !== '') {
        completed.push(field);
      } else {
        missing.push(field);
      }
    });

    const percentage = Math.round((completed.length / trackedFields.length) * 100);

    return sendSuccess(res, {
      percentage,
      isComplete: missing.length === 0,
      totalFields: trackedFields.length,
      completedCount: completed.length,
      missingFields: missing.map(m => m.label),
      missingFieldKeys: missing.map(m => m.key),
      completedFields: completed.map(c => c.label)
    }, 'Profile completion status calculated.');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return sendError(res, 'Current password and new password are required.', 400);
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return sendError(res, 'New passwords do not match.', 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect.', 400);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword }
    });

    return sendSuccess(res, null, 'Password changed successfully.');
  } catch (error) {
    next(error);
  }
};
