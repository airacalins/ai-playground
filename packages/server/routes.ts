import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import 'dotenv/config';
import { prisma } from './lib/prisma';

const router = express.Router();

router.use(express.json());

router.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: Number(req.params.id),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('after query');

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export default router;
