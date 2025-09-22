import type { DbType } from "../db.js";
import eq from "./comparisons/eq.js";
import between from "./comparisons/between.js";
import sqlIn from "./comparisons/in.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type Column from "../table/column.js";
import type QueryTable from "./queryTable.js";
import type { ColumnType, DbValueTypes } from "../table/column.js";
import type { QueryTableSpecsType } from "./queryTable.js";
import type QueryBuilder from "./queryBuilder.js";
import type { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";

type QueryColumnsObjectType<TDbType extends DbType, TQTableSpecs extends QueryTableSpecsType = QueryTableSpecsType> = { [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, TQTableSpecs, string | undefined> }

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined,
    TValueType extends DbValueTypes = TColumn extends Column<TDbType, any, any, any, any, infer TValType> ? TValType : never,
    TFinalValueType extends TValueType | null = TColumn extends Column<TDbType, any, any, any, any, any, infer TFinalValType> ? TFinalValType : never
> implements IComparable<TDbType, undefined, TValueType, TFinalValueType, false, any> {
    qTableSpecs?: TQTableSpecs;

    dbType: TDbType;

    asName?: TAsName;
    params?: undefined;
    icomparableValueDummy?: TValueType;
    icomparableFinalValueDummy?: TFinalValueType;
    isAgg?: false;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    constructor(dbType: TDbType, public column: TColumn, asName?: TAsName) {
        this.asName = asName;
        this.dbType = dbType;
    }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>(this.dbType, this.column, val);
    }

    setQTableSpecs(val: TQTableSpecs) {
        this.qTableSpecs = val;
    }
}


const ColumnsSelectionQueryTableObjectSymbol = Symbol();
type ColumnsSelection<
    TDbType extends DbType,
    TQItem extends QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>,
    TColumns extends { [key: string]: IComparable<TDbType, any, any, any, any, any> }
> = {
    [ColumnsSelectionQueryTableObjectSymbol]: TQItem;
}
    &
    {
        [K in keyof TColumns]: TColumns[K];
    };




export default QueryColumn;

export {
    ColumnsSelection,
    ColumnsSelectionQueryTableObjectSymbol
}

export type {
    QueryColumnsObjectType
}