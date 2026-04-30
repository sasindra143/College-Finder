import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
        _count: { select: { answers: true } },
      },
      take: 50,
    });
    res.json({ success: true, data: questions });
  } catch (err) {
    next(err);
  }
};

export const getQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const question = await prisma.question.findUnique({
      where: { id: id as string },
      include: {
        author: { select: { name: true } },
        answers: {
          include: { author: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }
    res.json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

export const askQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, body } = req.body;
    const userId = (req as any).userId;
    
    if (!title || !body) {
      res.status(400).json({ success: false, message: 'Title and body are required' });
      return;
    }

    const question = await prisma.question.create({
      data: {
        title,
        body,
        authorId: userId,
      },
    });
    res.status(201).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
};

export const answerQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const userId = (req as any).userId;

    if (!body) {
      res.status(400).json({ success: false, message: 'Answer body is required' });
      return;
    }

    const answer = await prisma.answer.create({
      data: {
        body,
        questionId: id as string,
        authorId: userId,
      },
      include: {
        author: { select: { name: true } },
      }
    });
    
    res.status(201).json({ success: true, data: answer });
  } catch (err) {
    next(err);
  }
};
