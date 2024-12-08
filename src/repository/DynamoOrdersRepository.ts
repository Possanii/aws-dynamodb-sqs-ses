import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { Order } from "../entities/order";
import { env } from "../config/env";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class DynamoOrdersRepository {
  private client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
      region: env.AWS_REGION,
    })
  );

  async create(order: Order): Promise<void> {
    const command = new PutCommand({
      TableName: "Orders",
      Item: order,
    });

    await this.client.send(command);
  }
}
