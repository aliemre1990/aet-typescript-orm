import type { DbType } from "../../db.js";
import type { ColumnType, DbValueTypes } from "../../table/column.js";
import type Column from "../../table/column.js";
import QueryColumn from "../queryColumn.js";
import type { QueryTableSpecsType } from "../queryTable.js";

class GroupedColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined,
    TValueType extends DbValueTypes = TColumn extends Column<TDbType, any, any, any, any, infer TValType> ? TValType : never,
    TFinalValueType extends TValueType | null = TColumn extends Column<TDbType, any, any, any, any, any, infer TFinalValType> ? TFinalValType : never
> extends QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TValueType, TFinalValueType> {
    constructor(public column: TColumn, asName?: TAsName) {
        super(column, asName)
    }
}


export default GroupedColumn;
