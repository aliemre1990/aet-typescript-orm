import type { IComparable } from "../_interfaces/IComparable.js";

type InferParamsFromFnArgs<T> =
    InferParamsFromFnArgArray<T>["length"] extends 0 ? undefined : InferParamsFromFnArgArray<T>;

type InferParamsFromFnArgArray<T> =
    T extends readonly [infer FirstArg, ...infer RestArgs] ?
    FirstArg extends IComparable<any, infer TParams, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromFnArgArray<RestArgs>] :
    [...InferParamsFromFnArgArray<RestArgs>] :
    [];

export type {
    InferParamsFromFnArgs
}
