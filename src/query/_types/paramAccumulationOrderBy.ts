import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";
import type { OrderBySpecs, OrderType } from "../queryBuilder.js";

type AccumulateOrderByParams<
    TDbType extends DbType,
    TParams extends readonly QueryParam<any, any, any, any, any>[] | undefined,
    TOrderByParams extends OrderBySpecs<TDbType>
> =
    TParams extends undefined ?
    InferParamsFromOrderByParams<TDbType, TOrderByParams>["length"] extends 0 ? undefined : InferParamsFromOrderByParams<TDbType, TOrderByParams> :
    TParams extends QueryParam<any, any, any, any, any>[] ? [...TParams, ...InferParamsFromOrderByParams<TDbType, TOrderByParams>] :
    never;

type InferParamsFromOrderByParams<TDbType extends DbType, TOrderByParams extends OrderBySpecs<TDbType>> =
    TOrderByParams extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<TDbType, infer TParams, any, any, any, any> ? Rest extends OrderBySpecs<TDbType> ?
    [...(TParams extends undefined ? [] : TParams), InferParamsFromOrderByParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams)] :
    First extends [IComparable<TDbType, infer TParams, any, any, any, any>, OrderType] ? Rest extends OrderBySpecs<TDbType> ?
    [...(TParams extends undefined ? [] : TParams), InferParamsFromOrderByParams<TDbType, Rest>] :
    [...(TParams extends undefined ? [] : TParams)] :
    [] :
    [];

export type {
    AccumulateOrderByParams
}