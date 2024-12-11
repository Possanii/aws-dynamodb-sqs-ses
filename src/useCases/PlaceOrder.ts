import { env } from "../config/env";
import { Inject } from "../di/Inject";
import { Order } from "../entities/order";
import { IEmailGateway } from "../interfaces/gateways/IEmailGateway";
import { IQueueGateway } from "../interfaces/gateways/IQueueGateway";

export interface IOrdersRepository {
  create(order: Order): Promise<void>;
}

// @Injectable()
export class PlaceOrder {
  constructor(
    @Inject("OrdersRepository")
    private readonly ordersRepository: IOrdersRepository,
    @Inject("QueueGateway") private readonly queueGateway: IQueueGateway,
    @Inject("EmailGateway") private readonly emailGateway: IEmailGateway
  ) {}

  async execute() {
    const customerEmail = env.AWS_CUSTOMER_RECIPIENT_EMAIL;
    const amount = Math.ceil(Math.random() * 1000);

    const order = new Order(customerEmail, amount);

    await this.ordersRepository.create(order);

    await this.queueGateway.publish({
      orderId: order.id,
    });

    await this.emailGateway.sendEmail({
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
