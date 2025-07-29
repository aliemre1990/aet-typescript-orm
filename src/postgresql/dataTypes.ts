const pgColumnTypes = {
    PgIntType: 'INTEGER',
    PgBigIntType: 'BIGINT',
    PgSerialType: 'SERIAL',
    PgVarcharType: 'VARCHAR',
    PgBooleanType: 'BOOLEAN',
    PgDateType: 'DATE',
    PgTimestampWithoutTimeZoneType: 'TIMESTAMP WITHOUT TIME ZONE',
    PgTimestampWithTimeZoneType: 'TIMESTAMP WITH TIME ZONE',
} as const;

type PgColumnType = typeof pgColumnTypes[keyof typeof pgColumnTypes];

export type {
    PgColumnType
}

export {
    pgColumnTypes
}