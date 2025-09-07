import type { DbType, DbValueTypes, PgDbType } from "../../../db.js";
import type QueryParam from "../../param.js";

interface IComparable<
    TDbType extends DbType,
    TParams extends QueryParam<TDbType, string, any>[] | undefined,
    TValueType extends (TDbType extends PgDbType ? DbValueTypes : never) | null
> {
    icomparableValueDummy?: TValueType;
    params?: TParams;
}

export type {
    IComparable
}