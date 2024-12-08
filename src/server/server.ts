import fastify from "fastify";
import { PlaceOrder } from "../useCases/PlaceOrder";
import { env } from "../config/env";
import { DynamoOrdersRepository } from "../repository/DynamoOrdersRepository";
import { SQSGateway } from "../gateways/SQSGateway";
import { SESGateway } from "../gateways/SESGateway";

const app = fastify();

app.post("/orders", async (request, reply) => {
  const dynamoOrdersRepository = new DynamoOrdersRepository();
  const sqsGateway = new SQSGateway();
  const sesGateway = new SESGateway();

  const placeOrder = new PlaceOrder(
    dynamoOrdersRepository,
    sqsGateway,
    sesGateway
  );

  const { orderId } = await placeOrder.execute();

  reply.status(201).send({ orderId });
});

app.listen({ port: env.API_BASE_PORT }).then(() => {
  console.log(`HTTP Server Running on ${env.API_BASE_URL}`);
});
