import type { IComparable } from "../_interfaces/IComparable.js";

type InferParamsFromFnArgs<T> =
    T extends readonly [infer FirstArg, ...infer RestArgs] ?
    FirstArg extends IComparable<any, any, infer TParams, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromFnArgs<RestArgs>] :
    [...InferParamsFromFnArgs<RestArgs>] :
    [];

export type {
    InferParamsFromFnArgs
}
