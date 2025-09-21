import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";
import type ColumnSQLFunction from "../functions/_functions.js";

type InferParamsFromFn<T> = T extends ColumnSQLFunction<any, any, infer TArgs, any, any> ? InferParamsFromFnArgs<TArgs> : never;

type InferParamsFromFnArgs<T> =
    T extends readonly [infer FirstArg, ...infer RestArgs] ?
    FirstArg extends IComparable<any, infer TParams, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromFnArgs<RestArgs>] :
    FirstArg extends ColumnSQLFunction<any, any, any, any, any> ? [...InferParamsFromFn<FirstArg>, ...InferParamsFromFnArgs<RestArgs>] :
    [...InferParamsFromFnArgs<RestArgs>] :
    [];

export type {
    InferParamsFromFnArgs
}
