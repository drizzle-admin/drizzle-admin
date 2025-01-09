import { buildSchema } from "drizzle-graphql";
import { db } from "@/lib/db";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

// const { schema } = buildSchema(db);
const { entities } = buildSchema(db);

const TablesType = new GraphQLObjectType({
  name: "Tables",
  description: "all the tables",
  fields: {
    name: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      usersTable: entities.queries.usersTable,
      tables: {
        resolve: async () => {
          return [{ name: "foo" }];
        },
        type: new GraphQLList(TablesType),
      },
    },
  }),
});

const server = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
