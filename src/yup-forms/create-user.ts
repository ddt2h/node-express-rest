import * as yup from 'yup'

export const createUserSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(6, 'Username must be at least 6 characters long')
    .max(20, 'Username cannot be more than 20 characters long'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot be more than 100 characters long'),
});