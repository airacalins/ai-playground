import express, { response } from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import 'dotenv/config';
import { prisma } from './lib/prisma';
import { reviewController } from './controllers/review.controller';
import { summaryController } from './controllers/summary.controller';

const router = express.Router();

router.use(express.json());

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', reviewController.getReviews);

router.get('/api/products/:id/summary', summaryController.getSummary);

router.post('/api/products/:id/summary', summaryController.getSummary);

export default router;
