import { CreateUser, VerifyEmailRequest } from '@/@types/user';
import emailVerificationToken from '@/models/emailVerificationToken';
import passwordResetToken from '@/models/passwordResetToken';
import User from '@/models/user';
import { generateToken } from '@/utils/helpers';
import {
  sendForgetPasswordMail,
  sendPassResetSuccessMail,
  sendVerificationMail,
} from '@/utils/mail';
import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import crypto from 'crypto';
import { PASSWORD_RESET_LINK } from '@/utils/variables';

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });

  //send verification email
  const token = generateToken();
  await emailVerificationToken.create({ owner: user._id, token });
  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {
  const { token, userId } = req.body;
  const verificationToken = await emailVerificationToken.findOne({ owner: userId });

  if (!verificationToken) {
    return res.status(404).json({ message: 'Invalid token' });
  }

  const matched = await verificationToken.compareToken(token);
  if (!matched) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  await User.findByIdAndUpdate(userId, { verified: true });

  await emailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.status(200).json({ message: 'Email verified' });
};

export const sendVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  //delete previous token
  await emailVerificationToken.findOneAndDelete({ owner: userId });

  // create new token
  const token = generateToken();
  await emailVerificationToken.create({ owner: userId, token });

  //send verification email
  sendVerificationMail(token, {
    name: user.name,
    email: user.email,
    userId: user._id.toString(),
  });

  res.status(200).json({ message: 'Verification email sent' });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  await passwordResetToken.findOneAndDelete({ owner: user._id });

  // generate link
  const token = crypto.randomBytes(32).toString('hex');

  await passwordResetToken.create({ owner: user._id, token });
  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordMail({ email: user.email, link: resetLink });

  res.status(200).json({ message: 'Password reset link sent' });
};

export const grandValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const matched = await user.comparePassword(password);
  if (matched) {
    return res
      .status(400)
      .json({ message: 'New password must be different from the old password' });
  }

  user.password = password;
  await user.save();

  await passwordResetToken.findOneAndDelete({ owner: userId });

  sendPassResetSuccessMail(user.name, user.email);
  res.status(200).json({ message: 'Password updated' });
};
