import { z } from "zod";

const envSchema = z.object({
  AWS_CUSTOMER_RECIPIENT_EMAIL: z.string().email(),
  AWS_SOURCE_SENDER_EMAIL: z.string(),
  AWS_PROCESS_PAYMENT_QUEUE_URL: z.string().url(),
  AWS_REGION: z.literal("us-east-1"),
  API_BASE_PORT: z.coerce.number().default(3333),
  API_BASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
