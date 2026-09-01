import { prisma } from '../db/prisma.js';
import { evaluatePersonalEligibility } from './eligibilityEngine.js';
import { sseService } from './sseService.js';
import { pushNotificationService } from './pushNotificationService.js';

export const createNotification = async ({
  userId,
  title,
  message,
  type,
  relatedSchemeId = null,
  relatedApplicationId = null
}) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        relatedSchemeId,
        relatedApplicationId,
        isRead: false
      }
    });

    // Real-time live dispatch via SSE
    sseService.sendToUser(userId, 'notification', notification);

    // Background Web Push Notification
    pushNotificationService.sendPushNotification(userId, {
      title,
      body: message,
      data: { notificationId: notification.id, type }
    }).catch(err => console.error(err));

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
};

export const notifyApplicationSubmitted = async (userId, applicationId, schemeName) => {
  return createNotification({
    userId,
    title: 'Application Submitted Successfully',
    message: `Your application for "${schemeName}" has been successfully submitted and is under administrative review.`,
    type: 'application_submitted',
    relatedApplicationId: applicationId
  });
};

export const notifyApplicationStatusChange = async (userId, applicationId, schemeName, status, adminComment = '') => {
  const isApproved = status === 'approved';
  const title = isApproved ? 'Application Approved! 🎉' : 'Application Rejected';
  let message = isApproved
    ? `Congratulations! Your application for "${schemeName}" has been approved by the department.`
    : `Your application for "${schemeName}" was not approved.`;

  if (!isApproved && adminComment) {
    message += ` Reason / Admin Remarks: "${adminComment}".`;
  }

  return createNotification({
    userId,
    title,
    message,
    type: isApproved ? 'application_approved' : 'application_rejected',
    relatedApplicationId: applicationId
  });
};

export const notifyEligibleUsersForNewScheme = async (scheme) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      select: {
        id: true,
        fullName: true,
        email: true,
        category: true,
        state: true,
        annualIncome: true,
        age: true,
        gender: true
      }
    });

    for (const user of users) {
      const eligibility = evaluatePersonalEligibility(user, scheme);
      if (eligibility.isEligible) {
        await createNotification({
          userId: user.id,
          title: `New Scheme Launched: ${scheme.name}`,
          message: `A new government scheme "${scheme.name}" under ${scheme.department} is now available and you are eligible to apply!`,
          type: 'scheme_added',
          relatedSchemeId: scheme.id
        });
      }
    }
  } catch (error) {
    console.error('Error notifying eligible users for new scheme:', error);
  }
};

export const notifyApplicantsForUpdatedScheme = async (schemeId, schemeName) => {
  try {
    const applications = await prisma.application.findMany({
      where: { schemeId },
      select: { userId: true },
      distinct: ['userId']
    });

    for (const app of applications) {
      await createNotification({
        userId: app.userId,
        title: `Scheme Updated: ${schemeName}`,
        message: `Important update: The terms or details for scheme "${schemeName}" that you applied for have been updated.`,
        type: 'scheme_updated',
        relatedSchemeId: schemeId
      });
    }
  } catch (error) {
    console.error('Error notifying applicants for updated scheme:', error);
  }
};
