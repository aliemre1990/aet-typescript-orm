const dbTypes = {
    postgresql: 'postgresql',
    mysql: 'mysql'
} as const;

type PgDbType = typeof dbTypes.postgresql;
type MySQLDbType = typeof dbTypes.mysql;
type DbType = PgDbType | MySQLDbType;

type DbValueTypes = string | string[] | number | number[] | bigint | bigint[] | boolean | boolean[] | Date | Date[] | Buffer | object | object[];

export type {
    PgDbType,
    DbType,
    DbValueTypes
}

export {
    dbTypes
}
