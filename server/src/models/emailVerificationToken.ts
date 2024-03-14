import { hash, compare } from 'bcrypt';
import { Model, ObjectId, Schema, model } from 'mongoose';

interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument, {}, Methods>({
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 43200 },
});

emailVerificationTokenSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const token = this;
  if (token.isModified('token')) {
    token.token = await hash(token.token, 8);
  }
  next();
});

emailVerificationTokenSchema.methods.compareToken = async function (token: string) {
  return compare(token, this.token);
};

export default model('EmailVerificationToken', emailVerificationTokenSchema) as Model<
  EmailVerificationTokenDocument,
  {},
  Methods
>;
