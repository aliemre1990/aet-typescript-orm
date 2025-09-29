import type { DbType } from "../db.js";
import eq from "./comparisons/eq.js";
import between from "./comparisons/between.js";
import sqlIn from "./comparisons/in.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type Column from "../table/column.js";
import type QueryTable from "./queryTable.js";
import type { ColumnType, DbValueTypes } from "../table/column.js";
import type { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";

type QueryColumnsObjectType<TDbType extends DbType> = { [key: string]: QueryColumn<TDbType, any, any, any> }

type InferIdFromQueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends { tableName: string, asTableName?: string },
    TAsName extends string | undefined,
> =
    `${TQTableSpecs extends { asTableName?: infer TAsTable } ? TAsTable extends undefined ? "undefined" : TAsTable : never}-${TQTableSpecs extends { tableName: infer TTableName } ? TTableName : never}-${TAsName extends string ? TAsName : "undefined"}-${TColumn extends Column<TDbType, any, infer TColName, any, any, any, any> ? TColName : never}`
    ;

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends { tableName: string, asTableName?: string },
    TAsName extends string | undefined = undefined,
    TDefaultFieldKey extends string = TColumn["name"],
    TValueType extends DbValueTypes = TColumn extends Column<TDbType, any, any, any, any, infer TValType> ? TValType : never,
    TFinalValueType extends TValueType | null = TColumn extends Column<TDbType, any, any, any, any, any, infer TFinalValType> ? TFinalValType : never,
    TComparableId extends string = InferIdFromQueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>
> implements IComparable<TDbType, TComparableId, undefined, TValueType, TFinalValueType, false, TDefaultFieldKey, any> {
    qTableSpecs?: TQTableSpecs;

    dbType: TDbType;

    asName?: TAsName;
    params?: undefined;
    icomparableValueDummy?: TValueType;
    icomparableFinalValueDummy?: TFinalValueType;
    icomparableIdDummy?: TComparableId;
    isAgg?: false;
    defaultFieldKey: TDefaultFieldKey;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    constructor(dbType: TDbType, public column: TColumn, asName?: TAsName) {
        this.asName = asName;
        this.dbType = dbType;
        this.defaultFieldKey = column.name as TDefaultFieldKey;
    }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TDefaultFieldKey>(this.dbType, this.column, val);
    }

    setQTableSpecs(val: TQTableSpecs) {
        this.qTableSpecs = val;
    }
}


const ColumnsSelectionQueryTableObjectSymbol = Symbol();
type ColumnsSelection<
    TDbType extends DbType,
    TQItem extends QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>,
    TColumns extends readonly IComparable<TDbType, any, any, any, any, any, any, any>[]
> =
    {
        [ColumnsSelectionQueryTableObjectSymbol]: TQItem;
    } &
    {
        [K in TColumns[number]as K["defaultFieldKey"]]: K;
    };




export default QueryColumn;

export {
    ColumnsSelection,
    ColumnsSelectionQueryTableObjectSymbol
}

export type {
    QueryColumnsObjectType
}