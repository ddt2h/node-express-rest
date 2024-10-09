import mongoose from 'mongoose';

export interface IUser {
    username: string;
    password: string;
    refreshToken?: string;
}

const UserSchema: mongoose.Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: false,
  }
});

export default mongoose.model<IUser>('User', UserSchema);
