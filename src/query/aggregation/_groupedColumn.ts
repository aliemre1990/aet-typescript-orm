import type { DbType } from "../../db.js";
import type Column from "../../table/column.js";
import type { ColumnType, GetColumnValueTypes, QueryTableSpecsType } from "../../table/types/utils.js";
import QueryColumn from "../queryColumn.js";

class GroupedColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined,
    TValueType extends GetColumnValueTypes<TDbType> = TColumn extends Column<TDbType, any, any, any, any, infer TValType> ? TValType : never,
    TFinalValueType extends TValueType | null = TColumn extends Column<TDbType, any, any, any, any, any, infer TFinalValType> ? TFinalValType : never
> extends QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TValueType, TFinalValueType> {
    constructor(public column: TColumn, asName?: TAsName) {
        super(column, asName)
    }
}


export default GroupedColumn;
