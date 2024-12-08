import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { env } from "../config/env";

export class PlaceOrder {
  async execute() {
    const customerEmail = env.AWS_CUSTOMER_RECIPIENT_EMAIL;
    const amount = Math.ceil(Math.random() * 1000);
    const orderId = randomUUID();

    // save the order to the database
    const ddbClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: env.AWS_REGION,
      })
    );

    const putItemCommand = new PutCommand({
      TableName: "Orders",
      Item: {
        id: orderId,
        email: customerEmail,
        amount,
      },
    });

    await ddbClient.send(putItemCommand);

    // Pubish a message to the SQS queue to process the payment
    const sqsClient = new SQSClient({
      region: env.AWS_REGION,
    });

    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: env.AWS_PROCESS_PAYMENT_QUEUE_URL,
      MessageBody: JSON.stringify({
        orderId,
      }),
    });

    await sqsClient.send(sendMessageCommand);

    // Send an confirmation e-mail to the customer
    const sesClient = new SESClient({
      region: env.AWS_REGION,
    });

    const sendEmailCommand = new SendEmailCommand({
      Source: env.AWS_SOURCE_SENDER_EMAIL,
      Destination: {
        ToAddresses: [customerEmail],
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: `Order ${orderId} has been placed successfully!`,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
            <h1>Hello, Gustavo!</h1>

            <p>Your order with ID ${orderId} has been placed successfully! As soon as possible, we going to send you more information.</p>

            <smal>{{ table containing the order items }}</small>
            `,
          },
        },
      },
    });

    await sesClient.send(sendEmailCommand);

    return { orderId };
  }
}
