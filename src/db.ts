const dbTypes = {
    postgresql: 'postgresql',
    mysql: 'mysql'
} as const;

type PgDbType = typeof dbTypes.postgresql;
type MySQLDbType = typeof dbTypes.mysql;
type DbType = PgDbType | MySQLDbType;


export type {
    PgDbType,
    MySQLDbType,
    DbType
}

export {
    dbTypes
}
