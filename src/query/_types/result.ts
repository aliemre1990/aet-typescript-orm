import type { DbType } from "../../db.js";
import type { DeepPrettify } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";

type ResultShapeItem<TDbType extends DbType> = IComparable<TDbType, any, any, any, any, any>;
type ResultShape<TDbType extends DbType> = readonly ResultShapeItem<TDbType>[];

type ColumnsToResultMap<TDbType extends DbType, T extends ResultShape<TDbType> | undefined> =
    DeepPrettify<
        T extends undefined ? undefined :
        T extends ResultShape<TDbType> ?
        {
            [
            R in T[number]as R extends IComparable<TDbType, any, any, any, infer TDefaultKey, infer TAs> ?
            TAs extends undefined ?
            TDefaultKey :
            TAs :
            never
            ]:
            R extends IComparable<TDbType, any, any, infer TFinalType, any, any> ? TFinalType :
            never
        }[] :
        never
    >

// Convert array of QueryParam to object type
type QueryParamsToObject<T extends readonly QueryParam<any, any, any, any, any>[] | undefined> =
    T extends undefined ? undefined :
    T extends QueryParam<any, any, any, any, any>[] ?
    T["length"] extends 0 ? undefined :
    T extends readonly QueryParam<any, any, any, any, any>[] ? {
        [K in T[number]as K extends QueryParam<any, infer Name, any, any, any> ? Name : never]:
        K extends QueryParam<any, any, infer ValueType, any, any> ? ValueType : never
    }
    : never
    : undefined;

export type {
    ResultShape,
    ResultShapeItem,
    ColumnsToResultMap,
    QueryParamsToObject
}