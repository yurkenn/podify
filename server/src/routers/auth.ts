import {
  create,
  generateForgetPasswordLink,
  sendVerificationToken,
  verifyEmail,
} from '@/controllers/user';
import { validate } from '@/middleware/validator';
import { EmailVerificationBody, createUserSchema } from '@/utils/validationSchema';
import { Router } from 'express';

const router = Router();

router.post('/create', validate(createUserSchema), create);
router.post('/verify-email', validate(EmailVerificationBody), verifyEmail);
router.post('/re-verify-email', sendVerificationToken);
router.post('/forget-password', generateForgetPasswordLink);

export default router;
