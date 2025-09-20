import type { DbType } from "../../../db.js";
import type { DbValueTypes } from "../../../table/column.js";
import type QueryParam from "../../param.js";
import type { IComparable } from "./IComparable.js";

interface IGroupedComparable<
    TDbType extends DbType,
    TParams extends QueryParam<TDbType, string, any>[] | undefined,
    TValueType extends DbValueTypes,
    TFinalValueType extends TValueType | null,
    TIsAgg extends boolean
> extends IComparable<TDbType, TParams, TValueType, TFinalValueType, TIsAgg> {
    dbType?: TDbType;
    icomparableValueDummy?: TValueType;
    icomparableFinalValueDummy?: TFinalValueType;
    params?: TParams;
    isAgg?: TIsAgg;
}

export type {
    IGroupedComparable
}