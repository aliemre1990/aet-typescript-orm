import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { MapResultToCTEObjectEntry } from "../cteObject.js";
import type CTEObject from "../cteObject.js";
import type { CTEType } from "../queryBuilder.js";
import type QueryBuilder from "../queryBuilder.js";
import type { ResultShape } from "./result.js";

type MapToCTEObjectForRecursive<
    TDbType extends DbType,
    TCTEName extends string,
    TCTEType extends CTEType,
    TColumnNames extends (readonly string[]) | undefined,
    T extends QueryBuilder<TDbType, any, any, any, any, any, any, any>
> =
    TColumnNames extends undefined ?
    MapToCTEObject<TDbType, TCTEName, TCTEType, T> :
    TColumnNames extends readonly string[] ?
    TColumnNames["length"] extends 0 ?
    MapToCTEObject<TDbType, TCTEName, TCTEType, T> :
    T extends QueryBuilder<TDbType, any, any, any, infer TRes, any, any, any> ?
    TRes extends readonly IComparable<TDbType, any, any, any, any, any>[] ?
    CTEObject<TDbType, TCTEName, TCTEType, T, MapToColumnMatch<TDbType, TRes, TColumnNames>> :
    never :
    never :
    never;

type MapToColumnMatch<
    TDbType extends DbType,
    TColumns extends readonly IComparable<TDbType, any, any, any, any, any>[],
    TColumnNames extends readonly string[]
> =
    TColumnNames extends readonly [infer TFirstName, ...infer TRestNames] ?
    TColumns extends readonly [infer TFirstCol, ...infer TRestCols] ?
    TFirstName extends string ?
    TFirstCol extends IComparable<TDbType, any, infer TValueType, infer TFinalValueType, any, any> ?
    TRestNames extends readonly [string, ...string[]] ?
    TRestCols extends readonly [any, ...any[]] ?
    [IComparable<TDbType, undefined, TValueType, TFinalValueType, TFirstName, undefined>, ...MapToColumnMatch<TDbType, TRestCols, TRestNames>] :
    [IComparable<TDbType, undefined, TValueType, TFinalValueType, TFirstName, undefined>] :
    [IComparable<TDbType, undefined, TValueType, TFinalValueType, TFirstName, undefined>] :
    never :
    never :
    [] :
    []
    ;



type MapToCTEObject<TDbType extends DbType, TCTEName extends string, TCTEType extends CTEType, T> =
    T extends QueryBuilder<TDbType, any, any, any, infer TRes extends ResultShape<TDbType>, any, any, any> ?
    CTEObject<TDbType, TCTEName, TCTEType, T, MapResultToCTEObjectEntry<TDbType, TRes>> : never
    ;



export type {
    MapToCTEObject,
    MapToCTEObjectForRecursive
}