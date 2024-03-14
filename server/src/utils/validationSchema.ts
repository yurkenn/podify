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
