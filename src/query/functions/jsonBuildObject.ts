import type { DbType, PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type AggregatedColumn from "../aggregation/_aggregatedColumn.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import type { InferIsAggFromJSONFn, InferReturnTypeFromJSONBuildObjectParam } from "./_types/args.js";

type JSONBuildObjectParam<TDbType extends DbType> = {
    [key: string]:
    IComparable<TDbType, any, any, any, any> |
    AggregatedColumn<TDbType, any> |
    JSONBuildObjectParam<TDbType>
}

function jsonBuildObject<
    TDbType extends PgDbType,
    TObj extends JSONBuildObjectParam<TDbType>,
    TReturnType extends PgValueTypes = InferReturnTypeFromJSONBuildObjectParam<TDbType, TObj>,
    IsAggregation extends boolean = InferIsAggFromJSONFn<TDbType, TObj>
>
    (obj: TObj) {

}


export type {
    JSONBuildObjectParam
}