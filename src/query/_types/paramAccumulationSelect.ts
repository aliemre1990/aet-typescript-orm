import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";

type AccumulateColumnParams<TParams extends readonly QueryParam<any, any, any, any, any, any>[] | undefined, TResult extends readonly any[]> =
    TParams extends undefined ?
    InferParamsFromColumns<TResult>["length"] extends 0 ? undefined : InferParamsFromColumns<TResult> :
    TParams extends QueryParam<any, any, any, any, any, any>[] ? [...TParams, ...InferParamsFromColumns<TResult>] :
    never;


type InferParamsFromColumns<TResult extends readonly any[]> =
    TResult extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, infer TParams, any, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromColumns<Rest>] :
    Rest extends readonly any[] ? InferParamsFromColumns<Rest> :
    [] :
    [];

export type {
    AccumulateColumnParams
}