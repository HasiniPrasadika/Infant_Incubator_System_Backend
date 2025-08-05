import {z} from 'zod'

export const AdminSignUpSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const CreateUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  phoneNumber: z.string(),
  role: z.string(),         
  nic: z.string(),
});
