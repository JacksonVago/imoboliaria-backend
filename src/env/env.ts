import { z } from 'zod';

export const envSChema = z.object({
  //Environment configs
  NODE_ENV: z.enum(['development', 'production', 'test']),

  //Database configs
  DATABASE_URL: z.string(),

  //Application configs
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),

  //Client configs
  FRONTEND_URL: z.string().url(),

  //Bucket configs

  //Admin user configs
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_NAME: z.string(),

  //Supabase configs
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
});

export type Env = z.infer<typeof envSChema>;
