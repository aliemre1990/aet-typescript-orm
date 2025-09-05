import type { DbType } from "../db.js";
import type { TableSpecsType } from "./types/tableSpecs.js";
import type { GetColumnTypes, GetValueTypeFromColumnType, GetColumnValueTypes } from "./types/utils.js";

class Column<
    TDbType extends DbType,
    TColumnType extends GetColumnTypes<TDbType>,
    TColumnName extends string,
    TTableSpecs extends TableSpecsType,
    TIsNull extends boolean = false,
    TValueType extends GetColumnValueTypes<TDbType> = GetValueTypeFromColumnType<TDbType, TColumnType>,
    TFinalValueType extends GetColumnValueTypes<TDbType> | null = TIsNull extends true ? TValueType | null : TValueType
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