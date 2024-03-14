const { env } = process as { env: { [key: string]: string } };
export const MONGO_URI = env.MONGODB_URI;
export const MAILTRAP_USER = env.MAILTRAP_USER;
export const MAILTRAP_PASS = env.MAILTRAP_PASS;
export const VERIFICATION_EMAIL = env.VERIFICATION_EMAIL;
