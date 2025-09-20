import type { DbType, PgDbType } from "../db.js";
import type { PgColumnType, PgTypeToJsType } from "./columnTypes.js";
import type { TableSpecsType } from "./table.js";

type DbValueTypes = string | string[] | number | number[] | bigint | bigint[] | boolean | boolean[] | Date | Date[] | Buffer | object | object[];

type GetColumnTypes<TDbType extends DbType> = TDbType extends PgDbType ? PgColumnType : never;
type GetValueTypeFromColumnType<TDbType extends DbType, TColType extends TDbType extends PgDbType ? PgColumnType : never> =
    TDbType extends PgDbType ? PgTypeToJsType<TColType> : never;

type ColumnType<TDbType extends DbType> = Column<TDbType, GetColumnTypes<TDbType>, string, TableSpecsType, boolean, any, any>;
type ColumnsObjectType<TDbType extends DbType> = { [key: string]: ColumnType<TDbType> };

class Column<
    TDbType extends DbType,
    TColumnType extends GetColumnTypes<TDbType>,
    TColumnName extends string,
    TTableSpecs extends TableSpecsType,
    TIsNull extends boolean = false,
    TValueType extends DbValueTypes = GetValueTypeFromColumnType<TDbType, TColumnType>,
    TFinalValueType extends DbValueTypes | null = TIsNull extends true ? TValueType | null : TValueType
> {

    tableSpecs?: TTableSpecs;

    value?: TValueType;
    finalValue?: TFinalValueType;

    constructor(
        public name: TColumnName,
        public type: TColumnType,
        public isNullable: TIsNull,
        public defaultValue?: string
    ) { }

    setTableSpecs(val: TTableSpecs) {
        this.tableSpecs = val;
    }

}

export default Column;

export type {
    DbValueTypes,
    GetColumnTypes,
    ColumnType,
    ColumnsObjectType,
    GetValueTypeFromColumnType
}