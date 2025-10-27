import type { DbType } from "../db.js";
import eq from "./comparisons/eq.js";
import between from "./comparisons/between.js";
import sqlIn from "./comparisons/in.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import type Column from "../table/column.js";
import type { ColumnType, DbValueTypes } from "../table/column.js";

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
    qTableSpecs?: TQTableSpecs;

    dbType: TDbType;

    asName?: TAsName;
    params?: undefined;
    [IComparableValueDummySymbol]?: TValueType;
    [IComparableFinalValueDummySymbol]?: TFinalValueType;
    isAgg?: false;
    defaultFieldKey: TDefaultFieldKey;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    constructor(dbType: TDbType, public column: TColumn, asName?: TAsName, ownerName?: string) {
        this.asName = asName;
        this.ownerName = ownerName;
        this.dbType = dbType;
        this.defaultFieldKey = column.name as TDefaultFieldKey;
    }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TDefaultFieldKey>(this.dbType, this.column, val, this.ownerName);
    }

    ownerName?: string;
    setOwnerName(val: string): QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TDefaultFieldKey, TValueType, TFinalValueType> {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName, TDefaultFieldKey, TValueType, TFinalValueType>(this.dbType, this.column, this.asName, val);
    }

    buildSQL(context?: QueryBuilderContext) {
        return { query: `${this.ownerName}.${this.asName || this.defaultFieldKey}`, params: [...(context?.params || [])] };
    }
}


export default QueryColumn;

export type {
    QueryColumnsObjectType
}