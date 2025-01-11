/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ApolloProvider,
  gql,
  NormalizedCacheObject,
  useQuery,
} from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DrizzleAdminProps {
  action: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export function DrizzleAdmin(props: DrizzleAdminProps) {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    const client = new ApolloClient({
      uri: "http://localhost:3000/api/graphql",
      cache: new InMemoryCache(),
    });
    setClient(client);
  }, []);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="drizzle">
      <header className="header">
        <h1>drizzle admin</h1>
      </header>
      <DrizzleContent {...props} />
    </div>
  );
}

function DrizzleContent(props: DrizzleAdminProps) {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    const client = new ApolloClient({
      uri: "http://localhost:3000/api/graphql",
      cache: new InMemoryCache(),
    });
    setClient(client);
  }, []);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <ApolloProvider client={client}>
      <div className="content">
        <DrizzleSidebar />
        <main className="main">
          <RenderDrizzlePage {...props} />
        </main>
      </div>
    </ApolloProvider>
  );
}

function RenderDrizzlePage(props: DrizzleAdminProps) {
  switch (props.action) {
    case "index":
      return <DrizzleIndex {...props} />;
    case "new":
      return <DrizzleNew {...props} />;
    case "list":
      return <DrizzleList {...props} />;
    case "show":
      return <DrizzleShow {...props} />;
    case "edit":
      return <DrizzleEdit {...props} />;
    case "delete":
      return <DrizzleDelete {...props} />;
    default:
      return <div>unknown action</div>;
  }
}

function DrizzleSidebar() {
  const GET_TABLES = gql`
    query {
      tables {
        name
        columns
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_TABLES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="sidebar">
      <ul>
        {data.tables.map((table: any) => (
          <li key={table.name}>
            <Link href={`/drizzle-admin/list?table=${table.name}`}>
              {table.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DrizzleIndex(props: DrizzleAdminProps) {
  return <div>index</div>;
}

function DrizzleNew(props: DrizzleAdminProps) {
  return <div>new</div>;
}

function DrizzleList(props: DrizzleAdminProps) {
  // get all the columns for table
  const GET_COLUMNS = gql`
    query Columns($table: String!) {
      columns(table: $table) {
        name
        dataType
      }
    }
  `;

  const {
    loading: columnsLoading,
    error: columnsError,
    data: columnsData,
  } = useQuery(GET_COLUMNS, {
    variables: {
      table: props.searchParams.table,
    },
  });

  // console.log(columnsData?.columns.map((col: any) => col.name).join("\n"));

  const GET_LIST = gql`
    query ListData {
      ${props.searchParams.table} {
        ${columnsData?.columns.map((col: any) => col.name).join("\n")}
      }
    }
  `;

  const {
    loading: listLoading,
    error: listError,
    data: listData,
  } = useQuery(GET_LIST, {
    skip: !columnsData,
  });

  if (columnsLoading || listLoading) return <p>Loading...</p>;
  if (columnsError) return <p>Error: {columnsError.message}</p>;
  if (listError) return <p>Error: {listError.message}</p>;

  return (
    <table>
      <thead>
        <tr>
          {columnsData.columns.map((col: any) => {
            return <th key={col.name}>{col.name}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {listData[props.searchParams.table as keyof typeof listData].map(
          (obj: any) => {
            return (
              <tr key={obj.id}>
                {columnsData.columns.map((col: any) => {
                  return <td key={col.name}>{obj[col.name]}</td>;
                })}
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
}

function DrizzleShow(props: DrizzleAdminProps) {
  return <div>show</div>;
}

function DrizzleEdit(props: DrizzleAdminProps) {
  return <div>edit</div>;
}

function DrizzleDelete(props: DrizzleAdminProps) {
  return <div>delete</div>;
}
