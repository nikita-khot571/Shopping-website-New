import express from "express";
import cors from "cors";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./graphql";

// ---------------- Start Apollo GraphQL
async function start() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`🚀 GraphQL server ready at ${url}`);

  // ---------------- Express to serve frontend
  const app = express();
  app.use(cors());
  app.use(express.static(path.join(process.cwd(), "public")));

  app.listen(3000, () => {
    console.log("🛒 Frontend ready at http://localhost:3000");
  });
}

start().catch((err) => {
  console.error("❌ Failed to start servers:", err);
  process.exit(1);
});
