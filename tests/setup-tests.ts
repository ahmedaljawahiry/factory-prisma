import { beforeEach } from "vitest";
import db from "../prisma";

/**
 * Truncate all tables, apart from the Prisma migrations table.
 */
beforeEach(async () => {
  const tables = await db.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename != '_prisma_migrations'`;

  const names = tables.map((t) => `"public"."${t.tablename}"`).join(", ");
  await db.$executeRawUnsafe(`TRUNCATE TABLE ${names} CASCADE;`);
});
