import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type QueryParam from "../param.js";
import type between from "../comparisons/between.js";
import type eq from "../comparisons/eq.js";
import type sqlIn from "../comparisons/in.js";

interface IComparable<
    TDbType extends DbType,
    TParams extends QueryParam<TDbType, string, any>[] | undefined,
    TValueType extends DbValueTypes,
    TFinalValueType extends TValueType | null,
    TIsAgg extends boolean
> {
    dbType?: TDbType;
    icomparableValueDummy?: TValueType;
    icomparableFinalValueDummy?: TFinalValueType;
    params?: TParams;
    isAgg?: TIsAgg;

    eq: typeof eq;
    sqlIn: typeof sqlIn;
    between: typeof between;
}

export type {
    IComparable
}