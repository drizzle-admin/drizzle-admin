import { buildSchema } from "drizzle-graphql";
import { db } from "./lib/db";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const { schema } = buildSchema(db);

const server = new ApolloServer({ schema });

async function main() {
  const { url } = await startStandaloneServer(server);

  console.log(`🚀 Server ready at ${url}`);
}

main();
