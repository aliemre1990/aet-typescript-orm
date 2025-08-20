import type { DbType, PgDbType } from "../../db.js";
import type { PgColumnType } from "../../postgresql/dataTypes.js";
import type Column from "../column.js";
import type QueryColumn from "../queryColumn.js";
import type QueryTable from "../queryTable.js";
import type Table from "../table.js";
import type { QueryTableSpecsType, TableSpecsType } from "./tableSpecs.js";

type GetColumnType<TDbType extends DbType> = TDbType extends PgDbType ? PgColumnType : string;

type ColumnType<TDbType extends DbType> = Column<TDbType, GetColumnType<TDbType>, string, TableSpecsType>;
type ColumnsObjectType<TDbType extends DbType> = { [key: string]: ColumnType<TDbType> };
type TableType<TDbType extends DbType, TColumns extends ColumnsObjectType<TDbType>, TTableName extends string = string> = Table<TDbType, TColumns, TTableName>;
type TablesObjectType<TDbType extends DbType> = { [key: string]: TableType<TDbType, ColumnsObjectType<TDbType>> };
type QueryTablesObjectType<TDbType extends DbType, TAsName extends string | undefined = string | undefined> = { [key: string]: QueryTable<TDbType, ColumnsObjectType<TDbType>, string, TableType<TDbType, ColumnsObjectType<TDbType>>, QueryColumnsObjectType<TDbType, QueryTableSpecsType>, TAsName> }
type QueryColumnsObjectType<TDbType extends DbType, TQTableSpecs extends QueryTableSpecsType = QueryTableSpecsType> = { [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, TQTableSpecs, string | undefined> }

export type {
    GetColumnType,
    ColumnType,
    ColumnsObjectType,
    TableType,
    TablesObjectType,
    QueryTablesObjectType,
    QueryColumnsObjectType,
    QueryTableSpecsType
}