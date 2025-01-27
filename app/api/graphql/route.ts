import { buildSchema } from "drizzle-graphql";
import { db } from "@/lib/db";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import * as dbSchema from "@/lib/schema";
import { getTableConfig } from "drizzle-orm/pg-core";

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
    columns: { type: new GraphQLList(GraphQLString) },
  },
});

const ColumnsType = new GraphQLObjectType({
  name: "Columns",
  description: "all the columns for a table",
  fields: {
    name: { type: GraphQLString },
    dataType: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      usersTable: entities.queries.usersTable,

      tables: {
        resolve: async () => {
          const tables = Object.keys(entities.queries)
            .filter((table) => !table.endsWith("Single"))
            .map((table) => {
              const tableConfig = getTableConfig(dbSchema.usersTable);
              const columns = tableConfig.columns.map((col) => col.name);
              return {
                name: table,
                columns: columns,
              };
            });
          return tables;
        },
        type: new GraphQLList(TablesType),
      },

      columns: {
        type: new GraphQLList(ColumnsType),
        args: {
          table: { type: GraphQLString },
        },
        resolve: async (_, { table }: { table: keyof typeof dbSchema }) => {
          const tableConfig = getTableConfig(dbSchema[table]);
          const columns = tableConfig.columns.map((col) => {
            return {
              name: col.name,
              dataType: col.dataType,
            };
          });
          return columns.map((col) => col);
        },
      },
    },
  }),
});

const server = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
