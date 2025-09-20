import type { DbType } from "../../../db.js";
import type { DbValueTypes } from "../../../table/column.js";
import type QueryParam from "../../param.js";

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
}

export type {
    IComparable
}