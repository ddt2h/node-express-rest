import { Request, Response } from 'express';
import { ValidationError } from 'yup';

import { messages } from '../constants/messages';
import { AuthService } from '../services/auth.service';
import { createUserSchema } from '../yup-forms/create-user';
export class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  signUp = async (req: Request, res: Response): Promise<void> => {
    try {
      await createUserSchema.validate(req.body);
    }
    catch (error) {
      if (error instanceof ValidationError) {
        res.status(messages.validationError.statusCode).json({ message: messages.validationError.message, error: error.errors });
        return;
      }
      res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error });
      return;
    }

    try {
      const user = await this.authService.signUp(req.body);
      res.status(messages.signedUp.statusCode).json({ message: messages.signedUp.message, data: user });
      return;
    }
    catch (error) {
      res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error });
      return;
    }
  }

  signIn = async (req: Request, res: Response): Promise<void> => {
    try {
      await createUserSchema.validate(req.body);
    }
    catch (error) {
      if (error instanceof ValidationError) {
        res.status(messages.validationError.statusCode).json({ message: messages.validationError.message, error: error.errors });
        return;
      }
      res.status(messages.serverError.statusCode).json({ message: messages.serverError.message, error });
      return;
    }
    try {
      const [accessToken, refreshToken] = await this.authService.signIn(req.body.username, req.body.password);
      res.cookie('refreshToken', refreshToken, { httpOnly: true }).json({ accessToken });
      return;
    }
    catch (error) {
      res.status(messages.authIncorrect.statusCode).json({ message: messages.authIncorrect.message, error });
      return;
    }
  }

  refreshAccess = async (req: Request, res: Response): Promise<void> => {
    const token = req.body.refreshToken;

    if (!token) {
      res.status(messages.noRefreshToken.statusCode).json({ message: messages.noRefreshToken.message });
      return;
    }
    try {
      const accessToken = await this.authService.refreshAccess(token);
      res.status(messages.success.statusCode).json({ accessToken: accessToken });
    }
    catch (error) {
      res.status(messages.refreshNotVerified.statusCode).json({ message: messages.refreshNotVerified.message, error: error });
    }
  }
}
