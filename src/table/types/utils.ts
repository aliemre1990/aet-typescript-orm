import type { DbType, PgDbType } from "../../db.js";
import type { PgColumnType, PgTypeToJsType, PgValueTypes } from "../../postgresql/dataTypes.js";
import type Column from "../column.js";
import type QueryColumn from "../../query/queryColumn.js";
import type Table from "../table.js";
import type { QueryTableSpecsType, TableSpecsType } from "./tableSpecs.js";
import type QueryTable from "../../query/queryTable.js";

type GetColumnTypes<TDbType extends DbType> = TDbType extends PgDbType ? PgColumnType : never;
type GetColumnValueTypes<TDbType extends DbType> = TDbType extends PgDbType ? PgValueTypes : never;
type GetValueTypeFromColumnType<TDbType extends DbType, TColType extends TDbType extends PgDbType ? PgColumnType : never> =
    TDbType extends PgDbType ? PgTypeToJsType<TColType> : never;

type ColumnType<TDbType extends DbType> = Column<TDbType, GetColumnTypes<TDbType>, string, TableSpecsType, boolean>;
type ColumnsObjectType<TDbType extends DbType> = { [key: string]: ColumnType<TDbType> };
type TableType<TDbType extends DbType, TColumns extends ColumnsObjectType<TDbType>, TTableName extends string = string> = Table<TDbType, TColumns, TTableName>;
type TablesObjectType<TDbType extends DbType> = { [key: string]: TableType<TDbType, ColumnsObjectType<TDbType>> };
type QueryTablesObjectType<TDbType extends DbType, TAsName extends string | undefined = string | undefined> = { [key: string]: QueryTable<TDbType, ColumnsObjectType<TDbType>, string, TableType<TDbType, ColumnsObjectType<TDbType>>, QueryColumnsObjectType<TDbType, QueryTableSpecsType>, TAsName> }
type QueryColumnsObjectType<TDbType extends DbType, TQTableSpecs extends QueryTableSpecsType = QueryTableSpecsType> = { [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, TQTableSpecs, string | undefined> }

export type {
    GetColumnTypes,
    ColumnType,
    ColumnsObjectType,
    TableType,
    TablesObjectType,
    QueryTablesObjectType,
    QueryColumnsObjectType,
    QueryTableSpecsType,
    GetColumnValueTypes,
    GetValueTypeFromColumnType
}