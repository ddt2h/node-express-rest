import jwt from 'jsonwebtoken';

import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.utils';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants/secrets';

jest.mock('jsonwebtoken');

describe('JWT Utils', () => {
  const userId = 'user123';
  const accessToken = 'access-token';
  const refreshToken = 'refresh-token';
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token with a 30m expiration', () => {
      (jwt.sign as jest.Mock).mockReturnValue(accessToken);

      const result = generateAccessToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
      expect(result).toBe(accessToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token with a 7d expiration', () => {
      (jwt.sign as jest.Mock).mockReturnValue(refreshToken);

      const result = generateRefreshToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
      expect(result).toBe(refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify the access token successfully', () => {
      const decodedToken = { id: userId };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      const result = verifyAccessToken(accessToken);

      expect(jwt.verify).toHaveBeenCalledWith(accessToken, ACCESS_TOKEN_SECRET);
      expect(result).toEqual(decodedToken);
    });

    it('should throw an error if access token verification fails', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => verifyAccessToken('invalid-token')).toThrow('Invalid token');
      expect(jwt.verify).toHaveBeenCalledWith('invalid-token', ACCESS_TOKEN_SECRET);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify the refresh token successfully', () => {
      const decodedToken = { id: userId };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      const result = verifyRefreshToken(refreshToken);

      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, REFRESH_TOKEN_SECRET);
      expect(result).toEqual(decodedToken);
    });

    it('should throw an error if refresh token verification fails', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => verifyRefreshToken('invalid-token')).toThrow('Invalid token');
      expect(jwt.verify).toHaveBeenCalledWith('invalid-token', REFRESH_TOKEN_SECRET);
    });
  });
});
