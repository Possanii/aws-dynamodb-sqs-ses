import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { env } from "../config/env";
import { IQueueGateway } from "../interfaces/gateways/IQueueGateway";

export class SQSGateway implements IQueueGateway {
  private client = new SQSClient({
    region: env.AWS_REGION,
  });

  async publish(message: Record<string, unknown>): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: env.AWS_PROCESS_PAYMENT_QUEUE_URL,
      MessageBody: JSON.stringify(message),
    });

    await this.client.send(command);
  }
}
