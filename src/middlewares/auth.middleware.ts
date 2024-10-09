import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../utils/jwt.utils';
import { messages } from '../constants/messages';

export const verifyAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(messages.noAccessToken.statuscode).json({ error: messages.noAccessToken.message });
    return;
  }

  try {
    const user = verifyAccessToken(token as string);
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error: error });
    return;
  }
};
