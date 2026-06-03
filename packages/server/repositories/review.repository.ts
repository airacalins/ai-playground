import type { Review } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const reviewRepository = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  },
};
