import { Request, Response, NextFunction } from 'express';
import { BookmarkService } from '../services/BookmarkService';
import { ApiResponse } from '../utils/response';

export class BookmarkController {
  static async addBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      const bookmark = await BookmarkService.addBookmark(req.user!.id, req.params.schemeId);
      return ApiResponse.success(res, bookmark, 'Scheme bookmarked successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  static async removeBookmark(req: Request, res: Response, next: NextFunction) {
    try {
      await BookmarkService.removeBookmark(req.user!.id, req.params.schemeId);
      return ApiResponse.success(res, null, 'Bookmark removed successfully');
    } catch (err) {
      next(err);
    }
  }

  static async listBookmarks(req: Request, res: Response, next: NextFunction) {
    try {
      const bookmarks = await BookmarkService.getUserBookmarks(req.user!.id);
      return ApiResponse.success(res, bookmarks, 'User bookmarks retrieved');
    } catch (err) {
      next(err);
    }
  }
}
