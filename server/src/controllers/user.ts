import { CreateUser, VerifyEmailRequest } from '@/@types/user';
import emailVerificationToken from '@/models/emailVerificationToken';
import User from '@/models/user';
import { generateToken } from '@/utils/helpers';
import { sendVerificationMail } from '@/utils/mail';
import { RequestHandler } from 'express';

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, name } = req.body;
  const user = await User.create({ email, password, name });

  //send verification email
  const token = generateToken();
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
