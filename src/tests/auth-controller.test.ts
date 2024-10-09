import { Request, Response } from 'express';
import { ValidationError } from 'yup';

import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { createUserSchema } from '../yup-forms/create-user';
import { messages } from '../constants/messages';

jest.mock('../services/auth.service');
jest.mock('../yup-forms/create-user');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let authServiceMock: jest.Mocked<AuthService>;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;

  beforeEach(() => {
    authServiceMock = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    statusSpy = jest.spyOn(mockResponse, 'status');
    jsonSpy = jest.spyOn(mockResponse, 'json');
  });

  describe('signUp', () => {
    it('should return validation error if request data is invalid', async () => {
      (createUserSchema.validate as jest.Mock).mockRejectedValueOnce(new ValidationError('Invalid data', mockRequest.body, 'body'));

      await authController.signUp(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(messages.validationError.statusCode);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: messages.validationError.message,
        error: ['Invalid data'],
      });
    });

    it('should return server error if an unexpected error occurs during validation', async () => {
      (createUserSchema.validate as jest.Mock).mockRejectedValueOnce(new Error('Unexpected error'));

      await authController.signUp(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(messages.serverError.statusCode);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: messages.serverError.message,
        error: new Error('Unexpected error'),
      });
    });

    it('should sign up user successfully and return user data', async () => {
      const user = { username: 'testuser', password: 'hashedPassword' }; 
      mockRequest.body = { username: 'testuser', password: 'hashedPassword' };
      
      (createUserSchema.validate as jest.Mock).mockResolvedValueOnce(mockRequest.body); 
      authServiceMock.signUp.mockResolvedValueOnce(user); 
      
      await authController.signUp(mockRequest as Request, mockResponse as Response);
      
      expect(statusSpy).toHaveBeenCalledWith(messages.signedUp.statusCode);
    });
  });

  describe('signIn', () => {
    it('should return validation error if request data is invalid', async () => {
      (createUserSchema.validate as jest.Mock).mockRejectedValueOnce(new ValidationError('Invalid data', mockRequest.body, 'body'));

      await authController.signIn(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(messages.validationError.statusCode);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: messages.validationError.message,
        error: ['Invalid data'],
      });
    });

    it('should return incorrect credentials if sign-in fails', async () => {
      mockRequest.body = { username: 'wronguser', password: 'wrongpassword' };
      
      (createUserSchema.validate as jest.Mock).mockResolvedValueOnce(mockRequest.body);
      authServiceMock.signIn.mockRejectedValueOnce(new Error('Incorrect credentials'));
      
      await authController.signIn(mockRequest as Request, mockResponse as Response);
      
      expect(statusSpy).toHaveBeenCalledWith(messages.authIncorrect.statusCode);
    });
  });

  describe('refreshAccess', () => {
    it('should return an error if refresh token is missing', async () => {
      mockRequest.body = {};

      await authController.refreshAccess(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(messages.noRefreshToken.statusCode);
      expect(jsonSpy).toHaveBeenCalledWith({ message: messages.noRefreshToken.message });
    });

    it('should return new access token if refresh token is valid', async () => {
      mockRequest.body = { refreshToken: 'validToken' };
      authServiceMock.refreshAccess.mockResolvedValueOnce('newAccessToken');

      await authController.refreshAccess(mockRequest as Request, mockResponse as Response);

      expect(statusSpy).toHaveBeenCalledWith(messages.success.statusCode);
    });
  });
});
