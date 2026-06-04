import type { Summary } from '@prisma/client';
import { summaryRepository } from '../repositories/summary.repository';

export const summaryService = {
  async getSummary(productId: number): Promise<Summary | null> {
    const existingSummary = await summaryRepository.getSummary(productId);

    if (!existingSummary) {
      return null;
    }

    return existingSummary;
  },
};
