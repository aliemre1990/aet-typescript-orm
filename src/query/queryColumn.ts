import type { DbType, DbValueTypes } from "../db.js";
import type { ColumnType, QueryTableSpecsType } from "../table/types/utils.js";
import eq from "./comparisons/eq.js";
import between from "./comparisons/between.js";
import sqlIn from "./comparisons/in.js";
import type { IComparable } from "./comparisons/_interfaces/IComparable.js";
import type Column from "../table/column.js";
import type QueryTable from "./queryTable.js";

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined,
    TValueType extends DbValueTypes = TColumn extends Column<TDbType, any, any, any, any, infer TValType> ? TValType : never,
    TFinalValueType extends TValueType | null = TColumn extends Column<TDbType, any, any, any, any, any, infer TFinalValType> ? TFinalValType : never
> implements IComparable<TDbType, undefined, TValueType, TFinalValueType, false> {
    qTableSpecs?: TQTableSpecs;

    asName?: TAsName;
    params?: undefined;
    dbType?: TDbType;
    icomparableValueDummy?: TValueType;
    icomparableFinalValueDummy?: TFinalValueType;
    isAgg?: false;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;

    between: typeof between = between;

    constructor(public column: TColumn, asName?: TAsName) {
        this.asName = asName;
    }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>(this.column, val);
    }

    setQTableSpecs(val: TQTableSpecs) {
        this.qTableSpecs = val;
    }
}


const ColumnsSelectionQueryTableObjectKey = Symbol();
type ColumnsSelection<
    TDbType extends DbType,
    TQTable extends QueryTable<TDbType, any, any, any, any, any>
> = {
    [ColumnsSelectionQueryTableObjectKey]: TQTable;
} & {
        [K in keyof TQTable["columns"]as TQTable["columns"][K]["column"]["name"]]: TQTable["columns"][K];
    }



export default QueryColumn;

export {
    ColumnsSelection,
}