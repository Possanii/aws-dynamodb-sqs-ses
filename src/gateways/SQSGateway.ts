import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { env } from "../config/env";

export class SQSGateway {
  private client = new SQSClient({
    region: env.AWS_REGION,
  });

  async publishMessage(message: Record<string, unknown>): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: env.AWS_PROCESS_PAYMENT_QUEUE_URL,
      MessageBody: JSON.stringify(message),
    });

    await this.client.send(command);
  }
}
