import { buildSchema } from "drizzle-graphql";
import { db } from "@/lib/db";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const { schema } = buildSchema(db);

const server = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
