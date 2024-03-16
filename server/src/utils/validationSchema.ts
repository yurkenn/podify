import { isValidObjectId } from 'mongoose';
import * as yup from 'yup';

export const createUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .max(20, 'Name must be at most 20 characters')
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  email: yup.string().trim().email('Email is not valid').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
    .matches(/^[a-zA-Z0-9]{3,30}$/, 'Password can only contain letters and numbers')
    .required('Password is required'),
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required('Token is required'),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return '';
    })
    .required('User id is required'),
});
