import passwordResetToken from '@/models/passwordResetToken';
import { RequestHandler } from 'express';

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken) {
    return res.status(404).json({ message: 'Unauthorized access, Invalid token' });
  }

  const matched = await resetToken.compareToken(token);
  if (!matched) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  next();
};
