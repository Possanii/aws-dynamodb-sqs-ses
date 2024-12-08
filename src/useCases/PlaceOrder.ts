import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { env } from "../config/env";
import { Order } from "../entities/order";
import { DynamoOrdersRepository } from "../repository/DynamoOrdersRepository";

export class PlaceOrder {
  async execute() {
    const customerEmail = env.AWS_CUSTOMER_RECIPIENT_EMAIL;
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);
    const dynamoOrdersRepository = new DynamoOrdersRepository();

    await dynamoOrdersRepository.create(order);

    // Pubish a message to the SQS queue to process the payment
    const sqsClient = new SQSClient({
      region: env.AWS_REGION,
    });

    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: env.AWS_PROCESS_PAYMENT_QUEUE_URL,
      MessageBody: JSON.stringify({
        orderId: order.id,
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
          Data: `Order ${order.id} has been placed successfully!`,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
            <h1><strong>Hello, Gustavo!</strong></h1>

            <p>Your order with ID ${order.id} has been placed successfully! As soon as possible, we going to send you more information.</p>

            <smal>{{ table containing the order items }}</small>
            `,
          },
        },
      },
    });

    await sesClient.send(sendEmailCommand);

    return { orderId: order.id };
  }
}
