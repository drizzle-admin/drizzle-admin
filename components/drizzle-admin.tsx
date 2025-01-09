"use client";

import { ApolloProvider } from "@apollo/client";
import UsersList from "./users-list";
import client from "@/lib/apollo-client";

export function DrizzleAdmin() {
  return (
    <div>
      <ApolloProvider client={client}>
        <h1>drizzle admin</h1>
        <UsersList />
      </ApolloProvider>
    </div>
  );
}
