import nodemailer from 'nodemailer';
import path from 'path';
import { generateTemplate } from '@/mail/template';
import emailVerificationToken from '@/models/emailVerificationToken';
import { generateToken } from '@/utils/helpers';
import { MAILTRAP_PASS, MAILTRAP_USER, VERIFICATION_EMAIL } from '@/utils/variables';
import User from '@/models/user';

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });
  return transport;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();
  const { name, email, userId } = profile;

  await emailVerificationToken.create({ owner: userId, token });

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: 'Welcome to my Podify',
    html: generateTemplate({
      title: 'Welcome to my Podify',
      message: `Hi ${name}, welcome to my Podify. There are so much thing that we do for verified users. Use the given OTP to verify your email.`,
      logo: 'cid:logo',
      banner: 'cid:welcome',
      link: '#',
      btnTitle: token,
    }),
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '../mail/logo.png'),
        cid: 'logo',
      },
      {
        filename: 'welcome.png',
        path: path.join(__dirname, '../mail/welcome.png'),
        cid: 'welcome',
      },
    ],
  });
};
