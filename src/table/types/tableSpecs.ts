type TableSpecsType<TTableName extends string = string> = { tableName: TTableName }
type QueryTableSpecsType<TTableName extends string = string, TAsName extends string = string> = { tableName: TTableName, asTableName?: TAsName }

export type {
    TableSpecsType,
    QueryTableSpecsType
}

