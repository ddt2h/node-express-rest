import bcryptjs from 'bcryptjs';
import User from '../models/user.model';
import * as jwtUtils from '../utils/jwt.utils';
import { AuthService } from '../services/auth.service';

jest.mock('bcryptjs');
jest.mock('../models/user.model');
jest.mock('../utils/jwt.utils');

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('signUp', () => {
    it('should create a new user when the username does not exist', async () => {
      const mockUserData = {
        username: 'newuser',
        password: 'password123',
      };

      (User.findOne as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      (bcryptjs.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcryptjs.hash as jest.Mock).mockResolvedValue('hashedPassword');

      (User.prototype.save as jest.Mock).mockResolvedValue({
        username: mockUserData.username,
        password: 'hashedPassword',
      });
  
      const newUser = await authService.signUp(mockUserData);
  
      expect(User.findOne).toHaveBeenCalledWith({ username: 'newuser' });
      expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
      expect(bcryptjs.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(User.prototype.save).toHaveBeenCalled();
      expect(newUser.username).toBe('newuser');
      expect(newUser.password).toBe('hashedPassword');
    });

    it('should throw an error if the username already exists', async () => {
      const mockUserData = { username: 'existinguser' };
  
      (User.findOne as jest.Mock).mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockUserData),
      });
  
      await expect(authService.signUp(mockUserData)).rejects.toThrow(
        `User ${mockUserData.username} exists`
      );
  
      expect(User.findOne).toHaveBeenCalledWith({ username: 'existinguser' });
    });
  });

  describe('signIn', () => {
    it('should return access and refresh tokens when credentials are valid', async () => {
      const mockUser = {
        id: 'userId123',
        username: 'testuser',
        password: 'hashedPassword',
        save: jest.fn().mockResolvedValueOnce({}),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(true);

      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('accessToken');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');

      const [accessToken, refreshToken] = await authService.signIn('testuser', 'password123');

      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
      expect(bcryptjs.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(jwtUtils.generateAccessToken).toHaveBeenCalledWith('userId123');
      expect(jwtUtils.generateRefreshToken).toHaveBeenCalledWith('userId123');
      expect(mockUser.save).toHaveBeenCalled();
      expect(accessToken).toBe('accessToken');
      expect(refreshToken).toBe('refreshToken');
    });
    
    it('should throw an error if the user does not exist', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authService.signIn('nonexistentuser', 'password123')).rejects.toThrow(
        'Incorrect credentials'
      );
    });

    it('should throw an error if the password is incorrect', async () => {
      const mockUser = {
        username: 'testuser',
        password: 'hashedPassword',
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn('testuser', 'wrongpassword')).rejects.toThrow(
        'Incorrect credentials'
      );
    });
  });

  describe('refreshAccess', () => {
    it('should generate a new access token from a valid refresh token', async () => {
      const mockPayload = { id: 'userId123' };

      (jwtUtils.verifyRefreshToken as jest.Mock).mockReturnValue(mockPayload);
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('newAccessToken');

      const newAccessToken = await authService.refreshAccess('validRefreshToken');

      expect(jwtUtils.verifyRefreshToken).toHaveBeenCalledWith('validRefreshToken');
      expect(jwtUtils.generateAccessToken).toHaveBeenCalledWith('userId123');
      expect(newAccessToken).toBe('newAccessToken');
    });

    it('should throw an error if the refresh token is invalid', async () => {
      (jwtUtils.verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshAccess('invalidRefreshToken')).rejects.toThrow('Invalid token');
    });
  });
});
