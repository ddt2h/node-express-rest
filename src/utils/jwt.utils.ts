import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants/secrets'

export const generateAccessToken = (id: string) => {
  return jwt.sign({id}, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({id}, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
