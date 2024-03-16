import {
  create,
  generateForgetPasswordLink,
  grandValid,
  sendVerificationToken,
  updatePassword,
  verifyEmail,
} from '@/controllers/user';
import { isValidPassResetToken } from '@/middleware/auth';
import { validate } from '@/middleware/validator';
import {
  TokenAndIDValidation,
  UpdatePasswordSchema,
  createUserSchema,
} from '@/utils/validationSchema';
import { Router } from 'express';

const router = Router();

router.post('/create', validate(createUserSchema), create);
router.post('/verify-email', validate(TokenAndIDValidation), verifyEmail);
router.post('/re-verify-email', sendVerificationToken);
router.post('/forget-password', generateForgetPasswordLink);
router.post(
  '/verify-pass-reset-token',
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  grandValid
);
router.post(
  '/update-password',
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);

export default router;
