import prisma from "../prisma";
import { PlayerPosition } from "@prisma/client";

interface PrismaTable {
  create: (args: { data: any }) => any;
}

type CreateData<Table extends PrismaTable> = Parameters<
  Table["create"]
>[0]["data"];

type CreateResult<Table extends PrismaTable> = Promise<
  ReturnType<Table["create"]>
>;

type Factory<Table extends PrismaTable> = {
  fields: (overrides?: Partial<CreateData<Table>>) => CreateData<Table>;
  instance: (overrides?: Partial<CreateData<Table>>) => CreateResult<Table>;
};
/**
 * Creates a Factory instance, for creating fields or instances of a table.
 * @param tableClient - Prisma client for the table: prisma.<name>.
 * @param fieldsFactory - function for creating fields for the instance.
 */
export function factory<Table extends PrismaTable>(
  tableClient: Table,
  fieldsFactory: Factory<Table>["fields"]
): Factory<Table> {
  const fieldsFunc: Factory<Table>["fields"] = (overrides) => ({
    ...fieldsFactory(),
    ...overrides,
  });

  return {
    fields: fieldsFunc,
    instance: (overrides) =>
      tableClient.create({ data: fieldsFunc(overrides) }),
  };
}

// EXAMPLE:
// const playerFactory = factory(prisma.player, () => ({
//   name: "test",
//   age: 24,
//   key: "test",
//   position: PlayerPosition.ST,
// }));
//
// const fields = playerFactory.fields({ name: "test2" });
// const obj = await playerFactory.instance();
