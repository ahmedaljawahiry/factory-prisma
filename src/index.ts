/**
 * Base interface, for the minimum required type. I.e. a Prisma model with a create() function.
 */
interface ModelBase {
  create: (args: { data: any }) => any;
}

/**
 * Required fields, passed as "data" to the Model's create() method.
 */
type CreateData<Model extends ModelBase> = Parameters<
  Model["create"]
>[0]["data"];

/**
 * The result of the Model's create() method, i.e. the created instance.
 */
type CreateResult<Model extends ModelBase> = Promise<
  ReturnType<Model["create"]>
>;

/**
 * A factory instance, with fields() and instance() functions typed generically.
 */
type Factory<Model extends ModelBase> = {
  fields: (overrides?: Partial<CreateData<Model>>) => CreateData<Model>;
  instance: (overrides?: Partial<CreateData<Model>>) => CreateResult<Model>;
};

/**
 * Creates a Factory instance, for creating fields or instances of a Model.
 *
 * @param model - Prisma client for the Model: prisma.<modelName>.
 * @param fieldsFactory - function for creating fields for the instance.
 */
export function factory<Model extends ModelBase>(
  model: Model,
  fieldsFactory: Factory<Model>["fields"]
): Factory<Model> {
  const fieldsFunc: Factory<Model>["fields"] = (overrides) => ({
    ...fieldsFactory(overrides ?? {}),
    ...overrides,
  });

  return {
    fields: fieldsFunc,
    instance: (overrides) => model.create({ data: fieldsFunc(overrides) }),
  };
}

/**
 * Basic helper functions, for generating random data.
 */
export const random: {
  int: (max?: number) => number;
  float: () => number;
  string: () => string;
  date: () => Date;
  url: () => string;
} = {
  /**
   * Returns a random integer, with an (optional) maximum.
   */
  int: (max = 500) => Math.ceil(Math.random() * max),
  /**
   * Returns a random float.
   */
  float: () => Math.random(),
  /**
   * Returns a string, made up of 11 random chars.
   */
  string: () => Math.random().toString(36).slice(2),
  /**
   * Returns a random date in the past.
   */
  date: () => {
    const maxDate = Date.now();
    const timestamp = Math.floor(Math.random() * maxDate);
    return new Date(timestamp);
  },
  /**
   * Returns a URL in the form: https://<random-string>.com
   */
  url: () => `https://${Math.random().toString(36).slice(2)}.com`,
};
