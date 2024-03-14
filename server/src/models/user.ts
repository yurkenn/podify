import { compare, hash } from 'bcrypt';
import { Model, ObjectId, Schema, model } from 'mongoose';

interface userDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; public_id: string };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}

interface Methods {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<userDocument, {}, Methods>(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Audio' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followings: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  if (this.isModified('password')) {
    this.password = await hash(this.password, 8);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return compare(password, this.password);
};

export default model('User', userSchema) as Model<userDocument, {}, Methods>;
