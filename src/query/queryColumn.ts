import type { DbType } from "../db.js";
import eq from "./comparisons/eq.js";
import between from "./comparisons/between.js";
import sqlIn from "./comparisons/in.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type Column from "../table/column.js";
import type { ColumnType, DbValueTypes } from "../table/column.js";
import notEq from "./comparisons/notEq.js";

type QueryColumnsObjectType<TDbType extends DbType> = { [key: string]: QueryColumn<TDbType, any, any, any> }

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends { tableName: string, asTableName?: string },
    TAsName extends string | undefined = undefined,
    TDefaultFieldKey extends string = TColumn["name"],
    TValueType extends DbValueTypes = TColumn extends Column<TDbType, any, any, any, any, infer TValType> ? TValType : never,
    TFinalValueType extends TValueType | null = TColumn extends Column<TDbType, any, any, any, any, any, infer TFinalValType> ? TFinalValType : never
> implements IComparable<TDbType, undefined, TValueType, TFinalValueType, TDefaultFieldKey, TAsName> {
    qTableSpecs: TQTableSpecs;

    dbType: TDbType;

    asName?: TAsName;
    params?: undefined;
    [IComparableValueDummySymbol]?: TValueType;
    [IComparableFinalValueDummySymbol]?: TFinalValueType;
    isAgg?: false;
    defaultFieldKey: TDefaultFieldKey;

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    constructor(dbType: TDbType, public column: TColumn, qTableSpecs: TQTableSpecs, asName?: TAsName) {
        this.asName = asName;
        this.dbType = dbType;
        this.qTableSpecs = qTableSpecs;
        this.defaultFieldKey = column.name as TDefaultFieldKey;
    }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TDefaultFieldKey>(this.dbType, this.column, this.qTableSpecs, val);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        return { query: `${this.qTableSpecs.asTableName || this.qTableSpecs.tableName}.${this.asName || this.defaultFieldKey}`, params: context.params };
    }
}


export default QueryColumn;

export type {
    QueryColumnsObjectType
}