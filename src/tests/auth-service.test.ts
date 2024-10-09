import bcryptjs from 'bcryptjs';

import { AuthService } from '../services/auth.service';
import User, { IUser } from '../models/user.model';
import * as jwtUtils from '../utils/jwt.utils';

jest.mock('../models/user.model'); 
jest.mock('bcryptjs'); 
jest.mock('../utils/jwt.utils'); 

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('signIn', () => {
    it('should throw an error if the user does not exist', async () => {
      const username = 'wronguser';
      const password = 'wrongpassword';

      (User.findOne as jest.Mock).mockResolvedValueOnce(null); 

      await expect(authService.signIn(username, password)).rejects.toThrow('Incorrect credentials');
    });

    describe('signUp', () => {
      it('should successfully create a user and return the user data', async () => {
        const userData: Partial<IUser> = {
          username: 'testuser',
          password: 'password',
        };
    
        const hashedPassword = 'hashedPassword';
        const savedUser = {
          ...userData,
          password: hashedPassword,
          _id: 'userId', 
        };
    
        (User.findOne as jest.Mock).mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        });
    
        (bcryptjs.genSalt as jest.Mock).mockResolvedValueOnce('salt'); 
        (bcryptjs.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
        (User.prototype.save as jest.Mock).mockResolvedValueOnce(savedUser);
    
        const result = await authService.signUp(userData);
    
        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(bcryptjs.genSalt).toHaveBeenCalledWith(10);
        expect(bcryptjs.hash).toHaveBeenCalledWith('password', 'salt');
        expect(User.prototype.save).toHaveBeenCalled();
        expect(result).toEqual(savedUser);
      });
    
      it('should throw an error if the user already exists', async () => {
        const userData: Partial<IUser> = {
          username: 'existinguser',
          password: 'password',
        };
    
        (User.findOne as jest.Mock).mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce({}),
        });
    
        await expect(authService.signUp(userData)).rejects.toThrow('User existinguser exists');
      });
    
      it('should throw an error if password hashing fails', async () => {
        const userData: Partial<IUser> = {
          username: 'newuser',
          password: 'password',
        };

        (User.findOne as jest.Mock).mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(null),
        });
    
        (bcryptjs.genSalt as jest.Mock).mockResolvedValueOnce('salt'); 
        (bcryptjs.hash as jest.Mock).mockRejectedValueOnce(new Error('Hashing failed'));
    
        await expect(authService.signUp(userData)).rejects.toThrow('Hashing failed');
      });
    });

    it('should throw an error if the password is incorrect', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const user = { id: 'userId', username, password: 'hashedPassword' };

      (User.findOne as jest.Mock).mockResolvedValueOnce(user); 
      (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(false); 

      await expect(authService.signIn(username, password)).rejects.toThrow('Incorrect credentials');
    });
  });

  describe('refreshAccess', () => {
    it('should successfully refresh access token', async () => {
      const refreshToken = 'validRefreshToken';
      const userId = 'userId';
      const newAccessToken = 'newAccessToken';
      (jwtUtils.verifyRefreshToken as jest.Mock).mockReturnValue({ id: userId });
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue(newAccessToken); 

      const result = await authService.refreshAccess(refreshToken);

      expect(jwtUtils.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(jwtUtils.generateAccessToken).toHaveBeenCalledWith(userId);
      expect(result).toBe(newAccessToken);
    });
  });
});
