
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model UserPermission
 * 
 */
export type UserPermission = $Result.DefaultSelection<Prisma.$UserPermissionPayload>
/**
 * Model Department
 * 
 */
export type Department = $Result.DefaultSelection<Prisma.$DepartmentPayload>
/**
 * Model RoleDefinition
 * 
 */
export type RoleDefinition = $Result.DefaultSelection<Prisma.$RoleDefinitionPayload>
/**
 * Model DepartmentColumn
 * 
 */
export type DepartmentColumn = $Result.DefaultSelection<Prisma.$DepartmentColumnPayload>
/**
 * Model RegisterSurat
 * 
 */
export type RegisterSurat = $Result.DefaultSelection<Prisma.$RegisterSuratPayload>
/**
 * Model DetailSurat
 * 
 */
export type DetailSurat = $Result.DefaultSelection<Prisma.$DetailSuratPayload>
/**
 * Model NomorCounter
 * 
 */
export type NomorCounter = $Result.DefaultSelection<Prisma.$NomorCounterPayload>
/**
 * Model TrackSheet
 * 
 */
export type TrackSheet = $Result.DefaultSelection<Prisma.$TrackSheetPayload>
/**
 * Model TrackCategory
 * 
 */
export type TrackCategory = $Result.DefaultSelection<Prisma.$TrackCategoryPayload>
/**
 * Model TrackField
 * 
 */
export type TrackField = $Result.DefaultSelection<Prisma.$TrackFieldPayload>
/**
 * Model TrackRecord
 * 
 */
export type TrackRecord = $Result.DefaultSelection<Prisma.$TrackRecordPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userPermission`: Exposes CRUD operations for the **UserPermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserPermissions
    * const userPermissions = await prisma.userPermission.findMany()
    * ```
    */
  get userPermission(): Prisma.UserPermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.department`: Exposes CRUD operations for the **Department** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Departments
    * const departments = await prisma.department.findMany()
    * ```
    */
  get department(): Prisma.DepartmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roleDefinition`: Exposes CRUD operations for the **RoleDefinition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoleDefinitions
    * const roleDefinitions = await prisma.roleDefinition.findMany()
    * ```
    */
  get roleDefinition(): Prisma.RoleDefinitionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.departmentColumn`: Exposes CRUD operations for the **DepartmentColumn** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DepartmentColumns
    * const departmentColumns = await prisma.departmentColumn.findMany()
    * ```
    */
  get departmentColumn(): Prisma.DepartmentColumnDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.registerSurat`: Exposes CRUD operations for the **RegisterSurat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RegisterSurats
    * const registerSurats = await prisma.registerSurat.findMany()
    * ```
    */
  get registerSurat(): Prisma.RegisterSuratDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.detailSurat`: Exposes CRUD operations for the **DetailSurat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DetailSurats
    * const detailSurats = await prisma.detailSurat.findMany()
    * ```
    */
  get detailSurat(): Prisma.DetailSuratDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.nomorCounter`: Exposes CRUD operations for the **NomorCounter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NomorCounters
    * const nomorCounters = await prisma.nomorCounter.findMany()
    * ```
    */
  get nomorCounter(): Prisma.NomorCounterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trackSheet`: Exposes CRUD operations for the **TrackSheet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrackSheets
    * const trackSheets = await prisma.trackSheet.findMany()
    * ```
    */
  get trackSheet(): Prisma.TrackSheetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trackCategory`: Exposes CRUD operations for the **TrackCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrackCategories
    * const trackCategories = await prisma.trackCategory.findMany()
    * ```
    */
  get trackCategory(): Prisma.TrackCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trackField`: Exposes CRUD operations for the **TrackField** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrackFields
    * const trackFields = await prisma.trackField.findMany()
    * ```
    */
  get trackField(): Prisma.TrackFieldDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trackRecord`: Exposes CRUD operations for the **TrackRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrackRecords
    * const trackRecords = await prisma.trackRecord.findMany()
    * ```
    */
  get trackRecord(): Prisma.TrackRecordDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Account: 'Account',
    UserPermission: 'UserPermission',
    Department: 'Department',
    RoleDefinition: 'RoleDefinition',
    DepartmentColumn: 'DepartmentColumn',
    RegisterSurat: 'RegisterSurat',
    DetailSurat: 'DetailSurat',
    NomorCounter: 'NomorCounter',
    TrackSheet: 'TrackSheet',
    TrackCategory: 'TrackCategory',
    TrackField: 'TrackField',
    TrackRecord: 'TrackRecord'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "account" | "userPermission" | "department" | "roleDefinition" | "departmentColumn" | "registerSurat" | "detailSurat" | "nomorCounter" | "trackSheet" | "trackCategory" | "trackField" | "trackRecord"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      UserPermission: {
        payload: Prisma.$UserPermissionPayload<ExtArgs>
        fields: Prisma.UserPermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserPermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserPermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          findFirst: {
            args: Prisma.UserPermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserPermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          findMany: {
            args: Prisma.UserPermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          create: {
            args: Prisma.UserPermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          createMany: {
            args: Prisma.UserPermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserPermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          delete: {
            args: Prisma.UserPermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          update: {
            args: Prisma.UserPermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          deleteMany: {
            args: Prisma.UserPermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserPermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserPermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>[]
          }
          upsert: {
            args: Prisma.UserPermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPermissionPayload>
          }
          aggregate: {
            args: Prisma.UserPermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserPermission>
          }
          groupBy: {
            args: Prisma.UserPermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserPermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserPermissionCountArgs<ExtArgs>
            result: $Utils.Optional<UserPermissionCountAggregateOutputType> | number
          }
        }
      }
      Department: {
        payload: Prisma.$DepartmentPayload<ExtArgs>
        fields: Prisma.DepartmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findFirst: {
            args: Prisma.DepartmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          findMany: {
            args: Prisma.DepartmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          create: {
            args: Prisma.DepartmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          createMany: {
            args: Prisma.DepartmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          delete: {
            args: Prisma.DepartmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          update: {
            args: Prisma.DepartmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepartmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>[]
          }
          upsert: {
            args: Prisma.DepartmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentPayload>
          }
          aggregate: {
            args: Prisma.DepartmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartment>
          }
          groupBy: {
            args: Prisma.DepartmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentCountAggregateOutputType> | number
          }
        }
      }
      RoleDefinition: {
        payload: Prisma.$RoleDefinitionPayload<ExtArgs>
        fields: Prisma.RoleDefinitionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleDefinitionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleDefinitionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>
          }
          findFirst: {
            args: Prisma.RoleDefinitionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleDefinitionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>
          }
          findMany: {
            args: Prisma.RoleDefinitionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>[]
          }
          create: {
            args: Prisma.RoleDefinitionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>
          }
          createMany: {
            args: Prisma.RoleDefinitionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleDefinitionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>[]
          }
          delete: {
            args: Prisma.RoleDefinitionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>
          }
          update: {
            args: Prisma.RoleDefinitionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>
          }
          deleteMany: {
            args: Prisma.RoleDefinitionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleDefinitionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleDefinitionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>[]
          }
          upsert: {
            args: Prisma.RoleDefinitionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoleDefinitionPayload>
          }
          aggregate: {
            args: Prisma.RoleDefinitionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoleDefinition>
          }
          groupBy: {
            args: Prisma.RoleDefinitionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleDefinitionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleDefinitionCountArgs<ExtArgs>
            result: $Utils.Optional<RoleDefinitionCountAggregateOutputType> | number
          }
        }
      }
      DepartmentColumn: {
        payload: Prisma.$DepartmentColumnPayload<ExtArgs>
        fields: Prisma.DepartmentColumnFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DepartmentColumnFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DepartmentColumnFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>
          }
          findFirst: {
            args: Prisma.DepartmentColumnFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DepartmentColumnFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>
          }
          findMany: {
            args: Prisma.DepartmentColumnFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>[]
          }
          create: {
            args: Prisma.DepartmentColumnCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>
          }
          createMany: {
            args: Prisma.DepartmentColumnCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DepartmentColumnCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>[]
          }
          delete: {
            args: Prisma.DepartmentColumnDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>
          }
          update: {
            args: Prisma.DepartmentColumnUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>
          }
          deleteMany: {
            args: Prisma.DepartmentColumnDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DepartmentColumnUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DepartmentColumnUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>[]
          }
          upsert: {
            args: Prisma.DepartmentColumnUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DepartmentColumnPayload>
          }
          aggregate: {
            args: Prisma.DepartmentColumnAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDepartmentColumn>
          }
          groupBy: {
            args: Prisma.DepartmentColumnGroupByArgs<ExtArgs>
            result: $Utils.Optional<DepartmentColumnGroupByOutputType>[]
          }
          count: {
            args: Prisma.DepartmentColumnCountArgs<ExtArgs>
            result: $Utils.Optional<DepartmentColumnCountAggregateOutputType> | number
          }
        }
      }
      RegisterSurat: {
        payload: Prisma.$RegisterSuratPayload<ExtArgs>
        fields: Prisma.RegisterSuratFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RegisterSuratFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RegisterSuratFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>
          }
          findFirst: {
            args: Prisma.RegisterSuratFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RegisterSuratFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>
          }
          findMany: {
            args: Prisma.RegisterSuratFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>[]
          }
          create: {
            args: Prisma.RegisterSuratCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>
          }
          createMany: {
            args: Prisma.RegisterSuratCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RegisterSuratCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>[]
          }
          delete: {
            args: Prisma.RegisterSuratDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>
          }
          update: {
            args: Prisma.RegisterSuratUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>
          }
          deleteMany: {
            args: Prisma.RegisterSuratDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RegisterSuratUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RegisterSuratUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>[]
          }
          upsert: {
            args: Prisma.RegisterSuratUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RegisterSuratPayload>
          }
          aggregate: {
            args: Prisma.RegisterSuratAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRegisterSurat>
          }
          groupBy: {
            args: Prisma.RegisterSuratGroupByArgs<ExtArgs>
            result: $Utils.Optional<RegisterSuratGroupByOutputType>[]
          }
          count: {
            args: Prisma.RegisterSuratCountArgs<ExtArgs>
            result: $Utils.Optional<RegisterSuratCountAggregateOutputType> | number
          }
        }
      }
      DetailSurat: {
        payload: Prisma.$DetailSuratPayload<ExtArgs>
        fields: Prisma.DetailSuratFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DetailSuratFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DetailSuratFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>
          }
          findFirst: {
            args: Prisma.DetailSuratFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DetailSuratFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>
          }
          findMany: {
            args: Prisma.DetailSuratFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>[]
          }
          create: {
            args: Prisma.DetailSuratCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>
          }
          createMany: {
            args: Prisma.DetailSuratCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DetailSuratCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>[]
          }
          delete: {
            args: Prisma.DetailSuratDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>
          }
          update: {
            args: Prisma.DetailSuratUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>
          }
          deleteMany: {
            args: Prisma.DetailSuratDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DetailSuratUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DetailSuratUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>[]
          }
          upsert: {
            args: Prisma.DetailSuratUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DetailSuratPayload>
          }
          aggregate: {
            args: Prisma.DetailSuratAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDetailSurat>
          }
          groupBy: {
            args: Prisma.DetailSuratGroupByArgs<ExtArgs>
            result: $Utils.Optional<DetailSuratGroupByOutputType>[]
          }
          count: {
            args: Prisma.DetailSuratCountArgs<ExtArgs>
            result: $Utils.Optional<DetailSuratCountAggregateOutputType> | number
          }
        }
      }
      NomorCounter: {
        payload: Prisma.$NomorCounterPayload<ExtArgs>
        fields: Prisma.NomorCounterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NomorCounterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NomorCounterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>
          }
          findFirst: {
            args: Prisma.NomorCounterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NomorCounterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>
          }
          findMany: {
            args: Prisma.NomorCounterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>[]
          }
          create: {
            args: Prisma.NomorCounterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>
          }
          createMany: {
            args: Prisma.NomorCounterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NomorCounterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>[]
          }
          delete: {
            args: Prisma.NomorCounterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>
          }
          update: {
            args: Prisma.NomorCounterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>
          }
          deleteMany: {
            args: Prisma.NomorCounterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NomorCounterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NomorCounterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>[]
          }
          upsert: {
            args: Prisma.NomorCounterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NomorCounterPayload>
          }
          aggregate: {
            args: Prisma.NomorCounterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNomorCounter>
          }
          groupBy: {
            args: Prisma.NomorCounterGroupByArgs<ExtArgs>
            result: $Utils.Optional<NomorCounterGroupByOutputType>[]
          }
          count: {
            args: Prisma.NomorCounterCountArgs<ExtArgs>
            result: $Utils.Optional<NomorCounterCountAggregateOutputType> | number
          }
        }
      }
      TrackSheet: {
        payload: Prisma.$TrackSheetPayload<ExtArgs>
        fields: Prisma.TrackSheetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrackSheetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrackSheetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>
          }
          findFirst: {
            args: Prisma.TrackSheetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrackSheetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>
          }
          findMany: {
            args: Prisma.TrackSheetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>[]
          }
          create: {
            args: Prisma.TrackSheetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>
          }
          createMany: {
            args: Prisma.TrackSheetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrackSheetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>[]
          }
          delete: {
            args: Prisma.TrackSheetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>
          }
          update: {
            args: Prisma.TrackSheetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>
          }
          deleteMany: {
            args: Prisma.TrackSheetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrackSheetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrackSheetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>[]
          }
          upsert: {
            args: Prisma.TrackSheetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackSheetPayload>
          }
          aggregate: {
            args: Prisma.TrackSheetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrackSheet>
          }
          groupBy: {
            args: Prisma.TrackSheetGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrackSheetGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrackSheetCountArgs<ExtArgs>
            result: $Utils.Optional<TrackSheetCountAggregateOutputType> | number
          }
        }
      }
      TrackCategory: {
        payload: Prisma.$TrackCategoryPayload<ExtArgs>
        fields: Prisma.TrackCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrackCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrackCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>
          }
          findFirst: {
            args: Prisma.TrackCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrackCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>
          }
          findMany: {
            args: Prisma.TrackCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>[]
          }
          create: {
            args: Prisma.TrackCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>
          }
          createMany: {
            args: Prisma.TrackCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrackCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>[]
          }
          delete: {
            args: Prisma.TrackCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>
          }
          update: {
            args: Prisma.TrackCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>
          }
          deleteMany: {
            args: Prisma.TrackCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrackCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrackCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>[]
          }
          upsert: {
            args: Prisma.TrackCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackCategoryPayload>
          }
          aggregate: {
            args: Prisma.TrackCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrackCategory>
          }
          groupBy: {
            args: Prisma.TrackCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrackCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrackCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<TrackCategoryCountAggregateOutputType> | number
          }
        }
      }
      TrackField: {
        payload: Prisma.$TrackFieldPayload<ExtArgs>
        fields: Prisma.TrackFieldFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrackFieldFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrackFieldFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>
          }
          findFirst: {
            args: Prisma.TrackFieldFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrackFieldFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>
          }
          findMany: {
            args: Prisma.TrackFieldFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>[]
          }
          create: {
            args: Prisma.TrackFieldCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>
          }
          createMany: {
            args: Prisma.TrackFieldCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrackFieldCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>[]
          }
          delete: {
            args: Prisma.TrackFieldDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>
          }
          update: {
            args: Prisma.TrackFieldUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>
          }
          deleteMany: {
            args: Prisma.TrackFieldDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrackFieldUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrackFieldUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>[]
          }
          upsert: {
            args: Prisma.TrackFieldUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackFieldPayload>
          }
          aggregate: {
            args: Prisma.TrackFieldAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrackField>
          }
          groupBy: {
            args: Prisma.TrackFieldGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrackFieldGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrackFieldCountArgs<ExtArgs>
            result: $Utils.Optional<TrackFieldCountAggregateOutputType> | number
          }
        }
      }
      TrackRecord: {
        payload: Prisma.$TrackRecordPayload<ExtArgs>
        fields: Prisma.TrackRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrackRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrackRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>
          }
          findFirst: {
            args: Prisma.TrackRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrackRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>
          }
          findMany: {
            args: Prisma.TrackRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>[]
          }
          create: {
            args: Prisma.TrackRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>
          }
          createMany: {
            args: Prisma.TrackRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrackRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>[]
          }
          delete: {
            args: Prisma.TrackRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>
          }
          update: {
            args: Prisma.TrackRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>
          }
          deleteMany: {
            args: Prisma.TrackRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrackRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrackRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>[]
          }
          upsert: {
            args: Prisma.TrackRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrackRecordPayload>
          }
          aggregate: {
            args: Prisma.TrackRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrackRecord>
          }
          groupBy: {
            args: Prisma.TrackRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrackRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrackRecordCountArgs<ExtArgs>
            result: $Utils.Optional<TrackRecordCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    account?: AccountOmit
    userPermission?: UserPermissionOmit
    department?: DepartmentOmit
    roleDefinition?: RoleDefinitionOmit
    departmentColumn?: DepartmentColumnOmit
    registerSurat?: RegisterSuratOmit
    detailSurat?: DetailSuratOmit
    nomorCounter?: NomorCounterOmit
    trackSheet?: TrackSheetOmit
    trackCategory?: TrackCategoryOmit
    trackField?: TrackFieldOmit
    trackRecord?: TrackRecordOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    accounts: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }


  /**
   * Count Type DepartmentCountOutputType
   */

  export type DepartmentCountOutputType = {
    registerSurat: number
    nomorCounter: number
    columns: number
  }

  export type DepartmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    registerSurat?: boolean | DepartmentCountOutputTypeCountRegisterSuratArgs
    nomorCounter?: boolean | DepartmentCountOutputTypeCountNomorCounterArgs
    columns?: boolean | DepartmentCountOutputTypeCountColumnsArgs
  }

  // Custom InputTypes
  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentCountOutputType
     */
    select?: DepartmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountRegisterSuratArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegisterSuratWhereInput
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountNomorCounterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NomorCounterWhereInput
  }

  /**
   * DepartmentCountOutputType without action
   */
  export type DepartmentCountOutputTypeCountColumnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentColumnWhereInput
  }


  /**
   * Count Type RegisterSuratCountOutputType
   */

  export type RegisterSuratCountOutputType = {
    detailSurat: number
  }

  export type RegisterSuratCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    detailSurat?: boolean | RegisterSuratCountOutputTypeCountDetailSuratArgs
  }

  // Custom InputTypes
  /**
   * RegisterSuratCountOutputType without action
   */
  export type RegisterSuratCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSuratCountOutputType
     */
    select?: RegisterSuratCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RegisterSuratCountOutputType without action
   */
  export type RegisterSuratCountOutputTypeCountDetailSuratArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetailSuratWhereInput
  }


  /**
   * Count Type TrackSheetCountOutputType
   */

  export type TrackSheetCountOutputType = {
    categories: number
    fields: number
    records: number
  }

  export type TrackSheetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categories?: boolean | TrackSheetCountOutputTypeCountCategoriesArgs
    fields?: boolean | TrackSheetCountOutputTypeCountFieldsArgs
    records?: boolean | TrackSheetCountOutputTypeCountRecordsArgs
  }

  // Custom InputTypes
  /**
   * TrackSheetCountOutputType without action
   */
  export type TrackSheetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheetCountOutputType
     */
    select?: TrackSheetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TrackSheetCountOutputType without action
   */
  export type TrackSheetCountOutputTypeCountCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackCategoryWhereInput
  }

  /**
   * TrackSheetCountOutputType without action
   */
  export type TrackSheetCountOutputTypeCountFieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackFieldWhereInput
  }

  /**
   * TrackSheetCountOutputType without action
   */
  export type TrackSheetCountOutputTypeCountRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackRecordWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    username: string | null
    image: string | null
    role: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: boolean | null
    username: string | null
    image: string | null
    role: string | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    username: number
    image: number
    role: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    username?: true
    image?: true
    role?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    username?: true
    image?: true
    role?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    username?: true
    image?: true
    role?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    emailVerified: boolean
    username: string | null
    image: string | null
    role: string
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    username?: boolean
    image?: boolean
    role?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    permissions?: boolean | User$permissionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    username?: boolean
    image?: boolean
    role?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    username?: boolean
    image?: boolean
    role?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    username?: boolean
    image?: boolean
    role?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "username" | "image" | "role" | "lastLoginAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    permissions?: boolean | User$permissionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      permissions: Prisma.$UserPermissionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      emailVerified: boolean
      username: string | null
      image: string | null
      role: string
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    permissions<T extends User$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, User$permissionsArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly username: FieldRef<"User", 'String'>
    readonly image: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.permissions
   */
  export type User$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    where?: UserPermissionWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    createdAt: number
    updatedAt: number
    ipAddress: number
    userAgent: number
    userId: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "createdAt" | "updatedAt" | "ipAddress" | "userAgent" | "userId", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model UserPermission
   */

  export type AggregateUserPermission = {
    _count: UserPermissionCountAggregateOutputType | null
    _min: UserPermissionMinAggregateOutputType | null
    _max: UserPermissionMaxAggregateOutputType | null
  }

  export type UserPermissionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    canViewDataSurat: boolean | null
    canCreate: boolean | null
    canEdit: boolean | null
    canDelete: boolean | null
    canPrint: boolean | null
    canTrack: boolean | null
  }

  export type UserPermissionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    canViewDataSurat: boolean | null
    canCreate: boolean | null
    canEdit: boolean | null
    canDelete: boolean | null
    canPrint: boolean | null
    canTrack: boolean | null
  }

  export type UserPermissionCountAggregateOutputType = {
    id: number
    userId: number
    canViewDataSurat: number
    canCreate: number
    canEdit: number
    canDelete: number
    canPrint: number
    canTrack: number
    _all: number
  }


  export type UserPermissionMinAggregateInputType = {
    id?: true
    userId?: true
    canViewDataSurat?: true
    canCreate?: true
    canEdit?: true
    canDelete?: true
    canPrint?: true
    canTrack?: true
  }

  export type UserPermissionMaxAggregateInputType = {
    id?: true
    userId?: true
    canViewDataSurat?: true
    canCreate?: true
    canEdit?: true
    canDelete?: true
    canPrint?: true
    canTrack?: true
  }

  export type UserPermissionCountAggregateInputType = {
    id?: true
    userId?: true
    canViewDataSurat?: true
    canCreate?: true
    canEdit?: true
    canDelete?: true
    canPrint?: true
    canTrack?: true
    _all?: true
  }

  export type UserPermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPermission to aggregate.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserPermissions
    **/
    _count?: true | UserPermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserPermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserPermissionMaxAggregateInputType
  }

  export type GetUserPermissionAggregateType<T extends UserPermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserPermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserPermission[P]>
      : GetScalarType<T[P], AggregateUserPermission[P]>
  }




  export type UserPermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserPermissionWhereInput
    orderBy?: UserPermissionOrderByWithAggregationInput | UserPermissionOrderByWithAggregationInput[]
    by: UserPermissionScalarFieldEnum[] | UserPermissionScalarFieldEnum
    having?: UserPermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserPermissionCountAggregateInputType | true
    _min?: UserPermissionMinAggregateInputType
    _max?: UserPermissionMaxAggregateInputType
  }

  export type UserPermissionGroupByOutputType = {
    id: string
    userId: string
    canViewDataSurat: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canPrint: boolean
    canTrack: boolean
    _count: UserPermissionCountAggregateOutputType | null
    _min: UserPermissionMinAggregateOutputType | null
    _max: UserPermissionMaxAggregateOutputType | null
  }

  type GetUserPermissionGroupByPayload<T extends UserPermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserPermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserPermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserPermissionGroupByOutputType[P]>
            : GetScalarType<T[P], UserPermissionGroupByOutputType[P]>
        }
      >
    >


  export type UserPermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userPermission"]>

  export type UserPermissionSelectScalar = {
    id?: boolean
    userId?: boolean
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
  }

  export type UserPermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "canViewDataSurat" | "canCreate" | "canEdit" | "canDelete" | "canPrint" | "canTrack", ExtArgs["result"]["userPermission"]>
  export type UserPermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserPermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserPermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserPermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserPermission"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      canViewDataSurat: boolean
      canCreate: boolean
      canEdit: boolean
      canDelete: boolean
      canPrint: boolean
      canTrack: boolean
    }, ExtArgs["result"]["userPermission"]>
    composites: {}
  }

  type UserPermissionGetPayload<S extends boolean | null | undefined | UserPermissionDefaultArgs> = $Result.GetResult<Prisma.$UserPermissionPayload, S>

  type UserPermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserPermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserPermissionCountAggregateInputType | true
    }

  export interface UserPermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserPermission'], meta: { name: 'UserPermission' } }
    /**
     * Find zero or one UserPermission that matches the filter.
     * @param {UserPermissionFindUniqueArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserPermissionFindUniqueArgs>(args: SelectSubset<T, UserPermissionFindUniqueArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserPermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserPermissionFindUniqueOrThrowArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserPermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserPermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindFirstArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserPermissionFindFirstArgs>(args?: SelectSubset<T, UserPermissionFindFirstArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserPermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindFirstOrThrowArgs} args - Arguments to find a UserPermission
     * @example
     * // Get one UserPermission
     * const userPermission = await prisma.userPermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserPermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserPermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserPermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserPermissions
     * const userPermissions = await prisma.userPermission.findMany()
     * 
     * // Get first 10 UserPermissions
     * const userPermissions = await prisma.userPermission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userPermissionWithIdOnly = await prisma.userPermission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserPermissionFindManyArgs>(args?: SelectSubset<T, UserPermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserPermission.
     * @param {UserPermissionCreateArgs} args - Arguments to create a UserPermission.
     * @example
     * // Create one UserPermission
     * const UserPermission = await prisma.userPermission.create({
     *   data: {
     *     // ... data to create a UserPermission
     *   }
     * })
     * 
     */
    create<T extends UserPermissionCreateArgs>(args: SelectSubset<T, UserPermissionCreateArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserPermissions.
     * @param {UserPermissionCreateManyArgs} args - Arguments to create many UserPermissions.
     * @example
     * // Create many UserPermissions
     * const userPermission = await prisma.userPermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserPermissionCreateManyArgs>(args?: SelectSubset<T, UserPermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserPermissions and returns the data saved in the database.
     * @param {UserPermissionCreateManyAndReturnArgs} args - Arguments to create many UserPermissions.
     * @example
     * // Create many UserPermissions
     * const userPermission = await prisma.userPermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserPermissions and only return the `id`
     * const userPermissionWithIdOnly = await prisma.userPermission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserPermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserPermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserPermission.
     * @param {UserPermissionDeleteArgs} args - Arguments to delete one UserPermission.
     * @example
     * // Delete one UserPermission
     * const UserPermission = await prisma.userPermission.delete({
     *   where: {
     *     // ... filter to delete one UserPermission
     *   }
     * })
     * 
     */
    delete<T extends UserPermissionDeleteArgs>(args: SelectSubset<T, UserPermissionDeleteArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserPermission.
     * @param {UserPermissionUpdateArgs} args - Arguments to update one UserPermission.
     * @example
     * // Update one UserPermission
     * const userPermission = await prisma.userPermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserPermissionUpdateArgs>(args: SelectSubset<T, UserPermissionUpdateArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserPermissions.
     * @param {UserPermissionDeleteManyArgs} args - Arguments to filter UserPermissions to delete.
     * @example
     * // Delete a few UserPermissions
     * const { count } = await prisma.userPermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserPermissionDeleteManyArgs>(args?: SelectSubset<T, UserPermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserPermissions
     * const userPermission = await prisma.userPermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserPermissionUpdateManyArgs>(args: SelectSubset<T, UserPermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserPermissions and returns the data updated in the database.
     * @param {UserPermissionUpdateManyAndReturnArgs} args - Arguments to update many UserPermissions.
     * @example
     * // Update many UserPermissions
     * const userPermission = await prisma.userPermission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserPermissions and only return the `id`
     * const userPermissionWithIdOnly = await prisma.userPermission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserPermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserPermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserPermission.
     * @param {UserPermissionUpsertArgs} args - Arguments to update or create a UserPermission.
     * @example
     * // Update or create a UserPermission
     * const userPermission = await prisma.userPermission.upsert({
     *   create: {
     *     // ... data to create a UserPermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserPermission we want to update
     *   }
     * })
     */
    upsert<T extends UserPermissionUpsertArgs>(args: SelectSubset<T, UserPermissionUpsertArgs<ExtArgs>>): Prisma__UserPermissionClient<$Result.GetResult<Prisma.$UserPermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionCountArgs} args - Arguments to filter UserPermissions to count.
     * @example
     * // Count the number of UserPermissions
     * const count = await prisma.userPermission.count({
     *   where: {
     *     // ... the filter for the UserPermissions we want to count
     *   }
     * })
    **/
    count<T extends UserPermissionCountArgs>(
      args?: Subset<T, UserPermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserPermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserPermissionAggregateArgs>(args: Subset<T, UserPermissionAggregateArgs>): Prisma.PrismaPromise<GetUserPermissionAggregateType<T>>

    /**
     * Group by UserPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserPermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserPermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserPermissionGroupByArgs['orderBy'] }
        : { orderBy?: UserPermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserPermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserPermission model
   */
  readonly fields: UserPermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserPermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserPermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserPermission model
   */
  interface UserPermissionFieldRefs {
    readonly id: FieldRef<"UserPermission", 'String'>
    readonly userId: FieldRef<"UserPermission", 'String'>
    readonly canViewDataSurat: FieldRef<"UserPermission", 'Boolean'>
    readonly canCreate: FieldRef<"UserPermission", 'Boolean'>
    readonly canEdit: FieldRef<"UserPermission", 'Boolean'>
    readonly canDelete: FieldRef<"UserPermission", 'Boolean'>
    readonly canPrint: FieldRef<"UserPermission", 'Boolean'>
    readonly canTrack: FieldRef<"UserPermission", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * UserPermission findUnique
   */
  export type UserPermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission findUniqueOrThrow
   */
  export type UserPermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission findFirst
   */
  export type UserPermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission findFirstOrThrow
   */
  export type UserPermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermission to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission findMany
   */
  export type UserPermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter, which UserPermissions to fetch.
     */
    where?: UserPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserPermissions to fetch.
     */
    orderBy?: UserPermissionOrderByWithRelationInput | UserPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserPermissions.
     */
    cursor?: UserPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserPermissions.
     */
    distinct?: UserPermissionScalarFieldEnum | UserPermissionScalarFieldEnum[]
  }

  /**
   * UserPermission create
   */
  export type UserPermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserPermission.
     */
    data: XOR<UserPermissionCreateInput, UserPermissionUncheckedCreateInput>
  }

  /**
   * UserPermission createMany
   */
  export type UserPermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserPermissions.
     */
    data: UserPermissionCreateManyInput | UserPermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserPermission createManyAndReturn
   */
  export type UserPermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The data used to create many UserPermissions.
     */
    data: UserPermissionCreateManyInput | UserPermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPermission update
   */
  export type UserPermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserPermission.
     */
    data: XOR<UserPermissionUpdateInput, UserPermissionUncheckedUpdateInput>
    /**
     * Choose, which UserPermission to update.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission updateMany
   */
  export type UserPermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserPermissions.
     */
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyInput>
    /**
     * Filter which UserPermissions to update
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to update.
     */
    limit?: number
  }

  /**
   * UserPermission updateManyAndReturn
   */
  export type UserPermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * The data used to update UserPermissions.
     */
    data: XOR<UserPermissionUpdateManyMutationInput, UserPermissionUncheckedUpdateManyInput>
    /**
     * Filter which UserPermissions to update
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserPermission upsert
   */
  export type UserPermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserPermission to update in case it exists.
     */
    where: UserPermissionWhereUniqueInput
    /**
     * In case the UserPermission found by the `where` argument doesn't exist, create a new UserPermission with this data.
     */
    create: XOR<UserPermissionCreateInput, UserPermissionUncheckedCreateInput>
    /**
     * In case the UserPermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserPermissionUpdateInput, UserPermissionUncheckedUpdateInput>
  }

  /**
   * UserPermission delete
   */
  export type UserPermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
    /**
     * Filter which UserPermission to delete.
     */
    where: UserPermissionWhereUniqueInput
  }

  /**
   * UserPermission deleteMany
   */
  export type UserPermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserPermissions to delete
     */
    where?: UserPermissionWhereInput
    /**
     * Limit how many UserPermissions to delete.
     */
    limit?: number
  }

  /**
   * UserPermission without action
   */
  export type UserPermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserPermission
     */
    select?: UserPermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserPermission
     */
    omit?: UserPermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserPermissionInclude<ExtArgs> | null
  }


  /**
   * Model Department
   */

  export type AggregateDepartment = {
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  export type DepartmentMinAggregateOutputType = {
    id: string | null
    shortName: string | null
    tujuan: string | null
    printSheetName: string | null
    isActive: boolean | null
  }

  export type DepartmentMaxAggregateOutputType = {
    id: string | null
    shortName: string | null
    tujuan: string | null
    printSheetName: string | null
    isActive: boolean | null
  }

  export type DepartmentCountAggregateOutputType = {
    id: number
    shortName: number
    tujuan: number
    printSheetName: number
    isActive: number
    _all: number
  }


  export type DepartmentMinAggregateInputType = {
    id?: true
    shortName?: true
    tujuan?: true
    printSheetName?: true
    isActive?: true
  }

  export type DepartmentMaxAggregateInputType = {
    id?: true
    shortName?: true
    tujuan?: true
    printSheetName?: true
    isActive?: true
  }

  export type DepartmentCountAggregateInputType = {
    id?: true
    shortName?: true
    tujuan?: true
    printSheetName?: true
    isActive?: true
    _all?: true
  }

  export type DepartmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Department to aggregate.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Departments
    **/
    _count?: true | DepartmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentMaxAggregateInputType
  }

  export type GetDepartmentAggregateType<T extends DepartmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartment[P]>
      : GetScalarType<T[P], AggregateDepartment[P]>
  }




  export type DepartmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentWhereInput
    orderBy?: DepartmentOrderByWithAggregationInput | DepartmentOrderByWithAggregationInput[]
    by: DepartmentScalarFieldEnum[] | DepartmentScalarFieldEnum
    having?: DepartmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentCountAggregateInputType | true
    _min?: DepartmentMinAggregateInputType
    _max?: DepartmentMaxAggregateInputType
  }

  export type DepartmentGroupByOutputType = {
    id: string
    shortName: string
    tujuan: string
    printSheetName: string
    isActive: boolean
    _count: DepartmentCountAggregateOutputType | null
    _min: DepartmentMinAggregateOutputType | null
    _max: DepartmentMaxAggregateOutputType | null
  }

  type GetDepartmentGroupByPayload<T extends DepartmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shortName?: boolean
    tujuan?: boolean
    printSheetName?: boolean
    isActive?: boolean
    registerSurat?: boolean | Department$registerSuratArgs<ExtArgs>
    nomorCounter?: boolean | Department$nomorCounterArgs<ExtArgs>
    columns?: boolean | Department$columnsArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shortName?: boolean
    tujuan?: boolean
    printSheetName?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shortName?: boolean
    tujuan?: boolean
    printSheetName?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["department"]>

  export type DepartmentSelectScalar = {
    id?: boolean
    shortName?: boolean
    tujuan?: boolean
    printSheetName?: boolean
    isActive?: boolean
  }

  export type DepartmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shortName" | "tujuan" | "printSheetName" | "isActive", ExtArgs["result"]["department"]>
  export type DepartmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    registerSurat?: boolean | Department$registerSuratArgs<ExtArgs>
    nomorCounter?: boolean | Department$nomorCounterArgs<ExtArgs>
    columns?: boolean | Department$columnsArgs<ExtArgs>
    _count?: boolean | DepartmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DepartmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DepartmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DepartmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Department"
    objects: {
      registerSurat: Prisma.$RegisterSuratPayload<ExtArgs>[]
      nomorCounter: Prisma.$NomorCounterPayload<ExtArgs>[]
      columns: Prisma.$DepartmentColumnPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shortName: string
      tujuan: string
      printSheetName: string
      isActive: boolean
    }, ExtArgs["result"]["department"]>
    composites: {}
  }

  type DepartmentGetPayload<S extends boolean | null | undefined | DepartmentDefaultArgs> = $Result.GetResult<Prisma.$DepartmentPayload, S>

  type DepartmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentCountAggregateInputType | true
    }

  export interface DepartmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Department'], meta: { name: 'Department' } }
    /**
     * Find zero or one Department that matches the filter.
     * @param {DepartmentFindUniqueArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentFindUniqueArgs>(args: SelectSubset<T, DepartmentFindUniqueArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Department that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentFindUniqueOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentFindFirstArgs>(args?: SelectSubset<T, DepartmentFindFirstArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Department that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindFirstOrThrowArgs} args - Arguments to find a Department
     * @example
     * // Get one Department
     * const department = await prisma.department.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Departments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Departments
     * const departments = await prisma.department.findMany()
     * 
     * // Get first 10 Departments
     * const departments = await prisma.department.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentWithIdOnly = await prisma.department.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentFindManyArgs>(args?: SelectSubset<T, DepartmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Department.
     * @param {DepartmentCreateArgs} args - Arguments to create a Department.
     * @example
     * // Create one Department
     * const Department = await prisma.department.create({
     *   data: {
     *     // ... data to create a Department
     *   }
     * })
     * 
     */
    create<T extends DepartmentCreateArgs>(args: SelectSubset<T, DepartmentCreateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Departments.
     * @param {DepartmentCreateManyArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentCreateManyArgs>(args?: SelectSubset<T, DepartmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Departments and returns the data saved in the database.
     * @param {DepartmentCreateManyAndReturnArgs} args - Arguments to create many Departments.
     * @example
     * // Create many Departments
     * const department = await prisma.department.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Department.
     * @param {DepartmentDeleteArgs} args - Arguments to delete one Department.
     * @example
     * // Delete one Department
     * const Department = await prisma.department.delete({
     *   where: {
     *     // ... filter to delete one Department
     *   }
     * })
     * 
     */
    delete<T extends DepartmentDeleteArgs>(args: SelectSubset<T, DepartmentDeleteArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Department.
     * @param {DepartmentUpdateArgs} args - Arguments to update one Department.
     * @example
     * // Update one Department
     * const department = await prisma.department.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentUpdateArgs>(args: SelectSubset<T, DepartmentUpdateArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Departments.
     * @param {DepartmentDeleteManyArgs} args - Arguments to filter Departments to delete.
     * @example
     * // Delete a few Departments
     * const { count } = await prisma.department.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentDeleteManyArgs>(args?: SelectSubset<T, DepartmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentUpdateManyArgs>(args: SelectSubset<T, DepartmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Departments and returns the data updated in the database.
     * @param {DepartmentUpdateManyAndReturnArgs} args - Arguments to update many Departments.
     * @example
     * // Update many Departments
     * const department = await prisma.department.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Departments and only return the `id`
     * const departmentWithIdOnly = await prisma.department.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DepartmentUpdateManyAndReturnArgs>(args: SelectSubset<T, DepartmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Department.
     * @param {DepartmentUpsertArgs} args - Arguments to update or create a Department.
     * @example
     * // Update or create a Department
     * const department = await prisma.department.upsert({
     *   create: {
     *     // ... data to create a Department
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Department we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentUpsertArgs>(args: SelectSubset<T, DepartmentUpsertArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Departments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentCountArgs} args - Arguments to filter Departments to count.
     * @example
     * // Count the number of Departments
     * const count = await prisma.department.count({
     *   where: {
     *     // ... the filter for the Departments we want to count
     *   }
     * })
    **/
    count<T extends DepartmentCountArgs>(
      args?: Subset<T, DepartmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentAggregateArgs>(args: Subset<T, DepartmentAggregateArgs>): Prisma.PrismaPromise<GetDepartmentAggregateType<T>>

    /**
     * Group by Department.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Department model
   */
  readonly fields: DepartmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Department.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    registerSurat<T extends Department$registerSuratArgs<ExtArgs> = {}>(args?: Subset<T, Department$registerSuratArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    nomorCounter<T extends Department$nomorCounterArgs<ExtArgs> = {}>(args?: Subset<T, Department$nomorCounterArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    columns<T extends Department$columnsArgs<ExtArgs> = {}>(args?: Subset<T, Department$columnsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Department model
   */
  interface DepartmentFieldRefs {
    readonly id: FieldRef<"Department", 'String'>
    readonly shortName: FieldRef<"Department", 'String'>
    readonly tujuan: FieldRef<"Department", 'String'>
    readonly printSheetName: FieldRef<"Department", 'String'>
    readonly isActive: FieldRef<"Department", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Department findUnique
   */
  export type DepartmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findUniqueOrThrow
   */
  export type DepartmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department findFirst
   */
  export type DepartmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findFirstOrThrow
   */
  export type DepartmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Department to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department findMany
   */
  export type DepartmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter, which Departments to fetch.
     */
    where?: DepartmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Departments to fetch.
     */
    orderBy?: DepartmentOrderByWithRelationInput | DepartmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Departments.
     */
    cursor?: DepartmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Departments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Departments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Departments.
     */
    distinct?: DepartmentScalarFieldEnum | DepartmentScalarFieldEnum[]
  }

  /**
   * Department create
   */
  export type DepartmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Department.
     */
    data: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
  }

  /**
   * Department createMany
   */
  export type DepartmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Department createManyAndReturn
   */
  export type DepartmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data used to create many Departments.
     */
    data: DepartmentCreateManyInput | DepartmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Department update
   */
  export type DepartmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Department.
     */
    data: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
    /**
     * Choose, which Department to update.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department updateMany
   */
  export type DepartmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department updateManyAndReturn
   */
  export type DepartmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * The data used to update Departments.
     */
    data: XOR<DepartmentUpdateManyMutationInput, DepartmentUncheckedUpdateManyInput>
    /**
     * Filter which Departments to update
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to update.
     */
    limit?: number
  }

  /**
   * Department upsert
   */
  export type DepartmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Department to update in case it exists.
     */
    where: DepartmentWhereUniqueInput
    /**
     * In case the Department found by the `where` argument doesn't exist, create a new Department with this data.
     */
    create: XOR<DepartmentCreateInput, DepartmentUncheckedCreateInput>
    /**
     * In case the Department was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentUpdateInput, DepartmentUncheckedUpdateInput>
  }

  /**
   * Department delete
   */
  export type DepartmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
    /**
     * Filter which Department to delete.
     */
    where: DepartmentWhereUniqueInput
  }

  /**
   * Department deleteMany
   */
  export type DepartmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Departments to delete
     */
    where?: DepartmentWhereInput
    /**
     * Limit how many Departments to delete.
     */
    limit?: number
  }

  /**
   * Department.registerSurat
   */
  export type Department$registerSuratArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    where?: RegisterSuratWhereInput
    orderBy?: RegisterSuratOrderByWithRelationInput | RegisterSuratOrderByWithRelationInput[]
    cursor?: RegisterSuratWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RegisterSuratScalarFieldEnum | RegisterSuratScalarFieldEnum[]
  }

  /**
   * Department.nomorCounter
   */
  export type Department$nomorCounterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    where?: NomorCounterWhereInput
    orderBy?: NomorCounterOrderByWithRelationInput | NomorCounterOrderByWithRelationInput[]
    cursor?: NomorCounterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NomorCounterScalarFieldEnum | NomorCounterScalarFieldEnum[]
  }

  /**
   * Department.columns
   */
  export type Department$columnsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    where?: DepartmentColumnWhereInput
    orderBy?: DepartmentColumnOrderByWithRelationInput | DepartmentColumnOrderByWithRelationInput[]
    cursor?: DepartmentColumnWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DepartmentColumnScalarFieldEnum | DepartmentColumnScalarFieldEnum[]
  }

  /**
   * Department without action
   */
  export type DepartmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Department
     */
    select?: DepartmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Department
     */
    omit?: DepartmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentInclude<ExtArgs> | null
  }


  /**
   * Model RoleDefinition
   */

  export type AggregateRoleDefinition = {
    _count: RoleDefinitionCountAggregateOutputType | null
    _min: RoleDefinitionMinAggregateOutputType | null
    _max: RoleDefinitionMaxAggregateOutputType | null
  }

  export type RoleDefinitionMinAggregateOutputType = {
    id: string | null
    name: string | null
    value: string | null
    isSystem: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleDefinitionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    value: string | null
    isSystem: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RoleDefinitionCountAggregateOutputType = {
    id: number
    name: number
    value: number
    isSystem: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RoleDefinitionMinAggregateInputType = {
    id?: true
    name?: true
    value?: true
    isSystem?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleDefinitionMaxAggregateInputType = {
    id?: true
    name?: true
    value?: true
    isSystem?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RoleDefinitionCountAggregateInputType = {
    id?: true
    name?: true
    value?: true
    isSystem?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RoleDefinitionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleDefinition to aggregate.
     */
    where?: RoleDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleDefinitions to fetch.
     */
    orderBy?: RoleDefinitionOrderByWithRelationInput | RoleDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoleDefinitions
    **/
    _count?: true | RoleDefinitionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleDefinitionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleDefinitionMaxAggregateInputType
  }

  export type GetRoleDefinitionAggregateType<T extends RoleDefinitionAggregateArgs> = {
        [P in keyof T & keyof AggregateRoleDefinition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoleDefinition[P]>
      : GetScalarType<T[P], AggregateRoleDefinition[P]>
  }




  export type RoleDefinitionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleDefinitionWhereInput
    orderBy?: RoleDefinitionOrderByWithAggregationInput | RoleDefinitionOrderByWithAggregationInput[]
    by: RoleDefinitionScalarFieldEnum[] | RoleDefinitionScalarFieldEnum
    having?: RoleDefinitionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleDefinitionCountAggregateInputType | true
    _min?: RoleDefinitionMinAggregateInputType
    _max?: RoleDefinitionMaxAggregateInputType
  }

  export type RoleDefinitionGroupByOutputType = {
    id: string
    name: string
    value: string
    isSystem: boolean
    createdAt: Date
    updatedAt: Date
    _count: RoleDefinitionCountAggregateOutputType | null
    _min: RoleDefinitionMinAggregateOutputType | null
    _max: RoleDefinitionMaxAggregateOutputType | null
  }

  type GetRoleDefinitionGroupByPayload<T extends RoleDefinitionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleDefinitionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleDefinitionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleDefinitionGroupByOutputType[P]>
            : GetScalarType<T[P], RoleDefinitionGroupByOutputType[P]>
        }
      >
    >


  export type RoleDefinitionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    value?: boolean
    isSystem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["roleDefinition"]>

  export type RoleDefinitionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    value?: boolean
    isSystem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["roleDefinition"]>

  export type RoleDefinitionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    value?: boolean
    isSystem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["roleDefinition"]>

  export type RoleDefinitionSelectScalar = {
    id?: boolean
    name?: boolean
    value?: boolean
    isSystem?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RoleDefinitionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "value" | "isSystem" | "createdAt" | "updatedAt", ExtArgs["result"]["roleDefinition"]>

  export type $RoleDefinitionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoleDefinition"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      value: string
      isSystem: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["roleDefinition"]>
    composites: {}
  }

  type RoleDefinitionGetPayload<S extends boolean | null | undefined | RoleDefinitionDefaultArgs> = $Result.GetResult<Prisma.$RoleDefinitionPayload, S>

  type RoleDefinitionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleDefinitionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleDefinitionCountAggregateInputType | true
    }

  export interface RoleDefinitionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoleDefinition'], meta: { name: 'RoleDefinition' } }
    /**
     * Find zero or one RoleDefinition that matches the filter.
     * @param {RoleDefinitionFindUniqueArgs} args - Arguments to find a RoleDefinition
     * @example
     * // Get one RoleDefinition
     * const roleDefinition = await prisma.roleDefinition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleDefinitionFindUniqueArgs>(args: SelectSubset<T, RoleDefinitionFindUniqueArgs<ExtArgs>>): Prisma__RoleDefinitionClient<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoleDefinition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleDefinitionFindUniqueOrThrowArgs} args - Arguments to find a RoleDefinition
     * @example
     * // Get one RoleDefinition
     * const roleDefinition = await prisma.roleDefinition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleDefinitionFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleDefinitionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleDefinitionClient<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleDefinition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleDefinitionFindFirstArgs} args - Arguments to find a RoleDefinition
     * @example
     * // Get one RoleDefinition
     * const roleDefinition = await prisma.roleDefinition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleDefinitionFindFirstArgs>(args?: SelectSubset<T, RoleDefinitionFindFirstArgs<ExtArgs>>): Prisma__RoleDefinitionClient<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoleDefinition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleDefinitionFindFirstOrThrowArgs} args - Arguments to find a RoleDefinition
     * @example
     * // Get one RoleDefinition
     * const roleDefinition = await prisma.roleDefinition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleDefinitionFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleDefinitionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleDefinitionClient<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoleDefinitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleDefinitionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoleDefinitions
     * const roleDefinitions = await prisma.roleDefinition.findMany()
     * 
     * // Get first 10 RoleDefinitions
     * const roleDefinitions = await prisma.roleDefinition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleDefinitionWithIdOnly = await prisma.roleDefinition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleDefinitionFindManyArgs>(args?: SelectSubset<T, RoleDefinitionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoleDefinition.
     * @param {RoleDefinitionCreateArgs} args - Arguments to create a RoleDefinition.
     * @example
     * // Create one RoleDefinition
     * const RoleDefinition = await prisma.roleDefinition.create({
     *   data: {
     *     // ... data to create a RoleDefinition
     *   }
     * })
     * 
     */
    create<T extends RoleDefinitionCreateArgs>(args: SelectSubset<T, RoleDefinitionCreateArgs<ExtArgs>>): Prisma__RoleDefinitionClient<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoleDefinitions.
     * @param {RoleDefinitionCreateManyArgs} args - Arguments to create many RoleDefinitions.
     * @example
     * // Create many RoleDefinitions
     * const roleDefinition = await prisma.roleDefinition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleDefinitionCreateManyArgs>(args?: SelectSubset<T, RoleDefinitionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoleDefinitions and returns the data saved in the database.
     * @param {RoleDefinitionCreateManyAndReturnArgs} args - Arguments to create many RoleDefinitions.
     * @example
     * // Create many RoleDefinitions
     * const roleDefinition = await prisma.roleDefinition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoleDefinitions and only return the `id`
     * const roleDefinitionWithIdOnly = await prisma.roleDefinition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleDefinitionCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleDefinitionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoleDefinition.
     * @param {RoleDefinitionDeleteArgs} args - Arguments to delete one RoleDefinition.
     * @example
     * // Delete one RoleDefinition
     * const RoleDefinition = await prisma.roleDefinition.delete({
     *   where: {
     *     // ... filter to delete one RoleDefinition
     *   }
     * })
     * 
     */
    delete<T extends RoleDefinitionDeleteArgs>(args: SelectSubset<T, RoleDefinitionDeleteArgs<ExtArgs>>): Prisma__RoleDefinitionClient<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoleDefinition.
     * @param {RoleDefinitionUpdateArgs} args - Arguments to update one RoleDefinition.
     * @example
     * // Update one RoleDefinition
     * const roleDefinition = await prisma.roleDefinition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleDefinitionUpdateArgs>(args: SelectSubset<T, RoleDefinitionUpdateArgs<ExtArgs>>): Prisma__RoleDefinitionClient<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoleDefinitions.
     * @param {RoleDefinitionDeleteManyArgs} args - Arguments to filter RoleDefinitions to delete.
     * @example
     * // Delete a few RoleDefinitions
     * const { count } = await prisma.roleDefinition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDefinitionDeleteManyArgs>(args?: SelectSubset<T, RoleDefinitionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleDefinitionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoleDefinitions
     * const roleDefinition = await prisma.roleDefinition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleDefinitionUpdateManyArgs>(args: SelectSubset<T, RoleDefinitionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoleDefinitions and returns the data updated in the database.
     * @param {RoleDefinitionUpdateManyAndReturnArgs} args - Arguments to update many RoleDefinitions.
     * @example
     * // Update many RoleDefinitions
     * const roleDefinition = await prisma.roleDefinition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoleDefinitions and only return the `id`
     * const roleDefinitionWithIdOnly = await prisma.roleDefinition.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleDefinitionUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleDefinitionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoleDefinition.
     * @param {RoleDefinitionUpsertArgs} args - Arguments to update or create a RoleDefinition.
     * @example
     * // Update or create a RoleDefinition
     * const roleDefinition = await prisma.roleDefinition.upsert({
     *   create: {
     *     // ... data to create a RoleDefinition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoleDefinition we want to update
     *   }
     * })
     */
    upsert<T extends RoleDefinitionUpsertArgs>(args: SelectSubset<T, RoleDefinitionUpsertArgs<ExtArgs>>): Prisma__RoleDefinitionClient<$Result.GetResult<Prisma.$RoleDefinitionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoleDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleDefinitionCountArgs} args - Arguments to filter RoleDefinitions to count.
     * @example
     * // Count the number of RoleDefinitions
     * const count = await prisma.roleDefinition.count({
     *   where: {
     *     // ... the filter for the RoleDefinitions we want to count
     *   }
     * })
    **/
    count<T extends RoleDefinitionCountArgs>(
      args?: Subset<T, RoleDefinitionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleDefinitionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoleDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleDefinitionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleDefinitionAggregateArgs>(args: Subset<T, RoleDefinitionAggregateArgs>): Prisma.PrismaPromise<GetRoleDefinitionAggregateType<T>>

    /**
     * Group by RoleDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleDefinitionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleDefinitionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleDefinitionGroupByArgs['orderBy'] }
        : { orderBy?: RoleDefinitionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleDefinitionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleDefinitionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoleDefinition model
   */
  readonly fields: RoleDefinitionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoleDefinition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleDefinitionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoleDefinition model
   */
  interface RoleDefinitionFieldRefs {
    readonly id: FieldRef<"RoleDefinition", 'String'>
    readonly name: FieldRef<"RoleDefinition", 'String'>
    readonly value: FieldRef<"RoleDefinition", 'String'>
    readonly isSystem: FieldRef<"RoleDefinition", 'Boolean'>
    readonly createdAt: FieldRef<"RoleDefinition", 'DateTime'>
    readonly updatedAt: FieldRef<"RoleDefinition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoleDefinition findUnique
   */
  export type RoleDefinitionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which RoleDefinition to fetch.
     */
    where: RoleDefinitionWhereUniqueInput
  }

  /**
   * RoleDefinition findUniqueOrThrow
   */
  export type RoleDefinitionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which RoleDefinition to fetch.
     */
    where: RoleDefinitionWhereUniqueInput
  }

  /**
   * RoleDefinition findFirst
   */
  export type RoleDefinitionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which RoleDefinition to fetch.
     */
    where?: RoleDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleDefinitions to fetch.
     */
    orderBy?: RoleDefinitionOrderByWithRelationInput | RoleDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleDefinitions.
     */
    cursor?: RoleDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleDefinitions.
     */
    distinct?: RoleDefinitionScalarFieldEnum | RoleDefinitionScalarFieldEnum[]
  }

  /**
   * RoleDefinition findFirstOrThrow
   */
  export type RoleDefinitionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which RoleDefinition to fetch.
     */
    where?: RoleDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleDefinitions to fetch.
     */
    orderBy?: RoleDefinitionOrderByWithRelationInput | RoleDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoleDefinitions.
     */
    cursor?: RoleDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleDefinitions.
     */
    distinct?: RoleDefinitionScalarFieldEnum | RoleDefinitionScalarFieldEnum[]
  }

  /**
   * RoleDefinition findMany
   */
  export type RoleDefinitionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which RoleDefinitions to fetch.
     */
    where?: RoleDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoleDefinitions to fetch.
     */
    orderBy?: RoleDefinitionOrderByWithRelationInput | RoleDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoleDefinitions.
     */
    cursor?: RoleDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoleDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoleDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoleDefinitions.
     */
    distinct?: RoleDefinitionScalarFieldEnum | RoleDefinitionScalarFieldEnum[]
  }

  /**
   * RoleDefinition create
   */
  export type RoleDefinitionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * The data needed to create a RoleDefinition.
     */
    data: XOR<RoleDefinitionCreateInput, RoleDefinitionUncheckedCreateInput>
  }

  /**
   * RoleDefinition createMany
   */
  export type RoleDefinitionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoleDefinitions.
     */
    data: RoleDefinitionCreateManyInput | RoleDefinitionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoleDefinition createManyAndReturn
   */
  export type RoleDefinitionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * The data used to create many RoleDefinitions.
     */
    data: RoleDefinitionCreateManyInput | RoleDefinitionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoleDefinition update
   */
  export type RoleDefinitionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * The data needed to update a RoleDefinition.
     */
    data: XOR<RoleDefinitionUpdateInput, RoleDefinitionUncheckedUpdateInput>
    /**
     * Choose, which RoleDefinition to update.
     */
    where: RoleDefinitionWhereUniqueInput
  }

  /**
   * RoleDefinition updateMany
   */
  export type RoleDefinitionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoleDefinitions.
     */
    data: XOR<RoleDefinitionUpdateManyMutationInput, RoleDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which RoleDefinitions to update
     */
    where?: RoleDefinitionWhereInput
    /**
     * Limit how many RoleDefinitions to update.
     */
    limit?: number
  }

  /**
   * RoleDefinition updateManyAndReturn
   */
  export type RoleDefinitionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * The data used to update RoleDefinitions.
     */
    data: XOR<RoleDefinitionUpdateManyMutationInput, RoleDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which RoleDefinitions to update
     */
    where?: RoleDefinitionWhereInput
    /**
     * Limit how many RoleDefinitions to update.
     */
    limit?: number
  }

  /**
   * RoleDefinition upsert
   */
  export type RoleDefinitionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * The filter to search for the RoleDefinition to update in case it exists.
     */
    where: RoleDefinitionWhereUniqueInput
    /**
     * In case the RoleDefinition found by the `where` argument doesn't exist, create a new RoleDefinition with this data.
     */
    create: XOR<RoleDefinitionCreateInput, RoleDefinitionUncheckedCreateInput>
    /**
     * In case the RoleDefinition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleDefinitionUpdateInput, RoleDefinitionUncheckedUpdateInput>
  }

  /**
   * RoleDefinition delete
   */
  export type RoleDefinitionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
    /**
     * Filter which RoleDefinition to delete.
     */
    where: RoleDefinitionWhereUniqueInput
  }

  /**
   * RoleDefinition deleteMany
   */
  export type RoleDefinitionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoleDefinitions to delete
     */
    where?: RoleDefinitionWhereInput
    /**
     * Limit how many RoleDefinitions to delete.
     */
    limit?: number
  }

  /**
   * RoleDefinition without action
   */
  export type RoleDefinitionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleDefinition
     */
    select?: RoleDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoleDefinition
     */
    omit?: RoleDefinitionOmit<ExtArgs> | null
  }


  /**
   * Model DepartmentColumn
   */

  export type AggregateDepartmentColumn = {
    _count: DepartmentColumnCountAggregateOutputType | null
    _avg: DepartmentColumnAvgAggregateOutputType | null
    _sum: DepartmentColumnSumAggregateOutputType | null
    _min: DepartmentColumnMinAggregateOutputType | null
    _max: DepartmentColumnMaxAggregateOutputType | null
  }

  export type DepartmentColumnAvgAggregateOutputType = {
    sortOrder: number | null
    displayOrder: number | null
  }

  export type DepartmentColumnSumAggregateOutputType = {
    sortOrder: number | null
    displayOrder: number | null
  }

  export type DepartmentColumnMinAggregateOutputType = {
    id: string | null
    departmentId: string | null
    label: string | null
    dataType: string | null
    defaultValue: string | null
    isDefault: boolean | null
    isRequired: boolean | null
    showInDataSurat: boolean | null
    showInPrint: boolean | null
    sortOrder: number | null
    displayOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentColumnMaxAggregateOutputType = {
    id: string | null
    departmentId: string | null
    label: string | null
    dataType: string | null
    defaultValue: string | null
    isDefault: boolean | null
    isRequired: boolean | null
    showInDataSurat: boolean | null
    showInPrint: boolean | null
    sortOrder: number | null
    displayOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DepartmentColumnCountAggregateOutputType = {
    id: number
    departmentId: number
    label: number
    dataType: number
    defaultValue: number
    isDefault: number
    isRequired: number
    showInDataSurat: number
    showInPrint: number
    sortOrder: number
    displayOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DepartmentColumnAvgAggregateInputType = {
    sortOrder?: true
    displayOrder?: true
  }

  export type DepartmentColumnSumAggregateInputType = {
    sortOrder?: true
    displayOrder?: true
  }

  export type DepartmentColumnMinAggregateInputType = {
    id?: true
    departmentId?: true
    label?: true
    dataType?: true
    defaultValue?: true
    isDefault?: true
    isRequired?: true
    showInDataSurat?: true
    showInPrint?: true
    sortOrder?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentColumnMaxAggregateInputType = {
    id?: true
    departmentId?: true
    label?: true
    dataType?: true
    defaultValue?: true
    isDefault?: true
    isRequired?: true
    showInDataSurat?: true
    showInPrint?: true
    sortOrder?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DepartmentColumnCountAggregateInputType = {
    id?: true
    departmentId?: true
    label?: true
    dataType?: true
    defaultValue?: true
    isDefault?: true
    isRequired?: true
    showInDataSurat?: true
    showInPrint?: true
    sortOrder?: true
    displayOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DepartmentColumnAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DepartmentColumn to aggregate.
     */
    where?: DepartmentColumnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentColumns to fetch.
     */
    orderBy?: DepartmentColumnOrderByWithRelationInput | DepartmentColumnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DepartmentColumnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentColumns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentColumns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DepartmentColumns
    **/
    _count?: true | DepartmentColumnCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DepartmentColumnAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DepartmentColumnSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DepartmentColumnMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DepartmentColumnMaxAggregateInputType
  }

  export type GetDepartmentColumnAggregateType<T extends DepartmentColumnAggregateArgs> = {
        [P in keyof T & keyof AggregateDepartmentColumn]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDepartmentColumn[P]>
      : GetScalarType<T[P], AggregateDepartmentColumn[P]>
  }




  export type DepartmentColumnGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DepartmentColumnWhereInput
    orderBy?: DepartmentColumnOrderByWithAggregationInput | DepartmentColumnOrderByWithAggregationInput[]
    by: DepartmentColumnScalarFieldEnum[] | DepartmentColumnScalarFieldEnum
    having?: DepartmentColumnScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DepartmentColumnCountAggregateInputType | true
    _avg?: DepartmentColumnAvgAggregateInputType
    _sum?: DepartmentColumnSumAggregateInputType
    _min?: DepartmentColumnMinAggregateInputType
    _max?: DepartmentColumnMaxAggregateInputType
  }

  export type DepartmentColumnGroupByOutputType = {
    id: string
    departmentId: string
    label: string
    dataType: string
    defaultValue: string
    isDefault: boolean
    isRequired: boolean
    showInDataSurat: boolean
    showInPrint: boolean
    sortOrder: number
    displayOrder: number
    createdAt: Date
    updatedAt: Date
    _count: DepartmentColumnCountAggregateOutputType | null
    _avg: DepartmentColumnAvgAggregateOutputType | null
    _sum: DepartmentColumnSumAggregateOutputType | null
    _min: DepartmentColumnMinAggregateOutputType | null
    _max: DepartmentColumnMaxAggregateOutputType | null
  }

  type GetDepartmentColumnGroupByPayload<T extends DepartmentColumnGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DepartmentColumnGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DepartmentColumnGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DepartmentColumnGroupByOutputType[P]>
            : GetScalarType<T[P], DepartmentColumnGroupByOutputType[P]>
        }
      >
    >


  export type DepartmentColumnSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    departmentId?: boolean
    label?: boolean
    dataType?: boolean
    defaultValue?: boolean
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["departmentColumn"]>

  export type DepartmentColumnSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    departmentId?: boolean
    label?: boolean
    dataType?: boolean
    defaultValue?: boolean
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["departmentColumn"]>

  export type DepartmentColumnSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    departmentId?: boolean
    label?: boolean
    dataType?: boolean
    defaultValue?: boolean
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["departmentColumn"]>

  export type DepartmentColumnSelectScalar = {
    id?: boolean
    departmentId?: boolean
    label?: boolean
    dataType?: boolean
    defaultValue?: boolean
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: boolean
    displayOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DepartmentColumnOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "departmentId" | "label" | "dataType" | "defaultValue" | "isDefault" | "isRequired" | "showInDataSurat" | "showInPrint" | "sortOrder" | "displayOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["departmentColumn"]>
  export type DepartmentColumnInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }
  export type DepartmentColumnIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }
  export type DepartmentColumnIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    department?: boolean | DepartmentDefaultArgs<ExtArgs>
  }

  export type $DepartmentColumnPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DepartmentColumn"
    objects: {
      department: Prisma.$DepartmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      departmentId: string
      label: string
      dataType: string
      defaultValue: string
      isDefault: boolean
      isRequired: boolean
      showInDataSurat: boolean
      showInPrint: boolean
      sortOrder: number
      displayOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["departmentColumn"]>
    composites: {}
  }

  type DepartmentColumnGetPayload<S extends boolean | null | undefined | DepartmentColumnDefaultArgs> = $Result.GetResult<Prisma.$DepartmentColumnPayload, S>

  type DepartmentColumnCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DepartmentColumnFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DepartmentColumnCountAggregateInputType | true
    }

  export interface DepartmentColumnDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DepartmentColumn'], meta: { name: 'DepartmentColumn' } }
    /**
     * Find zero or one DepartmentColumn that matches the filter.
     * @param {DepartmentColumnFindUniqueArgs} args - Arguments to find a DepartmentColumn
     * @example
     * // Get one DepartmentColumn
     * const departmentColumn = await prisma.departmentColumn.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DepartmentColumnFindUniqueArgs>(args: SelectSubset<T, DepartmentColumnFindUniqueArgs<ExtArgs>>): Prisma__DepartmentColumnClient<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DepartmentColumn that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DepartmentColumnFindUniqueOrThrowArgs} args - Arguments to find a DepartmentColumn
     * @example
     * // Get one DepartmentColumn
     * const departmentColumn = await prisma.departmentColumn.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DepartmentColumnFindUniqueOrThrowArgs>(args: SelectSubset<T, DepartmentColumnFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DepartmentColumnClient<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DepartmentColumn that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentColumnFindFirstArgs} args - Arguments to find a DepartmentColumn
     * @example
     * // Get one DepartmentColumn
     * const departmentColumn = await prisma.departmentColumn.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DepartmentColumnFindFirstArgs>(args?: SelectSubset<T, DepartmentColumnFindFirstArgs<ExtArgs>>): Prisma__DepartmentColumnClient<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DepartmentColumn that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentColumnFindFirstOrThrowArgs} args - Arguments to find a DepartmentColumn
     * @example
     * // Get one DepartmentColumn
     * const departmentColumn = await prisma.departmentColumn.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DepartmentColumnFindFirstOrThrowArgs>(args?: SelectSubset<T, DepartmentColumnFindFirstOrThrowArgs<ExtArgs>>): Prisma__DepartmentColumnClient<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DepartmentColumns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentColumnFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DepartmentColumns
     * const departmentColumns = await prisma.departmentColumn.findMany()
     * 
     * // Get first 10 DepartmentColumns
     * const departmentColumns = await prisma.departmentColumn.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const departmentColumnWithIdOnly = await prisma.departmentColumn.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DepartmentColumnFindManyArgs>(args?: SelectSubset<T, DepartmentColumnFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DepartmentColumn.
     * @param {DepartmentColumnCreateArgs} args - Arguments to create a DepartmentColumn.
     * @example
     * // Create one DepartmentColumn
     * const DepartmentColumn = await prisma.departmentColumn.create({
     *   data: {
     *     // ... data to create a DepartmentColumn
     *   }
     * })
     * 
     */
    create<T extends DepartmentColumnCreateArgs>(args: SelectSubset<T, DepartmentColumnCreateArgs<ExtArgs>>): Prisma__DepartmentColumnClient<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DepartmentColumns.
     * @param {DepartmentColumnCreateManyArgs} args - Arguments to create many DepartmentColumns.
     * @example
     * // Create many DepartmentColumns
     * const departmentColumn = await prisma.departmentColumn.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DepartmentColumnCreateManyArgs>(args?: SelectSubset<T, DepartmentColumnCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DepartmentColumns and returns the data saved in the database.
     * @param {DepartmentColumnCreateManyAndReturnArgs} args - Arguments to create many DepartmentColumns.
     * @example
     * // Create many DepartmentColumns
     * const departmentColumn = await prisma.departmentColumn.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DepartmentColumns and only return the `id`
     * const departmentColumnWithIdOnly = await prisma.departmentColumn.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DepartmentColumnCreateManyAndReturnArgs>(args?: SelectSubset<T, DepartmentColumnCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DepartmentColumn.
     * @param {DepartmentColumnDeleteArgs} args - Arguments to delete one DepartmentColumn.
     * @example
     * // Delete one DepartmentColumn
     * const DepartmentColumn = await prisma.departmentColumn.delete({
     *   where: {
     *     // ... filter to delete one DepartmentColumn
     *   }
     * })
     * 
     */
    delete<T extends DepartmentColumnDeleteArgs>(args: SelectSubset<T, DepartmentColumnDeleteArgs<ExtArgs>>): Prisma__DepartmentColumnClient<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DepartmentColumn.
     * @param {DepartmentColumnUpdateArgs} args - Arguments to update one DepartmentColumn.
     * @example
     * // Update one DepartmentColumn
     * const departmentColumn = await prisma.departmentColumn.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DepartmentColumnUpdateArgs>(args: SelectSubset<T, DepartmentColumnUpdateArgs<ExtArgs>>): Prisma__DepartmentColumnClient<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DepartmentColumns.
     * @param {DepartmentColumnDeleteManyArgs} args - Arguments to filter DepartmentColumns to delete.
     * @example
     * // Delete a few DepartmentColumns
     * const { count } = await prisma.departmentColumn.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DepartmentColumnDeleteManyArgs>(args?: SelectSubset<T, DepartmentColumnDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DepartmentColumns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentColumnUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DepartmentColumns
     * const departmentColumn = await prisma.departmentColumn.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DepartmentColumnUpdateManyArgs>(args: SelectSubset<T, DepartmentColumnUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DepartmentColumns and returns the data updated in the database.
     * @param {DepartmentColumnUpdateManyAndReturnArgs} args - Arguments to update many DepartmentColumns.
     * @example
     * // Update many DepartmentColumns
     * const departmentColumn = await prisma.departmentColumn.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DepartmentColumns and only return the `id`
     * const departmentColumnWithIdOnly = await prisma.departmentColumn.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DepartmentColumnUpdateManyAndReturnArgs>(args: SelectSubset<T, DepartmentColumnUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DepartmentColumn.
     * @param {DepartmentColumnUpsertArgs} args - Arguments to update or create a DepartmentColumn.
     * @example
     * // Update or create a DepartmentColumn
     * const departmentColumn = await prisma.departmentColumn.upsert({
     *   create: {
     *     // ... data to create a DepartmentColumn
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DepartmentColumn we want to update
     *   }
     * })
     */
    upsert<T extends DepartmentColumnUpsertArgs>(args: SelectSubset<T, DepartmentColumnUpsertArgs<ExtArgs>>): Prisma__DepartmentColumnClient<$Result.GetResult<Prisma.$DepartmentColumnPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DepartmentColumns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentColumnCountArgs} args - Arguments to filter DepartmentColumns to count.
     * @example
     * // Count the number of DepartmentColumns
     * const count = await prisma.departmentColumn.count({
     *   where: {
     *     // ... the filter for the DepartmentColumns we want to count
     *   }
     * })
    **/
    count<T extends DepartmentColumnCountArgs>(
      args?: Subset<T, DepartmentColumnCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DepartmentColumnCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DepartmentColumn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentColumnAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DepartmentColumnAggregateArgs>(args: Subset<T, DepartmentColumnAggregateArgs>): Prisma.PrismaPromise<GetDepartmentColumnAggregateType<T>>

    /**
     * Group by DepartmentColumn.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DepartmentColumnGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DepartmentColumnGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DepartmentColumnGroupByArgs['orderBy'] }
        : { orderBy?: DepartmentColumnGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DepartmentColumnGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDepartmentColumnGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DepartmentColumn model
   */
  readonly fields: DepartmentColumnFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DepartmentColumn.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DepartmentColumnClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    department<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DepartmentColumn model
   */
  interface DepartmentColumnFieldRefs {
    readonly id: FieldRef<"DepartmentColumn", 'String'>
    readonly departmentId: FieldRef<"DepartmentColumn", 'String'>
    readonly label: FieldRef<"DepartmentColumn", 'String'>
    readonly dataType: FieldRef<"DepartmentColumn", 'String'>
    readonly defaultValue: FieldRef<"DepartmentColumn", 'String'>
    readonly isDefault: FieldRef<"DepartmentColumn", 'Boolean'>
    readonly isRequired: FieldRef<"DepartmentColumn", 'Boolean'>
    readonly showInDataSurat: FieldRef<"DepartmentColumn", 'Boolean'>
    readonly showInPrint: FieldRef<"DepartmentColumn", 'Boolean'>
    readonly sortOrder: FieldRef<"DepartmentColumn", 'Int'>
    readonly displayOrder: FieldRef<"DepartmentColumn", 'Int'>
    readonly createdAt: FieldRef<"DepartmentColumn", 'DateTime'>
    readonly updatedAt: FieldRef<"DepartmentColumn", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DepartmentColumn findUnique
   */
  export type DepartmentColumnFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentColumn to fetch.
     */
    where: DepartmentColumnWhereUniqueInput
  }

  /**
   * DepartmentColumn findUniqueOrThrow
   */
  export type DepartmentColumnFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentColumn to fetch.
     */
    where: DepartmentColumnWhereUniqueInput
  }

  /**
   * DepartmentColumn findFirst
   */
  export type DepartmentColumnFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentColumn to fetch.
     */
    where?: DepartmentColumnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentColumns to fetch.
     */
    orderBy?: DepartmentColumnOrderByWithRelationInput | DepartmentColumnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DepartmentColumns.
     */
    cursor?: DepartmentColumnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentColumns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentColumns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentColumns.
     */
    distinct?: DepartmentColumnScalarFieldEnum | DepartmentColumnScalarFieldEnum[]
  }

  /**
   * DepartmentColumn findFirstOrThrow
   */
  export type DepartmentColumnFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentColumn to fetch.
     */
    where?: DepartmentColumnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentColumns to fetch.
     */
    orderBy?: DepartmentColumnOrderByWithRelationInput | DepartmentColumnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DepartmentColumns.
     */
    cursor?: DepartmentColumnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentColumns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentColumns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentColumns.
     */
    distinct?: DepartmentColumnScalarFieldEnum | DepartmentColumnScalarFieldEnum[]
  }

  /**
   * DepartmentColumn findMany
   */
  export type DepartmentColumnFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * Filter, which DepartmentColumns to fetch.
     */
    where?: DepartmentColumnWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DepartmentColumns to fetch.
     */
    orderBy?: DepartmentColumnOrderByWithRelationInput | DepartmentColumnOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DepartmentColumns.
     */
    cursor?: DepartmentColumnWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DepartmentColumns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DepartmentColumns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DepartmentColumns.
     */
    distinct?: DepartmentColumnScalarFieldEnum | DepartmentColumnScalarFieldEnum[]
  }

  /**
   * DepartmentColumn create
   */
  export type DepartmentColumnCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * The data needed to create a DepartmentColumn.
     */
    data: XOR<DepartmentColumnCreateInput, DepartmentColumnUncheckedCreateInput>
  }

  /**
   * DepartmentColumn createMany
   */
  export type DepartmentColumnCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DepartmentColumns.
     */
    data: DepartmentColumnCreateManyInput | DepartmentColumnCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DepartmentColumn createManyAndReturn
   */
  export type DepartmentColumnCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * The data used to create many DepartmentColumns.
     */
    data: DepartmentColumnCreateManyInput | DepartmentColumnCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DepartmentColumn update
   */
  export type DepartmentColumnUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * The data needed to update a DepartmentColumn.
     */
    data: XOR<DepartmentColumnUpdateInput, DepartmentColumnUncheckedUpdateInput>
    /**
     * Choose, which DepartmentColumn to update.
     */
    where: DepartmentColumnWhereUniqueInput
  }

  /**
   * DepartmentColumn updateMany
   */
  export type DepartmentColumnUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DepartmentColumns.
     */
    data: XOR<DepartmentColumnUpdateManyMutationInput, DepartmentColumnUncheckedUpdateManyInput>
    /**
     * Filter which DepartmentColumns to update
     */
    where?: DepartmentColumnWhereInput
    /**
     * Limit how many DepartmentColumns to update.
     */
    limit?: number
  }

  /**
   * DepartmentColumn updateManyAndReturn
   */
  export type DepartmentColumnUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * The data used to update DepartmentColumns.
     */
    data: XOR<DepartmentColumnUpdateManyMutationInput, DepartmentColumnUncheckedUpdateManyInput>
    /**
     * Filter which DepartmentColumns to update
     */
    where?: DepartmentColumnWhereInput
    /**
     * Limit how many DepartmentColumns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DepartmentColumn upsert
   */
  export type DepartmentColumnUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * The filter to search for the DepartmentColumn to update in case it exists.
     */
    where: DepartmentColumnWhereUniqueInput
    /**
     * In case the DepartmentColumn found by the `where` argument doesn't exist, create a new DepartmentColumn with this data.
     */
    create: XOR<DepartmentColumnCreateInput, DepartmentColumnUncheckedCreateInput>
    /**
     * In case the DepartmentColumn was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DepartmentColumnUpdateInput, DepartmentColumnUncheckedUpdateInput>
  }

  /**
   * DepartmentColumn delete
   */
  export type DepartmentColumnDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
    /**
     * Filter which DepartmentColumn to delete.
     */
    where: DepartmentColumnWhereUniqueInput
  }

  /**
   * DepartmentColumn deleteMany
   */
  export type DepartmentColumnDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DepartmentColumns to delete
     */
    where?: DepartmentColumnWhereInput
    /**
     * Limit how many DepartmentColumns to delete.
     */
    limit?: number
  }

  /**
   * DepartmentColumn without action
   */
  export type DepartmentColumnDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DepartmentColumn
     */
    select?: DepartmentColumnSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DepartmentColumn
     */
    omit?: DepartmentColumnOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DepartmentColumnInclude<ExtArgs> | null
  }


  /**
   * Model RegisterSurat
   */

  export type AggregateRegisterSurat = {
    _count: RegisterSuratCountAggregateOutputType | null
    _avg: RegisterSuratAvgAggregateOutputType | null
    _sum: RegisterSuratSumAggregateOutputType | null
    _min: RegisterSuratMinAggregateOutputType | null
    _max: RegisterSuratMaxAggregateOutputType | null
  }

  export type RegisterSuratAvgAggregateOutputType = {
    id: number | null
  }

  export type RegisterSuratSumAggregateOutputType = {
    id: number | null
  }

  export type RegisterSuratMinAggregateOutputType = {
    id: number | null
    nomor: string | null
    deptId: string | null
    tanggalTerima: Date | null
    asalSurat: string | null
    tujuan: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RegisterSuratMaxAggregateOutputType = {
    id: number | null
    nomor: string | null
    deptId: string | null
    tanggalTerima: Date | null
    asalSurat: string | null
    tujuan: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RegisterSuratCountAggregateOutputType = {
    id: number
    nomor: number
    deptId: number
    tanggalTerima: number
    asalSurat: number
    tujuan: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RegisterSuratAvgAggregateInputType = {
    id?: true
  }

  export type RegisterSuratSumAggregateInputType = {
    id?: true
  }

  export type RegisterSuratMinAggregateInputType = {
    id?: true
    nomor?: true
    deptId?: true
    tanggalTerima?: true
    asalSurat?: true
    tujuan?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RegisterSuratMaxAggregateInputType = {
    id?: true
    nomor?: true
    deptId?: true
    tanggalTerima?: true
    asalSurat?: true
    tujuan?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RegisterSuratCountAggregateInputType = {
    id?: true
    nomor?: true
    deptId?: true
    tanggalTerima?: true
    asalSurat?: true
    tujuan?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RegisterSuratAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegisterSurat to aggregate.
     */
    where?: RegisterSuratWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegisterSurats to fetch.
     */
    orderBy?: RegisterSuratOrderByWithRelationInput | RegisterSuratOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RegisterSuratWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegisterSurats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegisterSurats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RegisterSurats
    **/
    _count?: true | RegisterSuratCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RegisterSuratAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RegisterSuratSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RegisterSuratMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RegisterSuratMaxAggregateInputType
  }

  export type GetRegisterSuratAggregateType<T extends RegisterSuratAggregateArgs> = {
        [P in keyof T & keyof AggregateRegisterSurat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRegisterSurat[P]>
      : GetScalarType<T[P], AggregateRegisterSurat[P]>
  }




  export type RegisterSuratGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RegisterSuratWhereInput
    orderBy?: RegisterSuratOrderByWithAggregationInput | RegisterSuratOrderByWithAggregationInput[]
    by: RegisterSuratScalarFieldEnum[] | RegisterSuratScalarFieldEnum
    having?: RegisterSuratScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RegisterSuratCountAggregateInputType | true
    _avg?: RegisterSuratAvgAggregateInputType
    _sum?: RegisterSuratSumAggregateInputType
    _min?: RegisterSuratMinAggregateInputType
    _max?: RegisterSuratMaxAggregateInputType
  }

  export type RegisterSuratGroupByOutputType = {
    id: number
    nomor: string
    deptId: string
    tanggalTerima: Date
    asalSurat: string
    tujuan: string
    createdAt: Date
    updatedAt: Date
    _count: RegisterSuratCountAggregateOutputType | null
    _avg: RegisterSuratAvgAggregateOutputType | null
    _sum: RegisterSuratSumAggregateOutputType | null
    _min: RegisterSuratMinAggregateOutputType | null
    _max: RegisterSuratMaxAggregateOutputType | null
  }

  type GetRegisterSuratGroupByPayload<T extends RegisterSuratGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RegisterSuratGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RegisterSuratGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RegisterSuratGroupByOutputType[P]>
            : GetScalarType<T[P], RegisterSuratGroupByOutputType[P]>
        }
      >
    >


  export type RegisterSuratSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor?: boolean
    deptId?: boolean
    tanggalTerima?: boolean
    asalSurat?: boolean
    tujuan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
    detailSurat?: boolean | RegisterSurat$detailSuratArgs<ExtArgs>
    _count?: boolean | RegisterSuratCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registerSurat"]>

  export type RegisterSuratSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor?: boolean
    deptId?: boolean
    tanggalTerima?: boolean
    asalSurat?: boolean
    tujuan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registerSurat"]>

  export type RegisterSuratSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nomor?: boolean
    deptId?: boolean
    tanggalTerima?: boolean
    asalSurat?: boolean
    tujuan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["registerSurat"]>

  export type RegisterSuratSelectScalar = {
    id?: boolean
    nomor?: boolean
    deptId?: boolean
    tanggalTerima?: boolean
    asalSurat?: boolean
    tujuan?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RegisterSuratOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nomor" | "deptId" | "tanggalTerima" | "asalSurat" | "tujuan" | "createdAt" | "updatedAt", ExtArgs["result"]["registerSurat"]>
  export type RegisterSuratInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
    detailSurat?: boolean | RegisterSurat$detailSuratArgs<ExtArgs>
    _count?: boolean | RegisterSuratCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RegisterSuratIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }
  export type RegisterSuratIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }

  export type $RegisterSuratPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RegisterSurat"
    objects: {
      dept: Prisma.$DepartmentPayload<ExtArgs>
      detailSurat: Prisma.$DetailSuratPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nomor: string
      deptId: string
      tanggalTerima: Date
      asalSurat: string
      tujuan: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["registerSurat"]>
    composites: {}
  }

  type RegisterSuratGetPayload<S extends boolean | null | undefined | RegisterSuratDefaultArgs> = $Result.GetResult<Prisma.$RegisterSuratPayload, S>

  type RegisterSuratCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RegisterSuratFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RegisterSuratCountAggregateInputType | true
    }

  export interface RegisterSuratDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RegisterSurat'], meta: { name: 'RegisterSurat' } }
    /**
     * Find zero or one RegisterSurat that matches the filter.
     * @param {RegisterSuratFindUniqueArgs} args - Arguments to find a RegisterSurat
     * @example
     * // Get one RegisterSurat
     * const registerSurat = await prisma.registerSurat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RegisterSuratFindUniqueArgs>(args: SelectSubset<T, RegisterSuratFindUniqueArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RegisterSurat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RegisterSuratFindUniqueOrThrowArgs} args - Arguments to find a RegisterSurat
     * @example
     * // Get one RegisterSurat
     * const registerSurat = await prisma.registerSurat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RegisterSuratFindUniqueOrThrowArgs>(args: SelectSubset<T, RegisterSuratFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegisterSurat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterSuratFindFirstArgs} args - Arguments to find a RegisterSurat
     * @example
     * // Get one RegisterSurat
     * const registerSurat = await prisma.registerSurat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RegisterSuratFindFirstArgs>(args?: SelectSubset<T, RegisterSuratFindFirstArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RegisterSurat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterSuratFindFirstOrThrowArgs} args - Arguments to find a RegisterSurat
     * @example
     * // Get one RegisterSurat
     * const registerSurat = await prisma.registerSurat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RegisterSuratFindFirstOrThrowArgs>(args?: SelectSubset<T, RegisterSuratFindFirstOrThrowArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RegisterSurats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterSuratFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RegisterSurats
     * const registerSurats = await prisma.registerSurat.findMany()
     * 
     * // Get first 10 RegisterSurats
     * const registerSurats = await prisma.registerSurat.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const registerSuratWithIdOnly = await prisma.registerSurat.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RegisterSuratFindManyArgs>(args?: SelectSubset<T, RegisterSuratFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RegisterSurat.
     * @param {RegisterSuratCreateArgs} args - Arguments to create a RegisterSurat.
     * @example
     * // Create one RegisterSurat
     * const RegisterSurat = await prisma.registerSurat.create({
     *   data: {
     *     // ... data to create a RegisterSurat
     *   }
     * })
     * 
     */
    create<T extends RegisterSuratCreateArgs>(args: SelectSubset<T, RegisterSuratCreateArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RegisterSurats.
     * @param {RegisterSuratCreateManyArgs} args - Arguments to create many RegisterSurats.
     * @example
     * // Create many RegisterSurats
     * const registerSurat = await prisma.registerSurat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RegisterSuratCreateManyArgs>(args?: SelectSubset<T, RegisterSuratCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RegisterSurats and returns the data saved in the database.
     * @param {RegisterSuratCreateManyAndReturnArgs} args - Arguments to create many RegisterSurats.
     * @example
     * // Create many RegisterSurats
     * const registerSurat = await prisma.registerSurat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RegisterSurats and only return the `id`
     * const registerSuratWithIdOnly = await prisma.registerSurat.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RegisterSuratCreateManyAndReturnArgs>(args?: SelectSubset<T, RegisterSuratCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RegisterSurat.
     * @param {RegisterSuratDeleteArgs} args - Arguments to delete one RegisterSurat.
     * @example
     * // Delete one RegisterSurat
     * const RegisterSurat = await prisma.registerSurat.delete({
     *   where: {
     *     // ... filter to delete one RegisterSurat
     *   }
     * })
     * 
     */
    delete<T extends RegisterSuratDeleteArgs>(args: SelectSubset<T, RegisterSuratDeleteArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RegisterSurat.
     * @param {RegisterSuratUpdateArgs} args - Arguments to update one RegisterSurat.
     * @example
     * // Update one RegisterSurat
     * const registerSurat = await prisma.registerSurat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RegisterSuratUpdateArgs>(args: SelectSubset<T, RegisterSuratUpdateArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RegisterSurats.
     * @param {RegisterSuratDeleteManyArgs} args - Arguments to filter RegisterSurats to delete.
     * @example
     * // Delete a few RegisterSurats
     * const { count } = await prisma.registerSurat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RegisterSuratDeleteManyArgs>(args?: SelectSubset<T, RegisterSuratDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegisterSurats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterSuratUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RegisterSurats
     * const registerSurat = await prisma.registerSurat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RegisterSuratUpdateManyArgs>(args: SelectSubset<T, RegisterSuratUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RegisterSurats and returns the data updated in the database.
     * @param {RegisterSuratUpdateManyAndReturnArgs} args - Arguments to update many RegisterSurats.
     * @example
     * // Update many RegisterSurats
     * const registerSurat = await prisma.registerSurat.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RegisterSurats and only return the `id`
     * const registerSuratWithIdOnly = await prisma.registerSurat.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RegisterSuratUpdateManyAndReturnArgs>(args: SelectSubset<T, RegisterSuratUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RegisterSurat.
     * @param {RegisterSuratUpsertArgs} args - Arguments to update or create a RegisterSurat.
     * @example
     * // Update or create a RegisterSurat
     * const registerSurat = await prisma.registerSurat.upsert({
     *   create: {
     *     // ... data to create a RegisterSurat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RegisterSurat we want to update
     *   }
     * })
     */
    upsert<T extends RegisterSuratUpsertArgs>(args: SelectSubset<T, RegisterSuratUpsertArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RegisterSurats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterSuratCountArgs} args - Arguments to filter RegisterSurats to count.
     * @example
     * // Count the number of RegisterSurats
     * const count = await prisma.registerSurat.count({
     *   where: {
     *     // ... the filter for the RegisterSurats we want to count
     *   }
     * })
    **/
    count<T extends RegisterSuratCountArgs>(
      args?: Subset<T, RegisterSuratCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RegisterSuratCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RegisterSurat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterSuratAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RegisterSuratAggregateArgs>(args: Subset<T, RegisterSuratAggregateArgs>): Prisma.PrismaPromise<GetRegisterSuratAggregateType<T>>

    /**
     * Group by RegisterSurat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RegisterSuratGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RegisterSuratGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RegisterSuratGroupByArgs['orderBy'] }
        : { orderBy?: RegisterSuratGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RegisterSuratGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRegisterSuratGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RegisterSurat model
   */
  readonly fields: RegisterSuratFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RegisterSurat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RegisterSuratClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dept<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    detailSurat<T extends RegisterSurat$detailSuratArgs<ExtArgs> = {}>(args?: Subset<T, RegisterSurat$detailSuratArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RegisterSurat model
   */
  interface RegisterSuratFieldRefs {
    readonly id: FieldRef<"RegisterSurat", 'Int'>
    readonly nomor: FieldRef<"RegisterSurat", 'String'>
    readonly deptId: FieldRef<"RegisterSurat", 'String'>
    readonly tanggalTerima: FieldRef<"RegisterSurat", 'DateTime'>
    readonly asalSurat: FieldRef<"RegisterSurat", 'String'>
    readonly tujuan: FieldRef<"RegisterSurat", 'String'>
    readonly createdAt: FieldRef<"RegisterSurat", 'DateTime'>
    readonly updatedAt: FieldRef<"RegisterSurat", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RegisterSurat findUnique
   */
  export type RegisterSuratFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * Filter, which RegisterSurat to fetch.
     */
    where: RegisterSuratWhereUniqueInput
  }

  /**
   * RegisterSurat findUniqueOrThrow
   */
  export type RegisterSuratFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * Filter, which RegisterSurat to fetch.
     */
    where: RegisterSuratWhereUniqueInput
  }

  /**
   * RegisterSurat findFirst
   */
  export type RegisterSuratFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * Filter, which RegisterSurat to fetch.
     */
    where?: RegisterSuratWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegisterSurats to fetch.
     */
    orderBy?: RegisterSuratOrderByWithRelationInput | RegisterSuratOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegisterSurats.
     */
    cursor?: RegisterSuratWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegisterSurats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegisterSurats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegisterSurats.
     */
    distinct?: RegisterSuratScalarFieldEnum | RegisterSuratScalarFieldEnum[]
  }

  /**
   * RegisterSurat findFirstOrThrow
   */
  export type RegisterSuratFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * Filter, which RegisterSurat to fetch.
     */
    where?: RegisterSuratWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegisterSurats to fetch.
     */
    orderBy?: RegisterSuratOrderByWithRelationInput | RegisterSuratOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RegisterSurats.
     */
    cursor?: RegisterSuratWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegisterSurats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegisterSurats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegisterSurats.
     */
    distinct?: RegisterSuratScalarFieldEnum | RegisterSuratScalarFieldEnum[]
  }

  /**
   * RegisterSurat findMany
   */
  export type RegisterSuratFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * Filter, which RegisterSurats to fetch.
     */
    where?: RegisterSuratWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RegisterSurats to fetch.
     */
    orderBy?: RegisterSuratOrderByWithRelationInput | RegisterSuratOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RegisterSurats.
     */
    cursor?: RegisterSuratWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RegisterSurats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RegisterSurats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RegisterSurats.
     */
    distinct?: RegisterSuratScalarFieldEnum | RegisterSuratScalarFieldEnum[]
  }

  /**
   * RegisterSurat create
   */
  export type RegisterSuratCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * The data needed to create a RegisterSurat.
     */
    data: XOR<RegisterSuratCreateInput, RegisterSuratUncheckedCreateInput>
  }

  /**
   * RegisterSurat createMany
   */
  export type RegisterSuratCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RegisterSurats.
     */
    data: RegisterSuratCreateManyInput | RegisterSuratCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RegisterSurat createManyAndReturn
   */
  export type RegisterSuratCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * The data used to create many RegisterSurats.
     */
    data: RegisterSuratCreateManyInput | RegisterSuratCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RegisterSurat update
   */
  export type RegisterSuratUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * The data needed to update a RegisterSurat.
     */
    data: XOR<RegisterSuratUpdateInput, RegisterSuratUncheckedUpdateInput>
    /**
     * Choose, which RegisterSurat to update.
     */
    where: RegisterSuratWhereUniqueInput
  }

  /**
   * RegisterSurat updateMany
   */
  export type RegisterSuratUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RegisterSurats.
     */
    data: XOR<RegisterSuratUpdateManyMutationInput, RegisterSuratUncheckedUpdateManyInput>
    /**
     * Filter which RegisterSurats to update
     */
    where?: RegisterSuratWhereInput
    /**
     * Limit how many RegisterSurats to update.
     */
    limit?: number
  }

  /**
   * RegisterSurat updateManyAndReturn
   */
  export type RegisterSuratUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * The data used to update RegisterSurats.
     */
    data: XOR<RegisterSuratUpdateManyMutationInput, RegisterSuratUncheckedUpdateManyInput>
    /**
     * Filter which RegisterSurats to update
     */
    where?: RegisterSuratWhereInput
    /**
     * Limit how many RegisterSurats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RegisterSurat upsert
   */
  export type RegisterSuratUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * The filter to search for the RegisterSurat to update in case it exists.
     */
    where: RegisterSuratWhereUniqueInput
    /**
     * In case the RegisterSurat found by the `where` argument doesn't exist, create a new RegisterSurat with this data.
     */
    create: XOR<RegisterSuratCreateInput, RegisterSuratUncheckedCreateInput>
    /**
     * In case the RegisterSurat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RegisterSuratUpdateInput, RegisterSuratUncheckedUpdateInput>
  }

  /**
   * RegisterSurat delete
   */
  export type RegisterSuratDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
    /**
     * Filter which RegisterSurat to delete.
     */
    where: RegisterSuratWhereUniqueInput
  }

  /**
   * RegisterSurat deleteMany
   */
  export type RegisterSuratDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RegisterSurats to delete
     */
    where?: RegisterSuratWhereInput
    /**
     * Limit how many RegisterSurats to delete.
     */
    limit?: number
  }

  /**
   * RegisterSurat.detailSurat
   */
  export type RegisterSurat$detailSuratArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    where?: DetailSuratWhereInput
    orderBy?: DetailSuratOrderByWithRelationInput | DetailSuratOrderByWithRelationInput[]
    cursor?: DetailSuratWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DetailSuratScalarFieldEnum | DetailSuratScalarFieldEnum[]
  }

  /**
   * RegisterSurat without action
   */
  export type RegisterSuratDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RegisterSurat
     */
    select?: RegisterSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RegisterSurat
     */
    omit?: RegisterSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RegisterSuratInclude<ExtArgs> | null
  }


  /**
   * Model DetailSurat
   */

  export type AggregateDetailSurat = {
    _count: DetailSuratCountAggregateOutputType | null
    _avg: DetailSuratAvgAggregateOutputType | null
    _sum: DetailSuratSumAggregateOutputType | null
    _min: DetailSuratMinAggregateOutputType | null
    _max: DetailSuratMaxAggregateOutputType | null
  }

  export type DetailSuratAvgAggregateOutputType = {
    id: number | null
    registerId: number | null
  }

  export type DetailSuratSumAggregateOutputType = {
    id: number | null
    registerId: number | null
  }

  export type DetailSuratMinAggregateOutputType = {
    id: number | null
    registerId: number | null
    perihal: string | null
    noSurat: string | null
    lampiran: string | null
    tanggalSurat: Date | null
    tujuan: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DetailSuratMaxAggregateOutputType = {
    id: number | null
    registerId: number | null
    perihal: string | null
    noSurat: string | null
    lampiran: string | null
    tanggalSurat: Date | null
    tujuan: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DetailSuratCountAggregateOutputType = {
    id: number
    registerId: number
    perihal: number
    noSurat: number
    lampiran: number
    tanggalSurat: number
    tujuan: number
    customFields: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DetailSuratAvgAggregateInputType = {
    id?: true
    registerId?: true
  }

  export type DetailSuratSumAggregateInputType = {
    id?: true
    registerId?: true
  }

  export type DetailSuratMinAggregateInputType = {
    id?: true
    registerId?: true
    perihal?: true
    noSurat?: true
    lampiran?: true
    tanggalSurat?: true
    tujuan?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DetailSuratMaxAggregateInputType = {
    id?: true
    registerId?: true
    perihal?: true
    noSurat?: true
    lampiran?: true
    tanggalSurat?: true
    tujuan?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DetailSuratCountAggregateInputType = {
    id?: true
    registerId?: true
    perihal?: true
    noSurat?: true
    lampiran?: true
    tanggalSurat?: true
    tujuan?: true
    customFields?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DetailSuratAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DetailSurat to aggregate.
     */
    where?: DetailSuratWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailSurats to fetch.
     */
    orderBy?: DetailSuratOrderByWithRelationInput | DetailSuratOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DetailSuratWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailSurats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailSurats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DetailSurats
    **/
    _count?: true | DetailSuratCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DetailSuratAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DetailSuratSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DetailSuratMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DetailSuratMaxAggregateInputType
  }

  export type GetDetailSuratAggregateType<T extends DetailSuratAggregateArgs> = {
        [P in keyof T & keyof AggregateDetailSurat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDetailSurat[P]>
      : GetScalarType<T[P], AggregateDetailSurat[P]>
  }




  export type DetailSuratGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DetailSuratWhereInput
    orderBy?: DetailSuratOrderByWithAggregationInput | DetailSuratOrderByWithAggregationInput[]
    by: DetailSuratScalarFieldEnum[] | DetailSuratScalarFieldEnum
    having?: DetailSuratScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DetailSuratCountAggregateInputType | true
    _avg?: DetailSuratAvgAggregateInputType
    _sum?: DetailSuratSumAggregateInputType
    _min?: DetailSuratMinAggregateInputType
    _max?: DetailSuratMaxAggregateInputType
  }

  export type DetailSuratGroupByOutputType = {
    id: number
    registerId: number
    perihal: string
    noSurat: string | null
    lampiran: string | null
    tanggalSurat: Date
    tujuan: string | null
    customFields: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: DetailSuratCountAggregateOutputType | null
    _avg: DetailSuratAvgAggregateOutputType | null
    _sum: DetailSuratSumAggregateOutputType | null
    _min: DetailSuratMinAggregateOutputType | null
    _max: DetailSuratMaxAggregateOutputType | null
  }

  type GetDetailSuratGroupByPayload<T extends DetailSuratGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DetailSuratGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DetailSuratGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DetailSuratGroupByOutputType[P]>
            : GetScalarType<T[P], DetailSuratGroupByOutputType[P]>
        }
      >
    >


  export type DetailSuratSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    registerId?: boolean
    perihal?: boolean
    noSurat?: boolean
    lampiran?: boolean
    tanggalSurat?: boolean
    tujuan?: boolean
    customFields?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    register?: boolean | RegisterSuratDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detailSurat"]>

  export type DetailSuratSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    registerId?: boolean
    perihal?: boolean
    noSurat?: boolean
    lampiran?: boolean
    tanggalSurat?: boolean
    tujuan?: boolean
    customFields?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    register?: boolean | RegisterSuratDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detailSurat"]>

  export type DetailSuratSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    registerId?: boolean
    perihal?: boolean
    noSurat?: boolean
    lampiran?: boolean
    tanggalSurat?: boolean
    tujuan?: boolean
    customFields?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    register?: boolean | RegisterSuratDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["detailSurat"]>

  export type DetailSuratSelectScalar = {
    id?: boolean
    registerId?: boolean
    perihal?: boolean
    noSurat?: boolean
    lampiran?: boolean
    tanggalSurat?: boolean
    tujuan?: boolean
    customFields?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DetailSuratOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "registerId" | "perihal" | "noSurat" | "lampiran" | "tanggalSurat" | "tujuan" | "customFields" | "createdAt" | "updatedAt", ExtArgs["result"]["detailSurat"]>
  export type DetailSuratInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    register?: boolean | RegisterSuratDefaultArgs<ExtArgs>
  }
  export type DetailSuratIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    register?: boolean | RegisterSuratDefaultArgs<ExtArgs>
  }
  export type DetailSuratIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    register?: boolean | RegisterSuratDefaultArgs<ExtArgs>
  }

  export type $DetailSuratPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DetailSurat"
    objects: {
      register: Prisma.$RegisterSuratPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      registerId: number
      perihal: string
      noSurat: string | null
      lampiran: string | null
      tanggalSurat: Date
      tujuan: string | null
      customFields: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["detailSurat"]>
    composites: {}
  }

  type DetailSuratGetPayload<S extends boolean | null | undefined | DetailSuratDefaultArgs> = $Result.GetResult<Prisma.$DetailSuratPayload, S>

  type DetailSuratCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DetailSuratFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DetailSuratCountAggregateInputType | true
    }

  export interface DetailSuratDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DetailSurat'], meta: { name: 'DetailSurat' } }
    /**
     * Find zero or one DetailSurat that matches the filter.
     * @param {DetailSuratFindUniqueArgs} args - Arguments to find a DetailSurat
     * @example
     * // Get one DetailSurat
     * const detailSurat = await prisma.detailSurat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DetailSuratFindUniqueArgs>(args: SelectSubset<T, DetailSuratFindUniqueArgs<ExtArgs>>): Prisma__DetailSuratClient<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DetailSurat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DetailSuratFindUniqueOrThrowArgs} args - Arguments to find a DetailSurat
     * @example
     * // Get one DetailSurat
     * const detailSurat = await prisma.detailSurat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DetailSuratFindUniqueOrThrowArgs>(args: SelectSubset<T, DetailSuratFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DetailSuratClient<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DetailSurat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailSuratFindFirstArgs} args - Arguments to find a DetailSurat
     * @example
     * // Get one DetailSurat
     * const detailSurat = await prisma.detailSurat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DetailSuratFindFirstArgs>(args?: SelectSubset<T, DetailSuratFindFirstArgs<ExtArgs>>): Prisma__DetailSuratClient<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DetailSurat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailSuratFindFirstOrThrowArgs} args - Arguments to find a DetailSurat
     * @example
     * // Get one DetailSurat
     * const detailSurat = await prisma.detailSurat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DetailSuratFindFirstOrThrowArgs>(args?: SelectSubset<T, DetailSuratFindFirstOrThrowArgs<ExtArgs>>): Prisma__DetailSuratClient<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DetailSurats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailSuratFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DetailSurats
     * const detailSurats = await prisma.detailSurat.findMany()
     * 
     * // Get first 10 DetailSurats
     * const detailSurats = await prisma.detailSurat.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const detailSuratWithIdOnly = await prisma.detailSurat.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DetailSuratFindManyArgs>(args?: SelectSubset<T, DetailSuratFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DetailSurat.
     * @param {DetailSuratCreateArgs} args - Arguments to create a DetailSurat.
     * @example
     * // Create one DetailSurat
     * const DetailSurat = await prisma.detailSurat.create({
     *   data: {
     *     // ... data to create a DetailSurat
     *   }
     * })
     * 
     */
    create<T extends DetailSuratCreateArgs>(args: SelectSubset<T, DetailSuratCreateArgs<ExtArgs>>): Prisma__DetailSuratClient<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DetailSurats.
     * @param {DetailSuratCreateManyArgs} args - Arguments to create many DetailSurats.
     * @example
     * // Create many DetailSurats
     * const detailSurat = await prisma.detailSurat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DetailSuratCreateManyArgs>(args?: SelectSubset<T, DetailSuratCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DetailSurats and returns the data saved in the database.
     * @param {DetailSuratCreateManyAndReturnArgs} args - Arguments to create many DetailSurats.
     * @example
     * // Create many DetailSurats
     * const detailSurat = await prisma.detailSurat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DetailSurats and only return the `id`
     * const detailSuratWithIdOnly = await prisma.detailSurat.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DetailSuratCreateManyAndReturnArgs>(args?: SelectSubset<T, DetailSuratCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DetailSurat.
     * @param {DetailSuratDeleteArgs} args - Arguments to delete one DetailSurat.
     * @example
     * // Delete one DetailSurat
     * const DetailSurat = await prisma.detailSurat.delete({
     *   where: {
     *     // ... filter to delete one DetailSurat
     *   }
     * })
     * 
     */
    delete<T extends DetailSuratDeleteArgs>(args: SelectSubset<T, DetailSuratDeleteArgs<ExtArgs>>): Prisma__DetailSuratClient<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DetailSurat.
     * @param {DetailSuratUpdateArgs} args - Arguments to update one DetailSurat.
     * @example
     * // Update one DetailSurat
     * const detailSurat = await prisma.detailSurat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DetailSuratUpdateArgs>(args: SelectSubset<T, DetailSuratUpdateArgs<ExtArgs>>): Prisma__DetailSuratClient<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DetailSurats.
     * @param {DetailSuratDeleteManyArgs} args - Arguments to filter DetailSurats to delete.
     * @example
     * // Delete a few DetailSurats
     * const { count } = await prisma.detailSurat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DetailSuratDeleteManyArgs>(args?: SelectSubset<T, DetailSuratDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DetailSurats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailSuratUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DetailSurats
     * const detailSurat = await prisma.detailSurat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DetailSuratUpdateManyArgs>(args: SelectSubset<T, DetailSuratUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DetailSurats and returns the data updated in the database.
     * @param {DetailSuratUpdateManyAndReturnArgs} args - Arguments to update many DetailSurats.
     * @example
     * // Update many DetailSurats
     * const detailSurat = await prisma.detailSurat.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DetailSurats and only return the `id`
     * const detailSuratWithIdOnly = await prisma.detailSurat.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DetailSuratUpdateManyAndReturnArgs>(args: SelectSubset<T, DetailSuratUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DetailSurat.
     * @param {DetailSuratUpsertArgs} args - Arguments to update or create a DetailSurat.
     * @example
     * // Update or create a DetailSurat
     * const detailSurat = await prisma.detailSurat.upsert({
     *   create: {
     *     // ... data to create a DetailSurat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DetailSurat we want to update
     *   }
     * })
     */
    upsert<T extends DetailSuratUpsertArgs>(args: SelectSubset<T, DetailSuratUpsertArgs<ExtArgs>>): Prisma__DetailSuratClient<$Result.GetResult<Prisma.$DetailSuratPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DetailSurats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailSuratCountArgs} args - Arguments to filter DetailSurats to count.
     * @example
     * // Count the number of DetailSurats
     * const count = await prisma.detailSurat.count({
     *   where: {
     *     // ... the filter for the DetailSurats we want to count
     *   }
     * })
    **/
    count<T extends DetailSuratCountArgs>(
      args?: Subset<T, DetailSuratCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DetailSuratCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DetailSurat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailSuratAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DetailSuratAggregateArgs>(args: Subset<T, DetailSuratAggregateArgs>): Prisma.PrismaPromise<GetDetailSuratAggregateType<T>>

    /**
     * Group by DetailSurat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DetailSuratGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DetailSuratGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DetailSuratGroupByArgs['orderBy'] }
        : { orderBy?: DetailSuratGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DetailSuratGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDetailSuratGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DetailSurat model
   */
  readonly fields: DetailSuratFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DetailSurat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DetailSuratClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    register<T extends RegisterSuratDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RegisterSuratDefaultArgs<ExtArgs>>): Prisma__RegisterSuratClient<$Result.GetResult<Prisma.$RegisterSuratPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DetailSurat model
   */
  interface DetailSuratFieldRefs {
    readonly id: FieldRef<"DetailSurat", 'Int'>
    readonly registerId: FieldRef<"DetailSurat", 'Int'>
    readonly perihal: FieldRef<"DetailSurat", 'String'>
    readonly noSurat: FieldRef<"DetailSurat", 'String'>
    readonly lampiran: FieldRef<"DetailSurat", 'String'>
    readonly tanggalSurat: FieldRef<"DetailSurat", 'DateTime'>
    readonly tujuan: FieldRef<"DetailSurat", 'String'>
    readonly customFields: FieldRef<"DetailSurat", 'Json'>
    readonly createdAt: FieldRef<"DetailSurat", 'DateTime'>
    readonly updatedAt: FieldRef<"DetailSurat", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DetailSurat findUnique
   */
  export type DetailSuratFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * Filter, which DetailSurat to fetch.
     */
    where: DetailSuratWhereUniqueInput
  }

  /**
   * DetailSurat findUniqueOrThrow
   */
  export type DetailSuratFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * Filter, which DetailSurat to fetch.
     */
    where: DetailSuratWhereUniqueInput
  }

  /**
   * DetailSurat findFirst
   */
  export type DetailSuratFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * Filter, which DetailSurat to fetch.
     */
    where?: DetailSuratWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailSurats to fetch.
     */
    orderBy?: DetailSuratOrderByWithRelationInput | DetailSuratOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DetailSurats.
     */
    cursor?: DetailSuratWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailSurats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailSurats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailSurats.
     */
    distinct?: DetailSuratScalarFieldEnum | DetailSuratScalarFieldEnum[]
  }

  /**
   * DetailSurat findFirstOrThrow
   */
  export type DetailSuratFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * Filter, which DetailSurat to fetch.
     */
    where?: DetailSuratWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailSurats to fetch.
     */
    orderBy?: DetailSuratOrderByWithRelationInput | DetailSuratOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DetailSurats.
     */
    cursor?: DetailSuratWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailSurats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailSurats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailSurats.
     */
    distinct?: DetailSuratScalarFieldEnum | DetailSuratScalarFieldEnum[]
  }

  /**
   * DetailSurat findMany
   */
  export type DetailSuratFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * Filter, which DetailSurats to fetch.
     */
    where?: DetailSuratWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DetailSurats to fetch.
     */
    orderBy?: DetailSuratOrderByWithRelationInput | DetailSuratOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DetailSurats.
     */
    cursor?: DetailSuratWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DetailSurats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DetailSurats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DetailSurats.
     */
    distinct?: DetailSuratScalarFieldEnum | DetailSuratScalarFieldEnum[]
  }

  /**
   * DetailSurat create
   */
  export type DetailSuratCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * The data needed to create a DetailSurat.
     */
    data: XOR<DetailSuratCreateInput, DetailSuratUncheckedCreateInput>
  }

  /**
   * DetailSurat createMany
   */
  export type DetailSuratCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DetailSurats.
     */
    data: DetailSuratCreateManyInput | DetailSuratCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DetailSurat createManyAndReturn
   */
  export type DetailSuratCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * The data used to create many DetailSurats.
     */
    data: DetailSuratCreateManyInput | DetailSuratCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DetailSurat update
   */
  export type DetailSuratUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * The data needed to update a DetailSurat.
     */
    data: XOR<DetailSuratUpdateInput, DetailSuratUncheckedUpdateInput>
    /**
     * Choose, which DetailSurat to update.
     */
    where: DetailSuratWhereUniqueInput
  }

  /**
   * DetailSurat updateMany
   */
  export type DetailSuratUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DetailSurats.
     */
    data: XOR<DetailSuratUpdateManyMutationInput, DetailSuratUncheckedUpdateManyInput>
    /**
     * Filter which DetailSurats to update
     */
    where?: DetailSuratWhereInput
    /**
     * Limit how many DetailSurats to update.
     */
    limit?: number
  }

  /**
   * DetailSurat updateManyAndReturn
   */
  export type DetailSuratUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * The data used to update DetailSurats.
     */
    data: XOR<DetailSuratUpdateManyMutationInput, DetailSuratUncheckedUpdateManyInput>
    /**
     * Filter which DetailSurats to update
     */
    where?: DetailSuratWhereInput
    /**
     * Limit how many DetailSurats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DetailSurat upsert
   */
  export type DetailSuratUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * The filter to search for the DetailSurat to update in case it exists.
     */
    where: DetailSuratWhereUniqueInput
    /**
     * In case the DetailSurat found by the `where` argument doesn't exist, create a new DetailSurat with this data.
     */
    create: XOR<DetailSuratCreateInput, DetailSuratUncheckedCreateInput>
    /**
     * In case the DetailSurat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DetailSuratUpdateInput, DetailSuratUncheckedUpdateInput>
  }

  /**
   * DetailSurat delete
   */
  export type DetailSuratDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
    /**
     * Filter which DetailSurat to delete.
     */
    where: DetailSuratWhereUniqueInput
  }

  /**
   * DetailSurat deleteMany
   */
  export type DetailSuratDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DetailSurats to delete
     */
    where?: DetailSuratWhereInput
    /**
     * Limit how many DetailSurats to delete.
     */
    limit?: number
  }

  /**
   * DetailSurat without action
   */
  export type DetailSuratDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DetailSurat
     */
    select?: DetailSuratSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DetailSurat
     */
    omit?: DetailSuratOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DetailSuratInclude<ExtArgs> | null
  }


  /**
   * Model NomorCounter
   */

  export type AggregateNomorCounter = {
    _count: NomorCounterCountAggregateOutputType | null
    _avg: NomorCounterAvgAggregateOutputType | null
    _sum: NomorCounterSumAggregateOutputType | null
    _min: NomorCounterMinAggregateOutputType | null
    _max: NomorCounterMaxAggregateOutputType | null
  }

  export type NomorCounterAvgAggregateOutputType = {
    year: number | null
    counter: number | null
  }

  export type NomorCounterSumAggregateOutputType = {
    year: number | null
    counter: number | null
  }

  export type NomorCounterMinAggregateOutputType = {
    deptId: string | null
    year: number | null
    counter: number | null
  }

  export type NomorCounterMaxAggregateOutputType = {
    deptId: string | null
    year: number | null
    counter: number | null
  }

  export type NomorCounterCountAggregateOutputType = {
    deptId: number
    year: number
    counter: number
    _all: number
  }


  export type NomorCounterAvgAggregateInputType = {
    year?: true
    counter?: true
  }

  export type NomorCounterSumAggregateInputType = {
    year?: true
    counter?: true
  }

  export type NomorCounterMinAggregateInputType = {
    deptId?: true
    year?: true
    counter?: true
  }

  export type NomorCounterMaxAggregateInputType = {
    deptId?: true
    year?: true
    counter?: true
  }

  export type NomorCounterCountAggregateInputType = {
    deptId?: true
    year?: true
    counter?: true
    _all?: true
  }

  export type NomorCounterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NomorCounter to aggregate.
     */
    where?: NomorCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NomorCounters to fetch.
     */
    orderBy?: NomorCounterOrderByWithRelationInput | NomorCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NomorCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NomorCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NomorCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NomorCounters
    **/
    _count?: true | NomorCounterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NomorCounterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NomorCounterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NomorCounterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NomorCounterMaxAggregateInputType
  }

  export type GetNomorCounterAggregateType<T extends NomorCounterAggregateArgs> = {
        [P in keyof T & keyof AggregateNomorCounter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNomorCounter[P]>
      : GetScalarType<T[P], AggregateNomorCounter[P]>
  }




  export type NomorCounterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NomorCounterWhereInput
    orderBy?: NomorCounterOrderByWithAggregationInput | NomorCounterOrderByWithAggregationInput[]
    by: NomorCounterScalarFieldEnum[] | NomorCounterScalarFieldEnum
    having?: NomorCounterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NomorCounterCountAggregateInputType | true
    _avg?: NomorCounterAvgAggregateInputType
    _sum?: NomorCounterSumAggregateInputType
    _min?: NomorCounterMinAggregateInputType
    _max?: NomorCounterMaxAggregateInputType
  }

  export type NomorCounterGroupByOutputType = {
    deptId: string
    year: number
    counter: number
    _count: NomorCounterCountAggregateOutputType | null
    _avg: NomorCounterAvgAggregateOutputType | null
    _sum: NomorCounterSumAggregateOutputType | null
    _min: NomorCounterMinAggregateOutputType | null
    _max: NomorCounterMaxAggregateOutputType | null
  }

  type GetNomorCounterGroupByPayload<T extends NomorCounterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NomorCounterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NomorCounterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NomorCounterGroupByOutputType[P]>
            : GetScalarType<T[P], NomorCounterGroupByOutputType[P]>
        }
      >
    >


  export type NomorCounterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    deptId?: boolean
    year?: boolean
    counter?: boolean
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nomorCounter"]>

  export type NomorCounterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    deptId?: boolean
    year?: boolean
    counter?: boolean
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nomorCounter"]>

  export type NomorCounterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    deptId?: boolean
    year?: boolean
    counter?: boolean
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nomorCounter"]>

  export type NomorCounterSelectScalar = {
    deptId?: boolean
    year?: boolean
    counter?: boolean
  }

  export type NomorCounterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"deptId" | "year" | "counter", ExtArgs["result"]["nomorCounter"]>
  export type NomorCounterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }
  export type NomorCounterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }
  export type NomorCounterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dept?: boolean | DepartmentDefaultArgs<ExtArgs>
  }

  export type $NomorCounterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NomorCounter"
    objects: {
      dept: Prisma.$DepartmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      deptId: string
      year: number
      counter: number
    }, ExtArgs["result"]["nomorCounter"]>
    composites: {}
  }

  type NomorCounterGetPayload<S extends boolean | null | undefined | NomorCounterDefaultArgs> = $Result.GetResult<Prisma.$NomorCounterPayload, S>

  type NomorCounterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NomorCounterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NomorCounterCountAggregateInputType | true
    }

  export interface NomorCounterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NomorCounter'], meta: { name: 'NomorCounter' } }
    /**
     * Find zero or one NomorCounter that matches the filter.
     * @param {NomorCounterFindUniqueArgs} args - Arguments to find a NomorCounter
     * @example
     * // Get one NomorCounter
     * const nomorCounter = await prisma.nomorCounter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NomorCounterFindUniqueArgs>(args: SelectSubset<T, NomorCounterFindUniqueArgs<ExtArgs>>): Prisma__NomorCounterClient<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NomorCounter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NomorCounterFindUniqueOrThrowArgs} args - Arguments to find a NomorCounter
     * @example
     * // Get one NomorCounter
     * const nomorCounter = await prisma.nomorCounter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NomorCounterFindUniqueOrThrowArgs>(args: SelectSubset<T, NomorCounterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NomorCounterClient<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NomorCounter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NomorCounterFindFirstArgs} args - Arguments to find a NomorCounter
     * @example
     * // Get one NomorCounter
     * const nomorCounter = await prisma.nomorCounter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NomorCounterFindFirstArgs>(args?: SelectSubset<T, NomorCounterFindFirstArgs<ExtArgs>>): Prisma__NomorCounterClient<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NomorCounter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NomorCounterFindFirstOrThrowArgs} args - Arguments to find a NomorCounter
     * @example
     * // Get one NomorCounter
     * const nomorCounter = await prisma.nomorCounter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NomorCounterFindFirstOrThrowArgs>(args?: SelectSubset<T, NomorCounterFindFirstOrThrowArgs<ExtArgs>>): Prisma__NomorCounterClient<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NomorCounters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NomorCounterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NomorCounters
     * const nomorCounters = await prisma.nomorCounter.findMany()
     * 
     * // Get first 10 NomorCounters
     * const nomorCounters = await prisma.nomorCounter.findMany({ take: 10 })
     * 
     * // Only select the `deptId`
     * const nomorCounterWithDeptIdOnly = await prisma.nomorCounter.findMany({ select: { deptId: true } })
     * 
     */
    findMany<T extends NomorCounterFindManyArgs>(args?: SelectSubset<T, NomorCounterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NomorCounter.
     * @param {NomorCounterCreateArgs} args - Arguments to create a NomorCounter.
     * @example
     * // Create one NomorCounter
     * const NomorCounter = await prisma.nomorCounter.create({
     *   data: {
     *     // ... data to create a NomorCounter
     *   }
     * })
     * 
     */
    create<T extends NomorCounterCreateArgs>(args: SelectSubset<T, NomorCounterCreateArgs<ExtArgs>>): Prisma__NomorCounterClient<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NomorCounters.
     * @param {NomorCounterCreateManyArgs} args - Arguments to create many NomorCounters.
     * @example
     * // Create many NomorCounters
     * const nomorCounter = await prisma.nomorCounter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NomorCounterCreateManyArgs>(args?: SelectSubset<T, NomorCounterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NomorCounters and returns the data saved in the database.
     * @param {NomorCounterCreateManyAndReturnArgs} args - Arguments to create many NomorCounters.
     * @example
     * // Create many NomorCounters
     * const nomorCounter = await prisma.nomorCounter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NomorCounters and only return the `deptId`
     * const nomorCounterWithDeptIdOnly = await prisma.nomorCounter.createManyAndReturn({
     *   select: { deptId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NomorCounterCreateManyAndReturnArgs>(args?: SelectSubset<T, NomorCounterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NomorCounter.
     * @param {NomorCounterDeleteArgs} args - Arguments to delete one NomorCounter.
     * @example
     * // Delete one NomorCounter
     * const NomorCounter = await prisma.nomorCounter.delete({
     *   where: {
     *     // ... filter to delete one NomorCounter
     *   }
     * })
     * 
     */
    delete<T extends NomorCounterDeleteArgs>(args: SelectSubset<T, NomorCounterDeleteArgs<ExtArgs>>): Prisma__NomorCounterClient<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NomorCounter.
     * @param {NomorCounterUpdateArgs} args - Arguments to update one NomorCounter.
     * @example
     * // Update one NomorCounter
     * const nomorCounter = await prisma.nomorCounter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NomorCounterUpdateArgs>(args: SelectSubset<T, NomorCounterUpdateArgs<ExtArgs>>): Prisma__NomorCounterClient<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NomorCounters.
     * @param {NomorCounterDeleteManyArgs} args - Arguments to filter NomorCounters to delete.
     * @example
     * // Delete a few NomorCounters
     * const { count } = await prisma.nomorCounter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NomorCounterDeleteManyArgs>(args?: SelectSubset<T, NomorCounterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NomorCounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NomorCounterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NomorCounters
     * const nomorCounter = await prisma.nomorCounter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NomorCounterUpdateManyArgs>(args: SelectSubset<T, NomorCounterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NomorCounters and returns the data updated in the database.
     * @param {NomorCounterUpdateManyAndReturnArgs} args - Arguments to update many NomorCounters.
     * @example
     * // Update many NomorCounters
     * const nomorCounter = await prisma.nomorCounter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NomorCounters and only return the `deptId`
     * const nomorCounterWithDeptIdOnly = await prisma.nomorCounter.updateManyAndReturn({
     *   select: { deptId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NomorCounterUpdateManyAndReturnArgs>(args: SelectSubset<T, NomorCounterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NomorCounter.
     * @param {NomorCounterUpsertArgs} args - Arguments to update or create a NomorCounter.
     * @example
     * // Update or create a NomorCounter
     * const nomorCounter = await prisma.nomorCounter.upsert({
     *   create: {
     *     // ... data to create a NomorCounter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NomorCounter we want to update
     *   }
     * })
     */
    upsert<T extends NomorCounterUpsertArgs>(args: SelectSubset<T, NomorCounterUpsertArgs<ExtArgs>>): Prisma__NomorCounterClient<$Result.GetResult<Prisma.$NomorCounterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NomorCounters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NomorCounterCountArgs} args - Arguments to filter NomorCounters to count.
     * @example
     * // Count the number of NomorCounters
     * const count = await prisma.nomorCounter.count({
     *   where: {
     *     // ... the filter for the NomorCounters we want to count
     *   }
     * })
    **/
    count<T extends NomorCounterCountArgs>(
      args?: Subset<T, NomorCounterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NomorCounterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NomorCounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NomorCounterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NomorCounterAggregateArgs>(args: Subset<T, NomorCounterAggregateArgs>): Prisma.PrismaPromise<GetNomorCounterAggregateType<T>>

    /**
     * Group by NomorCounter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NomorCounterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NomorCounterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NomorCounterGroupByArgs['orderBy'] }
        : { orderBy?: NomorCounterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NomorCounterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNomorCounterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NomorCounter model
   */
  readonly fields: NomorCounterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NomorCounter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NomorCounterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dept<T extends DepartmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DepartmentDefaultArgs<ExtArgs>>): Prisma__DepartmentClient<$Result.GetResult<Prisma.$DepartmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NomorCounter model
   */
  interface NomorCounterFieldRefs {
    readonly deptId: FieldRef<"NomorCounter", 'String'>
    readonly year: FieldRef<"NomorCounter", 'Int'>
    readonly counter: FieldRef<"NomorCounter", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * NomorCounter findUnique
   */
  export type NomorCounterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * Filter, which NomorCounter to fetch.
     */
    where: NomorCounterWhereUniqueInput
  }

  /**
   * NomorCounter findUniqueOrThrow
   */
  export type NomorCounterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * Filter, which NomorCounter to fetch.
     */
    where: NomorCounterWhereUniqueInput
  }

  /**
   * NomorCounter findFirst
   */
  export type NomorCounterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * Filter, which NomorCounter to fetch.
     */
    where?: NomorCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NomorCounters to fetch.
     */
    orderBy?: NomorCounterOrderByWithRelationInput | NomorCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NomorCounters.
     */
    cursor?: NomorCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NomorCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NomorCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NomorCounters.
     */
    distinct?: NomorCounterScalarFieldEnum | NomorCounterScalarFieldEnum[]
  }

  /**
   * NomorCounter findFirstOrThrow
   */
  export type NomorCounterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * Filter, which NomorCounter to fetch.
     */
    where?: NomorCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NomorCounters to fetch.
     */
    orderBy?: NomorCounterOrderByWithRelationInput | NomorCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NomorCounters.
     */
    cursor?: NomorCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NomorCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NomorCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NomorCounters.
     */
    distinct?: NomorCounterScalarFieldEnum | NomorCounterScalarFieldEnum[]
  }

  /**
   * NomorCounter findMany
   */
  export type NomorCounterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * Filter, which NomorCounters to fetch.
     */
    where?: NomorCounterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NomorCounters to fetch.
     */
    orderBy?: NomorCounterOrderByWithRelationInput | NomorCounterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NomorCounters.
     */
    cursor?: NomorCounterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NomorCounters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NomorCounters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NomorCounters.
     */
    distinct?: NomorCounterScalarFieldEnum | NomorCounterScalarFieldEnum[]
  }

  /**
   * NomorCounter create
   */
  export type NomorCounterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * The data needed to create a NomorCounter.
     */
    data: XOR<NomorCounterCreateInput, NomorCounterUncheckedCreateInput>
  }

  /**
   * NomorCounter createMany
   */
  export type NomorCounterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NomorCounters.
     */
    data: NomorCounterCreateManyInput | NomorCounterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NomorCounter createManyAndReturn
   */
  export type NomorCounterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * The data used to create many NomorCounters.
     */
    data: NomorCounterCreateManyInput | NomorCounterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NomorCounter update
   */
  export type NomorCounterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * The data needed to update a NomorCounter.
     */
    data: XOR<NomorCounterUpdateInput, NomorCounterUncheckedUpdateInput>
    /**
     * Choose, which NomorCounter to update.
     */
    where: NomorCounterWhereUniqueInput
  }

  /**
   * NomorCounter updateMany
   */
  export type NomorCounterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NomorCounters.
     */
    data: XOR<NomorCounterUpdateManyMutationInput, NomorCounterUncheckedUpdateManyInput>
    /**
     * Filter which NomorCounters to update
     */
    where?: NomorCounterWhereInput
    /**
     * Limit how many NomorCounters to update.
     */
    limit?: number
  }

  /**
   * NomorCounter updateManyAndReturn
   */
  export type NomorCounterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * The data used to update NomorCounters.
     */
    data: XOR<NomorCounterUpdateManyMutationInput, NomorCounterUncheckedUpdateManyInput>
    /**
     * Filter which NomorCounters to update
     */
    where?: NomorCounterWhereInput
    /**
     * Limit how many NomorCounters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NomorCounter upsert
   */
  export type NomorCounterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * The filter to search for the NomorCounter to update in case it exists.
     */
    where: NomorCounterWhereUniqueInput
    /**
     * In case the NomorCounter found by the `where` argument doesn't exist, create a new NomorCounter with this data.
     */
    create: XOR<NomorCounterCreateInput, NomorCounterUncheckedCreateInput>
    /**
     * In case the NomorCounter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NomorCounterUpdateInput, NomorCounterUncheckedUpdateInput>
  }

  /**
   * NomorCounter delete
   */
  export type NomorCounterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
    /**
     * Filter which NomorCounter to delete.
     */
    where: NomorCounterWhereUniqueInput
  }

  /**
   * NomorCounter deleteMany
   */
  export type NomorCounterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NomorCounters to delete
     */
    where?: NomorCounterWhereInput
    /**
     * Limit how many NomorCounters to delete.
     */
    limit?: number
  }

  /**
   * NomorCounter without action
   */
  export type NomorCounterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NomorCounter
     */
    select?: NomorCounterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NomorCounter
     */
    omit?: NomorCounterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NomorCounterInclude<ExtArgs> | null
  }


  /**
   * Model TrackSheet
   */

  export type AggregateTrackSheet = {
    _count: TrackSheetCountAggregateOutputType | null
    _avg: TrackSheetAvgAggregateOutputType | null
    _sum: TrackSheetSumAggregateOutputType | null
    _min: TrackSheetMinAggregateOutputType | null
    _max: TrackSheetMaxAggregateOutputType | null
  }

  export type TrackSheetAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type TrackSheetSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type TrackSheetMinAggregateOutputType = {
    id: string | null
    name: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
    hiddenAt: Date | null
  }

  export type TrackSheetMaxAggregateOutputType = {
    id: string | null
    name: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
    hiddenAt: Date | null
  }

  export type TrackSheetCountAggregateOutputType = {
    id: number
    name: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    hiddenAt: number
    _all: number
  }


  export type TrackSheetAvgAggregateInputType = {
    sortOrder?: true
  }

  export type TrackSheetSumAggregateInputType = {
    sortOrder?: true
  }

  export type TrackSheetMinAggregateInputType = {
    id?: true
    name?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    hiddenAt?: true
  }

  export type TrackSheetMaxAggregateInputType = {
    id?: true
    name?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    hiddenAt?: true
  }

  export type TrackSheetCountAggregateInputType = {
    id?: true
    name?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    hiddenAt?: true
    _all?: true
  }

  export type TrackSheetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackSheet to aggregate.
     */
    where?: TrackSheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackSheets to fetch.
     */
    orderBy?: TrackSheetOrderByWithRelationInput | TrackSheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrackSheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackSheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackSheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrackSheets
    **/
    _count?: true | TrackSheetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrackSheetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrackSheetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrackSheetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrackSheetMaxAggregateInputType
  }

  export type GetTrackSheetAggregateType<T extends TrackSheetAggregateArgs> = {
        [P in keyof T & keyof AggregateTrackSheet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrackSheet[P]>
      : GetScalarType<T[P], AggregateTrackSheet[P]>
  }




  export type TrackSheetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackSheetWhereInput
    orderBy?: TrackSheetOrderByWithAggregationInput | TrackSheetOrderByWithAggregationInput[]
    by: TrackSheetScalarFieldEnum[] | TrackSheetScalarFieldEnum
    having?: TrackSheetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrackSheetCountAggregateInputType | true
    _avg?: TrackSheetAvgAggregateInputType
    _sum?: TrackSheetSumAggregateInputType
    _min?: TrackSheetMinAggregateInputType
    _max?: TrackSheetMaxAggregateInputType
  }

  export type TrackSheetGroupByOutputType = {
    id: string
    name: string
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    hiddenAt: Date | null
    _count: TrackSheetCountAggregateOutputType | null
    _avg: TrackSheetAvgAggregateOutputType | null
    _sum: TrackSheetSumAggregateOutputType | null
    _min: TrackSheetMinAggregateOutputType | null
    _max: TrackSheetMaxAggregateOutputType | null
  }

  type GetTrackSheetGroupByPayload<T extends TrackSheetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrackSheetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrackSheetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrackSheetGroupByOutputType[P]>
            : GetScalarType<T[P], TrackSheetGroupByOutputType[P]>
        }
      >
    >


  export type TrackSheetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hiddenAt?: boolean
    categories?: boolean | TrackSheet$categoriesArgs<ExtArgs>
    fields?: boolean | TrackSheet$fieldsArgs<ExtArgs>
    records?: boolean | TrackSheet$recordsArgs<ExtArgs>
    _count?: boolean | TrackSheetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackSheet"]>

  export type TrackSheetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hiddenAt?: boolean
  }, ExtArgs["result"]["trackSheet"]>

  export type TrackSheetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hiddenAt?: boolean
  }, ExtArgs["result"]["trackSheet"]>

  export type TrackSheetSelectScalar = {
    id?: boolean
    name?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hiddenAt?: boolean
  }

  export type TrackSheetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "sortOrder" | "createdAt" | "updatedAt" | "hiddenAt", ExtArgs["result"]["trackSheet"]>
  export type TrackSheetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categories?: boolean | TrackSheet$categoriesArgs<ExtArgs>
    fields?: boolean | TrackSheet$fieldsArgs<ExtArgs>
    records?: boolean | TrackSheet$recordsArgs<ExtArgs>
    _count?: boolean | TrackSheetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TrackSheetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TrackSheetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TrackSheetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrackSheet"
    objects: {
      categories: Prisma.$TrackCategoryPayload<ExtArgs>[]
      fields: Prisma.$TrackFieldPayload<ExtArgs>[]
      records: Prisma.$TrackRecordPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      sortOrder: number
      createdAt: Date
      updatedAt: Date
      hiddenAt: Date | null
    }, ExtArgs["result"]["trackSheet"]>
    composites: {}
  }

  type TrackSheetGetPayload<S extends boolean | null | undefined | TrackSheetDefaultArgs> = $Result.GetResult<Prisma.$TrackSheetPayload, S>

  type TrackSheetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrackSheetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrackSheetCountAggregateInputType | true
    }

  export interface TrackSheetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrackSheet'], meta: { name: 'TrackSheet' } }
    /**
     * Find zero or one TrackSheet that matches the filter.
     * @param {TrackSheetFindUniqueArgs} args - Arguments to find a TrackSheet
     * @example
     * // Get one TrackSheet
     * const trackSheet = await prisma.trackSheet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrackSheetFindUniqueArgs>(args: SelectSubset<T, TrackSheetFindUniqueArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrackSheet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrackSheetFindUniqueOrThrowArgs} args - Arguments to find a TrackSheet
     * @example
     * // Get one TrackSheet
     * const trackSheet = await prisma.trackSheet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrackSheetFindUniqueOrThrowArgs>(args: SelectSubset<T, TrackSheetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackSheet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackSheetFindFirstArgs} args - Arguments to find a TrackSheet
     * @example
     * // Get one TrackSheet
     * const trackSheet = await prisma.trackSheet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrackSheetFindFirstArgs>(args?: SelectSubset<T, TrackSheetFindFirstArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackSheet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackSheetFindFirstOrThrowArgs} args - Arguments to find a TrackSheet
     * @example
     * // Get one TrackSheet
     * const trackSheet = await prisma.trackSheet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrackSheetFindFirstOrThrowArgs>(args?: SelectSubset<T, TrackSheetFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrackSheets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackSheetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrackSheets
     * const trackSheets = await prisma.trackSheet.findMany()
     * 
     * // Get first 10 TrackSheets
     * const trackSheets = await prisma.trackSheet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trackSheetWithIdOnly = await prisma.trackSheet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrackSheetFindManyArgs>(args?: SelectSubset<T, TrackSheetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrackSheet.
     * @param {TrackSheetCreateArgs} args - Arguments to create a TrackSheet.
     * @example
     * // Create one TrackSheet
     * const TrackSheet = await prisma.trackSheet.create({
     *   data: {
     *     // ... data to create a TrackSheet
     *   }
     * })
     * 
     */
    create<T extends TrackSheetCreateArgs>(args: SelectSubset<T, TrackSheetCreateArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrackSheets.
     * @param {TrackSheetCreateManyArgs} args - Arguments to create many TrackSheets.
     * @example
     * // Create many TrackSheets
     * const trackSheet = await prisma.trackSheet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrackSheetCreateManyArgs>(args?: SelectSubset<T, TrackSheetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrackSheets and returns the data saved in the database.
     * @param {TrackSheetCreateManyAndReturnArgs} args - Arguments to create many TrackSheets.
     * @example
     * // Create many TrackSheets
     * const trackSheet = await prisma.trackSheet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrackSheets and only return the `id`
     * const trackSheetWithIdOnly = await prisma.trackSheet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrackSheetCreateManyAndReturnArgs>(args?: SelectSubset<T, TrackSheetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrackSheet.
     * @param {TrackSheetDeleteArgs} args - Arguments to delete one TrackSheet.
     * @example
     * // Delete one TrackSheet
     * const TrackSheet = await prisma.trackSheet.delete({
     *   where: {
     *     // ... filter to delete one TrackSheet
     *   }
     * })
     * 
     */
    delete<T extends TrackSheetDeleteArgs>(args: SelectSubset<T, TrackSheetDeleteArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrackSheet.
     * @param {TrackSheetUpdateArgs} args - Arguments to update one TrackSheet.
     * @example
     * // Update one TrackSheet
     * const trackSheet = await prisma.trackSheet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrackSheetUpdateArgs>(args: SelectSubset<T, TrackSheetUpdateArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrackSheets.
     * @param {TrackSheetDeleteManyArgs} args - Arguments to filter TrackSheets to delete.
     * @example
     * // Delete a few TrackSheets
     * const { count } = await prisma.trackSheet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrackSheetDeleteManyArgs>(args?: SelectSubset<T, TrackSheetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackSheets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackSheetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrackSheets
     * const trackSheet = await prisma.trackSheet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrackSheetUpdateManyArgs>(args: SelectSubset<T, TrackSheetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackSheets and returns the data updated in the database.
     * @param {TrackSheetUpdateManyAndReturnArgs} args - Arguments to update many TrackSheets.
     * @example
     * // Update many TrackSheets
     * const trackSheet = await prisma.trackSheet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrackSheets and only return the `id`
     * const trackSheetWithIdOnly = await prisma.trackSheet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrackSheetUpdateManyAndReturnArgs>(args: SelectSubset<T, TrackSheetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrackSheet.
     * @param {TrackSheetUpsertArgs} args - Arguments to update or create a TrackSheet.
     * @example
     * // Update or create a TrackSheet
     * const trackSheet = await prisma.trackSheet.upsert({
     *   create: {
     *     // ... data to create a TrackSheet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrackSheet we want to update
     *   }
     * })
     */
    upsert<T extends TrackSheetUpsertArgs>(args: SelectSubset<T, TrackSheetUpsertArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrackSheets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackSheetCountArgs} args - Arguments to filter TrackSheets to count.
     * @example
     * // Count the number of TrackSheets
     * const count = await prisma.trackSheet.count({
     *   where: {
     *     // ... the filter for the TrackSheets we want to count
     *   }
     * })
    **/
    count<T extends TrackSheetCountArgs>(
      args?: Subset<T, TrackSheetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrackSheetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrackSheet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackSheetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrackSheetAggregateArgs>(args: Subset<T, TrackSheetAggregateArgs>): Prisma.PrismaPromise<GetTrackSheetAggregateType<T>>

    /**
     * Group by TrackSheet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackSheetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrackSheetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrackSheetGroupByArgs['orderBy'] }
        : { orderBy?: TrackSheetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrackSheetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrackSheetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrackSheet model
   */
  readonly fields: TrackSheetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrackSheet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrackSheetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    categories<T extends TrackSheet$categoriesArgs<ExtArgs> = {}>(args?: Subset<T, TrackSheet$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    fields<T extends TrackSheet$fieldsArgs<ExtArgs> = {}>(args?: Subset<T, TrackSheet$fieldsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    records<T extends TrackSheet$recordsArgs<ExtArgs> = {}>(args?: Subset<T, TrackSheet$recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrackSheet model
   */
  interface TrackSheetFieldRefs {
    readonly id: FieldRef<"TrackSheet", 'String'>
    readonly name: FieldRef<"TrackSheet", 'String'>
    readonly sortOrder: FieldRef<"TrackSheet", 'Int'>
    readonly createdAt: FieldRef<"TrackSheet", 'DateTime'>
    readonly updatedAt: FieldRef<"TrackSheet", 'DateTime'>
    readonly hiddenAt: FieldRef<"TrackSheet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrackSheet findUnique
   */
  export type TrackSheetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * Filter, which TrackSheet to fetch.
     */
    where: TrackSheetWhereUniqueInput
  }

  /**
   * TrackSheet findUniqueOrThrow
   */
  export type TrackSheetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * Filter, which TrackSheet to fetch.
     */
    where: TrackSheetWhereUniqueInput
  }

  /**
   * TrackSheet findFirst
   */
  export type TrackSheetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * Filter, which TrackSheet to fetch.
     */
    where?: TrackSheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackSheets to fetch.
     */
    orderBy?: TrackSheetOrderByWithRelationInput | TrackSheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackSheets.
     */
    cursor?: TrackSheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackSheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackSheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackSheets.
     */
    distinct?: TrackSheetScalarFieldEnum | TrackSheetScalarFieldEnum[]
  }

  /**
   * TrackSheet findFirstOrThrow
   */
  export type TrackSheetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * Filter, which TrackSheet to fetch.
     */
    where?: TrackSheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackSheets to fetch.
     */
    orderBy?: TrackSheetOrderByWithRelationInput | TrackSheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackSheets.
     */
    cursor?: TrackSheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackSheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackSheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackSheets.
     */
    distinct?: TrackSheetScalarFieldEnum | TrackSheetScalarFieldEnum[]
  }

  /**
   * TrackSheet findMany
   */
  export type TrackSheetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * Filter, which TrackSheets to fetch.
     */
    where?: TrackSheetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackSheets to fetch.
     */
    orderBy?: TrackSheetOrderByWithRelationInput | TrackSheetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrackSheets.
     */
    cursor?: TrackSheetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackSheets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackSheets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackSheets.
     */
    distinct?: TrackSheetScalarFieldEnum | TrackSheetScalarFieldEnum[]
  }

  /**
   * TrackSheet create
   */
  export type TrackSheetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * The data needed to create a TrackSheet.
     */
    data: XOR<TrackSheetCreateInput, TrackSheetUncheckedCreateInput>
  }

  /**
   * TrackSheet createMany
   */
  export type TrackSheetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrackSheets.
     */
    data: TrackSheetCreateManyInput | TrackSheetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrackSheet createManyAndReturn
   */
  export type TrackSheetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * The data used to create many TrackSheets.
     */
    data: TrackSheetCreateManyInput | TrackSheetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrackSheet update
   */
  export type TrackSheetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * The data needed to update a TrackSheet.
     */
    data: XOR<TrackSheetUpdateInput, TrackSheetUncheckedUpdateInput>
    /**
     * Choose, which TrackSheet to update.
     */
    where: TrackSheetWhereUniqueInput
  }

  /**
   * TrackSheet updateMany
   */
  export type TrackSheetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrackSheets.
     */
    data: XOR<TrackSheetUpdateManyMutationInput, TrackSheetUncheckedUpdateManyInput>
    /**
     * Filter which TrackSheets to update
     */
    where?: TrackSheetWhereInput
    /**
     * Limit how many TrackSheets to update.
     */
    limit?: number
  }

  /**
   * TrackSheet updateManyAndReturn
   */
  export type TrackSheetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * The data used to update TrackSheets.
     */
    data: XOR<TrackSheetUpdateManyMutationInput, TrackSheetUncheckedUpdateManyInput>
    /**
     * Filter which TrackSheets to update
     */
    where?: TrackSheetWhereInput
    /**
     * Limit how many TrackSheets to update.
     */
    limit?: number
  }

  /**
   * TrackSheet upsert
   */
  export type TrackSheetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * The filter to search for the TrackSheet to update in case it exists.
     */
    where: TrackSheetWhereUniqueInput
    /**
     * In case the TrackSheet found by the `where` argument doesn't exist, create a new TrackSheet with this data.
     */
    create: XOR<TrackSheetCreateInput, TrackSheetUncheckedCreateInput>
    /**
     * In case the TrackSheet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrackSheetUpdateInput, TrackSheetUncheckedUpdateInput>
  }

  /**
   * TrackSheet delete
   */
  export type TrackSheetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
    /**
     * Filter which TrackSheet to delete.
     */
    where: TrackSheetWhereUniqueInput
  }

  /**
   * TrackSheet deleteMany
   */
  export type TrackSheetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackSheets to delete
     */
    where?: TrackSheetWhereInput
    /**
     * Limit how many TrackSheets to delete.
     */
    limit?: number
  }

  /**
   * TrackSheet.categories
   */
  export type TrackSheet$categoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    where?: TrackCategoryWhereInput
    orderBy?: TrackCategoryOrderByWithRelationInput | TrackCategoryOrderByWithRelationInput[]
    cursor?: TrackCategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrackCategoryScalarFieldEnum | TrackCategoryScalarFieldEnum[]
  }

  /**
   * TrackSheet.fields
   */
  export type TrackSheet$fieldsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    where?: TrackFieldWhereInput
    orderBy?: TrackFieldOrderByWithRelationInput | TrackFieldOrderByWithRelationInput[]
    cursor?: TrackFieldWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrackFieldScalarFieldEnum | TrackFieldScalarFieldEnum[]
  }

  /**
   * TrackSheet.records
   */
  export type TrackSheet$recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    where?: TrackRecordWhereInput
    orderBy?: TrackRecordOrderByWithRelationInput | TrackRecordOrderByWithRelationInput[]
    cursor?: TrackRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrackRecordScalarFieldEnum | TrackRecordScalarFieldEnum[]
  }

  /**
   * TrackSheet without action
   */
  export type TrackSheetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackSheet
     */
    select?: TrackSheetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackSheet
     */
    omit?: TrackSheetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackSheetInclude<ExtArgs> | null
  }


  /**
   * Model TrackCategory
   */

  export type AggregateTrackCategory = {
    _count: TrackCategoryCountAggregateOutputType | null
    _avg: TrackCategoryAvgAggregateOutputType | null
    _sum: TrackCategorySumAggregateOutputType | null
    _min: TrackCategoryMinAggregateOutputType | null
    _max: TrackCategoryMaxAggregateOutputType | null
  }

  export type TrackCategoryAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type TrackCategorySumAggregateOutputType = {
    sortOrder: number | null
  }

  export type TrackCategoryMinAggregateOutputType = {
    id: string | null
    sheetId: string | null
    name: string | null
    color: string | null
    fillRequired: boolean | null
    addRoleValues: string | null
    editRoleValues: string | null
    deleteRoleValues: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrackCategoryMaxAggregateOutputType = {
    id: string | null
    sheetId: string | null
    name: string | null
    color: string | null
    fillRequired: boolean | null
    addRoleValues: string | null
    editRoleValues: string | null
    deleteRoleValues: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrackCategoryCountAggregateOutputType = {
    id: number
    sheetId: number
    name: number
    color: number
    fillRequired: number
    addRoleValues: number
    editRoleValues: number
    deleteRoleValues: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrackCategoryAvgAggregateInputType = {
    sortOrder?: true
  }

  export type TrackCategorySumAggregateInputType = {
    sortOrder?: true
  }

  export type TrackCategoryMinAggregateInputType = {
    id?: true
    sheetId?: true
    name?: true
    color?: true
    fillRequired?: true
    addRoleValues?: true
    editRoleValues?: true
    deleteRoleValues?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrackCategoryMaxAggregateInputType = {
    id?: true
    sheetId?: true
    name?: true
    color?: true
    fillRequired?: true
    addRoleValues?: true
    editRoleValues?: true
    deleteRoleValues?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrackCategoryCountAggregateInputType = {
    id?: true
    sheetId?: true
    name?: true
    color?: true
    fillRequired?: true
    addRoleValues?: true
    editRoleValues?: true
    deleteRoleValues?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrackCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackCategory to aggregate.
     */
    where?: TrackCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackCategories to fetch.
     */
    orderBy?: TrackCategoryOrderByWithRelationInput | TrackCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrackCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrackCategories
    **/
    _count?: true | TrackCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrackCategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrackCategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrackCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrackCategoryMaxAggregateInputType
  }

  export type GetTrackCategoryAggregateType<T extends TrackCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateTrackCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrackCategory[P]>
      : GetScalarType<T[P], AggregateTrackCategory[P]>
  }




  export type TrackCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackCategoryWhereInput
    orderBy?: TrackCategoryOrderByWithAggregationInput | TrackCategoryOrderByWithAggregationInput[]
    by: TrackCategoryScalarFieldEnum[] | TrackCategoryScalarFieldEnum
    having?: TrackCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrackCategoryCountAggregateInputType | true
    _avg?: TrackCategoryAvgAggregateInputType
    _sum?: TrackCategorySumAggregateInputType
    _min?: TrackCategoryMinAggregateInputType
    _max?: TrackCategoryMaxAggregateInputType
  }

  export type TrackCategoryGroupByOutputType = {
    id: string
    sheetId: string
    name: string
    color: string
    fillRequired: boolean
    addRoleValues: string
    editRoleValues: string
    deleteRoleValues: string
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: TrackCategoryCountAggregateOutputType | null
    _avg: TrackCategoryAvgAggregateOutputType | null
    _sum: TrackCategorySumAggregateOutputType | null
    _min: TrackCategoryMinAggregateOutputType | null
    _max: TrackCategoryMaxAggregateOutputType | null
  }

  type GetTrackCategoryGroupByPayload<T extends TrackCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrackCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrackCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrackCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], TrackCategoryGroupByOutputType[P]>
        }
      >
    >


  export type TrackCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    name?: boolean
    color?: boolean
    fillRequired?: boolean
    addRoleValues?: boolean
    editRoleValues?: boolean
    deleteRoleValues?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackCategory"]>

  export type TrackCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    name?: boolean
    color?: boolean
    fillRequired?: boolean
    addRoleValues?: boolean
    editRoleValues?: boolean
    deleteRoleValues?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackCategory"]>

  export type TrackCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    name?: boolean
    color?: boolean
    fillRequired?: boolean
    addRoleValues?: boolean
    editRoleValues?: boolean
    deleteRoleValues?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackCategory"]>

  export type TrackCategorySelectScalar = {
    id?: boolean
    sheetId?: boolean
    name?: boolean
    color?: boolean
    fillRequired?: boolean
    addRoleValues?: boolean
    editRoleValues?: boolean
    deleteRoleValues?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrackCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sheetId" | "name" | "color" | "fillRequired" | "addRoleValues" | "editRoleValues" | "deleteRoleValues" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["trackCategory"]>
  export type TrackCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }
  export type TrackCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }
  export type TrackCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }

  export type $TrackCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrackCategory"
    objects: {
      sheet: Prisma.$TrackSheetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sheetId: string
      name: string
      color: string
      fillRequired: boolean
      addRoleValues: string
      editRoleValues: string
      deleteRoleValues: string
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trackCategory"]>
    composites: {}
  }

  type TrackCategoryGetPayload<S extends boolean | null | undefined | TrackCategoryDefaultArgs> = $Result.GetResult<Prisma.$TrackCategoryPayload, S>

  type TrackCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrackCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrackCategoryCountAggregateInputType | true
    }

  export interface TrackCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrackCategory'], meta: { name: 'TrackCategory' } }
    /**
     * Find zero or one TrackCategory that matches the filter.
     * @param {TrackCategoryFindUniqueArgs} args - Arguments to find a TrackCategory
     * @example
     * // Get one TrackCategory
     * const trackCategory = await prisma.trackCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrackCategoryFindUniqueArgs>(args: SelectSubset<T, TrackCategoryFindUniqueArgs<ExtArgs>>): Prisma__TrackCategoryClient<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrackCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrackCategoryFindUniqueOrThrowArgs} args - Arguments to find a TrackCategory
     * @example
     * // Get one TrackCategory
     * const trackCategory = await prisma.trackCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrackCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, TrackCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrackCategoryClient<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackCategoryFindFirstArgs} args - Arguments to find a TrackCategory
     * @example
     * // Get one TrackCategory
     * const trackCategory = await prisma.trackCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrackCategoryFindFirstArgs>(args?: SelectSubset<T, TrackCategoryFindFirstArgs<ExtArgs>>): Prisma__TrackCategoryClient<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackCategoryFindFirstOrThrowArgs} args - Arguments to find a TrackCategory
     * @example
     * // Get one TrackCategory
     * const trackCategory = await prisma.trackCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrackCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, TrackCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrackCategoryClient<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrackCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrackCategories
     * const trackCategories = await prisma.trackCategory.findMany()
     * 
     * // Get first 10 TrackCategories
     * const trackCategories = await prisma.trackCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trackCategoryWithIdOnly = await prisma.trackCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrackCategoryFindManyArgs>(args?: SelectSubset<T, TrackCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrackCategory.
     * @param {TrackCategoryCreateArgs} args - Arguments to create a TrackCategory.
     * @example
     * // Create one TrackCategory
     * const TrackCategory = await prisma.trackCategory.create({
     *   data: {
     *     // ... data to create a TrackCategory
     *   }
     * })
     * 
     */
    create<T extends TrackCategoryCreateArgs>(args: SelectSubset<T, TrackCategoryCreateArgs<ExtArgs>>): Prisma__TrackCategoryClient<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrackCategories.
     * @param {TrackCategoryCreateManyArgs} args - Arguments to create many TrackCategories.
     * @example
     * // Create many TrackCategories
     * const trackCategory = await prisma.trackCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrackCategoryCreateManyArgs>(args?: SelectSubset<T, TrackCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrackCategories and returns the data saved in the database.
     * @param {TrackCategoryCreateManyAndReturnArgs} args - Arguments to create many TrackCategories.
     * @example
     * // Create many TrackCategories
     * const trackCategory = await prisma.trackCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrackCategories and only return the `id`
     * const trackCategoryWithIdOnly = await prisma.trackCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrackCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, TrackCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrackCategory.
     * @param {TrackCategoryDeleteArgs} args - Arguments to delete one TrackCategory.
     * @example
     * // Delete one TrackCategory
     * const TrackCategory = await prisma.trackCategory.delete({
     *   where: {
     *     // ... filter to delete one TrackCategory
     *   }
     * })
     * 
     */
    delete<T extends TrackCategoryDeleteArgs>(args: SelectSubset<T, TrackCategoryDeleteArgs<ExtArgs>>): Prisma__TrackCategoryClient<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrackCategory.
     * @param {TrackCategoryUpdateArgs} args - Arguments to update one TrackCategory.
     * @example
     * // Update one TrackCategory
     * const trackCategory = await prisma.trackCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrackCategoryUpdateArgs>(args: SelectSubset<T, TrackCategoryUpdateArgs<ExtArgs>>): Prisma__TrackCategoryClient<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrackCategories.
     * @param {TrackCategoryDeleteManyArgs} args - Arguments to filter TrackCategories to delete.
     * @example
     * // Delete a few TrackCategories
     * const { count } = await prisma.trackCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrackCategoryDeleteManyArgs>(args?: SelectSubset<T, TrackCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrackCategories
     * const trackCategory = await prisma.trackCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrackCategoryUpdateManyArgs>(args: SelectSubset<T, TrackCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackCategories and returns the data updated in the database.
     * @param {TrackCategoryUpdateManyAndReturnArgs} args - Arguments to update many TrackCategories.
     * @example
     * // Update many TrackCategories
     * const trackCategory = await prisma.trackCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrackCategories and only return the `id`
     * const trackCategoryWithIdOnly = await prisma.trackCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrackCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, TrackCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrackCategory.
     * @param {TrackCategoryUpsertArgs} args - Arguments to update or create a TrackCategory.
     * @example
     * // Update or create a TrackCategory
     * const trackCategory = await prisma.trackCategory.upsert({
     *   create: {
     *     // ... data to create a TrackCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrackCategory we want to update
     *   }
     * })
     */
    upsert<T extends TrackCategoryUpsertArgs>(args: SelectSubset<T, TrackCategoryUpsertArgs<ExtArgs>>): Prisma__TrackCategoryClient<$Result.GetResult<Prisma.$TrackCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrackCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackCategoryCountArgs} args - Arguments to filter TrackCategories to count.
     * @example
     * // Count the number of TrackCategories
     * const count = await prisma.trackCategory.count({
     *   where: {
     *     // ... the filter for the TrackCategories we want to count
     *   }
     * })
    **/
    count<T extends TrackCategoryCountArgs>(
      args?: Subset<T, TrackCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrackCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrackCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrackCategoryAggregateArgs>(args: Subset<T, TrackCategoryAggregateArgs>): Prisma.PrismaPromise<GetTrackCategoryAggregateType<T>>

    /**
     * Group by TrackCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrackCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrackCategoryGroupByArgs['orderBy'] }
        : { orderBy?: TrackCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrackCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrackCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrackCategory model
   */
  readonly fields: TrackCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrackCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrackCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sheet<T extends TrackSheetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TrackSheetDefaultArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrackCategory model
   */
  interface TrackCategoryFieldRefs {
    readonly id: FieldRef<"TrackCategory", 'String'>
    readonly sheetId: FieldRef<"TrackCategory", 'String'>
    readonly name: FieldRef<"TrackCategory", 'String'>
    readonly color: FieldRef<"TrackCategory", 'String'>
    readonly fillRequired: FieldRef<"TrackCategory", 'Boolean'>
    readonly addRoleValues: FieldRef<"TrackCategory", 'String'>
    readonly editRoleValues: FieldRef<"TrackCategory", 'String'>
    readonly deleteRoleValues: FieldRef<"TrackCategory", 'String'>
    readonly sortOrder: FieldRef<"TrackCategory", 'Int'>
    readonly createdAt: FieldRef<"TrackCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"TrackCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrackCategory findUnique
   */
  export type TrackCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * Filter, which TrackCategory to fetch.
     */
    where: TrackCategoryWhereUniqueInput
  }

  /**
   * TrackCategory findUniqueOrThrow
   */
  export type TrackCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * Filter, which TrackCategory to fetch.
     */
    where: TrackCategoryWhereUniqueInput
  }

  /**
   * TrackCategory findFirst
   */
  export type TrackCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * Filter, which TrackCategory to fetch.
     */
    where?: TrackCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackCategories to fetch.
     */
    orderBy?: TrackCategoryOrderByWithRelationInput | TrackCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackCategories.
     */
    cursor?: TrackCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackCategories.
     */
    distinct?: TrackCategoryScalarFieldEnum | TrackCategoryScalarFieldEnum[]
  }

  /**
   * TrackCategory findFirstOrThrow
   */
  export type TrackCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * Filter, which TrackCategory to fetch.
     */
    where?: TrackCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackCategories to fetch.
     */
    orderBy?: TrackCategoryOrderByWithRelationInput | TrackCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackCategories.
     */
    cursor?: TrackCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackCategories.
     */
    distinct?: TrackCategoryScalarFieldEnum | TrackCategoryScalarFieldEnum[]
  }

  /**
   * TrackCategory findMany
   */
  export type TrackCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * Filter, which TrackCategories to fetch.
     */
    where?: TrackCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackCategories to fetch.
     */
    orderBy?: TrackCategoryOrderByWithRelationInput | TrackCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrackCategories.
     */
    cursor?: TrackCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackCategories.
     */
    distinct?: TrackCategoryScalarFieldEnum | TrackCategoryScalarFieldEnum[]
  }

  /**
   * TrackCategory create
   */
  export type TrackCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a TrackCategory.
     */
    data: XOR<TrackCategoryCreateInput, TrackCategoryUncheckedCreateInput>
  }

  /**
   * TrackCategory createMany
   */
  export type TrackCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrackCategories.
     */
    data: TrackCategoryCreateManyInput | TrackCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrackCategory createManyAndReturn
   */
  export type TrackCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many TrackCategories.
     */
    data: TrackCategoryCreateManyInput | TrackCategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrackCategory update
   */
  export type TrackCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a TrackCategory.
     */
    data: XOR<TrackCategoryUpdateInput, TrackCategoryUncheckedUpdateInput>
    /**
     * Choose, which TrackCategory to update.
     */
    where: TrackCategoryWhereUniqueInput
  }

  /**
   * TrackCategory updateMany
   */
  export type TrackCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrackCategories.
     */
    data: XOR<TrackCategoryUpdateManyMutationInput, TrackCategoryUncheckedUpdateManyInput>
    /**
     * Filter which TrackCategories to update
     */
    where?: TrackCategoryWhereInput
    /**
     * Limit how many TrackCategories to update.
     */
    limit?: number
  }

  /**
   * TrackCategory updateManyAndReturn
   */
  export type TrackCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * The data used to update TrackCategories.
     */
    data: XOR<TrackCategoryUpdateManyMutationInput, TrackCategoryUncheckedUpdateManyInput>
    /**
     * Filter which TrackCategories to update
     */
    where?: TrackCategoryWhereInput
    /**
     * Limit how many TrackCategories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrackCategory upsert
   */
  export type TrackCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the TrackCategory to update in case it exists.
     */
    where: TrackCategoryWhereUniqueInput
    /**
     * In case the TrackCategory found by the `where` argument doesn't exist, create a new TrackCategory with this data.
     */
    create: XOR<TrackCategoryCreateInput, TrackCategoryUncheckedCreateInput>
    /**
     * In case the TrackCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrackCategoryUpdateInput, TrackCategoryUncheckedUpdateInput>
  }

  /**
   * TrackCategory delete
   */
  export type TrackCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
    /**
     * Filter which TrackCategory to delete.
     */
    where: TrackCategoryWhereUniqueInput
  }

  /**
   * TrackCategory deleteMany
   */
  export type TrackCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackCategories to delete
     */
    where?: TrackCategoryWhereInput
    /**
     * Limit how many TrackCategories to delete.
     */
    limit?: number
  }

  /**
   * TrackCategory without action
   */
  export type TrackCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackCategory
     */
    select?: TrackCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackCategory
     */
    omit?: TrackCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackCategoryInclude<ExtArgs> | null
  }


  /**
   * Model TrackField
   */

  export type AggregateTrackField = {
    _count: TrackFieldCountAggregateOutputType | null
    _avg: TrackFieldAvgAggregateOutputType | null
    _sum: TrackFieldSumAggregateOutputType | null
    _min: TrackFieldMinAggregateOutputType | null
    _max: TrackFieldMaxAggregateOutputType | null
  }

  export type TrackFieldAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type TrackFieldSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type TrackFieldMinAggregateOutputType = {
    id: string | null
    sheetId: string | null
    categoryId: string | null
    category: string | null
    categoryColor: string | null
    region: string | null
    columnName: string | null
    dataType: string | null
    defaultValue: string | null
    categoryOptions: string | null
    fillRequired: boolean | null
    addRoleValues: string | null
    editRoleValues: string | null
    deleteRoleValues: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrackFieldMaxAggregateOutputType = {
    id: string | null
    sheetId: string | null
    categoryId: string | null
    category: string | null
    categoryColor: string | null
    region: string | null
    columnName: string | null
    dataType: string | null
    defaultValue: string | null
    categoryOptions: string | null
    fillRequired: boolean | null
    addRoleValues: string | null
    editRoleValues: string | null
    deleteRoleValues: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrackFieldCountAggregateOutputType = {
    id: number
    sheetId: number
    categoryId: number
    category: number
    categoryColor: number
    region: number
    columnName: number
    dataType: number
    defaultValue: number
    categoryOptions: number
    fillRequired: number
    addRoleValues: number
    editRoleValues: number
    deleteRoleValues: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrackFieldAvgAggregateInputType = {
    sortOrder?: true
  }

  export type TrackFieldSumAggregateInputType = {
    sortOrder?: true
  }

  export type TrackFieldMinAggregateInputType = {
    id?: true
    sheetId?: true
    categoryId?: true
    category?: true
    categoryColor?: true
    region?: true
    columnName?: true
    dataType?: true
    defaultValue?: true
    categoryOptions?: true
    fillRequired?: true
    addRoleValues?: true
    editRoleValues?: true
    deleteRoleValues?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrackFieldMaxAggregateInputType = {
    id?: true
    sheetId?: true
    categoryId?: true
    category?: true
    categoryColor?: true
    region?: true
    columnName?: true
    dataType?: true
    defaultValue?: true
    categoryOptions?: true
    fillRequired?: true
    addRoleValues?: true
    editRoleValues?: true
    deleteRoleValues?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrackFieldCountAggregateInputType = {
    id?: true
    sheetId?: true
    categoryId?: true
    category?: true
    categoryColor?: true
    region?: true
    columnName?: true
    dataType?: true
    defaultValue?: true
    categoryOptions?: true
    fillRequired?: true
    addRoleValues?: true
    editRoleValues?: true
    deleteRoleValues?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrackFieldAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackField to aggregate.
     */
    where?: TrackFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackFields to fetch.
     */
    orderBy?: TrackFieldOrderByWithRelationInput | TrackFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrackFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrackFields
    **/
    _count?: true | TrackFieldCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrackFieldAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrackFieldSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrackFieldMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrackFieldMaxAggregateInputType
  }

  export type GetTrackFieldAggregateType<T extends TrackFieldAggregateArgs> = {
        [P in keyof T & keyof AggregateTrackField]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrackField[P]>
      : GetScalarType<T[P], AggregateTrackField[P]>
  }




  export type TrackFieldGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackFieldWhereInput
    orderBy?: TrackFieldOrderByWithAggregationInput | TrackFieldOrderByWithAggregationInput[]
    by: TrackFieldScalarFieldEnum[] | TrackFieldScalarFieldEnum
    having?: TrackFieldScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrackFieldCountAggregateInputType | true
    _avg?: TrackFieldAvgAggregateInputType
    _sum?: TrackFieldSumAggregateInputType
    _min?: TrackFieldMinAggregateInputType
    _max?: TrackFieldMaxAggregateInputType
  }

  export type TrackFieldGroupByOutputType = {
    id: string
    sheetId: string
    categoryId: string | null
    category: string
    categoryColor: string
    region: string
    columnName: string
    dataType: string
    defaultValue: string
    categoryOptions: string
    fillRequired: boolean
    addRoleValues: string
    editRoleValues: string
    deleteRoleValues: string
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: TrackFieldCountAggregateOutputType | null
    _avg: TrackFieldAvgAggregateOutputType | null
    _sum: TrackFieldSumAggregateOutputType | null
    _min: TrackFieldMinAggregateOutputType | null
    _max: TrackFieldMaxAggregateOutputType | null
  }

  type GetTrackFieldGroupByPayload<T extends TrackFieldGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrackFieldGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrackFieldGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrackFieldGroupByOutputType[P]>
            : GetScalarType<T[P], TrackFieldGroupByOutputType[P]>
        }
      >
    >


  export type TrackFieldSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    categoryId?: boolean
    category?: boolean
    categoryColor?: boolean
    region?: boolean
    columnName?: boolean
    dataType?: boolean
    defaultValue?: boolean
    categoryOptions?: boolean
    fillRequired?: boolean
    addRoleValues?: boolean
    editRoleValues?: boolean
    deleteRoleValues?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackField"]>

  export type TrackFieldSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    categoryId?: boolean
    category?: boolean
    categoryColor?: boolean
    region?: boolean
    columnName?: boolean
    dataType?: boolean
    defaultValue?: boolean
    categoryOptions?: boolean
    fillRequired?: boolean
    addRoleValues?: boolean
    editRoleValues?: boolean
    deleteRoleValues?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackField"]>

  export type TrackFieldSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    categoryId?: boolean
    category?: boolean
    categoryColor?: boolean
    region?: boolean
    columnName?: boolean
    dataType?: boolean
    defaultValue?: boolean
    categoryOptions?: boolean
    fillRequired?: boolean
    addRoleValues?: boolean
    editRoleValues?: boolean
    deleteRoleValues?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackField"]>

  export type TrackFieldSelectScalar = {
    id?: boolean
    sheetId?: boolean
    categoryId?: boolean
    category?: boolean
    categoryColor?: boolean
    region?: boolean
    columnName?: boolean
    dataType?: boolean
    defaultValue?: boolean
    categoryOptions?: boolean
    fillRequired?: boolean
    addRoleValues?: boolean
    editRoleValues?: boolean
    deleteRoleValues?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrackFieldOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sheetId" | "categoryId" | "category" | "categoryColor" | "region" | "columnName" | "dataType" | "defaultValue" | "categoryOptions" | "fillRequired" | "addRoleValues" | "editRoleValues" | "deleteRoleValues" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["trackField"]>
  export type TrackFieldInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }
  export type TrackFieldIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }
  export type TrackFieldIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }

  export type $TrackFieldPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrackField"
    objects: {
      sheet: Prisma.$TrackSheetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sheetId: string
      categoryId: string | null
      category: string
      categoryColor: string
      region: string
      columnName: string
      dataType: string
      defaultValue: string
      categoryOptions: string
      fillRequired: boolean
      addRoleValues: string
      editRoleValues: string
      deleteRoleValues: string
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trackField"]>
    composites: {}
  }

  type TrackFieldGetPayload<S extends boolean | null | undefined | TrackFieldDefaultArgs> = $Result.GetResult<Prisma.$TrackFieldPayload, S>

  type TrackFieldCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrackFieldFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrackFieldCountAggregateInputType | true
    }

  export interface TrackFieldDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrackField'], meta: { name: 'TrackField' } }
    /**
     * Find zero or one TrackField that matches the filter.
     * @param {TrackFieldFindUniqueArgs} args - Arguments to find a TrackField
     * @example
     * // Get one TrackField
     * const trackField = await prisma.trackField.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrackFieldFindUniqueArgs>(args: SelectSubset<T, TrackFieldFindUniqueArgs<ExtArgs>>): Prisma__TrackFieldClient<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrackField that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrackFieldFindUniqueOrThrowArgs} args - Arguments to find a TrackField
     * @example
     * // Get one TrackField
     * const trackField = await prisma.trackField.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrackFieldFindUniqueOrThrowArgs>(args: SelectSubset<T, TrackFieldFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrackFieldClient<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackField that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackFieldFindFirstArgs} args - Arguments to find a TrackField
     * @example
     * // Get one TrackField
     * const trackField = await prisma.trackField.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrackFieldFindFirstArgs>(args?: SelectSubset<T, TrackFieldFindFirstArgs<ExtArgs>>): Prisma__TrackFieldClient<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackField that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackFieldFindFirstOrThrowArgs} args - Arguments to find a TrackField
     * @example
     * // Get one TrackField
     * const trackField = await prisma.trackField.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrackFieldFindFirstOrThrowArgs>(args?: SelectSubset<T, TrackFieldFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrackFieldClient<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrackFields that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackFieldFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrackFields
     * const trackFields = await prisma.trackField.findMany()
     * 
     * // Get first 10 TrackFields
     * const trackFields = await prisma.trackField.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trackFieldWithIdOnly = await prisma.trackField.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrackFieldFindManyArgs>(args?: SelectSubset<T, TrackFieldFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrackField.
     * @param {TrackFieldCreateArgs} args - Arguments to create a TrackField.
     * @example
     * // Create one TrackField
     * const TrackField = await prisma.trackField.create({
     *   data: {
     *     // ... data to create a TrackField
     *   }
     * })
     * 
     */
    create<T extends TrackFieldCreateArgs>(args: SelectSubset<T, TrackFieldCreateArgs<ExtArgs>>): Prisma__TrackFieldClient<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrackFields.
     * @param {TrackFieldCreateManyArgs} args - Arguments to create many TrackFields.
     * @example
     * // Create many TrackFields
     * const trackField = await prisma.trackField.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrackFieldCreateManyArgs>(args?: SelectSubset<T, TrackFieldCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrackFields and returns the data saved in the database.
     * @param {TrackFieldCreateManyAndReturnArgs} args - Arguments to create many TrackFields.
     * @example
     * // Create many TrackFields
     * const trackField = await prisma.trackField.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrackFields and only return the `id`
     * const trackFieldWithIdOnly = await prisma.trackField.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrackFieldCreateManyAndReturnArgs>(args?: SelectSubset<T, TrackFieldCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrackField.
     * @param {TrackFieldDeleteArgs} args - Arguments to delete one TrackField.
     * @example
     * // Delete one TrackField
     * const TrackField = await prisma.trackField.delete({
     *   where: {
     *     // ... filter to delete one TrackField
     *   }
     * })
     * 
     */
    delete<T extends TrackFieldDeleteArgs>(args: SelectSubset<T, TrackFieldDeleteArgs<ExtArgs>>): Prisma__TrackFieldClient<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrackField.
     * @param {TrackFieldUpdateArgs} args - Arguments to update one TrackField.
     * @example
     * // Update one TrackField
     * const trackField = await prisma.trackField.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrackFieldUpdateArgs>(args: SelectSubset<T, TrackFieldUpdateArgs<ExtArgs>>): Prisma__TrackFieldClient<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrackFields.
     * @param {TrackFieldDeleteManyArgs} args - Arguments to filter TrackFields to delete.
     * @example
     * // Delete a few TrackFields
     * const { count } = await prisma.trackField.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrackFieldDeleteManyArgs>(args?: SelectSubset<T, TrackFieldDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackFieldUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrackFields
     * const trackField = await prisma.trackField.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrackFieldUpdateManyArgs>(args: SelectSubset<T, TrackFieldUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackFields and returns the data updated in the database.
     * @param {TrackFieldUpdateManyAndReturnArgs} args - Arguments to update many TrackFields.
     * @example
     * // Update many TrackFields
     * const trackField = await prisma.trackField.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrackFields and only return the `id`
     * const trackFieldWithIdOnly = await prisma.trackField.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrackFieldUpdateManyAndReturnArgs>(args: SelectSubset<T, TrackFieldUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrackField.
     * @param {TrackFieldUpsertArgs} args - Arguments to update or create a TrackField.
     * @example
     * // Update or create a TrackField
     * const trackField = await prisma.trackField.upsert({
     *   create: {
     *     // ... data to create a TrackField
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrackField we want to update
     *   }
     * })
     */
    upsert<T extends TrackFieldUpsertArgs>(args: SelectSubset<T, TrackFieldUpsertArgs<ExtArgs>>): Prisma__TrackFieldClient<$Result.GetResult<Prisma.$TrackFieldPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrackFields.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackFieldCountArgs} args - Arguments to filter TrackFields to count.
     * @example
     * // Count the number of TrackFields
     * const count = await prisma.trackField.count({
     *   where: {
     *     // ... the filter for the TrackFields we want to count
     *   }
     * })
    **/
    count<T extends TrackFieldCountArgs>(
      args?: Subset<T, TrackFieldCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrackFieldCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrackField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackFieldAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrackFieldAggregateArgs>(args: Subset<T, TrackFieldAggregateArgs>): Prisma.PrismaPromise<GetTrackFieldAggregateType<T>>

    /**
     * Group by TrackField.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackFieldGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrackFieldGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrackFieldGroupByArgs['orderBy'] }
        : { orderBy?: TrackFieldGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrackFieldGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrackFieldGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrackField model
   */
  readonly fields: TrackFieldFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrackField.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrackFieldClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sheet<T extends TrackSheetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TrackSheetDefaultArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrackField model
   */
  interface TrackFieldFieldRefs {
    readonly id: FieldRef<"TrackField", 'String'>
    readonly sheetId: FieldRef<"TrackField", 'String'>
    readonly categoryId: FieldRef<"TrackField", 'String'>
    readonly category: FieldRef<"TrackField", 'String'>
    readonly categoryColor: FieldRef<"TrackField", 'String'>
    readonly region: FieldRef<"TrackField", 'String'>
    readonly columnName: FieldRef<"TrackField", 'String'>
    readonly dataType: FieldRef<"TrackField", 'String'>
    readonly defaultValue: FieldRef<"TrackField", 'String'>
    readonly categoryOptions: FieldRef<"TrackField", 'String'>
    readonly fillRequired: FieldRef<"TrackField", 'Boolean'>
    readonly addRoleValues: FieldRef<"TrackField", 'String'>
    readonly editRoleValues: FieldRef<"TrackField", 'String'>
    readonly deleteRoleValues: FieldRef<"TrackField", 'String'>
    readonly sortOrder: FieldRef<"TrackField", 'Int'>
    readonly createdAt: FieldRef<"TrackField", 'DateTime'>
    readonly updatedAt: FieldRef<"TrackField", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrackField findUnique
   */
  export type TrackFieldFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * Filter, which TrackField to fetch.
     */
    where: TrackFieldWhereUniqueInput
  }

  /**
   * TrackField findUniqueOrThrow
   */
  export type TrackFieldFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * Filter, which TrackField to fetch.
     */
    where: TrackFieldWhereUniqueInput
  }

  /**
   * TrackField findFirst
   */
  export type TrackFieldFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * Filter, which TrackField to fetch.
     */
    where?: TrackFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackFields to fetch.
     */
    orderBy?: TrackFieldOrderByWithRelationInput | TrackFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackFields.
     */
    cursor?: TrackFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackFields.
     */
    distinct?: TrackFieldScalarFieldEnum | TrackFieldScalarFieldEnum[]
  }

  /**
   * TrackField findFirstOrThrow
   */
  export type TrackFieldFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * Filter, which TrackField to fetch.
     */
    where?: TrackFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackFields to fetch.
     */
    orderBy?: TrackFieldOrderByWithRelationInput | TrackFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackFields.
     */
    cursor?: TrackFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackFields.
     */
    distinct?: TrackFieldScalarFieldEnum | TrackFieldScalarFieldEnum[]
  }

  /**
   * TrackField findMany
   */
  export type TrackFieldFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * Filter, which TrackFields to fetch.
     */
    where?: TrackFieldWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackFields to fetch.
     */
    orderBy?: TrackFieldOrderByWithRelationInput | TrackFieldOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrackFields.
     */
    cursor?: TrackFieldWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackFields from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackFields.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackFields.
     */
    distinct?: TrackFieldScalarFieldEnum | TrackFieldScalarFieldEnum[]
  }

  /**
   * TrackField create
   */
  export type TrackFieldCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * The data needed to create a TrackField.
     */
    data: XOR<TrackFieldCreateInput, TrackFieldUncheckedCreateInput>
  }

  /**
   * TrackField createMany
   */
  export type TrackFieldCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrackFields.
     */
    data: TrackFieldCreateManyInput | TrackFieldCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrackField createManyAndReturn
   */
  export type TrackFieldCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * The data used to create many TrackFields.
     */
    data: TrackFieldCreateManyInput | TrackFieldCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrackField update
   */
  export type TrackFieldUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * The data needed to update a TrackField.
     */
    data: XOR<TrackFieldUpdateInput, TrackFieldUncheckedUpdateInput>
    /**
     * Choose, which TrackField to update.
     */
    where: TrackFieldWhereUniqueInput
  }

  /**
   * TrackField updateMany
   */
  export type TrackFieldUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrackFields.
     */
    data: XOR<TrackFieldUpdateManyMutationInput, TrackFieldUncheckedUpdateManyInput>
    /**
     * Filter which TrackFields to update
     */
    where?: TrackFieldWhereInput
    /**
     * Limit how many TrackFields to update.
     */
    limit?: number
  }

  /**
   * TrackField updateManyAndReturn
   */
  export type TrackFieldUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * The data used to update TrackFields.
     */
    data: XOR<TrackFieldUpdateManyMutationInput, TrackFieldUncheckedUpdateManyInput>
    /**
     * Filter which TrackFields to update
     */
    where?: TrackFieldWhereInput
    /**
     * Limit how many TrackFields to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrackField upsert
   */
  export type TrackFieldUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * The filter to search for the TrackField to update in case it exists.
     */
    where: TrackFieldWhereUniqueInput
    /**
     * In case the TrackField found by the `where` argument doesn't exist, create a new TrackField with this data.
     */
    create: XOR<TrackFieldCreateInput, TrackFieldUncheckedCreateInput>
    /**
     * In case the TrackField was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrackFieldUpdateInput, TrackFieldUncheckedUpdateInput>
  }

  /**
   * TrackField delete
   */
  export type TrackFieldDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
    /**
     * Filter which TrackField to delete.
     */
    where: TrackFieldWhereUniqueInput
  }

  /**
   * TrackField deleteMany
   */
  export type TrackFieldDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackFields to delete
     */
    where?: TrackFieldWhereInput
    /**
     * Limit how many TrackFields to delete.
     */
    limit?: number
  }

  /**
   * TrackField without action
   */
  export type TrackFieldDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackField
     */
    select?: TrackFieldSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackField
     */
    omit?: TrackFieldOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackFieldInclude<ExtArgs> | null
  }


  /**
   * Model TrackRecord
   */

  export type AggregateTrackRecord = {
    _count: TrackRecordCountAggregateOutputType | null
    _avg: TrackRecordAvgAggregateOutputType | null
    _sum: TrackRecordSumAggregateOutputType | null
    _min: TrackRecordMinAggregateOutputType | null
    _max: TrackRecordMaxAggregateOutputType | null
  }

  export type TrackRecordAvgAggregateOutputType = {
    sequenceNo: number | null
  }

  export type TrackRecordSumAggregateOutputType = {
    sequenceNo: number | null
  }

  export type TrackRecordMinAggregateOutputType = {
    id: string | null
    sheetId: string | null
    sequenceNo: number | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrackRecordMaxAggregateOutputType = {
    id: string | null
    sheetId: string | null
    sequenceNo: number | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrackRecordCountAggregateOutputType = {
    id: number
    sheetId: number
    sequenceNo: number
    values: number
    createdById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrackRecordAvgAggregateInputType = {
    sequenceNo?: true
  }

  export type TrackRecordSumAggregateInputType = {
    sequenceNo?: true
  }

  export type TrackRecordMinAggregateInputType = {
    id?: true
    sheetId?: true
    sequenceNo?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrackRecordMaxAggregateInputType = {
    id?: true
    sheetId?: true
    sequenceNo?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrackRecordCountAggregateInputType = {
    id?: true
    sheetId?: true
    sequenceNo?: true
    values?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrackRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackRecord to aggregate.
     */
    where?: TrackRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackRecords to fetch.
     */
    orderBy?: TrackRecordOrderByWithRelationInput | TrackRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrackRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrackRecords
    **/
    _count?: true | TrackRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrackRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrackRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrackRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrackRecordMaxAggregateInputType
  }

  export type GetTrackRecordAggregateType<T extends TrackRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateTrackRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrackRecord[P]>
      : GetScalarType<T[P], AggregateTrackRecord[P]>
  }




  export type TrackRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrackRecordWhereInput
    orderBy?: TrackRecordOrderByWithAggregationInput | TrackRecordOrderByWithAggregationInput[]
    by: TrackRecordScalarFieldEnum[] | TrackRecordScalarFieldEnum
    having?: TrackRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrackRecordCountAggregateInputType | true
    _avg?: TrackRecordAvgAggregateInputType
    _sum?: TrackRecordSumAggregateInputType
    _min?: TrackRecordMinAggregateInputType
    _max?: TrackRecordMaxAggregateInputType
  }

  export type TrackRecordGroupByOutputType = {
    id: string
    sheetId: string
    sequenceNo: number
    values: JsonValue
    createdById: string | null
    createdAt: Date
    updatedAt: Date
    _count: TrackRecordCountAggregateOutputType | null
    _avg: TrackRecordAvgAggregateOutputType | null
    _sum: TrackRecordSumAggregateOutputType | null
    _min: TrackRecordMinAggregateOutputType | null
    _max: TrackRecordMaxAggregateOutputType | null
  }

  type GetTrackRecordGroupByPayload<T extends TrackRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrackRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrackRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrackRecordGroupByOutputType[P]>
            : GetScalarType<T[P], TrackRecordGroupByOutputType[P]>
        }
      >
    >


  export type TrackRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    sequenceNo?: boolean
    values?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackRecord"]>

  export type TrackRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    sequenceNo?: boolean
    values?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackRecord"]>

  export type TrackRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sheetId?: boolean
    sequenceNo?: boolean
    values?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trackRecord"]>

  export type TrackRecordSelectScalar = {
    id?: boolean
    sheetId?: boolean
    sequenceNo?: boolean
    values?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrackRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sheetId" | "sequenceNo" | "values" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["trackRecord"]>
  export type TrackRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }
  export type TrackRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }
  export type TrackRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sheet?: boolean | TrackSheetDefaultArgs<ExtArgs>
  }

  export type $TrackRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrackRecord"
    objects: {
      sheet: Prisma.$TrackSheetPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sheetId: string
      sequenceNo: number
      values: Prisma.JsonValue
      createdById: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trackRecord"]>
    composites: {}
  }

  type TrackRecordGetPayload<S extends boolean | null | undefined | TrackRecordDefaultArgs> = $Result.GetResult<Prisma.$TrackRecordPayload, S>

  type TrackRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrackRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrackRecordCountAggregateInputType | true
    }

  export interface TrackRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrackRecord'], meta: { name: 'TrackRecord' } }
    /**
     * Find zero or one TrackRecord that matches the filter.
     * @param {TrackRecordFindUniqueArgs} args - Arguments to find a TrackRecord
     * @example
     * // Get one TrackRecord
     * const trackRecord = await prisma.trackRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrackRecordFindUniqueArgs>(args: SelectSubset<T, TrackRecordFindUniqueArgs<ExtArgs>>): Prisma__TrackRecordClient<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrackRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrackRecordFindUniqueOrThrowArgs} args - Arguments to find a TrackRecord
     * @example
     * // Get one TrackRecord
     * const trackRecord = await prisma.trackRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrackRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, TrackRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrackRecordClient<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackRecordFindFirstArgs} args - Arguments to find a TrackRecord
     * @example
     * // Get one TrackRecord
     * const trackRecord = await prisma.trackRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrackRecordFindFirstArgs>(args?: SelectSubset<T, TrackRecordFindFirstArgs<ExtArgs>>): Prisma__TrackRecordClient<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrackRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackRecordFindFirstOrThrowArgs} args - Arguments to find a TrackRecord
     * @example
     * // Get one TrackRecord
     * const trackRecord = await prisma.trackRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrackRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, TrackRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrackRecordClient<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrackRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrackRecords
     * const trackRecords = await prisma.trackRecord.findMany()
     * 
     * // Get first 10 TrackRecords
     * const trackRecords = await prisma.trackRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trackRecordWithIdOnly = await prisma.trackRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrackRecordFindManyArgs>(args?: SelectSubset<T, TrackRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrackRecord.
     * @param {TrackRecordCreateArgs} args - Arguments to create a TrackRecord.
     * @example
     * // Create one TrackRecord
     * const TrackRecord = await prisma.trackRecord.create({
     *   data: {
     *     // ... data to create a TrackRecord
     *   }
     * })
     * 
     */
    create<T extends TrackRecordCreateArgs>(args: SelectSubset<T, TrackRecordCreateArgs<ExtArgs>>): Prisma__TrackRecordClient<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrackRecords.
     * @param {TrackRecordCreateManyArgs} args - Arguments to create many TrackRecords.
     * @example
     * // Create many TrackRecords
     * const trackRecord = await prisma.trackRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrackRecordCreateManyArgs>(args?: SelectSubset<T, TrackRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrackRecords and returns the data saved in the database.
     * @param {TrackRecordCreateManyAndReturnArgs} args - Arguments to create many TrackRecords.
     * @example
     * // Create many TrackRecords
     * const trackRecord = await prisma.trackRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrackRecords and only return the `id`
     * const trackRecordWithIdOnly = await prisma.trackRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrackRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, TrackRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrackRecord.
     * @param {TrackRecordDeleteArgs} args - Arguments to delete one TrackRecord.
     * @example
     * // Delete one TrackRecord
     * const TrackRecord = await prisma.trackRecord.delete({
     *   where: {
     *     // ... filter to delete one TrackRecord
     *   }
     * })
     * 
     */
    delete<T extends TrackRecordDeleteArgs>(args: SelectSubset<T, TrackRecordDeleteArgs<ExtArgs>>): Prisma__TrackRecordClient<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrackRecord.
     * @param {TrackRecordUpdateArgs} args - Arguments to update one TrackRecord.
     * @example
     * // Update one TrackRecord
     * const trackRecord = await prisma.trackRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrackRecordUpdateArgs>(args: SelectSubset<T, TrackRecordUpdateArgs<ExtArgs>>): Prisma__TrackRecordClient<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrackRecords.
     * @param {TrackRecordDeleteManyArgs} args - Arguments to filter TrackRecords to delete.
     * @example
     * // Delete a few TrackRecords
     * const { count } = await prisma.trackRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrackRecordDeleteManyArgs>(args?: SelectSubset<T, TrackRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrackRecords
     * const trackRecord = await prisma.trackRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrackRecordUpdateManyArgs>(args: SelectSubset<T, TrackRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrackRecords and returns the data updated in the database.
     * @param {TrackRecordUpdateManyAndReturnArgs} args - Arguments to update many TrackRecords.
     * @example
     * // Update many TrackRecords
     * const trackRecord = await prisma.trackRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrackRecords and only return the `id`
     * const trackRecordWithIdOnly = await prisma.trackRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrackRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, TrackRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrackRecord.
     * @param {TrackRecordUpsertArgs} args - Arguments to update or create a TrackRecord.
     * @example
     * // Update or create a TrackRecord
     * const trackRecord = await prisma.trackRecord.upsert({
     *   create: {
     *     // ... data to create a TrackRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrackRecord we want to update
     *   }
     * })
     */
    upsert<T extends TrackRecordUpsertArgs>(args: SelectSubset<T, TrackRecordUpsertArgs<ExtArgs>>): Prisma__TrackRecordClient<$Result.GetResult<Prisma.$TrackRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrackRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackRecordCountArgs} args - Arguments to filter TrackRecords to count.
     * @example
     * // Count the number of TrackRecords
     * const count = await prisma.trackRecord.count({
     *   where: {
     *     // ... the filter for the TrackRecords we want to count
     *   }
     * })
    **/
    count<T extends TrackRecordCountArgs>(
      args?: Subset<T, TrackRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrackRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrackRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrackRecordAggregateArgs>(args: Subset<T, TrackRecordAggregateArgs>): Prisma.PrismaPromise<GetTrackRecordAggregateType<T>>

    /**
     * Group by TrackRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrackRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrackRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrackRecordGroupByArgs['orderBy'] }
        : { orderBy?: TrackRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrackRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrackRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrackRecord model
   */
  readonly fields: TrackRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrackRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrackRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sheet<T extends TrackSheetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TrackSheetDefaultArgs<ExtArgs>>): Prisma__TrackSheetClient<$Result.GetResult<Prisma.$TrackSheetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrackRecord model
   */
  interface TrackRecordFieldRefs {
    readonly id: FieldRef<"TrackRecord", 'String'>
    readonly sheetId: FieldRef<"TrackRecord", 'String'>
    readonly sequenceNo: FieldRef<"TrackRecord", 'Int'>
    readonly values: FieldRef<"TrackRecord", 'Json'>
    readonly createdById: FieldRef<"TrackRecord", 'String'>
    readonly createdAt: FieldRef<"TrackRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"TrackRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrackRecord findUnique
   */
  export type TrackRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * Filter, which TrackRecord to fetch.
     */
    where: TrackRecordWhereUniqueInput
  }

  /**
   * TrackRecord findUniqueOrThrow
   */
  export type TrackRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * Filter, which TrackRecord to fetch.
     */
    where: TrackRecordWhereUniqueInput
  }

  /**
   * TrackRecord findFirst
   */
  export type TrackRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * Filter, which TrackRecord to fetch.
     */
    where?: TrackRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackRecords to fetch.
     */
    orderBy?: TrackRecordOrderByWithRelationInput | TrackRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackRecords.
     */
    cursor?: TrackRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackRecords.
     */
    distinct?: TrackRecordScalarFieldEnum | TrackRecordScalarFieldEnum[]
  }

  /**
   * TrackRecord findFirstOrThrow
   */
  export type TrackRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * Filter, which TrackRecord to fetch.
     */
    where?: TrackRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackRecords to fetch.
     */
    orderBy?: TrackRecordOrderByWithRelationInput | TrackRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrackRecords.
     */
    cursor?: TrackRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackRecords.
     */
    distinct?: TrackRecordScalarFieldEnum | TrackRecordScalarFieldEnum[]
  }

  /**
   * TrackRecord findMany
   */
  export type TrackRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * Filter, which TrackRecords to fetch.
     */
    where?: TrackRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrackRecords to fetch.
     */
    orderBy?: TrackRecordOrderByWithRelationInput | TrackRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrackRecords.
     */
    cursor?: TrackRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrackRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrackRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrackRecords.
     */
    distinct?: TrackRecordScalarFieldEnum | TrackRecordScalarFieldEnum[]
  }

  /**
   * TrackRecord create
   */
  export type TrackRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a TrackRecord.
     */
    data: XOR<TrackRecordCreateInput, TrackRecordUncheckedCreateInput>
  }

  /**
   * TrackRecord createMany
   */
  export type TrackRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrackRecords.
     */
    data: TrackRecordCreateManyInput | TrackRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrackRecord createManyAndReturn
   */
  export type TrackRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * The data used to create many TrackRecords.
     */
    data: TrackRecordCreateManyInput | TrackRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrackRecord update
   */
  export type TrackRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a TrackRecord.
     */
    data: XOR<TrackRecordUpdateInput, TrackRecordUncheckedUpdateInput>
    /**
     * Choose, which TrackRecord to update.
     */
    where: TrackRecordWhereUniqueInput
  }

  /**
   * TrackRecord updateMany
   */
  export type TrackRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrackRecords.
     */
    data: XOR<TrackRecordUpdateManyMutationInput, TrackRecordUncheckedUpdateManyInput>
    /**
     * Filter which TrackRecords to update
     */
    where?: TrackRecordWhereInput
    /**
     * Limit how many TrackRecords to update.
     */
    limit?: number
  }

  /**
   * TrackRecord updateManyAndReturn
   */
  export type TrackRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * The data used to update TrackRecords.
     */
    data: XOR<TrackRecordUpdateManyMutationInput, TrackRecordUncheckedUpdateManyInput>
    /**
     * Filter which TrackRecords to update
     */
    where?: TrackRecordWhereInput
    /**
     * Limit how many TrackRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrackRecord upsert
   */
  export type TrackRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the TrackRecord to update in case it exists.
     */
    where: TrackRecordWhereUniqueInput
    /**
     * In case the TrackRecord found by the `where` argument doesn't exist, create a new TrackRecord with this data.
     */
    create: XOR<TrackRecordCreateInput, TrackRecordUncheckedCreateInput>
    /**
     * In case the TrackRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrackRecordUpdateInput, TrackRecordUncheckedUpdateInput>
  }

  /**
   * TrackRecord delete
   */
  export type TrackRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
    /**
     * Filter which TrackRecord to delete.
     */
    where: TrackRecordWhereUniqueInput
  }

  /**
   * TrackRecord deleteMany
   */
  export type TrackRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrackRecords to delete
     */
    where?: TrackRecordWhereInput
    /**
     * Limit how many TrackRecords to delete.
     */
    limit?: number
  }

  /**
   * TrackRecord without action
   */
  export type TrackRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrackRecord
     */
    select?: TrackRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrackRecord
     */
    omit?: TrackRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrackRecordInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    username: 'username',
    image: 'image',
    role: 'role',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const UserPermissionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    canViewDataSurat: 'canViewDataSurat',
    canCreate: 'canCreate',
    canEdit: 'canEdit',
    canDelete: 'canDelete',
    canPrint: 'canPrint',
    canTrack: 'canTrack'
  };

  export type UserPermissionScalarFieldEnum = (typeof UserPermissionScalarFieldEnum)[keyof typeof UserPermissionScalarFieldEnum]


  export const DepartmentScalarFieldEnum: {
    id: 'id',
    shortName: 'shortName',
    tujuan: 'tujuan',
    printSheetName: 'printSheetName',
    isActive: 'isActive'
  };

  export type DepartmentScalarFieldEnum = (typeof DepartmentScalarFieldEnum)[keyof typeof DepartmentScalarFieldEnum]


  export const RoleDefinitionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    value: 'value',
    isSystem: 'isSystem',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RoleDefinitionScalarFieldEnum = (typeof RoleDefinitionScalarFieldEnum)[keyof typeof RoleDefinitionScalarFieldEnum]


  export const DepartmentColumnScalarFieldEnum: {
    id: 'id',
    departmentId: 'departmentId',
    label: 'label',
    dataType: 'dataType',
    defaultValue: 'defaultValue',
    isDefault: 'isDefault',
    isRequired: 'isRequired',
    showInDataSurat: 'showInDataSurat',
    showInPrint: 'showInPrint',
    sortOrder: 'sortOrder',
    displayOrder: 'displayOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DepartmentColumnScalarFieldEnum = (typeof DepartmentColumnScalarFieldEnum)[keyof typeof DepartmentColumnScalarFieldEnum]


  export const RegisterSuratScalarFieldEnum: {
    id: 'id',
    nomor: 'nomor',
    deptId: 'deptId',
    tanggalTerima: 'tanggalTerima',
    asalSurat: 'asalSurat',
    tujuan: 'tujuan',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RegisterSuratScalarFieldEnum = (typeof RegisterSuratScalarFieldEnum)[keyof typeof RegisterSuratScalarFieldEnum]


  export const DetailSuratScalarFieldEnum: {
    id: 'id',
    registerId: 'registerId',
    perihal: 'perihal',
    noSurat: 'noSurat',
    lampiran: 'lampiran',
    tanggalSurat: 'tanggalSurat',
    tujuan: 'tujuan',
    customFields: 'customFields',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DetailSuratScalarFieldEnum = (typeof DetailSuratScalarFieldEnum)[keyof typeof DetailSuratScalarFieldEnum]


  export const NomorCounterScalarFieldEnum: {
    deptId: 'deptId',
    year: 'year',
    counter: 'counter'
  };

  export type NomorCounterScalarFieldEnum = (typeof NomorCounterScalarFieldEnum)[keyof typeof NomorCounterScalarFieldEnum]


  export const TrackSheetScalarFieldEnum: {
    id: 'id',
    name: 'name',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    hiddenAt: 'hiddenAt'
  };

  export type TrackSheetScalarFieldEnum = (typeof TrackSheetScalarFieldEnum)[keyof typeof TrackSheetScalarFieldEnum]


  export const TrackCategoryScalarFieldEnum: {
    id: 'id',
    sheetId: 'sheetId',
    name: 'name',
    color: 'color',
    fillRequired: 'fillRequired',
    addRoleValues: 'addRoleValues',
    editRoleValues: 'editRoleValues',
    deleteRoleValues: 'deleteRoleValues',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TrackCategoryScalarFieldEnum = (typeof TrackCategoryScalarFieldEnum)[keyof typeof TrackCategoryScalarFieldEnum]


  export const TrackFieldScalarFieldEnum: {
    id: 'id',
    sheetId: 'sheetId',
    categoryId: 'categoryId',
    category: 'category',
    categoryColor: 'categoryColor',
    region: 'region',
    columnName: 'columnName',
    dataType: 'dataType',
    defaultValue: 'defaultValue',
    categoryOptions: 'categoryOptions',
    fillRequired: 'fillRequired',
    addRoleValues: 'addRoleValues',
    editRoleValues: 'editRoleValues',
    deleteRoleValues: 'deleteRoleValues',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TrackFieldScalarFieldEnum = (typeof TrackFieldScalarFieldEnum)[keyof typeof TrackFieldScalarFieldEnum]


  export const TrackRecordScalarFieldEnum: {
    id: 'id',
    sheetId: 'sheetId',
    sequenceNo: 'sequenceNo',
    values: 'values',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TrackRecordScalarFieldEnum = (typeof TrackRecordScalarFieldEnum)[keyof typeof TrackRecordScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    username?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    permissions?: XOR<UserPermissionNullableScalarRelationFilter, UserPermissionWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    username?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    permissions?: UserPermissionOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    permissions?: XOR<UserPermissionNullableScalarRelationFilter, UserPermissionWhereInput> | null
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    username?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type UserPermissionWhereInput = {
    AND?: UserPermissionWhereInput | UserPermissionWhereInput[]
    OR?: UserPermissionWhereInput[]
    NOT?: UserPermissionWhereInput | UserPermissionWhereInput[]
    id?: StringFilter<"UserPermission"> | string
    userId?: StringFilter<"UserPermission"> | string
    canViewDataSurat?: BoolFilter<"UserPermission"> | boolean
    canCreate?: BoolFilter<"UserPermission"> | boolean
    canEdit?: BoolFilter<"UserPermission"> | boolean
    canDelete?: BoolFilter<"UserPermission"> | boolean
    canPrint?: BoolFilter<"UserPermission"> | boolean
    canTrack?: BoolFilter<"UserPermission"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserPermissionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    canViewDataSurat?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
    canPrint?: SortOrder
    canTrack?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserPermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserPermissionWhereInput | UserPermissionWhereInput[]
    OR?: UserPermissionWhereInput[]
    NOT?: UserPermissionWhereInput | UserPermissionWhereInput[]
    canViewDataSurat?: BoolFilter<"UserPermission"> | boolean
    canCreate?: BoolFilter<"UserPermission"> | boolean
    canEdit?: BoolFilter<"UserPermission"> | boolean
    canDelete?: BoolFilter<"UserPermission"> | boolean
    canPrint?: BoolFilter<"UserPermission"> | boolean
    canTrack?: BoolFilter<"UserPermission"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserPermissionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    canViewDataSurat?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
    canPrint?: SortOrder
    canTrack?: SortOrder
    _count?: UserPermissionCountOrderByAggregateInput
    _max?: UserPermissionMaxOrderByAggregateInput
    _min?: UserPermissionMinOrderByAggregateInput
  }

  export type UserPermissionScalarWhereWithAggregatesInput = {
    AND?: UserPermissionScalarWhereWithAggregatesInput | UserPermissionScalarWhereWithAggregatesInput[]
    OR?: UserPermissionScalarWhereWithAggregatesInput[]
    NOT?: UserPermissionScalarWhereWithAggregatesInput | UserPermissionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserPermission"> | string
    userId?: StringWithAggregatesFilter<"UserPermission"> | string
    canViewDataSurat?: BoolWithAggregatesFilter<"UserPermission"> | boolean
    canCreate?: BoolWithAggregatesFilter<"UserPermission"> | boolean
    canEdit?: BoolWithAggregatesFilter<"UserPermission"> | boolean
    canDelete?: BoolWithAggregatesFilter<"UserPermission"> | boolean
    canPrint?: BoolWithAggregatesFilter<"UserPermission"> | boolean
    canTrack?: BoolWithAggregatesFilter<"UserPermission"> | boolean
  }

  export type DepartmentWhereInput = {
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    id?: StringFilter<"Department"> | string
    shortName?: StringFilter<"Department"> | string
    tujuan?: StringFilter<"Department"> | string
    printSheetName?: StringFilter<"Department"> | string
    isActive?: BoolFilter<"Department"> | boolean
    registerSurat?: RegisterSuratListRelationFilter
    nomorCounter?: NomorCounterListRelationFilter
    columns?: DepartmentColumnListRelationFilter
  }

  export type DepartmentOrderByWithRelationInput = {
    id?: SortOrder
    shortName?: SortOrder
    tujuan?: SortOrder
    printSheetName?: SortOrder
    isActive?: SortOrder
    registerSurat?: RegisterSuratOrderByRelationAggregateInput
    nomorCounter?: NomorCounterOrderByRelationAggregateInput
    columns?: DepartmentColumnOrderByRelationAggregateInput
  }

  export type DepartmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DepartmentWhereInput | DepartmentWhereInput[]
    OR?: DepartmentWhereInput[]
    NOT?: DepartmentWhereInput | DepartmentWhereInput[]
    shortName?: StringFilter<"Department"> | string
    tujuan?: StringFilter<"Department"> | string
    printSheetName?: StringFilter<"Department"> | string
    isActive?: BoolFilter<"Department"> | boolean
    registerSurat?: RegisterSuratListRelationFilter
    nomorCounter?: NomorCounterListRelationFilter
    columns?: DepartmentColumnListRelationFilter
  }, "id">

  export type DepartmentOrderByWithAggregationInput = {
    id?: SortOrder
    shortName?: SortOrder
    tujuan?: SortOrder
    printSheetName?: SortOrder
    isActive?: SortOrder
    _count?: DepartmentCountOrderByAggregateInput
    _max?: DepartmentMaxOrderByAggregateInput
    _min?: DepartmentMinOrderByAggregateInput
  }

  export type DepartmentScalarWhereWithAggregatesInput = {
    AND?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    OR?: DepartmentScalarWhereWithAggregatesInput[]
    NOT?: DepartmentScalarWhereWithAggregatesInput | DepartmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Department"> | string
    shortName?: StringWithAggregatesFilter<"Department"> | string
    tujuan?: StringWithAggregatesFilter<"Department"> | string
    printSheetName?: StringWithAggregatesFilter<"Department"> | string
    isActive?: BoolWithAggregatesFilter<"Department"> | boolean
  }

  export type RoleDefinitionWhereInput = {
    AND?: RoleDefinitionWhereInput | RoleDefinitionWhereInput[]
    OR?: RoleDefinitionWhereInput[]
    NOT?: RoleDefinitionWhereInput | RoleDefinitionWhereInput[]
    id?: StringFilter<"RoleDefinition"> | string
    name?: StringFilter<"RoleDefinition"> | string
    value?: StringFilter<"RoleDefinition"> | string
    isSystem?: BoolFilter<"RoleDefinition"> | boolean
    createdAt?: DateTimeFilter<"RoleDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"RoleDefinition"> | Date | string
  }

  export type RoleDefinitionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    value?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleDefinitionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    value?: string
    AND?: RoleDefinitionWhereInput | RoleDefinitionWhereInput[]
    OR?: RoleDefinitionWhereInput[]
    NOT?: RoleDefinitionWhereInput | RoleDefinitionWhereInput[]
    name?: StringFilter<"RoleDefinition"> | string
    isSystem?: BoolFilter<"RoleDefinition"> | boolean
    createdAt?: DateTimeFilter<"RoleDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"RoleDefinition"> | Date | string
  }, "id" | "value">

  export type RoleDefinitionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    value?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RoleDefinitionCountOrderByAggregateInput
    _max?: RoleDefinitionMaxOrderByAggregateInput
    _min?: RoleDefinitionMinOrderByAggregateInput
  }

  export type RoleDefinitionScalarWhereWithAggregatesInput = {
    AND?: RoleDefinitionScalarWhereWithAggregatesInput | RoleDefinitionScalarWhereWithAggregatesInput[]
    OR?: RoleDefinitionScalarWhereWithAggregatesInput[]
    NOT?: RoleDefinitionScalarWhereWithAggregatesInput | RoleDefinitionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoleDefinition"> | string
    name?: StringWithAggregatesFilter<"RoleDefinition"> | string
    value?: StringWithAggregatesFilter<"RoleDefinition"> | string
    isSystem?: BoolWithAggregatesFilter<"RoleDefinition"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"RoleDefinition"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RoleDefinition"> | Date | string
  }

  export type DepartmentColumnWhereInput = {
    AND?: DepartmentColumnWhereInput | DepartmentColumnWhereInput[]
    OR?: DepartmentColumnWhereInput[]
    NOT?: DepartmentColumnWhereInput | DepartmentColumnWhereInput[]
    id?: StringFilter<"DepartmentColumn"> | string
    departmentId?: StringFilter<"DepartmentColumn"> | string
    label?: StringFilter<"DepartmentColumn"> | string
    dataType?: StringFilter<"DepartmentColumn"> | string
    defaultValue?: StringFilter<"DepartmentColumn"> | string
    isDefault?: BoolFilter<"DepartmentColumn"> | boolean
    isRequired?: BoolFilter<"DepartmentColumn"> | boolean
    showInDataSurat?: BoolFilter<"DepartmentColumn"> | boolean
    showInPrint?: BoolFilter<"DepartmentColumn"> | boolean
    sortOrder?: IntFilter<"DepartmentColumn"> | number
    displayOrder?: IntFilter<"DepartmentColumn"> | number
    createdAt?: DateTimeFilter<"DepartmentColumn"> | Date | string
    updatedAt?: DateTimeFilter<"DepartmentColumn"> | Date | string
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
  }

  export type DepartmentColumnOrderByWithRelationInput = {
    id?: SortOrder
    departmentId?: SortOrder
    label?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    isDefault?: SortOrder
    isRequired?: SortOrder
    showInDataSurat?: SortOrder
    showInPrint?: SortOrder
    sortOrder?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    department?: DepartmentOrderByWithRelationInput
  }

  export type DepartmentColumnWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DepartmentColumnWhereInput | DepartmentColumnWhereInput[]
    OR?: DepartmentColumnWhereInput[]
    NOT?: DepartmentColumnWhereInput | DepartmentColumnWhereInput[]
    departmentId?: StringFilter<"DepartmentColumn"> | string
    label?: StringFilter<"DepartmentColumn"> | string
    dataType?: StringFilter<"DepartmentColumn"> | string
    defaultValue?: StringFilter<"DepartmentColumn"> | string
    isDefault?: BoolFilter<"DepartmentColumn"> | boolean
    isRequired?: BoolFilter<"DepartmentColumn"> | boolean
    showInDataSurat?: BoolFilter<"DepartmentColumn"> | boolean
    showInPrint?: BoolFilter<"DepartmentColumn"> | boolean
    sortOrder?: IntFilter<"DepartmentColumn"> | number
    displayOrder?: IntFilter<"DepartmentColumn"> | number
    createdAt?: DateTimeFilter<"DepartmentColumn"> | Date | string
    updatedAt?: DateTimeFilter<"DepartmentColumn"> | Date | string
    department?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
  }, "id">

  export type DepartmentColumnOrderByWithAggregationInput = {
    id?: SortOrder
    departmentId?: SortOrder
    label?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    isDefault?: SortOrder
    isRequired?: SortOrder
    showInDataSurat?: SortOrder
    showInPrint?: SortOrder
    sortOrder?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DepartmentColumnCountOrderByAggregateInput
    _avg?: DepartmentColumnAvgOrderByAggregateInput
    _max?: DepartmentColumnMaxOrderByAggregateInput
    _min?: DepartmentColumnMinOrderByAggregateInput
    _sum?: DepartmentColumnSumOrderByAggregateInput
  }

  export type DepartmentColumnScalarWhereWithAggregatesInput = {
    AND?: DepartmentColumnScalarWhereWithAggregatesInput | DepartmentColumnScalarWhereWithAggregatesInput[]
    OR?: DepartmentColumnScalarWhereWithAggregatesInput[]
    NOT?: DepartmentColumnScalarWhereWithAggregatesInput | DepartmentColumnScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DepartmentColumn"> | string
    departmentId?: StringWithAggregatesFilter<"DepartmentColumn"> | string
    label?: StringWithAggregatesFilter<"DepartmentColumn"> | string
    dataType?: StringWithAggregatesFilter<"DepartmentColumn"> | string
    defaultValue?: StringWithAggregatesFilter<"DepartmentColumn"> | string
    isDefault?: BoolWithAggregatesFilter<"DepartmentColumn"> | boolean
    isRequired?: BoolWithAggregatesFilter<"DepartmentColumn"> | boolean
    showInDataSurat?: BoolWithAggregatesFilter<"DepartmentColumn"> | boolean
    showInPrint?: BoolWithAggregatesFilter<"DepartmentColumn"> | boolean
    sortOrder?: IntWithAggregatesFilter<"DepartmentColumn"> | number
    displayOrder?: IntWithAggregatesFilter<"DepartmentColumn"> | number
    createdAt?: DateTimeWithAggregatesFilter<"DepartmentColumn"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DepartmentColumn"> | Date | string
  }

  export type RegisterSuratWhereInput = {
    AND?: RegisterSuratWhereInput | RegisterSuratWhereInput[]
    OR?: RegisterSuratWhereInput[]
    NOT?: RegisterSuratWhereInput | RegisterSuratWhereInput[]
    id?: IntFilter<"RegisterSurat"> | number
    nomor?: StringFilter<"RegisterSurat"> | string
    deptId?: StringFilter<"RegisterSurat"> | string
    tanggalTerima?: DateTimeFilter<"RegisterSurat"> | Date | string
    asalSurat?: StringFilter<"RegisterSurat"> | string
    tujuan?: StringFilter<"RegisterSurat"> | string
    createdAt?: DateTimeFilter<"RegisterSurat"> | Date | string
    updatedAt?: DateTimeFilter<"RegisterSurat"> | Date | string
    dept?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    detailSurat?: DetailSuratListRelationFilter
  }

  export type RegisterSuratOrderByWithRelationInput = {
    id?: SortOrder
    nomor?: SortOrder
    deptId?: SortOrder
    tanggalTerima?: SortOrder
    asalSurat?: SortOrder
    tujuan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    dept?: DepartmentOrderByWithRelationInput
    detailSurat?: DetailSuratOrderByRelationAggregateInput
  }

  export type RegisterSuratWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RegisterSuratWhereInput | RegisterSuratWhereInput[]
    OR?: RegisterSuratWhereInput[]
    NOT?: RegisterSuratWhereInput | RegisterSuratWhereInput[]
    nomor?: StringFilter<"RegisterSurat"> | string
    deptId?: StringFilter<"RegisterSurat"> | string
    tanggalTerima?: DateTimeFilter<"RegisterSurat"> | Date | string
    asalSurat?: StringFilter<"RegisterSurat"> | string
    tujuan?: StringFilter<"RegisterSurat"> | string
    createdAt?: DateTimeFilter<"RegisterSurat"> | Date | string
    updatedAt?: DateTimeFilter<"RegisterSurat"> | Date | string
    dept?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
    detailSurat?: DetailSuratListRelationFilter
  }, "id">

  export type RegisterSuratOrderByWithAggregationInput = {
    id?: SortOrder
    nomor?: SortOrder
    deptId?: SortOrder
    tanggalTerima?: SortOrder
    asalSurat?: SortOrder
    tujuan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RegisterSuratCountOrderByAggregateInput
    _avg?: RegisterSuratAvgOrderByAggregateInput
    _max?: RegisterSuratMaxOrderByAggregateInput
    _min?: RegisterSuratMinOrderByAggregateInput
    _sum?: RegisterSuratSumOrderByAggregateInput
  }

  export type RegisterSuratScalarWhereWithAggregatesInput = {
    AND?: RegisterSuratScalarWhereWithAggregatesInput | RegisterSuratScalarWhereWithAggregatesInput[]
    OR?: RegisterSuratScalarWhereWithAggregatesInput[]
    NOT?: RegisterSuratScalarWhereWithAggregatesInput | RegisterSuratScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RegisterSurat"> | number
    nomor?: StringWithAggregatesFilter<"RegisterSurat"> | string
    deptId?: StringWithAggregatesFilter<"RegisterSurat"> | string
    tanggalTerima?: DateTimeWithAggregatesFilter<"RegisterSurat"> | Date | string
    asalSurat?: StringWithAggregatesFilter<"RegisterSurat"> | string
    tujuan?: StringWithAggregatesFilter<"RegisterSurat"> | string
    createdAt?: DateTimeWithAggregatesFilter<"RegisterSurat"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RegisterSurat"> | Date | string
  }

  export type DetailSuratWhereInput = {
    AND?: DetailSuratWhereInput | DetailSuratWhereInput[]
    OR?: DetailSuratWhereInput[]
    NOT?: DetailSuratWhereInput | DetailSuratWhereInput[]
    id?: IntFilter<"DetailSurat"> | number
    registerId?: IntFilter<"DetailSurat"> | number
    perihal?: StringFilter<"DetailSurat"> | string
    noSurat?: StringNullableFilter<"DetailSurat"> | string | null
    lampiran?: StringNullableFilter<"DetailSurat"> | string | null
    tanggalSurat?: DateTimeFilter<"DetailSurat"> | Date | string
    tujuan?: StringNullableFilter<"DetailSurat"> | string | null
    customFields?: JsonFilter<"DetailSurat">
    createdAt?: DateTimeFilter<"DetailSurat"> | Date | string
    updatedAt?: DateTimeFilter<"DetailSurat"> | Date | string
    register?: XOR<RegisterSuratScalarRelationFilter, RegisterSuratWhereInput>
  }

  export type DetailSuratOrderByWithRelationInput = {
    id?: SortOrder
    registerId?: SortOrder
    perihal?: SortOrder
    noSurat?: SortOrderInput | SortOrder
    lampiran?: SortOrderInput | SortOrder
    tanggalSurat?: SortOrder
    tujuan?: SortOrderInput | SortOrder
    customFields?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    register?: RegisterSuratOrderByWithRelationInput
  }

  export type DetailSuratWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DetailSuratWhereInput | DetailSuratWhereInput[]
    OR?: DetailSuratWhereInput[]
    NOT?: DetailSuratWhereInput | DetailSuratWhereInput[]
    registerId?: IntFilter<"DetailSurat"> | number
    perihal?: StringFilter<"DetailSurat"> | string
    noSurat?: StringNullableFilter<"DetailSurat"> | string | null
    lampiran?: StringNullableFilter<"DetailSurat"> | string | null
    tanggalSurat?: DateTimeFilter<"DetailSurat"> | Date | string
    tujuan?: StringNullableFilter<"DetailSurat"> | string | null
    customFields?: JsonFilter<"DetailSurat">
    createdAt?: DateTimeFilter<"DetailSurat"> | Date | string
    updatedAt?: DateTimeFilter<"DetailSurat"> | Date | string
    register?: XOR<RegisterSuratScalarRelationFilter, RegisterSuratWhereInput>
  }, "id">

  export type DetailSuratOrderByWithAggregationInput = {
    id?: SortOrder
    registerId?: SortOrder
    perihal?: SortOrder
    noSurat?: SortOrderInput | SortOrder
    lampiran?: SortOrderInput | SortOrder
    tanggalSurat?: SortOrder
    tujuan?: SortOrderInput | SortOrder
    customFields?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DetailSuratCountOrderByAggregateInput
    _avg?: DetailSuratAvgOrderByAggregateInput
    _max?: DetailSuratMaxOrderByAggregateInput
    _min?: DetailSuratMinOrderByAggregateInput
    _sum?: DetailSuratSumOrderByAggregateInput
  }

  export type DetailSuratScalarWhereWithAggregatesInput = {
    AND?: DetailSuratScalarWhereWithAggregatesInput | DetailSuratScalarWhereWithAggregatesInput[]
    OR?: DetailSuratScalarWhereWithAggregatesInput[]
    NOT?: DetailSuratScalarWhereWithAggregatesInput | DetailSuratScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DetailSurat"> | number
    registerId?: IntWithAggregatesFilter<"DetailSurat"> | number
    perihal?: StringWithAggregatesFilter<"DetailSurat"> | string
    noSurat?: StringNullableWithAggregatesFilter<"DetailSurat"> | string | null
    lampiran?: StringNullableWithAggregatesFilter<"DetailSurat"> | string | null
    tanggalSurat?: DateTimeWithAggregatesFilter<"DetailSurat"> | Date | string
    tujuan?: StringNullableWithAggregatesFilter<"DetailSurat"> | string | null
    customFields?: JsonWithAggregatesFilter<"DetailSurat">
    createdAt?: DateTimeWithAggregatesFilter<"DetailSurat"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DetailSurat"> | Date | string
  }

  export type NomorCounterWhereInput = {
    AND?: NomorCounterWhereInput | NomorCounterWhereInput[]
    OR?: NomorCounterWhereInput[]
    NOT?: NomorCounterWhereInput | NomorCounterWhereInput[]
    deptId?: StringFilter<"NomorCounter"> | string
    year?: IntFilter<"NomorCounter"> | number
    counter?: IntFilter<"NomorCounter"> | number
    dept?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
  }

  export type NomorCounterOrderByWithRelationInput = {
    deptId?: SortOrder
    year?: SortOrder
    counter?: SortOrder
    dept?: DepartmentOrderByWithRelationInput
  }

  export type NomorCounterWhereUniqueInput = Prisma.AtLeast<{
    deptId_year?: NomorCounterDeptIdYearCompoundUniqueInput
    AND?: NomorCounterWhereInput | NomorCounterWhereInput[]
    OR?: NomorCounterWhereInput[]
    NOT?: NomorCounterWhereInput | NomorCounterWhereInput[]
    deptId?: StringFilter<"NomorCounter"> | string
    year?: IntFilter<"NomorCounter"> | number
    counter?: IntFilter<"NomorCounter"> | number
    dept?: XOR<DepartmentScalarRelationFilter, DepartmentWhereInput>
  }, "deptId_year">

  export type NomorCounterOrderByWithAggregationInput = {
    deptId?: SortOrder
    year?: SortOrder
    counter?: SortOrder
    _count?: NomorCounterCountOrderByAggregateInput
    _avg?: NomorCounterAvgOrderByAggregateInput
    _max?: NomorCounterMaxOrderByAggregateInput
    _min?: NomorCounterMinOrderByAggregateInput
    _sum?: NomorCounterSumOrderByAggregateInput
  }

  export type NomorCounterScalarWhereWithAggregatesInput = {
    AND?: NomorCounterScalarWhereWithAggregatesInput | NomorCounterScalarWhereWithAggregatesInput[]
    OR?: NomorCounterScalarWhereWithAggregatesInput[]
    NOT?: NomorCounterScalarWhereWithAggregatesInput | NomorCounterScalarWhereWithAggregatesInput[]
    deptId?: StringWithAggregatesFilter<"NomorCounter"> | string
    year?: IntWithAggregatesFilter<"NomorCounter"> | number
    counter?: IntWithAggregatesFilter<"NomorCounter"> | number
  }

  export type TrackSheetWhereInput = {
    AND?: TrackSheetWhereInput | TrackSheetWhereInput[]
    OR?: TrackSheetWhereInput[]
    NOT?: TrackSheetWhereInput | TrackSheetWhereInput[]
    id?: StringFilter<"TrackSheet"> | string
    name?: StringFilter<"TrackSheet"> | string
    sortOrder?: IntFilter<"TrackSheet"> | number
    createdAt?: DateTimeFilter<"TrackSheet"> | Date | string
    updatedAt?: DateTimeFilter<"TrackSheet"> | Date | string
    hiddenAt?: DateTimeNullableFilter<"TrackSheet"> | Date | string | null
    categories?: TrackCategoryListRelationFilter
    fields?: TrackFieldListRelationFilter
    records?: TrackRecordListRelationFilter
  }

  export type TrackSheetOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hiddenAt?: SortOrderInput | SortOrder
    categories?: TrackCategoryOrderByRelationAggregateInput
    fields?: TrackFieldOrderByRelationAggregateInput
    records?: TrackRecordOrderByRelationAggregateInput
  }

  export type TrackSheetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrackSheetWhereInput | TrackSheetWhereInput[]
    OR?: TrackSheetWhereInput[]
    NOT?: TrackSheetWhereInput | TrackSheetWhereInput[]
    name?: StringFilter<"TrackSheet"> | string
    sortOrder?: IntFilter<"TrackSheet"> | number
    createdAt?: DateTimeFilter<"TrackSheet"> | Date | string
    updatedAt?: DateTimeFilter<"TrackSheet"> | Date | string
    hiddenAt?: DateTimeNullableFilter<"TrackSheet"> | Date | string | null
    categories?: TrackCategoryListRelationFilter
    fields?: TrackFieldListRelationFilter
    records?: TrackRecordListRelationFilter
  }, "id">

  export type TrackSheetOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hiddenAt?: SortOrderInput | SortOrder
    _count?: TrackSheetCountOrderByAggregateInput
    _avg?: TrackSheetAvgOrderByAggregateInput
    _max?: TrackSheetMaxOrderByAggregateInput
    _min?: TrackSheetMinOrderByAggregateInput
    _sum?: TrackSheetSumOrderByAggregateInput
  }

  export type TrackSheetScalarWhereWithAggregatesInput = {
    AND?: TrackSheetScalarWhereWithAggregatesInput | TrackSheetScalarWhereWithAggregatesInput[]
    OR?: TrackSheetScalarWhereWithAggregatesInput[]
    NOT?: TrackSheetScalarWhereWithAggregatesInput | TrackSheetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrackSheet"> | string
    name?: StringWithAggregatesFilter<"TrackSheet"> | string
    sortOrder?: IntWithAggregatesFilter<"TrackSheet"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TrackSheet"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrackSheet"> | Date | string
    hiddenAt?: DateTimeNullableWithAggregatesFilter<"TrackSheet"> | Date | string | null
  }

  export type TrackCategoryWhereInput = {
    AND?: TrackCategoryWhereInput | TrackCategoryWhereInput[]
    OR?: TrackCategoryWhereInput[]
    NOT?: TrackCategoryWhereInput | TrackCategoryWhereInput[]
    id?: StringFilter<"TrackCategory"> | string
    sheetId?: StringFilter<"TrackCategory"> | string
    name?: StringFilter<"TrackCategory"> | string
    color?: StringFilter<"TrackCategory"> | string
    fillRequired?: BoolFilter<"TrackCategory"> | boolean
    addRoleValues?: StringFilter<"TrackCategory"> | string
    editRoleValues?: StringFilter<"TrackCategory"> | string
    deleteRoleValues?: StringFilter<"TrackCategory"> | string
    sortOrder?: IntFilter<"TrackCategory"> | number
    createdAt?: DateTimeFilter<"TrackCategory"> | Date | string
    updatedAt?: DateTimeFilter<"TrackCategory"> | Date | string
    sheet?: XOR<TrackSheetScalarRelationFilter, TrackSheetWhereInput>
  }

  export type TrackCategoryOrderByWithRelationInput = {
    id?: SortOrder
    sheetId?: SortOrder
    name?: SortOrder
    color?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sheet?: TrackSheetOrderByWithRelationInput
  }

  export type TrackCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrackCategoryWhereInput | TrackCategoryWhereInput[]
    OR?: TrackCategoryWhereInput[]
    NOT?: TrackCategoryWhereInput | TrackCategoryWhereInput[]
    sheetId?: StringFilter<"TrackCategory"> | string
    name?: StringFilter<"TrackCategory"> | string
    color?: StringFilter<"TrackCategory"> | string
    fillRequired?: BoolFilter<"TrackCategory"> | boolean
    addRoleValues?: StringFilter<"TrackCategory"> | string
    editRoleValues?: StringFilter<"TrackCategory"> | string
    deleteRoleValues?: StringFilter<"TrackCategory"> | string
    sortOrder?: IntFilter<"TrackCategory"> | number
    createdAt?: DateTimeFilter<"TrackCategory"> | Date | string
    updatedAt?: DateTimeFilter<"TrackCategory"> | Date | string
    sheet?: XOR<TrackSheetScalarRelationFilter, TrackSheetWhereInput>
  }, "id">

  export type TrackCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    sheetId?: SortOrder
    name?: SortOrder
    color?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrackCategoryCountOrderByAggregateInput
    _avg?: TrackCategoryAvgOrderByAggregateInput
    _max?: TrackCategoryMaxOrderByAggregateInput
    _min?: TrackCategoryMinOrderByAggregateInput
    _sum?: TrackCategorySumOrderByAggregateInput
  }

  export type TrackCategoryScalarWhereWithAggregatesInput = {
    AND?: TrackCategoryScalarWhereWithAggregatesInput | TrackCategoryScalarWhereWithAggregatesInput[]
    OR?: TrackCategoryScalarWhereWithAggregatesInput[]
    NOT?: TrackCategoryScalarWhereWithAggregatesInput | TrackCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrackCategory"> | string
    sheetId?: StringWithAggregatesFilter<"TrackCategory"> | string
    name?: StringWithAggregatesFilter<"TrackCategory"> | string
    color?: StringWithAggregatesFilter<"TrackCategory"> | string
    fillRequired?: BoolWithAggregatesFilter<"TrackCategory"> | boolean
    addRoleValues?: StringWithAggregatesFilter<"TrackCategory"> | string
    editRoleValues?: StringWithAggregatesFilter<"TrackCategory"> | string
    deleteRoleValues?: StringWithAggregatesFilter<"TrackCategory"> | string
    sortOrder?: IntWithAggregatesFilter<"TrackCategory"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TrackCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrackCategory"> | Date | string
  }

  export type TrackFieldWhereInput = {
    AND?: TrackFieldWhereInput | TrackFieldWhereInput[]
    OR?: TrackFieldWhereInput[]
    NOT?: TrackFieldWhereInput | TrackFieldWhereInput[]
    id?: StringFilter<"TrackField"> | string
    sheetId?: StringFilter<"TrackField"> | string
    categoryId?: StringNullableFilter<"TrackField"> | string | null
    category?: StringFilter<"TrackField"> | string
    categoryColor?: StringFilter<"TrackField"> | string
    region?: StringFilter<"TrackField"> | string
    columnName?: StringFilter<"TrackField"> | string
    dataType?: StringFilter<"TrackField"> | string
    defaultValue?: StringFilter<"TrackField"> | string
    categoryOptions?: StringFilter<"TrackField"> | string
    fillRequired?: BoolFilter<"TrackField"> | boolean
    addRoleValues?: StringFilter<"TrackField"> | string
    editRoleValues?: StringFilter<"TrackField"> | string
    deleteRoleValues?: StringFilter<"TrackField"> | string
    sortOrder?: IntFilter<"TrackField"> | number
    createdAt?: DateTimeFilter<"TrackField"> | Date | string
    updatedAt?: DateTimeFilter<"TrackField"> | Date | string
    sheet?: XOR<TrackSheetScalarRelationFilter, TrackSheetWhereInput>
  }

  export type TrackFieldOrderByWithRelationInput = {
    id?: SortOrder
    sheetId?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    category?: SortOrder
    categoryColor?: SortOrder
    region?: SortOrder
    columnName?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    categoryOptions?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sheet?: TrackSheetOrderByWithRelationInput
  }

  export type TrackFieldWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrackFieldWhereInput | TrackFieldWhereInput[]
    OR?: TrackFieldWhereInput[]
    NOT?: TrackFieldWhereInput | TrackFieldWhereInput[]
    sheetId?: StringFilter<"TrackField"> | string
    categoryId?: StringNullableFilter<"TrackField"> | string | null
    category?: StringFilter<"TrackField"> | string
    categoryColor?: StringFilter<"TrackField"> | string
    region?: StringFilter<"TrackField"> | string
    columnName?: StringFilter<"TrackField"> | string
    dataType?: StringFilter<"TrackField"> | string
    defaultValue?: StringFilter<"TrackField"> | string
    categoryOptions?: StringFilter<"TrackField"> | string
    fillRequired?: BoolFilter<"TrackField"> | boolean
    addRoleValues?: StringFilter<"TrackField"> | string
    editRoleValues?: StringFilter<"TrackField"> | string
    deleteRoleValues?: StringFilter<"TrackField"> | string
    sortOrder?: IntFilter<"TrackField"> | number
    createdAt?: DateTimeFilter<"TrackField"> | Date | string
    updatedAt?: DateTimeFilter<"TrackField"> | Date | string
    sheet?: XOR<TrackSheetScalarRelationFilter, TrackSheetWhereInput>
  }, "id">

  export type TrackFieldOrderByWithAggregationInput = {
    id?: SortOrder
    sheetId?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    category?: SortOrder
    categoryColor?: SortOrder
    region?: SortOrder
    columnName?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    categoryOptions?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrackFieldCountOrderByAggregateInput
    _avg?: TrackFieldAvgOrderByAggregateInput
    _max?: TrackFieldMaxOrderByAggregateInput
    _min?: TrackFieldMinOrderByAggregateInput
    _sum?: TrackFieldSumOrderByAggregateInput
  }

  export type TrackFieldScalarWhereWithAggregatesInput = {
    AND?: TrackFieldScalarWhereWithAggregatesInput | TrackFieldScalarWhereWithAggregatesInput[]
    OR?: TrackFieldScalarWhereWithAggregatesInput[]
    NOT?: TrackFieldScalarWhereWithAggregatesInput | TrackFieldScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrackField"> | string
    sheetId?: StringWithAggregatesFilter<"TrackField"> | string
    categoryId?: StringNullableWithAggregatesFilter<"TrackField"> | string | null
    category?: StringWithAggregatesFilter<"TrackField"> | string
    categoryColor?: StringWithAggregatesFilter<"TrackField"> | string
    region?: StringWithAggregatesFilter<"TrackField"> | string
    columnName?: StringWithAggregatesFilter<"TrackField"> | string
    dataType?: StringWithAggregatesFilter<"TrackField"> | string
    defaultValue?: StringWithAggregatesFilter<"TrackField"> | string
    categoryOptions?: StringWithAggregatesFilter<"TrackField"> | string
    fillRequired?: BoolWithAggregatesFilter<"TrackField"> | boolean
    addRoleValues?: StringWithAggregatesFilter<"TrackField"> | string
    editRoleValues?: StringWithAggregatesFilter<"TrackField"> | string
    deleteRoleValues?: StringWithAggregatesFilter<"TrackField"> | string
    sortOrder?: IntWithAggregatesFilter<"TrackField"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TrackField"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrackField"> | Date | string
  }

  export type TrackRecordWhereInput = {
    AND?: TrackRecordWhereInput | TrackRecordWhereInput[]
    OR?: TrackRecordWhereInput[]
    NOT?: TrackRecordWhereInput | TrackRecordWhereInput[]
    id?: StringFilter<"TrackRecord"> | string
    sheetId?: StringFilter<"TrackRecord"> | string
    sequenceNo?: IntFilter<"TrackRecord"> | number
    values?: JsonFilter<"TrackRecord">
    createdById?: StringNullableFilter<"TrackRecord"> | string | null
    createdAt?: DateTimeFilter<"TrackRecord"> | Date | string
    updatedAt?: DateTimeFilter<"TrackRecord"> | Date | string
    sheet?: XOR<TrackSheetScalarRelationFilter, TrackSheetWhereInput>
  }

  export type TrackRecordOrderByWithRelationInput = {
    id?: SortOrder
    sheetId?: SortOrder
    sequenceNo?: SortOrder
    values?: SortOrder
    createdById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sheet?: TrackSheetOrderByWithRelationInput
  }

  export type TrackRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TrackRecordWhereInput | TrackRecordWhereInput[]
    OR?: TrackRecordWhereInput[]
    NOT?: TrackRecordWhereInput | TrackRecordWhereInput[]
    sheetId?: StringFilter<"TrackRecord"> | string
    sequenceNo?: IntFilter<"TrackRecord"> | number
    values?: JsonFilter<"TrackRecord">
    createdById?: StringNullableFilter<"TrackRecord"> | string | null
    createdAt?: DateTimeFilter<"TrackRecord"> | Date | string
    updatedAt?: DateTimeFilter<"TrackRecord"> | Date | string
    sheet?: XOR<TrackSheetScalarRelationFilter, TrackSheetWhereInput>
  }, "id">

  export type TrackRecordOrderByWithAggregationInput = {
    id?: SortOrder
    sheetId?: SortOrder
    sequenceNo?: SortOrder
    values?: SortOrder
    createdById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrackRecordCountOrderByAggregateInput
    _avg?: TrackRecordAvgOrderByAggregateInput
    _max?: TrackRecordMaxOrderByAggregateInput
    _min?: TrackRecordMinOrderByAggregateInput
    _sum?: TrackRecordSumOrderByAggregateInput
  }

  export type TrackRecordScalarWhereWithAggregatesInput = {
    AND?: TrackRecordScalarWhereWithAggregatesInput | TrackRecordScalarWhereWithAggregatesInput[]
    OR?: TrackRecordScalarWhereWithAggregatesInput[]
    NOT?: TrackRecordScalarWhereWithAggregatesInput | TrackRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrackRecord"> | string
    sheetId?: StringWithAggregatesFilter<"TrackRecord"> | string
    sequenceNo?: IntWithAggregatesFilter<"TrackRecord"> | number
    values?: JsonWithAggregatesFilter<"TrackRecord">
    createdById?: StringNullableWithAggregatesFilter<"TrackRecord"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrackRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrackRecord"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    permissions?: UserPermissionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    permissions?: UserPermissionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    permissions?: UserPermissionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    permissions?: UserPermissionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type SessionCreateManyInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserPermissionCreateInput = {
    id?: string
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
    user: UserCreateNestedOneWithoutPermissionsInput
  }

  export type UserPermissionUncheckedCreateInput = {
    id?: string
    userId: string
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
  }

  export type UserPermissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    canViewDataSurat?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    canPrint?: BoolFieldUpdateOperationsInput | boolean
    canTrack?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type UserPermissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    canViewDataSurat?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    canPrint?: BoolFieldUpdateOperationsInput | boolean
    canTrack?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserPermissionCreateManyInput = {
    id?: string
    userId: string
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
  }

  export type UserPermissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    canViewDataSurat?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    canPrint?: BoolFieldUpdateOperationsInput | boolean
    canTrack?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserPermissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    canViewDataSurat?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    canPrint?: BoolFieldUpdateOperationsInput | boolean
    canTrack?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DepartmentCreateInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
    registerSurat?: RegisterSuratCreateNestedManyWithoutDeptInput
    nomorCounter?: NomorCounterCreateNestedManyWithoutDeptInput
    columns?: DepartmentColumnCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
    registerSurat?: RegisterSuratUncheckedCreateNestedManyWithoutDeptInput
    nomorCounter?: NomorCounterUncheckedCreateNestedManyWithoutDeptInput
    columns?: DepartmentColumnUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registerSurat?: RegisterSuratUpdateManyWithoutDeptNestedInput
    nomorCounter?: NomorCounterUpdateManyWithoutDeptNestedInput
    columns?: DepartmentColumnUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registerSurat?: RegisterSuratUncheckedUpdateManyWithoutDeptNestedInput
    nomorCounter?: NomorCounterUncheckedUpdateManyWithoutDeptNestedInput
    columns?: DepartmentColumnUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentCreateManyInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
  }

  export type DepartmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DepartmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RoleDefinitionCreateInput = {
    id?: string
    name: string
    value: string
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleDefinitionUncheckedCreateInput = {
    id?: string
    name: string
    value: string
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleDefinitionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleDefinitionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleDefinitionCreateManyInput = {
    id?: string
    name: string
    value: string
    isSystem?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoleDefinitionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleDefinitionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    isSystem?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentColumnCreateInput = {
    id: string
    label: string
    dataType: string
    defaultValue?: string
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: number
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    department: DepartmentCreateNestedOneWithoutColumnsInput
  }

  export type DepartmentColumnUncheckedCreateInput = {
    id: string
    departmentId: string
    label: string
    dataType: string
    defaultValue?: string
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: number
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentColumnUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    showInDataSurat?: BoolFieldUpdateOperationsInput | boolean
    showInPrint?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    department?: DepartmentUpdateOneRequiredWithoutColumnsNestedInput
  }

  export type DepartmentColumnUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    departmentId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    showInDataSurat?: BoolFieldUpdateOperationsInput | boolean
    showInPrint?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentColumnCreateManyInput = {
    id: string
    departmentId: string
    label: string
    dataType: string
    defaultValue?: string
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: number
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentColumnUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    showInDataSurat?: BoolFieldUpdateOperationsInput | boolean
    showInPrint?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentColumnUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    departmentId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    showInDataSurat?: BoolFieldUpdateOperationsInput | boolean
    showInPrint?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegisterSuratCreateInput = {
    nomor: string
    tanggalTerima: Date | string
    asalSurat: string
    tujuan?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    dept: DepartmentCreateNestedOneWithoutRegisterSuratInput
    detailSurat?: DetailSuratCreateNestedManyWithoutRegisterInput
  }

  export type RegisterSuratUncheckedCreateInput = {
    id?: number
    nomor: string
    deptId: string
    tanggalTerima: Date | string
    asalSurat: string
    tujuan?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    detailSurat?: DetailSuratUncheckedCreateNestedManyWithoutRegisterInput
  }

  export type RegisterSuratUpdateInput = {
    nomor?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dept?: DepartmentUpdateOneRequiredWithoutRegisterSuratNestedInput
    detailSurat?: DetailSuratUpdateManyWithoutRegisterNestedInput
  }

  export type RegisterSuratUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nomor?: StringFieldUpdateOperationsInput | string
    deptId?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detailSurat?: DetailSuratUncheckedUpdateManyWithoutRegisterNestedInput
  }

  export type RegisterSuratCreateManyInput = {
    id?: number
    nomor: string
    deptId: string
    tanggalTerima: Date | string
    asalSurat: string
    tujuan?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RegisterSuratUpdateManyMutationInput = {
    nomor?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegisterSuratUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nomor?: StringFieldUpdateOperationsInput | string
    deptId?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailSuratCreateInput = {
    perihal: string
    noSurat?: string | null
    lampiran?: string | null
    tanggalSurat: Date | string
    tujuan?: string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    register: RegisterSuratCreateNestedOneWithoutDetailSuratInput
  }

  export type DetailSuratUncheckedCreateInput = {
    id?: number
    registerId: number
    perihal: string
    noSurat?: string | null
    lampiran?: string | null
    tanggalSurat: Date | string
    tujuan?: string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DetailSuratUpdateInput = {
    perihal?: StringFieldUpdateOperationsInput | string
    noSurat?: NullableStringFieldUpdateOperationsInput | string | null
    lampiran?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalSurat?: DateTimeFieldUpdateOperationsInput | Date | string
    tujuan?: NullableStringFieldUpdateOperationsInput | string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    register?: RegisterSuratUpdateOneRequiredWithoutDetailSuratNestedInput
  }

  export type DetailSuratUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    registerId?: IntFieldUpdateOperationsInput | number
    perihal?: StringFieldUpdateOperationsInput | string
    noSurat?: NullableStringFieldUpdateOperationsInput | string | null
    lampiran?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalSurat?: DateTimeFieldUpdateOperationsInput | Date | string
    tujuan?: NullableStringFieldUpdateOperationsInput | string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailSuratCreateManyInput = {
    id?: number
    registerId: number
    perihal: string
    noSurat?: string | null
    lampiran?: string | null
    tanggalSurat: Date | string
    tujuan?: string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DetailSuratUpdateManyMutationInput = {
    perihal?: StringFieldUpdateOperationsInput | string
    noSurat?: NullableStringFieldUpdateOperationsInput | string | null
    lampiran?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalSurat?: DateTimeFieldUpdateOperationsInput | Date | string
    tujuan?: NullableStringFieldUpdateOperationsInput | string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailSuratUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    registerId?: IntFieldUpdateOperationsInput | number
    perihal?: StringFieldUpdateOperationsInput | string
    noSurat?: NullableStringFieldUpdateOperationsInput | string | null
    lampiran?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalSurat?: DateTimeFieldUpdateOperationsInput | Date | string
    tujuan?: NullableStringFieldUpdateOperationsInput | string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NomorCounterCreateInput = {
    year: number
    counter?: number
    dept: DepartmentCreateNestedOneWithoutNomorCounterInput
  }

  export type NomorCounterUncheckedCreateInput = {
    deptId: string
    year: number
    counter?: number
  }

  export type NomorCounterUpdateInput = {
    year?: IntFieldUpdateOperationsInput | number
    counter?: IntFieldUpdateOperationsInput | number
    dept?: DepartmentUpdateOneRequiredWithoutNomorCounterNestedInput
  }

  export type NomorCounterUncheckedUpdateInput = {
    deptId?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    counter?: IntFieldUpdateOperationsInput | number
  }

  export type NomorCounterCreateManyInput = {
    deptId: string
    year: number
    counter?: number
  }

  export type NomorCounterUpdateManyMutationInput = {
    year?: IntFieldUpdateOperationsInput | number
    counter?: IntFieldUpdateOperationsInput | number
  }

  export type NomorCounterUncheckedUpdateManyInput = {
    deptId?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    counter?: IntFieldUpdateOperationsInput | number
  }

  export type TrackSheetCreateInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
    categories?: TrackCategoryCreateNestedManyWithoutSheetInput
    fields?: TrackFieldCreateNestedManyWithoutSheetInput
    records?: TrackRecordCreateNestedManyWithoutSheetInput
  }

  export type TrackSheetUncheckedCreateInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
    categories?: TrackCategoryUncheckedCreateNestedManyWithoutSheetInput
    fields?: TrackFieldUncheckedCreateNestedManyWithoutSheetInput
    records?: TrackRecordUncheckedCreateNestedManyWithoutSheetInput
  }

  export type TrackSheetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categories?: TrackCategoryUpdateManyWithoutSheetNestedInput
    fields?: TrackFieldUpdateManyWithoutSheetNestedInput
    records?: TrackRecordUpdateManyWithoutSheetNestedInput
  }

  export type TrackSheetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categories?: TrackCategoryUncheckedUpdateManyWithoutSheetNestedInput
    fields?: TrackFieldUncheckedUpdateManyWithoutSheetNestedInput
    records?: TrackRecordUncheckedUpdateManyWithoutSheetNestedInput
  }

  export type TrackSheetCreateManyInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
  }

  export type TrackSheetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TrackSheetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TrackCategoryCreateInput = {
    id: string
    name: string
    color?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sheet: TrackSheetCreateNestedOneWithoutCategoriesInput
  }

  export type TrackCategoryUncheckedCreateInput = {
    id: string
    sheetId: string
    name: string
    color?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sheet?: TrackSheetUpdateOneRequiredWithoutCategoriesNestedInput
  }

  export type TrackCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sheetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackCategoryCreateManyInput = {
    id: string
    sheetId: string
    name: string
    color?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sheetId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackFieldCreateInput = {
    id: string
    categoryId?: string | null
    category: string
    categoryColor?: string
    region: string
    columnName: string
    dataType: string
    defaultValue?: string
    categoryOptions?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sheet: TrackSheetCreateNestedOneWithoutFieldsInput
  }

  export type TrackFieldUncheckedCreateInput = {
    id: string
    sheetId: string
    categoryId?: string | null
    category: string
    categoryColor?: string
    region: string
    columnName: string
    dataType: string
    defaultValue?: string
    categoryOptions?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackFieldUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryColor?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    columnName?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    categoryOptions?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sheet?: TrackSheetUpdateOneRequiredWithoutFieldsNestedInput
  }

  export type TrackFieldUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sheetId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryColor?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    columnName?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    categoryOptions?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackFieldCreateManyInput = {
    id: string
    sheetId: string
    categoryId?: string | null
    category: string
    categoryColor?: string
    region: string
    columnName: string
    dataType: string
    defaultValue?: string
    categoryOptions?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackFieldUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryColor?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    columnName?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    categoryOptions?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackFieldUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sheetId?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryColor?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    columnName?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    categoryOptions?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackRecordCreateInput = {
    id: string
    sequenceNo?: number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sheet: TrackSheetCreateNestedOneWithoutRecordsInput
  }

  export type TrackRecordUncheckedCreateInput = {
    id: string
    sheetId: string
    sequenceNo?: number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNo?: IntFieldUpdateOperationsInput | number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sheet?: TrackSheetUpdateOneRequiredWithoutRecordsNestedInput
  }

  export type TrackRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sheetId?: StringFieldUpdateOperationsInput | string
    sequenceNo?: IntFieldUpdateOperationsInput | number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackRecordCreateManyInput = {
    id: string
    sheetId: string
    sequenceNo?: number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNo?: IntFieldUpdateOperationsInput | number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sheetId?: StringFieldUpdateOperationsInput | string
    sequenceNo?: IntFieldUpdateOperationsInput | number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type UserPermissionNullableScalarRelationFilter = {
    is?: UserPermissionWhereInput | null
    isNot?: UserPermissionWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    username?: SortOrder
    image?: SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    username?: SortOrder
    image?: SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    username?: SortOrder
    image?: SortOrder
    role?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserPermissionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    canViewDataSurat?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
    canPrint?: SortOrder
    canTrack?: SortOrder
  }

  export type UserPermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    canViewDataSurat?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
    canPrint?: SortOrder
    canTrack?: SortOrder
  }

  export type UserPermissionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    canViewDataSurat?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
    canPrint?: SortOrder
    canTrack?: SortOrder
  }

  export type RegisterSuratListRelationFilter = {
    every?: RegisterSuratWhereInput
    some?: RegisterSuratWhereInput
    none?: RegisterSuratWhereInput
  }

  export type NomorCounterListRelationFilter = {
    every?: NomorCounterWhereInput
    some?: NomorCounterWhereInput
    none?: NomorCounterWhereInput
  }

  export type DepartmentColumnListRelationFilter = {
    every?: DepartmentColumnWhereInput
    some?: DepartmentColumnWhereInput
    none?: DepartmentColumnWhereInput
  }

  export type RegisterSuratOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NomorCounterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentColumnOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DepartmentCountOrderByAggregateInput = {
    id?: SortOrder
    shortName?: SortOrder
    tujuan?: SortOrder
    printSheetName?: SortOrder
    isActive?: SortOrder
  }

  export type DepartmentMaxOrderByAggregateInput = {
    id?: SortOrder
    shortName?: SortOrder
    tujuan?: SortOrder
    printSheetName?: SortOrder
    isActive?: SortOrder
  }

  export type DepartmentMinOrderByAggregateInput = {
    id?: SortOrder
    shortName?: SortOrder
    tujuan?: SortOrder
    printSheetName?: SortOrder
    isActive?: SortOrder
  }

  export type RoleDefinitionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    value?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleDefinitionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    value?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoleDefinitionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    value?: SortOrder
    isSystem?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DepartmentScalarRelationFilter = {
    is?: DepartmentWhereInput
    isNot?: DepartmentWhereInput
  }

  export type DepartmentColumnCountOrderByAggregateInput = {
    id?: SortOrder
    departmentId?: SortOrder
    label?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    isDefault?: SortOrder
    isRequired?: SortOrder
    showInDataSurat?: SortOrder
    showInPrint?: SortOrder
    sortOrder?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentColumnAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
    displayOrder?: SortOrder
  }

  export type DepartmentColumnMaxOrderByAggregateInput = {
    id?: SortOrder
    departmentId?: SortOrder
    label?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    isDefault?: SortOrder
    isRequired?: SortOrder
    showInDataSurat?: SortOrder
    showInPrint?: SortOrder
    sortOrder?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentColumnMinOrderByAggregateInput = {
    id?: SortOrder
    departmentId?: SortOrder
    label?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    isDefault?: SortOrder
    isRequired?: SortOrder
    showInDataSurat?: SortOrder
    showInPrint?: SortOrder
    sortOrder?: SortOrder
    displayOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DepartmentColumnSumOrderByAggregateInput = {
    sortOrder?: SortOrder
    displayOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DetailSuratListRelationFilter = {
    every?: DetailSuratWhereInput
    some?: DetailSuratWhereInput
    none?: DetailSuratWhereInput
  }

  export type DetailSuratOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RegisterSuratCountOrderByAggregateInput = {
    id?: SortOrder
    nomor?: SortOrder
    deptId?: SortOrder
    tanggalTerima?: SortOrder
    asalSurat?: SortOrder
    tujuan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RegisterSuratAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RegisterSuratMaxOrderByAggregateInput = {
    id?: SortOrder
    nomor?: SortOrder
    deptId?: SortOrder
    tanggalTerima?: SortOrder
    asalSurat?: SortOrder
    tujuan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RegisterSuratMinOrderByAggregateInput = {
    id?: SortOrder
    nomor?: SortOrder
    deptId?: SortOrder
    tanggalTerima?: SortOrder
    asalSurat?: SortOrder
    tujuan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RegisterSuratSumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RegisterSuratScalarRelationFilter = {
    is?: RegisterSuratWhereInput
    isNot?: RegisterSuratWhereInput
  }

  export type DetailSuratCountOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
    perihal?: SortOrder
    noSurat?: SortOrder
    lampiran?: SortOrder
    tanggalSurat?: SortOrder
    tujuan?: SortOrder
    customFields?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DetailSuratAvgOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
  }

  export type DetailSuratMaxOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
    perihal?: SortOrder
    noSurat?: SortOrder
    lampiran?: SortOrder
    tanggalSurat?: SortOrder
    tujuan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DetailSuratMinOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
    perihal?: SortOrder
    noSurat?: SortOrder
    lampiran?: SortOrder
    tanggalSurat?: SortOrder
    tujuan?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DetailSuratSumOrderByAggregateInput = {
    id?: SortOrder
    registerId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type NomorCounterDeptIdYearCompoundUniqueInput = {
    deptId: string
    year: number
  }

  export type NomorCounterCountOrderByAggregateInput = {
    deptId?: SortOrder
    year?: SortOrder
    counter?: SortOrder
  }

  export type NomorCounterAvgOrderByAggregateInput = {
    year?: SortOrder
    counter?: SortOrder
  }

  export type NomorCounterMaxOrderByAggregateInput = {
    deptId?: SortOrder
    year?: SortOrder
    counter?: SortOrder
  }

  export type NomorCounterMinOrderByAggregateInput = {
    deptId?: SortOrder
    year?: SortOrder
    counter?: SortOrder
  }

  export type NomorCounterSumOrderByAggregateInput = {
    year?: SortOrder
    counter?: SortOrder
  }

  export type TrackCategoryListRelationFilter = {
    every?: TrackCategoryWhereInput
    some?: TrackCategoryWhereInput
    none?: TrackCategoryWhereInput
  }

  export type TrackFieldListRelationFilter = {
    every?: TrackFieldWhereInput
    some?: TrackFieldWhereInput
    none?: TrackFieldWhereInput
  }

  export type TrackRecordListRelationFilter = {
    every?: TrackRecordWhereInput
    some?: TrackRecordWhereInput
    none?: TrackRecordWhereInput
  }

  export type TrackCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrackFieldOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrackRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TrackSheetCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hiddenAt?: SortOrder
  }

  export type TrackSheetAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type TrackSheetMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hiddenAt?: SortOrder
  }

  export type TrackSheetMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hiddenAt?: SortOrder
  }

  export type TrackSheetSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type TrackSheetScalarRelationFilter = {
    is?: TrackSheetWhereInput
    isNot?: TrackSheetWhereInput
  }

  export type TrackCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    name?: SortOrder
    color?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackCategoryAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type TrackCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    name?: SortOrder
    color?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    name?: SortOrder
    color?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackCategorySumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type TrackFieldCountOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    categoryId?: SortOrder
    category?: SortOrder
    categoryColor?: SortOrder
    region?: SortOrder
    columnName?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    categoryOptions?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackFieldAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type TrackFieldMaxOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    categoryId?: SortOrder
    category?: SortOrder
    categoryColor?: SortOrder
    region?: SortOrder
    columnName?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    categoryOptions?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackFieldMinOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    categoryId?: SortOrder
    category?: SortOrder
    categoryColor?: SortOrder
    region?: SortOrder
    columnName?: SortOrder
    dataType?: SortOrder
    defaultValue?: SortOrder
    categoryOptions?: SortOrder
    fillRequired?: SortOrder
    addRoleValues?: SortOrder
    editRoleValues?: SortOrder
    deleteRoleValues?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackFieldSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type TrackRecordCountOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    sequenceNo?: SortOrder
    values?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackRecordAvgOrderByAggregateInput = {
    sequenceNo?: SortOrder
  }

  export type TrackRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    sequenceNo?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackRecordMinOrderByAggregateInput = {
    id?: SortOrder
    sheetId?: SortOrder
    sequenceNo?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrackRecordSumOrderByAggregateInput = {
    sequenceNo?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type UserPermissionCreateNestedOneWithoutUserInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput
    connect?: UserPermissionWhereUniqueInput
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type UserPermissionUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput
    connect?: UserPermissionWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type UserPermissionUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput
    upsert?: UserPermissionUpsertWithoutUserInput
    disconnect?: UserPermissionWhereInput | boolean
    delete?: UserPermissionWhereInput | boolean
    connect?: UserPermissionWhereUniqueInput
    update?: XOR<XOR<UserPermissionUpdateToOneWithWhereWithoutUserInput, UserPermissionUpdateWithoutUserInput>, UserPermissionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type UserPermissionUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserPermissionCreateOrConnectWithoutUserInput
    upsert?: UserPermissionUpsertWithoutUserInput
    disconnect?: UserPermissionWhereInput | boolean
    delete?: UserPermissionWhereInput | boolean
    connect?: UserPermissionWhereUniqueInput
    update?: XOR<XOR<UserPermissionUpdateToOneWithWhereWithoutUserInput, UserPermissionUpdateWithoutUserInput>, UserPermissionUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPermissionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPermissionsInput
    upsert?: UserUpsertWithoutPermissionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPermissionsInput, UserUpdateWithoutPermissionsInput>, UserUncheckedUpdateWithoutPermissionsInput>
  }

  export type RegisterSuratCreateNestedManyWithoutDeptInput = {
    create?: XOR<RegisterSuratCreateWithoutDeptInput, RegisterSuratUncheckedCreateWithoutDeptInput> | RegisterSuratCreateWithoutDeptInput[] | RegisterSuratUncheckedCreateWithoutDeptInput[]
    connectOrCreate?: RegisterSuratCreateOrConnectWithoutDeptInput | RegisterSuratCreateOrConnectWithoutDeptInput[]
    createMany?: RegisterSuratCreateManyDeptInputEnvelope
    connect?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
  }

  export type NomorCounterCreateNestedManyWithoutDeptInput = {
    create?: XOR<NomorCounterCreateWithoutDeptInput, NomorCounterUncheckedCreateWithoutDeptInput> | NomorCounterCreateWithoutDeptInput[] | NomorCounterUncheckedCreateWithoutDeptInput[]
    connectOrCreate?: NomorCounterCreateOrConnectWithoutDeptInput | NomorCounterCreateOrConnectWithoutDeptInput[]
    createMany?: NomorCounterCreateManyDeptInputEnvelope
    connect?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
  }

  export type DepartmentColumnCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<DepartmentColumnCreateWithoutDepartmentInput, DepartmentColumnUncheckedCreateWithoutDepartmentInput> | DepartmentColumnCreateWithoutDepartmentInput[] | DepartmentColumnUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: DepartmentColumnCreateOrConnectWithoutDepartmentInput | DepartmentColumnCreateOrConnectWithoutDepartmentInput[]
    createMany?: DepartmentColumnCreateManyDepartmentInputEnvelope
    connect?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
  }

  export type RegisterSuratUncheckedCreateNestedManyWithoutDeptInput = {
    create?: XOR<RegisterSuratCreateWithoutDeptInput, RegisterSuratUncheckedCreateWithoutDeptInput> | RegisterSuratCreateWithoutDeptInput[] | RegisterSuratUncheckedCreateWithoutDeptInput[]
    connectOrCreate?: RegisterSuratCreateOrConnectWithoutDeptInput | RegisterSuratCreateOrConnectWithoutDeptInput[]
    createMany?: RegisterSuratCreateManyDeptInputEnvelope
    connect?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
  }

  export type NomorCounterUncheckedCreateNestedManyWithoutDeptInput = {
    create?: XOR<NomorCounterCreateWithoutDeptInput, NomorCounterUncheckedCreateWithoutDeptInput> | NomorCounterCreateWithoutDeptInput[] | NomorCounterUncheckedCreateWithoutDeptInput[]
    connectOrCreate?: NomorCounterCreateOrConnectWithoutDeptInput | NomorCounterCreateOrConnectWithoutDeptInput[]
    createMany?: NomorCounterCreateManyDeptInputEnvelope
    connect?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
  }

  export type DepartmentColumnUncheckedCreateNestedManyWithoutDepartmentInput = {
    create?: XOR<DepartmentColumnCreateWithoutDepartmentInput, DepartmentColumnUncheckedCreateWithoutDepartmentInput> | DepartmentColumnCreateWithoutDepartmentInput[] | DepartmentColumnUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: DepartmentColumnCreateOrConnectWithoutDepartmentInput | DepartmentColumnCreateOrConnectWithoutDepartmentInput[]
    createMany?: DepartmentColumnCreateManyDepartmentInputEnvelope
    connect?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
  }

  export type RegisterSuratUpdateManyWithoutDeptNestedInput = {
    create?: XOR<RegisterSuratCreateWithoutDeptInput, RegisterSuratUncheckedCreateWithoutDeptInput> | RegisterSuratCreateWithoutDeptInput[] | RegisterSuratUncheckedCreateWithoutDeptInput[]
    connectOrCreate?: RegisterSuratCreateOrConnectWithoutDeptInput | RegisterSuratCreateOrConnectWithoutDeptInput[]
    upsert?: RegisterSuratUpsertWithWhereUniqueWithoutDeptInput | RegisterSuratUpsertWithWhereUniqueWithoutDeptInput[]
    createMany?: RegisterSuratCreateManyDeptInputEnvelope
    set?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
    disconnect?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
    delete?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
    connect?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
    update?: RegisterSuratUpdateWithWhereUniqueWithoutDeptInput | RegisterSuratUpdateWithWhereUniqueWithoutDeptInput[]
    updateMany?: RegisterSuratUpdateManyWithWhereWithoutDeptInput | RegisterSuratUpdateManyWithWhereWithoutDeptInput[]
    deleteMany?: RegisterSuratScalarWhereInput | RegisterSuratScalarWhereInput[]
  }

  export type NomorCounterUpdateManyWithoutDeptNestedInput = {
    create?: XOR<NomorCounterCreateWithoutDeptInput, NomorCounterUncheckedCreateWithoutDeptInput> | NomorCounterCreateWithoutDeptInput[] | NomorCounterUncheckedCreateWithoutDeptInput[]
    connectOrCreate?: NomorCounterCreateOrConnectWithoutDeptInput | NomorCounterCreateOrConnectWithoutDeptInput[]
    upsert?: NomorCounterUpsertWithWhereUniqueWithoutDeptInput | NomorCounterUpsertWithWhereUniqueWithoutDeptInput[]
    createMany?: NomorCounterCreateManyDeptInputEnvelope
    set?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
    disconnect?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
    delete?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
    connect?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
    update?: NomorCounterUpdateWithWhereUniqueWithoutDeptInput | NomorCounterUpdateWithWhereUniqueWithoutDeptInput[]
    updateMany?: NomorCounterUpdateManyWithWhereWithoutDeptInput | NomorCounterUpdateManyWithWhereWithoutDeptInput[]
    deleteMany?: NomorCounterScalarWhereInput | NomorCounterScalarWhereInput[]
  }

  export type DepartmentColumnUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<DepartmentColumnCreateWithoutDepartmentInput, DepartmentColumnUncheckedCreateWithoutDepartmentInput> | DepartmentColumnCreateWithoutDepartmentInput[] | DepartmentColumnUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: DepartmentColumnCreateOrConnectWithoutDepartmentInput | DepartmentColumnCreateOrConnectWithoutDepartmentInput[]
    upsert?: DepartmentColumnUpsertWithWhereUniqueWithoutDepartmentInput | DepartmentColumnUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: DepartmentColumnCreateManyDepartmentInputEnvelope
    set?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
    disconnect?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
    delete?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
    connect?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
    update?: DepartmentColumnUpdateWithWhereUniqueWithoutDepartmentInput | DepartmentColumnUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: DepartmentColumnUpdateManyWithWhereWithoutDepartmentInput | DepartmentColumnUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: DepartmentColumnScalarWhereInput | DepartmentColumnScalarWhereInput[]
  }

  export type RegisterSuratUncheckedUpdateManyWithoutDeptNestedInput = {
    create?: XOR<RegisterSuratCreateWithoutDeptInput, RegisterSuratUncheckedCreateWithoutDeptInput> | RegisterSuratCreateWithoutDeptInput[] | RegisterSuratUncheckedCreateWithoutDeptInput[]
    connectOrCreate?: RegisterSuratCreateOrConnectWithoutDeptInput | RegisterSuratCreateOrConnectWithoutDeptInput[]
    upsert?: RegisterSuratUpsertWithWhereUniqueWithoutDeptInput | RegisterSuratUpsertWithWhereUniqueWithoutDeptInput[]
    createMany?: RegisterSuratCreateManyDeptInputEnvelope
    set?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
    disconnect?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
    delete?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
    connect?: RegisterSuratWhereUniqueInput | RegisterSuratWhereUniqueInput[]
    update?: RegisterSuratUpdateWithWhereUniqueWithoutDeptInput | RegisterSuratUpdateWithWhereUniqueWithoutDeptInput[]
    updateMany?: RegisterSuratUpdateManyWithWhereWithoutDeptInput | RegisterSuratUpdateManyWithWhereWithoutDeptInput[]
    deleteMany?: RegisterSuratScalarWhereInput | RegisterSuratScalarWhereInput[]
  }

  export type NomorCounterUncheckedUpdateManyWithoutDeptNestedInput = {
    create?: XOR<NomorCounterCreateWithoutDeptInput, NomorCounterUncheckedCreateWithoutDeptInput> | NomorCounterCreateWithoutDeptInput[] | NomorCounterUncheckedCreateWithoutDeptInput[]
    connectOrCreate?: NomorCounterCreateOrConnectWithoutDeptInput | NomorCounterCreateOrConnectWithoutDeptInput[]
    upsert?: NomorCounterUpsertWithWhereUniqueWithoutDeptInput | NomorCounterUpsertWithWhereUniqueWithoutDeptInput[]
    createMany?: NomorCounterCreateManyDeptInputEnvelope
    set?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
    disconnect?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
    delete?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
    connect?: NomorCounterWhereUniqueInput | NomorCounterWhereUniqueInput[]
    update?: NomorCounterUpdateWithWhereUniqueWithoutDeptInput | NomorCounterUpdateWithWhereUniqueWithoutDeptInput[]
    updateMany?: NomorCounterUpdateManyWithWhereWithoutDeptInput | NomorCounterUpdateManyWithWhereWithoutDeptInput[]
    deleteMany?: NomorCounterScalarWhereInput | NomorCounterScalarWhereInput[]
  }

  export type DepartmentColumnUncheckedUpdateManyWithoutDepartmentNestedInput = {
    create?: XOR<DepartmentColumnCreateWithoutDepartmentInput, DepartmentColumnUncheckedCreateWithoutDepartmentInput> | DepartmentColumnCreateWithoutDepartmentInput[] | DepartmentColumnUncheckedCreateWithoutDepartmentInput[]
    connectOrCreate?: DepartmentColumnCreateOrConnectWithoutDepartmentInput | DepartmentColumnCreateOrConnectWithoutDepartmentInput[]
    upsert?: DepartmentColumnUpsertWithWhereUniqueWithoutDepartmentInput | DepartmentColumnUpsertWithWhereUniqueWithoutDepartmentInput[]
    createMany?: DepartmentColumnCreateManyDepartmentInputEnvelope
    set?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
    disconnect?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
    delete?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
    connect?: DepartmentColumnWhereUniqueInput | DepartmentColumnWhereUniqueInput[]
    update?: DepartmentColumnUpdateWithWhereUniqueWithoutDepartmentInput | DepartmentColumnUpdateWithWhereUniqueWithoutDepartmentInput[]
    updateMany?: DepartmentColumnUpdateManyWithWhereWithoutDepartmentInput | DepartmentColumnUpdateManyWithWhereWithoutDepartmentInput[]
    deleteMany?: DepartmentColumnScalarWhereInput | DepartmentColumnScalarWhereInput[]
  }

  export type DepartmentCreateNestedOneWithoutColumnsInput = {
    create?: XOR<DepartmentCreateWithoutColumnsInput, DepartmentUncheckedCreateWithoutColumnsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutColumnsInput
    connect?: DepartmentWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DepartmentUpdateOneRequiredWithoutColumnsNestedInput = {
    create?: XOR<DepartmentCreateWithoutColumnsInput, DepartmentUncheckedCreateWithoutColumnsInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutColumnsInput
    upsert?: DepartmentUpsertWithoutColumnsInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutColumnsInput, DepartmentUpdateWithoutColumnsInput>, DepartmentUncheckedUpdateWithoutColumnsInput>
  }

  export type DepartmentCreateNestedOneWithoutRegisterSuratInput = {
    create?: XOR<DepartmentCreateWithoutRegisterSuratInput, DepartmentUncheckedCreateWithoutRegisterSuratInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutRegisterSuratInput
    connect?: DepartmentWhereUniqueInput
  }

  export type DetailSuratCreateNestedManyWithoutRegisterInput = {
    create?: XOR<DetailSuratCreateWithoutRegisterInput, DetailSuratUncheckedCreateWithoutRegisterInput> | DetailSuratCreateWithoutRegisterInput[] | DetailSuratUncheckedCreateWithoutRegisterInput[]
    connectOrCreate?: DetailSuratCreateOrConnectWithoutRegisterInput | DetailSuratCreateOrConnectWithoutRegisterInput[]
    createMany?: DetailSuratCreateManyRegisterInputEnvelope
    connect?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
  }

  export type DetailSuratUncheckedCreateNestedManyWithoutRegisterInput = {
    create?: XOR<DetailSuratCreateWithoutRegisterInput, DetailSuratUncheckedCreateWithoutRegisterInput> | DetailSuratCreateWithoutRegisterInput[] | DetailSuratUncheckedCreateWithoutRegisterInput[]
    connectOrCreate?: DetailSuratCreateOrConnectWithoutRegisterInput | DetailSuratCreateOrConnectWithoutRegisterInput[]
    createMany?: DetailSuratCreateManyRegisterInputEnvelope
    connect?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
  }

  export type DepartmentUpdateOneRequiredWithoutRegisterSuratNestedInput = {
    create?: XOR<DepartmentCreateWithoutRegisterSuratInput, DepartmentUncheckedCreateWithoutRegisterSuratInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutRegisterSuratInput
    upsert?: DepartmentUpsertWithoutRegisterSuratInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutRegisterSuratInput, DepartmentUpdateWithoutRegisterSuratInput>, DepartmentUncheckedUpdateWithoutRegisterSuratInput>
  }

  export type DetailSuratUpdateManyWithoutRegisterNestedInput = {
    create?: XOR<DetailSuratCreateWithoutRegisterInput, DetailSuratUncheckedCreateWithoutRegisterInput> | DetailSuratCreateWithoutRegisterInput[] | DetailSuratUncheckedCreateWithoutRegisterInput[]
    connectOrCreate?: DetailSuratCreateOrConnectWithoutRegisterInput | DetailSuratCreateOrConnectWithoutRegisterInput[]
    upsert?: DetailSuratUpsertWithWhereUniqueWithoutRegisterInput | DetailSuratUpsertWithWhereUniqueWithoutRegisterInput[]
    createMany?: DetailSuratCreateManyRegisterInputEnvelope
    set?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
    disconnect?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
    delete?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
    connect?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
    update?: DetailSuratUpdateWithWhereUniqueWithoutRegisterInput | DetailSuratUpdateWithWhereUniqueWithoutRegisterInput[]
    updateMany?: DetailSuratUpdateManyWithWhereWithoutRegisterInput | DetailSuratUpdateManyWithWhereWithoutRegisterInput[]
    deleteMany?: DetailSuratScalarWhereInput | DetailSuratScalarWhereInput[]
  }

  export type DetailSuratUncheckedUpdateManyWithoutRegisterNestedInput = {
    create?: XOR<DetailSuratCreateWithoutRegisterInput, DetailSuratUncheckedCreateWithoutRegisterInput> | DetailSuratCreateWithoutRegisterInput[] | DetailSuratUncheckedCreateWithoutRegisterInput[]
    connectOrCreate?: DetailSuratCreateOrConnectWithoutRegisterInput | DetailSuratCreateOrConnectWithoutRegisterInput[]
    upsert?: DetailSuratUpsertWithWhereUniqueWithoutRegisterInput | DetailSuratUpsertWithWhereUniqueWithoutRegisterInput[]
    createMany?: DetailSuratCreateManyRegisterInputEnvelope
    set?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
    disconnect?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
    delete?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
    connect?: DetailSuratWhereUniqueInput | DetailSuratWhereUniqueInput[]
    update?: DetailSuratUpdateWithWhereUniqueWithoutRegisterInput | DetailSuratUpdateWithWhereUniqueWithoutRegisterInput[]
    updateMany?: DetailSuratUpdateManyWithWhereWithoutRegisterInput | DetailSuratUpdateManyWithWhereWithoutRegisterInput[]
    deleteMany?: DetailSuratScalarWhereInput | DetailSuratScalarWhereInput[]
  }

  export type RegisterSuratCreateNestedOneWithoutDetailSuratInput = {
    create?: XOR<RegisterSuratCreateWithoutDetailSuratInput, RegisterSuratUncheckedCreateWithoutDetailSuratInput>
    connectOrCreate?: RegisterSuratCreateOrConnectWithoutDetailSuratInput
    connect?: RegisterSuratWhereUniqueInput
  }

  export type RegisterSuratUpdateOneRequiredWithoutDetailSuratNestedInput = {
    create?: XOR<RegisterSuratCreateWithoutDetailSuratInput, RegisterSuratUncheckedCreateWithoutDetailSuratInput>
    connectOrCreate?: RegisterSuratCreateOrConnectWithoutDetailSuratInput
    upsert?: RegisterSuratUpsertWithoutDetailSuratInput
    connect?: RegisterSuratWhereUniqueInput
    update?: XOR<XOR<RegisterSuratUpdateToOneWithWhereWithoutDetailSuratInput, RegisterSuratUpdateWithoutDetailSuratInput>, RegisterSuratUncheckedUpdateWithoutDetailSuratInput>
  }

  export type DepartmentCreateNestedOneWithoutNomorCounterInput = {
    create?: XOR<DepartmentCreateWithoutNomorCounterInput, DepartmentUncheckedCreateWithoutNomorCounterInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutNomorCounterInput
    connect?: DepartmentWhereUniqueInput
  }

  export type DepartmentUpdateOneRequiredWithoutNomorCounterNestedInput = {
    create?: XOR<DepartmentCreateWithoutNomorCounterInput, DepartmentUncheckedCreateWithoutNomorCounterInput>
    connectOrCreate?: DepartmentCreateOrConnectWithoutNomorCounterInput
    upsert?: DepartmentUpsertWithoutNomorCounterInput
    connect?: DepartmentWhereUniqueInput
    update?: XOR<XOR<DepartmentUpdateToOneWithWhereWithoutNomorCounterInput, DepartmentUpdateWithoutNomorCounterInput>, DepartmentUncheckedUpdateWithoutNomorCounterInput>
  }

  export type TrackCategoryCreateNestedManyWithoutSheetInput = {
    create?: XOR<TrackCategoryCreateWithoutSheetInput, TrackCategoryUncheckedCreateWithoutSheetInput> | TrackCategoryCreateWithoutSheetInput[] | TrackCategoryUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackCategoryCreateOrConnectWithoutSheetInput | TrackCategoryCreateOrConnectWithoutSheetInput[]
    createMany?: TrackCategoryCreateManySheetInputEnvelope
    connect?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
  }

  export type TrackFieldCreateNestedManyWithoutSheetInput = {
    create?: XOR<TrackFieldCreateWithoutSheetInput, TrackFieldUncheckedCreateWithoutSheetInput> | TrackFieldCreateWithoutSheetInput[] | TrackFieldUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackFieldCreateOrConnectWithoutSheetInput | TrackFieldCreateOrConnectWithoutSheetInput[]
    createMany?: TrackFieldCreateManySheetInputEnvelope
    connect?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
  }

  export type TrackRecordCreateNestedManyWithoutSheetInput = {
    create?: XOR<TrackRecordCreateWithoutSheetInput, TrackRecordUncheckedCreateWithoutSheetInput> | TrackRecordCreateWithoutSheetInput[] | TrackRecordUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackRecordCreateOrConnectWithoutSheetInput | TrackRecordCreateOrConnectWithoutSheetInput[]
    createMany?: TrackRecordCreateManySheetInputEnvelope
    connect?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
  }

  export type TrackCategoryUncheckedCreateNestedManyWithoutSheetInput = {
    create?: XOR<TrackCategoryCreateWithoutSheetInput, TrackCategoryUncheckedCreateWithoutSheetInput> | TrackCategoryCreateWithoutSheetInput[] | TrackCategoryUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackCategoryCreateOrConnectWithoutSheetInput | TrackCategoryCreateOrConnectWithoutSheetInput[]
    createMany?: TrackCategoryCreateManySheetInputEnvelope
    connect?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
  }

  export type TrackFieldUncheckedCreateNestedManyWithoutSheetInput = {
    create?: XOR<TrackFieldCreateWithoutSheetInput, TrackFieldUncheckedCreateWithoutSheetInput> | TrackFieldCreateWithoutSheetInput[] | TrackFieldUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackFieldCreateOrConnectWithoutSheetInput | TrackFieldCreateOrConnectWithoutSheetInput[]
    createMany?: TrackFieldCreateManySheetInputEnvelope
    connect?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
  }

  export type TrackRecordUncheckedCreateNestedManyWithoutSheetInput = {
    create?: XOR<TrackRecordCreateWithoutSheetInput, TrackRecordUncheckedCreateWithoutSheetInput> | TrackRecordCreateWithoutSheetInput[] | TrackRecordUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackRecordCreateOrConnectWithoutSheetInput | TrackRecordCreateOrConnectWithoutSheetInput[]
    createMany?: TrackRecordCreateManySheetInputEnvelope
    connect?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
  }

  export type TrackCategoryUpdateManyWithoutSheetNestedInput = {
    create?: XOR<TrackCategoryCreateWithoutSheetInput, TrackCategoryUncheckedCreateWithoutSheetInput> | TrackCategoryCreateWithoutSheetInput[] | TrackCategoryUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackCategoryCreateOrConnectWithoutSheetInput | TrackCategoryCreateOrConnectWithoutSheetInput[]
    upsert?: TrackCategoryUpsertWithWhereUniqueWithoutSheetInput | TrackCategoryUpsertWithWhereUniqueWithoutSheetInput[]
    createMany?: TrackCategoryCreateManySheetInputEnvelope
    set?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
    disconnect?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
    delete?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
    connect?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
    update?: TrackCategoryUpdateWithWhereUniqueWithoutSheetInput | TrackCategoryUpdateWithWhereUniqueWithoutSheetInput[]
    updateMany?: TrackCategoryUpdateManyWithWhereWithoutSheetInput | TrackCategoryUpdateManyWithWhereWithoutSheetInput[]
    deleteMany?: TrackCategoryScalarWhereInput | TrackCategoryScalarWhereInput[]
  }

  export type TrackFieldUpdateManyWithoutSheetNestedInput = {
    create?: XOR<TrackFieldCreateWithoutSheetInput, TrackFieldUncheckedCreateWithoutSheetInput> | TrackFieldCreateWithoutSheetInput[] | TrackFieldUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackFieldCreateOrConnectWithoutSheetInput | TrackFieldCreateOrConnectWithoutSheetInput[]
    upsert?: TrackFieldUpsertWithWhereUniqueWithoutSheetInput | TrackFieldUpsertWithWhereUniqueWithoutSheetInput[]
    createMany?: TrackFieldCreateManySheetInputEnvelope
    set?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
    disconnect?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
    delete?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
    connect?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
    update?: TrackFieldUpdateWithWhereUniqueWithoutSheetInput | TrackFieldUpdateWithWhereUniqueWithoutSheetInput[]
    updateMany?: TrackFieldUpdateManyWithWhereWithoutSheetInput | TrackFieldUpdateManyWithWhereWithoutSheetInput[]
    deleteMany?: TrackFieldScalarWhereInput | TrackFieldScalarWhereInput[]
  }

  export type TrackRecordUpdateManyWithoutSheetNestedInput = {
    create?: XOR<TrackRecordCreateWithoutSheetInput, TrackRecordUncheckedCreateWithoutSheetInput> | TrackRecordCreateWithoutSheetInput[] | TrackRecordUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackRecordCreateOrConnectWithoutSheetInput | TrackRecordCreateOrConnectWithoutSheetInput[]
    upsert?: TrackRecordUpsertWithWhereUniqueWithoutSheetInput | TrackRecordUpsertWithWhereUniqueWithoutSheetInput[]
    createMany?: TrackRecordCreateManySheetInputEnvelope
    set?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
    disconnect?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
    delete?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
    connect?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
    update?: TrackRecordUpdateWithWhereUniqueWithoutSheetInput | TrackRecordUpdateWithWhereUniqueWithoutSheetInput[]
    updateMany?: TrackRecordUpdateManyWithWhereWithoutSheetInput | TrackRecordUpdateManyWithWhereWithoutSheetInput[]
    deleteMany?: TrackRecordScalarWhereInput | TrackRecordScalarWhereInput[]
  }

  export type TrackCategoryUncheckedUpdateManyWithoutSheetNestedInput = {
    create?: XOR<TrackCategoryCreateWithoutSheetInput, TrackCategoryUncheckedCreateWithoutSheetInput> | TrackCategoryCreateWithoutSheetInput[] | TrackCategoryUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackCategoryCreateOrConnectWithoutSheetInput | TrackCategoryCreateOrConnectWithoutSheetInput[]
    upsert?: TrackCategoryUpsertWithWhereUniqueWithoutSheetInput | TrackCategoryUpsertWithWhereUniqueWithoutSheetInput[]
    createMany?: TrackCategoryCreateManySheetInputEnvelope
    set?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
    disconnect?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
    delete?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
    connect?: TrackCategoryWhereUniqueInput | TrackCategoryWhereUniqueInput[]
    update?: TrackCategoryUpdateWithWhereUniqueWithoutSheetInput | TrackCategoryUpdateWithWhereUniqueWithoutSheetInput[]
    updateMany?: TrackCategoryUpdateManyWithWhereWithoutSheetInput | TrackCategoryUpdateManyWithWhereWithoutSheetInput[]
    deleteMany?: TrackCategoryScalarWhereInput | TrackCategoryScalarWhereInput[]
  }

  export type TrackFieldUncheckedUpdateManyWithoutSheetNestedInput = {
    create?: XOR<TrackFieldCreateWithoutSheetInput, TrackFieldUncheckedCreateWithoutSheetInput> | TrackFieldCreateWithoutSheetInput[] | TrackFieldUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackFieldCreateOrConnectWithoutSheetInput | TrackFieldCreateOrConnectWithoutSheetInput[]
    upsert?: TrackFieldUpsertWithWhereUniqueWithoutSheetInput | TrackFieldUpsertWithWhereUniqueWithoutSheetInput[]
    createMany?: TrackFieldCreateManySheetInputEnvelope
    set?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
    disconnect?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
    delete?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
    connect?: TrackFieldWhereUniqueInput | TrackFieldWhereUniqueInput[]
    update?: TrackFieldUpdateWithWhereUniqueWithoutSheetInput | TrackFieldUpdateWithWhereUniqueWithoutSheetInput[]
    updateMany?: TrackFieldUpdateManyWithWhereWithoutSheetInput | TrackFieldUpdateManyWithWhereWithoutSheetInput[]
    deleteMany?: TrackFieldScalarWhereInput | TrackFieldScalarWhereInput[]
  }

  export type TrackRecordUncheckedUpdateManyWithoutSheetNestedInput = {
    create?: XOR<TrackRecordCreateWithoutSheetInput, TrackRecordUncheckedCreateWithoutSheetInput> | TrackRecordCreateWithoutSheetInput[] | TrackRecordUncheckedCreateWithoutSheetInput[]
    connectOrCreate?: TrackRecordCreateOrConnectWithoutSheetInput | TrackRecordCreateOrConnectWithoutSheetInput[]
    upsert?: TrackRecordUpsertWithWhereUniqueWithoutSheetInput | TrackRecordUpsertWithWhereUniqueWithoutSheetInput[]
    createMany?: TrackRecordCreateManySheetInputEnvelope
    set?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
    disconnect?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
    delete?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
    connect?: TrackRecordWhereUniqueInput | TrackRecordWhereUniqueInput[]
    update?: TrackRecordUpdateWithWhereUniqueWithoutSheetInput | TrackRecordUpdateWithWhereUniqueWithoutSheetInput[]
    updateMany?: TrackRecordUpdateManyWithWhereWithoutSheetInput | TrackRecordUpdateManyWithWhereWithoutSheetInput[]
    deleteMany?: TrackRecordScalarWhereInput | TrackRecordScalarWhereInput[]
  }

  export type TrackSheetCreateNestedOneWithoutCategoriesInput = {
    create?: XOR<TrackSheetCreateWithoutCategoriesInput, TrackSheetUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: TrackSheetCreateOrConnectWithoutCategoriesInput
    connect?: TrackSheetWhereUniqueInput
  }

  export type TrackSheetUpdateOneRequiredWithoutCategoriesNestedInput = {
    create?: XOR<TrackSheetCreateWithoutCategoriesInput, TrackSheetUncheckedCreateWithoutCategoriesInput>
    connectOrCreate?: TrackSheetCreateOrConnectWithoutCategoriesInput
    upsert?: TrackSheetUpsertWithoutCategoriesInput
    connect?: TrackSheetWhereUniqueInput
    update?: XOR<XOR<TrackSheetUpdateToOneWithWhereWithoutCategoriesInput, TrackSheetUpdateWithoutCategoriesInput>, TrackSheetUncheckedUpdateWithoutCategoriesInput>
  }

  export type TrackSheetCreateNestedOneWithoutFieldsInput = {
    create?: XOR<TrackSheetCreateWithoutFieldsInput, TrackSheetUncheckedCreateWithoutFieldsInput>
    connectOrCreate?: TrackSheetCreateOrConnectWithoutFieldsInput
    connect?: TrackSheetWhereUniqueInput
  }

  export type TrackSheetUpdateOneRequiredWithoutFieldsNestedInput = {
    create?: XOR<TrackSheetCreateWithoutFieldsInput, TrackSheetUncheckedCreateWithoutFieldsInput>
    connectOrCreate?: TrackSheetCreateOrConnectWithoutFieldsInput
    upsert?: TrackSheetUpsertWithoutFieldsInput
    connect?: TrackSheetWhereUniqueInput
    update?: XOR<XOR<TrackSheetUpdateToOneWithWhereWithoutFieldsInput, TrackSheetUpdateWithoutFieldsInput>, TrackSheetUncheckedUpdateWithoutFieldsInput>
  }

  export type TrackSheetCreateNestedOneWithoutRecordsInput = {
    create?: XOR<TrackSheetCreateWithoutRecordsInput, TrackSheetUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: TrackSheetCreateOrConnectWithoutRecordsInput
    connect?: TrackSheetWhereUniqueInput
  }

  export type TrackSheetUpdateOneRequiredWithoutRecordsNestedInput = {
    create?: XOR<TrackSheetCreateWithoutRecordsInput, TrackSheetUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: TrackSheetCreateOrConnectWithoutRecordsInput
    upsert?: TrackSheetUpsertWithoutRecordsInput
    connect?: TrackSheetWhereUniqueInput
    update?: XOR<XOR<TrackSheetUpdateToOneWithWhereWithoutRecordsInput, TrackSheetUpdateWithoutRecordsInput>, TrackSheetUncheckedUpdateWithoutRecordsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserPermissionCreateWithoutUserInput = {
    id?: string
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
  }

  export type UserPermissionUncheckedCreateWithoutUserInput = {
    id?: string
    canViewDataSurat?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    canPrint?: boolean
    canTrack?: boolean
  }

  export type UserPermissionCreateOrConnectWithoutUserInput = {
    where: UserPermissionWhereUniqueInput
    create: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type UserPermissionUpsertWithoutUserInput = {
    update: XOR<UserPermissionUpdateWithoutUserInput, UserPermissionUncheckedUpdateWithoutUserInput>
    create: XOR<UserPermissionCreateWithoutUserInput, UserPermissionUncheckedCreateWithoutUserInput>
    where?: UserPermissionWhereInput
  }

  export type UserPermissionUpdateToOneWithWhereWithoutUserInput = {
    where?: UserPermissionWhereInput
    data: XOR<UserPermissionUpdateWithoutUserInput, UserPermissionUncheckedUpdateWithoutUserInput>
  }

  export type UserPermissionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    canViewDataSurat?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    canPrint?: BoolFieldUpdateOperationsInput | boolean
    canTrack?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserPermissionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    canViewDataSurat?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    canPrint?: BoolFieldUpdateOperationsInput | boolean
    canTrack?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    permissions?: UserPermissionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    permissions?: UserPermissionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    permissions?: UserPermissionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    permissions?: UserPermissionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    permissions?: UserPermissionCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    permissions?: UserPermissionUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    permissions?: UserPermissionUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    permissions?: UserPermissionUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutPermissionsInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPermissionsInput = {
    id?: string
    name: string
    email: string
    emailVerified?: boolean
    username?: string | null
    image?: string | null
    role?: string
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPermissionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
  }

  export type UserUpsertWithoutPermissionsInput = {
    update: XOR<UserUpdateWithoutPermissionsInput, UserUncheckedUpdateWithoutPermissionsInput>
    create: XOR<UserCreateWithoutPermissionsInput, UserUncheckedCreateWithoutPermissionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPermissionsInput, UserUncheckedUpdateWithoutPermissionsInput>
  }

  export type UserUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    username?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RegisterSuratCreateWithoutDeptInput = {
    nomor: string
    tanggalTerima: Date | string
    asalSurat: string
    tujuan?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    detailSurat?: DetailSuratCreateNestedManyWithoutRegisterInput
  }

  export type RegisterSuratUncheckedCreateWithoutDeptInput = {
    id?: number
    nomor: string
    tanggalTerima: Date | string
    asalSurat: string
    tujuan?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    detailSurat?: DetailSuratUncheckedCreateNestedManyWithoutRegisterInput
  }

  export type RegisterSuratCreateOrConnectWithoutDeptInput = {
    where: RegisterSuratWhereUniqueInput
    create: XOR<RegisterSuratCreateWithoutDeptInput, RegisterSuratUncheckedCreateWithoutDeptInput>
  }

  export type RegisterSuratCreateManyDeptInputEnvelope = {
    data: RegisterSuratCreateManyDeptInput | RegisterSuratCreateManyDeptInput[]
    skipDuplicates?: boolean
  }

  export type NomorCounterCreateWithoutDeptInput = {
    year: number
    counter?: number
  }

  export type NomorCounterUncheckedCreateWithoutDeptInput = {
    year: number
    counter?: number
  }

  export type NomorCounterCreateOrConnectWithoutDeptInput = {
    where: NomorCounterWhereUniqueInput
    create: XOR<NomorCounterCreateWithoutDeptInput, NomorCounterUncheckedCreateWithoutDeptInput>
  }

  export type NomorCounterCreateManyDeptInputEnvelope = {
    data: NomorCounterCreateManyDeptInput | NomorCounterCreateManyDeptInput[]
    skipDuplicates?: boolean
  }

  export type DepartmentColumnCreateWithoutDepartmentInput = {
    id: string
    label: string
    dataType: string
    defaultValue?: string
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: number
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentColumnUncheckedCreateWithoutDepartmentInput = {
    id: string
    label: string
    dataType: string
    defaultValue?: string
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: number
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DepartmentColumnCreateOrConnectWithoutDepartmentInput = {
    where: DepartmentColumnWhereUniqueInput
    create: XOR<DepartmentColumnCreateWithoutDepartmentInput, DepartmentColumnUncheckedCreateWithoutDepartmentInput>
  }

  export type DepartmentColumnCreateManyDepartmentInputEnvelope = {
    data: DepartmentColumnCreateManyDepartmentInput | DepartmentColumnCreateManyDepartmentInput[]
    skipDuplicates?: boolean
  }

  export type RegisterSuratUpsertWithWhereUniqueWithoutDeptInput = {
    where: RegisterSuratWhereUniqueInput
    update: XOR<RegisterSuratUpdateWithoutDeptInput, RegisterSuratUncheckedUpdateWithoutDeptInput>
    create: XOR<RegisterSuratCreateWithoutDeptInput, RegisterSuratUncheckedCreateWithoutDeptInput>
  }

  export type RegisterSuratUpdateWithWhereUniqueWithoutDeptInput = {
    where: RegisterSuratWhereUniqueInput
    data: XOR<RegisterSuratUpdateWithoutDeptInput, RegisterSuratUncheckedUpdateWithoutDeptInput>
  }

  export type RegisterSuratUpdateManyWithWhereWithoutDeptInput = {
    where: RegisterSuratScalarWhereInput
    data: XOR<RegisterSuratUpdateManyMutationInput, RegisterSuratUncheckedUpdateManyWithoutDeptInput>
  }

  export type RegisterSuratScalarWhereInput = {
    AND?: RegisterSuratScalarWhereInput | RegisterSuratScalarWhereInput[]
    OR?: RegisterSuratScalarWhereInput[]
    NOT?: RegisterSuratScalarWhereInput | RegisterSuratScalarWhereInput[]
    id?: IntFilter<"RegisterSurat"> | number
    nomor?: StringFilter<"RegisterSurat"> | string
    deptId?: StringFilter<"RegisterSurat"> | string
    tanggalTerima?: DateTimeFilter<"RegisterSurat"> | Date | string
    asalSurat?: StringFilter<"RegisterSurat"> | string
    tujuan?: StringFilter<"RegisterSurat"> | string
    createdAt?: DateTimeFilter<"RegisterSurat"> | Date | string
    updatedAt?: DateTimeFilter<"RegisterSurat"> | Date | string
  }

  export type NomorCounterUpsertWithWhereUniqueWithoutDeptInput = {
    where: NomorCounterWhereUniqueInput
    update: XOR<NomorCounterUpdateWithoutDeptInput, NomorCounterUncheckedUpdateWithoutDeptInput>
    create: XOR<NomorCounterCreateWithoutDeptInput, NomorCounterUncheckedCreateWithoutDeptInput>
  }

  export type NomorCounterUpdateWithWhereUniqueWithoutDeptInput = {
    where: NomorCounterWhereUniqueInput
    data: XOR<NomorCounterUpdateWithoutDeptInput, NomorCounterUncheckedUpdateWithoutDeptInput>
  }

  export type NomorCounterUpdateManyWithWhereWithoutDeptInput = {
    where: NomorCounterScalarWhereInput
    data: XOR<NomorCounterUpdateManyMutationInput, NomorCounterUncheckedUpdateManyWithoutDeptInput>
  }

  export type NomorCounterScalarWhereInput = {
    AND?: NomorCounterScalarWhereInput | NomorCounterScalarWhereInput[]
    OR?: NomorCounterScalarWhereInput[]
    NOT?: NomorCounterScalarWhereInput | NomorCounterScalarWhereInput[]
    deptId?: StringFilter<"NomorCounter"> | string
    year?: IntFilter<"NomorCounter"> | number
    counter?: IntFilter<"NomorCounter"> | number
  }

  export type DepartmentColumnUpsertWithWhereUniqueWithoutDepartmentInput = {
    where: DepartmentColumnWhereUniqueInput
    update: XOR<DepartmentColumnUpdateWithoutDepartmentInput, DepartmentColumnUncheckedUpdateWithoutDepartmentInput>
    create: XOR<DepartmentColumnCreateWithoutDepartmentInput, DepartmentColumnUncheckedCreateWithoutDepartmentInput>
  }

  export type DepartmentColumnUpdateWithWhereUniqueWithoutDepartmentInput = {
    where: DepartmentColumnWhereUniqueInput
    data: XOR<DepartmentColumnUpdateWithoutDepartmentInput, DepartmentColumnUncheckedUpdateWithoutDepartmentInput>
  }

  export type DepartmentColumnUpdateManyWithWhereWithoutDepartmentInput = {
    where: DepartmentColumnScalarWhereInput
    data: XOR<DepartmentColumnUpdateManyMutationInput, DepartmentColumnUncheckedUpdateManyWithoutDepartmentInput>
  }

  export type DepartmentColumnScalarWhereInput = {
    AND?: DepartmentColumnScalarWhereInput | DepartmentColumnScalarWhereInput[]
    OR?: DepartmentColumnScalarWhereInput[]
    NOT?: DepartmentColumnScalarWhereInput | DepartmentColumnScalarWhereInput[]
    id?: StringFilter<"DepartmentColumn"> | string
    departmentId?: StringFilter<"DepartmentColumn"> | string
    label?: StringFilter<"DepartmentColumn"> | string
    dataType?: StringFilter<"DepartmentColumn"> | string
    defaultValue?: StringFilter<"DepartmentColumn"> | string
    isDefault?: BoolFilter<"DepartmentColumn"> | boolean
    isRequired?: BoolFilter<"DepartmentColumn"> | boolean
    showInDataSurat?: BoolFilter<"DepartmentColumn"> | boolean
    showInPrint?: BoolFilter<"DepartmentColumn"> | boolean
    sortOrder?: IntFilter<"DepartmentColumn"> | number
    displayOrder?: IntFilter<"DepartmentColumn"> | number
    createdAt?: DateTimeFilter<"DepartmentColumn"> | Date | string
    updatedAt?: DateTimeFilter<"DepartmentColumn"> | Date | string
  }

  export type DepartmentCreateWithoutColumnsInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
    registerSurat?: RegisterSuratCreateNestedManyWithoutDeptInput
    nomorCounter?: NomorCounterCreateNestedManyWithoutDeptInput
  }

  export type DepartmentUncheckedCreateWithoutColumnsInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
    registerSurat?: RegisterSuratUncheckedCreateNestedManyWithoutDeptInput
    nomorCounter?: NomorCounterUncheckedCreateNestedManyWithoutDeptInput
  }

  export type DepartmentCreateOrConnectWithoutColumnsInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutColumnsInput, DepartmentUncheckedCreateWithoutColumnsInput>
  }

  export type DepartmentUpsertWithoutColumnsInput = {
    update: XOR<DepartmentUpdateWithoutColumnsInput, DepartmentUncheckedUpdateWithoutColumnsInput>
    create: XOR<DepartmentCreateWithoutColumnsInput, DepartmentUncheckedCreateWithoutColumnsInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutColumnsInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutColumnsInput, DepartmentUncheckedUpdateWithoutColumnsInput>
  }

  export type DepartmentUpdateWithoutColumnsInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registerSurat?: RegisterSuratUpdateManyWithoutDeptNestedInput
    nomorCounter?: NomorCounterUpdateManyWithoutDeptNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutColumnsInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registerSurat?: RegisterSuratUncheckedUpdateManyWithoutDeptNestedInput
    nomorCounter?: NomorCounterUncheckedUpdateManyWithoutDeptNestedInput
  }

  export type DepartmentCreateWithoutRegisterSuratInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
    nomorCounter?: NomorCounterCreateNestedManyWithoutDeptInput
    columns?: DepartmentColumnCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutRegisterSuratInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
    nomorCounter?: NomorCounterUncheckedCreateNestedManyWithoutDeptInput
    columns?: DepartmentColumnUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutRegisterSuratInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutRegisterSuratInput, DepartmentUncheckedCreateWithoutRegisterSuratInput>
  }

  export type DetailSuratCreateWithoutRegisterInput = {
    perihal: string
    noSurat?: string | null
    lampiran?: string | null
    tanggalSurat: Date | string
    tujuan?: string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DetailSuratUncheckedCreateWithoutRegisterInput = {
    id?: number
    perihal: string
    noSurat?: string | null
    lampiran?: string | null
    tanggalSurat: Date | string
    tujuan?: string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DetailSuratCreateOrConnectWithoutRegisterInput = {
    where: DetailSuratWhereUniqueInput
    create: XOR<DetailSuratCreateWithoutRegisterInput, DetailSuratUncheckedCreateWithoutRegisterInput>
  }

  export type DetailSuratCreateManyRegisterInputEnvelope = {
    data: DetailSuratCreateManyRegisterInput | DetailSuratCreateManyRegisterInput[]
    skipDuplicates?: boolean
  }

  export type DepartmentUpsertWithoutRegisterSuratInput = {
    update: XOR<DepartmentUpdateWithoutRegisterSuratInput, DepartmentUncheckedUpdateWithoutRegisterSuratInput>
    create: XOR<DepartmentCreateWithoutRegisterSuratInput, DepartmentUncheckedCreateWithoutRegisterSuratInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutRegisterSuratInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutRegisterSuratInput, DepartmentUncheckedUpdateWithoutRegisterSuratInput>
  }

  export type DepartmentUpdateWithoutRegisterSuratInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nomorCounter?: NomorCounterUpdateManyWithoutDeptNestedInput
    columns?: DepartmentColumnUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutRegisterSuratInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nomorCounter?: NomorCounterUncheckedUpdateManyWithoutDeptNestedInput
    columns?: DepartmentColumnUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type DetailSuratUpsertWithWhereUniqueWithoutRegisterInput = {
    where: DetailSuratWhereUniqueInput
    update: XOR<DetailSuratUpdateWithoutRegisterInput, DetailSuratUncheckedUpdateWithoutRegisterInput>
    create: XOR<DetailSuratCreateWithoutRegisterInput, DetailSuratUncheckedCreateWithoutRegisterInput>
  }

  export type DetailSuratUpdateWithWhereUniqueWithoutRegisterInput = {
    where: DetailSuratWhereUniqueInput
    data: XOR<DetailSuratUpdateWithoutRegisterInput, DetailSuratUncheckedUpdateWithoutRegisterInput>
  }

  export type DetailSuratUpdateManyWithWhereWithoutRegisterInput = {
    where: DetailSuratScalarWhereInput
    data: XOR<DetailSuratUpdateManyMutationInput, DetailSuratUncheckedUpdateManyWithoutRegisterInput>
  }

  export type DetailSuratScalarWhereInput = {
    AND?: DetailSuratScalarWhereInput | DetailSuratScalarWhereInput[]
    OR?: DetailSuratScalarWhereInput[]
    NOT?: DetailSuratScalarWhereInput | DetailSuratScalarWhereInput[]
    id?: IntFilter<"DetailSurat"> | number
    registerId?: IntFilter<"DetailSurat"> | number
    perihal?: StringFilter<"DetailSurat"> | string
    noSurat?: StringNullableFilter<"DetailSurat"> | string | null
    lampiran?: StringNullableFilter<"DetailSurat"> | string | null
    tanggalSurat?: DateTimeFilter<"DetailSurat"> | Date | string
    tujuan?: StringNullableFilter<"DetailSurat"> | string | null
    customFields?: JsonFilter<"DetailSurat">
    createdAt?: DateTimeFilter<"DetailSurat"> | Date | string
    updatedAt?: DateTimeFilter<"DetailSurat"> | Date | string
  }

  export type RegisterSuratCreateWithoutDetailSuratInput = {
    nomor: string
    tanggalTerima: Date | string
    asalSurat: string
    tujuan?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    dept: DepartmentCreateNestedOneWithoutRegisterSuratInput
  }

  export type RegisterSuratUncheckedCreateWithoutDetailSuratInput = {
    id?: number
    nomor: string
    deptId: string
    tanggalTerima: Date | string
    asalSurat: string
    tujuan?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RegisterSuratCreateOrConnectWithoutDetailSuratInput = {
    where: RegisterSuratWhereUniqueInput
    create: XOR<RegisterSuratCreateWithoutDetailSuratInput, RegisterSuratUncheckedCreateWithoutDetailSuratInput>
  }

  export type RegisterSuratUpsertWithoutDetailSuratInput = {
    update: XOR<RegisterSuratUpdateWithoutDetailSuratInput, RegisterSuratUncheckedUpdateWithoutDetailSuratInput>
    create: XOR<RegisterSuratCreateWithoutDetailSuratInput, RegisterSuratUncheckedCreateWithoutDetailSuratInput>
    where?: RegisterSuratWhereInput
  }

  export type RegisterSuratUpdateToOneWithWhereWithoutDetailSuratInput = {
    where?: RegisterSuratWhereInput
    data: XOR<RegisterSuratUpdateWithoutDetailSuratInput, RegisterSuratUncheckedUpdateWithoutDetailSuratInput>
  }

  export type RegisterSuratUpdateWithoutDetailSuratInput = {
    nomor?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dept?: DepartmentUpdateOneRequiredWithoutRegisterSuratNestedInput
  }

  export type RegisterSuratUncheckedUpdateWithoutDetailSuratInput = {
    id?: IntFieldUpdateOperationsInput | number
    nomor?: StringFieldUpdateOperationsInput | string
    deptId?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentCreateWithoutNomorCounterInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
    registerSurat?: RegisterSuratCreateNestedManyWithoutDeptInput
    columns?: DepartmentColumnCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentUncheckedCreateWithoutNomorCounterInput = {
    id: string
    shortName: string
    tujuan?: string
    printSheetName?: string
    isActive?: boolean
    registerSurat?: RegisterSuratUncheckedCreateNestedManyWithoutDeptInput
    columns?: DepartmentColumnUncheckedCreateNestedManyWithoutDepartmentInput
  }

  export type DepartmentCreateOrConnectWithoutNomorCounterInput = {
    where: DepartmentWhereUniqueInput
    create: XOR<DepartmentCreateWithoutNomorCounterInput, DepartmentUncheckedCreateWithoutNomorCounterInput>
  }

  export type DepartmentUpsertWithoutNomorCounterInput = {
    update: XOR<DepartmentUpdateWithoutNomorCounterInput, DepartmentUncheckedUpdateWithoutNomorCounterInput>
    create: XOR<DepartmentCreateWithoutNomorCounterInput, DepartmentUncheckedCreateWithoutNomorCounterInput>
    where?: DepartmentWhereInput
  }

  export type DepartmentUpdateToOneWithWhereWithoutNomorCounterInput = {
    where?: DepartmentWhereInput
    data: XOR<DepartmentUpdateWithoutNomorCounterInput, DepartmentUncheckedUpdateWithoutNomorCounterInput>
  }

  export type DepartmentUpdateWithoutNomorCounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registerSurat?: RegisterSuratUpdateManyWithoutDeptNestedInput
    columns?: DepartmentColumnUpdateManyWithoutDepartmentNestedInput
  }

  export type DepartmentUncheckedUpdateWithoutNomorCounterInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortName?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    printSheetName?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    registerSurat?: RegisterSuratUncheckedUpdateManyWithoutDeptNestedInput
    columns?: DepartmentColumnUncheckedUpdateManyWithoutDepartmentNestedInput
  }

  export type TrackCategoryCreateWithoutSheetInput = {
    id: string
    name: string
    color?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackCategoryUncheckedCreateWithoutSheetInput = {
    id: string
    name: string
    color?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackCategoryCreateOrConnectWithoutSheetInput = {
    where: TrackCategoryWhereUniqueInput
    create: XOR<TrackCategoryCreateWithoutSheetInput, TrackCategoryUncheckedCreateWithoutSheetInput>
  }

  export type TrackCategoryCreateManySheetInputEnvelope = {
    data: TrackCategoryCreateManySheetInput | TrackCategoryCreateManySheetInput[]
    skipDuplicates?: boolean
  }

  export type TrackFieldCreateWithoutSheetInput = {
    id: string
    categoryId?: string | null
    category: string
    categoryColor?: string
    region: string
    columnName: string
    dataType: string
    defaultValue?: string
    categoryOptions?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackFieldUncheckedCreateWithoutSheetInput = {
    id: string
    categoryId?: string | null
    category: string
    categoryColor?: string
    region: string
    columnName: string
    dataType: string
    defaultValue?: string
    categoryOptions?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackFieldCreateOrConnectWithoutSheetInput = {
    where: TrackFieldWhereUniqueInput
    create: XOR<TrackFieldCreateWithoutSheetInput, TrackFieldUncheckedCreateWithoutSheetInput>
  }

  export type TrackFieldCreateManySheetInputEnvelope = {
    data: TrackFieldCreateManySheetInput | TrackFieldCreateManySheetInput[]
    skipDuplicates?: boolean
  }

  export type TrackRecordCreateWithoutSheetInput = {
    id: string
    sequenceNo?: number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackRecordUncheckedCreateWithoutSheetInput = {
    id: string
    sequenceNo?: number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackRecordCreateOrConnectWithoutSheetInput = {
    where: TrackRecordWhereUniqueInput
    create: XOR<TrackRecordCreateWithoutSheetInput, TrackRecordUncheckedCreateWithoutSheetInput>
  }

  export type TrackRecordCreateManySheetInputEnvelope = {
    data: TrackRecordCreateManySheetInput | TrackRecordCreateManySheetInput[]
    skipDuplicates?: boolean
  }

  export type TrackCategoryUpsertWithWhereUniqueWithoutSheetInput = {
    where: TrackCategoryWhereUniqueInput
    update: XOR<TrackCategoryUpdateWithoutSheetInput, TrackCategoryUncheckedUpdateWithoutSheetInput>
    create: XOR<TrackCategoryCreateWithoutSheetInput, TrackCategoryUncheckedCreateWithoutSheetInput>
  }

  export type TrackCategoryUpdateWithWhereUniqueWithoutSheetInput = {
    where: TrackCategoryWhereUniqueInput
    data: XOR<TrackCategoryUpdateWithoutSheetInput, TrackCategoryUncheckedUpdateWithoutSheetInput>
  }

  export type TrackCategoryUpdateManyWithWhereWithoutSheetInput = {
    where: TrackCategoryScalarWhereInput
    data: XOR<TrackCategoryUpdateManyMutationInput, TrackCategoryUncheckedUpdateManyWithoutSheetInput>
  }

  export type TrackCategoryScalarWhereInput = {
    AND?: TrackCategoryScalarWhereInput | TrackCategoryScalarWhereInput[]
    OR?: TrackCategoryScalarWhereInput[]
    NOT?: TrackCategoryScalarWhereInput | TrackCategoryScalarWhereInput[]
    id?: StringFilter<"TrackCategory"> | string
    sheetId?: StringFilter<"TrackCategory"> | string
    name?: StringFilter<"TrackCategory"> | string
    color?: StringFilter<"TrackCategory"> | string
    fillRequired?: BoolFilter<"TrackCategory"> | boolean
    addRoleValues?: StringFilter<"TrackCategory"> | string
    editRoleValues?: StringFilter<"TrackCategory"> | string
    deleteRoleValues?: StringFilter<"TrackCategory"> | string
    sortOrder?: IntFilter<"TrackCategory"> | number
    createdAt?: DateTimeFilter<"TrackCategory"> | Date | string
    updatedAt?: DateTimeFilter<"TrackCategory"> | Date | string
  }

  export type TrackFieldUpsertWithWhereUniqueWithoutSheetInput = {
    where: TrackFieldWhereUniqueInput
    update: XOR<TrackFieldUpdateWithoutSheetInput, TrackFieldUncheckedUpdateWithoutSheetInput>
    create: XOR<TrackFieldCreateWithoutSheetInput, TrackFieldUncheckedCreateWithoutSheetInput>
  }

  export type TrackFieldUpdateWithWhereUniqueWithoutSheetInput = {
    where: TrackFieldWhereUniqueInput
    data: XOR<TrackFieldUpdateWithoutSheetInput, TrackFieldUncheckedUpdateWithoutSheetInput>
  }

  export type TrackFieldUpdateManyWithWhereWithoutSheetInput = {
    where: TrackFieldScalarWhereInput
    data: XOR<TrackFieldUpdateManyMutationInput, TrackFieldUncheckedUpdateManyWithoutSheetInput>
  }

  export type TrackFieldScalarWhereInput = {
    AND?: TrackFieldScalarWhereInput | TrackFieldScalarWhereInput[]
    OR?: TrackFieldScalarWhereInput[]
    NOT?: TrackFieldScalarWhereInput | TrackFieldScalarWhereInput[]
    id?: StringFilter<"TrackField"> | string
    sheetId?: StringFilter<"TrackField"> | string
    categoryId?: StringNullableFilter<"TrackField"> | string | null
    category?: StringFilter<"TrackField"> | string
    categoryColor?: StringFilter<"TrackField"> | string
    region?: StringFilter<"TrackField"> | string
    columnName?: StringFilter<"TrackField"> | string
    dataType?: StringFilter<"TrackField"> | string
    defaultValue?: StringFilter<"TrackField"> | string
    categoryOptions?: StringFilter<"TrackField"> | string
    fillRequired?: BoolFilter<"TrackField"> | boolean
    addRoleValues?: StringFilter<"TrackField"> | string
    editRoleValues?: StringFilter<"TrackField"> | string
    deleteRoleValues?: StringFilter<"TrackField"> | string
    sortOrder?: IntFilter<"TrackField"> | number
    createdAt?: DateTimeFilter<"TrackField"> | Date | string
    updatedAt?: DateTimeFilter<"TrackField"> | Date | string
  }

  export type TrackRecordUpsertWithWhereUniqueWithoutSheetInput = {
    where: TrackRecordWhereUniqueInput
    update: XOR<TrackRecordUpdateWithoutSheetInput, TrackRecordUncheckedUpdateWithoutSheetInput>
    create: XOR<TrackRecordCreateWithoutSheetInput, TrackRecordUncheckedCreateWithoutSheetInput>
  }

  export type TrackRecordUpdateWithWhereUniqueWithoutSheetInput = {
    where: TrackRecordWhereUniqueInput
    data: XOR<TrackRecordUpdateWithoutSheetInput, TrackRecordUncheckedUpdateWithoutSheetInput>
  }

  export type TrackRecordUpdateManyWithWhereWithoutSheetInput = {
    where: TrackRecordScalarWhereInput
    data: XOR<TrackRecordUpdateManyMutationInput, TrackRecordUncheckedUpdateManyWithoutSheetInput>
  }

  export type TrackRecordScalarWhereInput = {
    AND?: TrackRecordScalarWhereInput | TrackRecordScalarWhereInput[]
    OR?: TrackRecordScalarWhereInput[]
    NOT?: TrackRecordScalarWhereInput | TrackRecordScalarWhereInput[]
    id?: StringFilter<"TrackRecord"> | string
    sheetId?: StringFilter<"TrackRecord"> | string
    sequenceNo?: IntFilter<"TrackRecord"> | number
    values?: JsonFilter<"TrackRecord">
    createdById?: StringNullableFilter<"TrackRecord"> | string | null
    createdAt?: DateTimeFilter<"TrackRecord"> | Date | string
    updatedAt?: DateTimeFilter<"TrackRecord"> | Date | string
  }

  export type TrackSheetCreateWithoutCategoriesInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
    fields?: TrackFieldCreateNestedManyWithoutSheetInput
    records?: TrackRecordCreateNestedManyWithoutSheetInput
  }

  export type TrackSheetUncheckedCreateWithoutCategoriesInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
    fields?: TrackFieldUncheckedCreateNestedManyWithoutSheetInput
    records?: TrackRecordUncheckedCreateNestedManyWithoutSheetInput
  }

  export type TrackSheetCreateOrConnectWithoutCategoriesInput = {
    where: TrackSheetWhereUniqueInput
    create: XOR<TrackSheetCreateWithoutCategoriesInput, TrackSheetUncheckedCreateWithoutCategoriesInput>
  }

  export type TrackSheetUpsertWithoutCategoriesInput = {
    update: XOR<TrackSheetUpdateWithoutCategoriesInput, TrackSheetUncheckedUpdateWithoutCategoriesInput>
    create: XOR<TrackSheetCreateWithoutCategoriesInput, TrackSheetUncheckedCreateWithoutCategoriesInput>
    where?: TrackSheetWhereInput
  }

  export type TrackSheetUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: TrackSheetWhereInput
    data: XOR<TrackSheetUpdateWithoutCategoriesInput, TrackSheetUncheckedUpdateWithoutCategoriesInput>
  }

  export type TrackSheetUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fields?: TrackFieldUpdateManyWithoutSheetNestedInput
    records?: TrackRecordUpdateManyWithoutSheetNestedInput
  }

  export type TrackSheetUncheckedUpdateWithoutCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fields?: TrackFieldUncheckedUpdateManyWithoutSheetNestedInput
    records?: TrackRecordUncheckedUpdateManyWithoutSheetNestedInput
  }

  export type TrackSheetCreateWithoutFieldsInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
    categories?: TrackCategoryCreateNestedManyWithoutSheetInput
    records?: TrackRecordCreateNestedManyWithoutSheetInput
  }

  export type TrackSheetUncheckedCreateWithoutFieldsInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
    categories?: TrackCategoryUncheckedCreateNestedManyWithoutSheetInput
    records?: TrackRecordUncheckedCreateNestedManyWithoutSheetInput
  }

  export type TrackSheetCreateOrConnectWithoutFieldsInput = {
    where: TrackSheetWhereUniqueInput
    create: XOR<TrackSheetCreateWithoutFieldsInput, TrackSheetUncheckedCreateWithoutFieldsInput>
  }

  export type TrackSheetUpsertWithoutFieldsInput = {
    update: XOR<TrackSheetUpdateWithoutFieldsInput, TrackSheetUncheckedUpdateWithoutFieldsInput>
    create: XOR<TrackSheetCreateWithoutFieldsInput, TrackSheetUncheckedCreateWithoutFieldsInput>
    where?: TrackSheetWhereInput
  }

  export type TrackSheetUpdateToOneWithWhereWithoutFieldsInput = {
    where?: TrackSheetWhereInput
    data: XOR<TrackSheetUpdateWithoutFieldsInput, TrackSheetUncheckedUpdateWithoutFieldsInput>
  }

  export type TrackSheetUpdateWithoutFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categories?: TrackCategoryUpdateManyWithoutSheetNestedInput
    records?: TrackRecordUpdateManyWithoutSheetNestedInput
  }

  export type TrackSheetUncheckedUpdateWithoutFieldsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categories?: TrackCategoryUncheckedUpdateManyWithoutSheetNestedInput
    records?: TrackRecordUncheckedUpdateManyWithoutSheetNestedInput
  }

  export type TrackSheetCreateWithoutRecordsInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
    categories?: TrackCategoryCreateNestedManyWithoutSheetInput
    fields?: TrackFieldCreateNestedManyWithoutSheetInput
  }

  export type TrackSheetUncheckedCreateWithoutRecordsInput = {
    id: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    hiddenAt?: Date | string | null
    categories?: TrackCategoryUncheckedCreateNestedManyWithoutSheetInput
    fields?: TrackFieldUncheckedCreateNestedManyWithoutSheetInput
  }

  export type TrackSheetCreateOrConnectWithoutRecordsInput = {
    where: TrackSheetWhereUniqueInput
    create: XOR<TrackSheetCreateWithoutRecordsInput, TrackSheetUncheckedCreateWithoutRecordsInput>
  }

  export type TrackSheetUpsertWithoutRecordsInput = {
    update: XOR<TrackSheetUpdateWithoutRecordsInput, TrackSheetUncheckedUpdateWithoutRecordsInput>
    create: XOR<TrackSheetCreateWithoutRecordsInput, TrackSheetUncheckedCreateWithoutRecordsInput>
    where?: TrackSheetWhereInput
  }

  export type TrackSheetUpdateToOneWithWhereWithoutRecordsInput = {
    where?: TrackSheetWhereInput
    data: XOR<TrackSheetUpdateWithoutRecordsInput, TrackSheetUncheckedUpdateWithoutRecordsInput>
  }

  export type TrackSheetUpdateWithoutRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categories?: TrackCategoryUpdateManyWithoutSheetNestedInput
    fields?: TrackFieldUpdateManyWithoutSheetNestedInput
  }

  export type TrackSheetUncheckedUpdateWithoutRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hiddenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categories?: TrackCategoryUncheckedUpdateManyWithoutSheetNestedInput
    fields?: TrackFieldUncheckedUpdateManyWithoutSheetNestedInput
  }

  export type SessionCreateManyUserInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AccountCreateManyUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RegisterSuratCreateManyDeptInput = {
    id?: number
    nomor: string
    tanggalTerima: Date | string
    asalSurat: string
    tujuan?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NomorCounterCreateManyDeptInput = {
    year: number
    counter?: number
  }

  export type DepartmentColumnCreateManyDepartmentInput = {
    id: string
    label: string
    dataType: string
    defaultValue?: string
    isDefault?: boolean
    isRequired?: boolean
    showInDataSurat?: boolean
    showInPrint?: boolean
    sortOrder?: number
    displayOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RegisterSuratUpdateWithoutDeptInput = {
    nomor?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detailSurat?: DetailSuratUpdateManyWithoutRegisterNestedInput
  }

  export type RegisterSuratUncheckedUpdateWithoutDeptInput = {
    id?: IntFieldUpdateOperationsInput | number
    nomor?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    detailSurat?: DetailSuratUncheckedUpdateManyWithoutRegisterNestedInput
  }

  export type RegisterSuratUncheckedUpdateManyWithoutDeptInput = {
    id?: IntFieldUpdateOperationsInput | number
    nomor?: StringFieldUpdateOperationsInput | string
    tanggalTerima?: DateTimeFieldUpdateOperationsInput | Date | string
    asalSurat?: StringFieldUpdateOperationsInput | string
    tujuan?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NomorCounterUpdateWithoutDeptInput = {
    year?: IntFieldUpdateOperationsInput | number
    counter?: IntFieldUpdateOperationsInput | number
  }

  export type NomorCounterUncheckedUpdateWithoutDeptInput = {
    year?: IntFieldUpdateOperationsInput | number
    counter?: IntFieldUpdateOperationsInput | number
  }

  export type NomorCounterUncheckedUpdateManyWithoutDeptInput = {
    year?: IntFieldUpdateOperationsInput | number
    counter?: IntFieldUpdateOperationsInput | number
  }

  export type DepartmentColumnUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    showInDataSurat?: BoolFieldUpdateOperationsInput | boolean
    showInPrint?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentColumnUncheckedUpdateWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    showInDataSurat?: BoolFieldUpdateOperationsInput | boolean
    showInPrint?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DepartmentColumnUncheckedUpdateManyWithoutDepartmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    isRequired?: BoolFieldUpdateOperationsInput | boolean
    showInDataSurat?: BoolFieldUpdateOperationsInput | boolean
    showInPrint?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    displayOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailSuratCreateManyRegisterInput = {
    id?: number
    perihal: string
    noSurat?: string | null
    lampiran?: string | null
    tanggalSurat: Date | string
    tujuan?: string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DetailSuratUpdateWithoutRegisterInput = {
    perihal?: StringFieldUpdateOperationsInput | string
    noSurat?: NullableStringFieldUpdateOperationsInput | string | null
    lampiran?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalSurat?: DateTimeFieldUpdateOperationsInput | Date | string
    tujuan?: NullableStringFieldUpdateOperationsInput | string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailSuratUncheckedUpdateWithoutRegisterInput = {
    id?: IntFieldUpdateOperationsInput | number
    perihal?: StringFieldUpdateOperationsInput | string
    noSurat?: NullableStringFieldUpdateOperationsInput | string | null
    lampiran?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalSurat?: DateTimeFieldUpdateOperationsInput | Date | string
    tujuan?: NullableStringFieldUpdateOperationsInput | string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DetailSuratUncheckedUpdateManyWithoutRegisterInput = {
    id?: IntFieldUpdateOperationsInput | number
    perihal?: StringFieldUpdateOperationsInput | string
    noSurat?: NullableStringFieldUpdateOperationsInput | string | null
    lampiran?: NullableStringFieldUpdateOperationsInput | string | null
    tanggalSurat?: DateTimeFieldUpdateOperationsInput | Date | string
    tujuan?: NullableStringFieldUpdateOperationsInput | string | null
    customFields?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackCategoryCreateManySheetInput = {
    id: string
    name: string
    color?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackFieldCreateManySheetInput = {
    id: string
    categoryId?: string | null
    category: string
    categoryColor?: string
    region: string
    columnName: string
    dataType: string
    defaultValue?: string
    categoryOptions?: string
    fillRequired?: boolean
    addRoleValues?: string
    editRoleValues?: string
    deleteRoleValues?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackRecordCreateManySheetInput = {
    id: string
    sequenceNo?: number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrackCategoryUpdateWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackCategoryUncheckedUpdateWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackCategoryUncheckedUpdateManyWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    color?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackFieldUpdateWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryColor?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    columnName?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    categoryOptions?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackFieldUncheckedUpdateWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryColor?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    columnName?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    categoryOptions?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackFieldUncheckedUpdateManyWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    categoryColor?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    columnName?: StringFieldUpdateOperationsInput | string
    dataType?: StringFieldUpdateOperationsInput | string
    defaultValue?: StringFieldUpdateOperationsInput | string
    categoryOptions?: StringFieldUpdateOperationsInput | string
    fillRequired?: BoolFieldUpdateOperationsInput | boolean
    addRoleValues?: StringFieldUpdateOperationsInput | string
    editRoleValues?: StringFieldUpdateOperationsInput | string
    deleteRoleValues?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackRecordUpdateWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNo?: IntFieldUpdateOperationsInput | number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackRecordUncheckedUpdateWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNo?: IntFieldUpdateOperationsInput | number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrackRecordUncheckedUpdateManyWithoutSheetInput = {
    id?: StringFieldUpdateOperationsInput | string
    sequenceNo?: IntFieldUpdateOperationsInput | number
    values?: JsonNullValueInput | InputJsonValue
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}