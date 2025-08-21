const pgColumnTypes = {
    // Numeric Types
    smallInt: 'SMALLINT',
    int: 'INTEGER',
    bigInt: 'BIGINT',
    decimal: 'DECIMAL',
    numeric: 'NUMERIC',
    real: 'REAL',
    doublePrecision: 'DOUBLE PRECISION',
    smallSerial: 'SMALLSERIAL',
    serial: 'SERIAL',
    bigSerial: 'BIGSERIAL',

    // Monetary Type
    money: 'MONEY',

    // Character Types
    varchar: 'VARCHAR',
    char: 'CHAR',
    text: 'TEXT',

    // Binary Data Types
    bytea: 'BYTEA',

    // Date/Time Types
    timestamp: 'TIMESTAMP',
    timestampWithTimeZone: 'TIMESTAMP WITH TIME ZONE',
    timestampWithoutTimeZone: 'TIMESTAMP WITHOUT TIME ZONE',
    date: 'DATE',
    time: 'TIME',
    timeWithTimeZone: 'TIME WITH TIME ZONE',
    timeWithoutTimeZone: 'TIME WITHOUT TIME ZONE',
    interval: 'INTERVAL',

    // Boolean Type
    boolean: 'BOOLEAN',

    // Enumerated Type
    enum: 'ENUM',

    // Geometric Types
    point: 'POINT',
    line: 'LINE',
    lseg: 'LSEG',
    box: 'BOX',
    path: 'PATH',
    polygon: 'POLYGON',
    circle: 'CIRCLE',

    // Network Address Types
    cidr: 'CIDR',
    inet: 'INET',
    macAddr: 'MACADDR',
    macAddr8: 'MACADDR8',

    // Bit String Types
    bit: 'BIT',
    bitVarying: 'BIT VARYING',

    // Text Search Types
    tsVector: 'TSVECTOR',
    tsQuery: 'TSQUERY',

    // UUID Type
    uuid: 'UUID',

    // XML Type
    xml: 'XML',

    // JSON Types
    json: 'JSON',
    jsonb: 'JSONB',

    // Array Types
    array: 'ARRAY',

    // Composite Types
    composite: 'COMPOSITE',

    // Range Types
    int4Range: 'INT4RANGE',
    int8Range: 'INT8RANGE',
    numRange: 'NUMRANGE',
    tsRange: 'TSRANGE',
    tstzRange: 'TSTZRANGE',
    dateRange: 'DATERANGE',

    // Domain Types
    domain: 'DOMAIN',

    // Object Identifier Types
    oid: 'OID',
    regProc: 'REGPROC',
    regProcedure: 'REGPROCEDURE',
    regOper: 'REGOPER',
    regOperator: 'REGOPERATOR',
    regClass: 'REGCLASS',
    regType: 'REGTYPE',
    regRole: 'REGROLE',
    regNamespace: 'REGNAMESPACE',
    regConfig: 'REGCONFIG',
    regDictionary: 'REGDICTIONARY',

    // Pseudo Types
    record: 'RECORD',
    cString: 'CSTRING',
    any: 'ANY',
    anyArray: 'ANYARRAY',
    anyNonArray: 'ANYNONARRAY',
    anyEnum: 'ANYENUM',
    anyRange: 'ANYRANGE',
    anyCompatible: 'ANYCOMPATIBLE',
    anyCompatibleArray: 'ANYCOMPATIBLEARRAY',
    anyCompatibleNonArray: 'ANYCOMPATIBLENONARRAY',
    anyCompatibleRange: 'ANYCOMPATIBLERANGE',
    void: 'VOID',
    trigger: 'TRIGGER',
    languageHandler: 'LANGUAGE_HANDLER',
    internal: 'INTERNAL',
    opaque: 'OPAQUE',
    anyElement: 'ANYELEMENT',
    eventTrigger: 'EVENT_TRIGGER',
    fdwHandler: 'FDW_HANDLER',
    indexAmHandler: 'INDEX_AM_HANDLER',
    tsmHandler: 'TSM_HANDLER',
    tableAmHandler: 'TABLE_AM_HANDLER'
} as const;
type PgColumnType = typeof pgColumnTypes[keyof typeof pgColumnTypes];

type PgTypeToJsType<T extends PgColumnType> =
    T extends 'SMALLINT' | 'INTEGER' | 'SERIAL' | 'SMALLSERIAL' ? number :
    T extends 'BIGINT' | 'BIGSERIAL' ? bigint :
    T extends 'DECIMAL' | 'NUMERIC' | 'REAL' | 'DOUBLE PRECISION' | 'MONEY' ? number :
    T extends 'VARCHAR' | 'CHAR' | 'TEXT' ? string :
    T extends 'BYTEA' ? Buffer :
    T extends 'TIMESTAMP' | 'TIMESTAMP WITH TIME ZONE' | 'TIMESTAMP WITHOUT TIME ZONE' | 'DATE' | 'TIME' | 'TIME WITH TIME ZONE' | 'TIME WITHOUT TIME ZONE' ? Date :
    T extends 'INTERVAL' ? string :
    T extends 'BOOLEAN' ? boolean :
    T extends 'ENUM' ? string :
    T extends 'POINT' | 'LINE' | 'LSEG' | 'BOX' | 'PATH' | 'POLYGON' | 'CIRCLE' ? object :
    T extends 'CIDR' | 'INET' | 'MACADDR' | 'MACADDR8' ? string :
    T extends 'BIT' | 'BIT VARYING' ? string :
    T extends 'TSVECTOR' | 'TSQUERY' ? string :
    T extends 'UUID' ? string :
    T extends 'XML' ? string :
    T extends 'JSON' | 'JSONB' ? any :
    T extends 'ARRAY' ? any[] :
    T extends 'COMPOSITE' ? object :
    T extends 'INT4RANGE' | 'INT8RANGE' | 'NUMRANGE' | 'TSRANGE' | 'TSTZRANGE' | 'DATERANGE' ? object :
    T extends 'DOMAIN' ? any :
    T extends 'OID' | 'REGPROC' | 'REGPROCEDURE' | 'REGOPER' | 'REGOPERATOR' | 'REGCLASS' | 'REGTYPE' | 'REGROLE' | 'REGNAMESPACE' | 'REGCONFIG' | 'REGDICTIONARY' ? number :
    T extends 'RECORD' ? object :
    T extends 'CSTRING' ? string :
    T extends 'ANY' | 'ANYARRAY' | 'ANYNONARRAY' | 'ANYENUM' | 'ANYRANGE' | 'ANYCOMPATIBLE' | 'ANYCOMPATIBLEARRAY' | 'ANYCOMPATIBLENONARRAY' | 'ANYCOMPATIBLERANGE' | 'ANYELEMENT' ? any :
    T extends 'VOID' ? void :
    T extends 'TRIGGER' | 'EVENT_TRIGGER' ? Function :
    T extends 'LANGUAGE_HANDLER' | 'INTERNAL' | 'OPAQUE' | 'FDW_HANDLER' | 'INDEX_AM_HANDLER' | 'TSM_HANDLER' | 'TABLE_AM_HANDLER' ? any :
    unknown;

type PgValueTypes = string | number | bigint | boolean | Date | Buffer | object | null;

export type {
    PgColumnType,
    PgTypeToJsType,
    PgValueTypes
}


export {
    pgColumnTypes
}