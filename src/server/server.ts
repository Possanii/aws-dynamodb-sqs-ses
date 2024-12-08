import fastify from "fastify";

const app = fastify();

app.post("/checkout", (req, reply) => {
  return {
    hello: "world",
  };
});

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server Running on http://localhost:3333");
});
