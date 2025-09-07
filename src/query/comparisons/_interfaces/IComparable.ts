import type { DbType, DbValueTypes, PgDbType } from "../../../db.js";
import type { GetColumnValueTypes } from "../../../table/types/utils.js";
import type QueryParam from "../../param.js";

interface IComparable<
    TDbType extends DbType,
    TParams extends QueryParam<TDbType, string, any>[] | undefined,
    TValueType extends GetColumnValueTypes<TDbType>,
    TFinalValueType extends TValueType | null
> {
    icomparableValueDummy?: TValueType;
    icomparableFinalValueDummy?: TFinalValueType;
    params?: TParams;
}

export type {
    IComparable
}