import type { IComparable } from "../_interfaces/IComparable.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type QueryParam from "../param.js";

type AccumulateComparisonParams<TParams extends readonly QueryParam<any, any, any, any, any>[] | undefined, TCbResult extends ColumnComparisonOperation<any, any, any, any> | ColumnLogicalOperation<any, any>> =
    TParams extends undefined ?
    InferParamsFromOps<TCbResult> :
    TParams extends QueryParam<any, any, any, any, any>[] ?
    [...TParams, ...(InferParamsFromOps<TCbResult> extends QueryParam<any, any, any, any, any>[] ? InferParamsFromOps<TCbResult> : [])] :
    never;

type InferParamsFromOps<T> =
    T extends ColumnComparisonOperation<any, any, any, any, infer TParams> ?
    TParams["length"] extends 0 ?
    undefined :
    TParams :
    T extends ColumnLogicalOperation<any, any, infer TParams> ?
    TParams["length"] extends 0 ?
    undefined :
    TParams :
    undefined;

type InferParamsFromOpsArray<T extends readonly any[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends ColumnComparisonOperation<any, infer TComparing, infer TApplied, any> ?
    TComparing extends IComparable<any, any, any, any, any, any> ? TApplied extends IComparable<any, any, any, any, any, any>[] ?
    [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :
    [...InferParamsFromComparables<[TComparing]>, ...InferParamsFromOpsArray<Rest>] :

    TApplied extends IComparable<any, any, any, any, any, any>[] ?
    [...InferParamsFromComparables<TApplied>, ...InferParamsFromOpsArray<Rest>] :

    InferParamsFromOpsArray<Rest> :
    First extends ColumnLogicalOperation<any, infer TOps> ?
    [...InferParamsFromOpsArray<TOps>, ...InferParamsFromOpsArray<Rest>] :
    InferParamsFromOpsArray<Rest> :
    [];

type InferParamsFromComparables<T> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends IComparable<any, infer TParams, any, any, any, any> ?
    [...(TParams extends undefined ? [] : TParams), ...InferParamsFromComparables<Rest>] :
    [...InferParamsFromComparables<Rest>] :
    [];

export type {
    InferParamsFromOps,
    AccumulateComparisonParams,
    InferParamsFromOpsArray,
    InferParamsFromComparables
}