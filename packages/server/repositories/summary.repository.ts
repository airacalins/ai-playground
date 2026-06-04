import { prisma } from '../lib/prisma';

export const summaryRepository = {
  getSummary(productId: number) {
    return prisma.summary.findUnique({
      where: {
        productId,
      },
    });
  },
};
