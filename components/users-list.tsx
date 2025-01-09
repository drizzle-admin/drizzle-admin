"use client";

// UsersList.js
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { usersTable } from "@/lib/schema";

type User = typeof usersTable.$inferSelect;

// Define the GraphQL query
const GET_USERS = gql`
  query {
    usersTable {
      id
      email
    }
  }
`;

const UsersList = () => {
  // Use the `useQuery` hook to fetch data
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data.usersTable.map((user: User) => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
