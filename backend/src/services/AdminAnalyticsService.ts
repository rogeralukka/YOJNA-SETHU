import { ApplicationStatus } from '@prisma/client';
import { prisma } from '../config/database';

export class AdminAnalyticsService {
  static async getAnalytics() {
    const [
      totalUsers,
      totalSchemes,
      activeSchemes,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      applications,
      users,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.scheme.count(),
      prisma.scheme.count({ where: { isActive: true } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: ApplicationStatus.PENDING } }),
      prisma.application.count({ where: { status: ApplicationStatus.APPROVED } }),
      prisma.application.count({ where: { status: ApplicationStatus.REJECTED } }),
      prisma.application.findMany({ select: { schemeIds: true } }),
      prisma.user.findMany({ select: { state: true, category: true } }),
    ]);

    // Aggregate popular schemes
    const schemeCounts: Record<string, number> = {};
    for (const app of applications) {
      const ids = Array.isArray(app.schemeIds) ? (app.schemeIds as string[]) : [];
      for (const id of ids) {
        schemeCounts[id] = (schemeCounts[id] || 0) + 1;
      }
    }

    const popularSchemesSorted = Object.entries(schemeCounts)
      .map(([schemeId, count]) => ({ schemeId, applicationCount: count }))
      .sort((a, b) => b.applicationCount - a.applicationCount)
      .slice(0, 5);

    // Aggregate users/applications by state & category
    const applicationsByState: Record<string, number> = {};
    const applicationsByCategory: Record<string, number> = {};

    for (const u of users) {
      if (u.state) {
        applicationsByState[u.state] = (applicationsByState[u.state] || 0) + 1;
      }
      if (u.category) {
        applicationsByCategory[u.category] = (applicationsByCategory[u.category] || 0) + 1;
      }
    }

    return {
      overview: {
        totalUsers,
        totalSchemes,
        activeSchemes,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
      },
      popularSchemes: popularSchemesSorted,
      applicationsByState,
      applicationsByCategory,
    };
  }
}
