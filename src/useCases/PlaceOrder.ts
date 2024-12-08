import { env } from "../config/env";
import { Order } from "../entities/order";
import { DynamoOrdersRepository } from "../repository/DynamoOrdersRepository";
import { SQSGateway } from "../gateways/SQSGateway";
import { SESGateway } from "../gateways/SESGateway";

export class PlaceOrder {
  constructor(
    private readonly dynamoOrdersRepository: DynamoOrdersRepository,
    private readonly sqsGateway: SQSGateway,
    private readonly sesGateway: SESGateway
  ) {}

  async execute() {
    const customerEmail = env.AWS_CUSTOMER_RECIPIENT_EMAIL;
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);

    await this.dynamoOrdersRepository.create(order);

    await this.sqsGateway.publishMessage({
      orderId: order.id,
    });

    await this.sesGateway.sendEmail({
      from: env.AWS_SOURCE_SENDER_EMAIL,
      to: [env.AWS_CUSTOMER_RECIPIENT_EMAIL],
      subject: `Order ${order.id} has been placed successfully!`,
      html: `<h1><strong>Hello, Gustavo!</strong></h1> 
            <p>Your order with ID ${order.id} has been placed successfully! As soon as possible, we going to send you more information.</p>
            <smal>{{ table containing the order items }}</small>
      `,
    });

    return { orderId: order.id };
  }
}
