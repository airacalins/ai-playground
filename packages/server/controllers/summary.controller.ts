import type { Request, Response } from 'express';
import { summaryService } from '../services/summary.service';

export const summaryController = {
  async getSummary(req: Request, res: Response) {
    const productId = Number(req.params.id);

    try {
      const summary = await summaryService.getSummary(productId);

      if (!summary) {
        res.status(404).json({
          error: 'No summary generated yet.',
        });
      }

      res.json(summary);
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  },
};
