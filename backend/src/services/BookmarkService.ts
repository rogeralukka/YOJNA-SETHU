import { prisma } from '../config/database';
import { ConflictError, NotFoundError } from '../utils/errors';

export class BookmarkService {
  static async addBookmark(userId: string, schemeIdStr: string) {
    const scheme = await prisma.scheme.findFirst({
      where: { OR: [{ id: schemeIdStr }, { schemeId: schemeIdStr }] },
    });

    if (!scheme) {
      throw new NotFoundError('Scheme not found');
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_schemeId: {
          userId,
          schemeId: scheme.id,
        },
      },
    });

    if (existing) {
      throw new ConflictError('Scheme is already bookmarked');
    }

    return prisma.bookmark.create({
      data: {
        userId,
        schemeId: scheme.id,
      },
      include: {
        scheme: true,
      },
    });
  }

  static async removeBookmark(userId: string, schemeIdStr: string) {
    const scheme = await prisma.scheme.findFirst({
      where: { OR: [{ id: schemeIdStr }, { schemeId: schemeIdStr }] },
    });

    if (!scheme) {
      throw new NotFoundError('Scheme not found');
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_schemeId: {
          userId,
          schemeId: scheme.id,
        },
      },
    });

    if (!bookmark) {
      throw new NotFoundError('Bookmark not found');
    }

    await prisma.bookmark.delete({
      where: { id: bookmark.id },
    });
  }

  static async getUserBookmarks(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        scheme: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookmarks.map((b) => b.scheme);
  }
}
