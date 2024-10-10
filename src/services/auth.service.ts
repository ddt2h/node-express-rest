import bcryptjs from 'bcryptjs'
import { JwtPayload } from 'jsonwebtoken';

import User, { IUser } from '../models/user.model';
import * as jwtUtils from '../utils/jwt.utils'

export class AuthService {
  async signUp(data: Partial<IUser>): Promise<IUser> {

    const userExists = await User.findOne({ username: data.username }).exec();

    if (userExists) {
      throw new Error(`User ${data.username} exists`);
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(data.password as string, salt);

    const user = new User({
      username: data.username,
      password: hashedPassword
    });

    return user.save();
  }

  async signIn(username: string, password: string): Promise<[string, string]> {
    const user = await User.findOne({ username: username });

    if (!user) {
      throw new Error('Incorrect credentials');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Incorrect credentials');
    }

    const accessToken = jwtUtils.generateAccessToken(user.id);
    const refreshToken = jwtUtils.generateRefreshToken(user.id);

    user.refreshToken = refreshToken;

    await user.save();

    return [accessToken, refreshToken];
  }

  async refreshAccess(refreshToken: string): Promise<string> {
    const payload = jwtUtils.verifyRefreshToken(refreshToken);
    const userId = (payload as JwtPayload).id;
    const newAccessToken = jwtUtils.generateAccessToken(userId);

    return newAccessToken;
  }
}
