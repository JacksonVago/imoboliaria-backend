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

  //PagSeguro configs
  PAGSEGURO_TOKEN: z.string(),
  PAGSEGURO_PUIBLIC_KEY: z.string(),

  /**
   * Acesso ao Blob azure
   * https://appimg.blob.core.windows.net/appimage/{id empresa}/{nome tela}/{id registro_descricao}.png
   */
  AZURE_BLOB_CONTAINER: z.string(),
  AZURE_ACCOUNT_STORAGE: z.string(),
  AZURE_SAS_TOKEN: z.string(),
  AZURE_CONTAINER_NAME: z.string(),
  AZURE_CONTAINER_CONNECTSTRING: z.string(),
});

export type Env = z.infer<typeof envSChema>;
