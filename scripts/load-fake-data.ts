import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "../lib/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const userList = [];
  for (let i = 0; i < 100; i++) {
    const user: typeof usersTable.$inferInsert = {
      name: "John",
      age: 30,
      email: `john${i}@example.com`,
    };
    userList.push(user);
  }

  await db.insert(usersTable).values(userList);
  console.log("New users created!");

  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
  process.exit(0);
}

main();
