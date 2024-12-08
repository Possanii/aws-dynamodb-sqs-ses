import fastify from "fastify";
import { PlaceOrder } from "../useCases/PlaceOrder";
import { env } from "../config/env";

const app = fastify();

app.post("/orders", async (request, reply) => {
  const placeOrder = new PlaceOrder();

  const { orderId } = await placeOrder.execute();

  reply.status(201).send({ orderId });
});

app.listen({ port: env.API_BASE_PORT }).then(() => {
  console.log(`HTTP Server Running on ${env.API_BASE_URL}`);
});
