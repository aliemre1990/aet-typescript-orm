import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { JoinTuple, RecordToTupleSafe } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";

type InferTypeNamesFromArgArray<TArgs extends readonly (
    DbValueTypes | null |
    IComparable<any, any, any, any, any, any, any, any>
)[]> =
    TArgs extends readonly [infer First, ...infer Rest] ?
    First extends DbValueTypes | null ?
    Rest extends readonly (DbValueTypes | null | IComparable<any, any, any, any, any, any, any, any>)[] ?
    [InferTypeName<First>, ...InferTypeNamesFromArgArray<Rest>] :
    [InferTypeName<First>] :
    First extends IComparable<any, infer TId, any, any, any, any, any, any> ?
    Rest extends readonly (DbValueTypes | null | IComparable<any, any, any, any, any, any, any, any>)[] ?
    [TId, ...InferTypeNamesFromArgArray<Rest>] :
    [TId] :
    [] :
    [];

type InferTypeNamesFromArgs<
    TArgs extends readonly (
        DbValueTypes | null |
        IComparable<any, any, any, any, any, any, any, any>
    )[]
> = JoinTuple<InferTypeNamesFromArgArray<TArgs>, ",">;

type InferTypeName<T> =
    number | null extends T ? "number|null" :
    bigint | null extends T ? "bigint|null" :
    string | null extends T ? "string|null" :
    boolean | null extends T ? "boolean|null" :
    Date | null extends T ? "Date|null" :
    Buffer | null extends T ? "Buffer|null" :
    number extends T ? "number" :
    bigint extends T ? "bigint" :
    string extends T ? "string" :
    boolean extends T ? "boolean" :
    Date extends T ? "Date" :
    Buffer extends T ? "Buffer" :
    (number | null)[] | null extends T ? "(number|null)[]|null" :
    (bigint | null)[] | null extends T ? "(bigint|null)[]|null" :
    (string | null)[] | null extends T ? "(string|null)[]|null" :
    (boolean | null)[] | null extends T ? "(boolean|null)[]|null" :
    (Date | null)[] | null extends T ? "(Date|null)[]|null" :
    (number)[] | null extends T ? "number[]|null" :
    (bigint)[] | null extends T ? "bigint[]|null" :
    (string)[] | null extends T ? "string[]|null" :
    (boolean)[] | null extends T ? "boolean[]|null" :
    (Date)[] | null extends T ? "Date[]|null" :
    (number | null)[] extends T ? "(number|null)[]" :
    (bigint | null)[] extends T ? "(bigint|null)[]" :
    (string | null)[] extends T ? "(string|null)[]" :
    (boolean | null)[] extends T ? "(boolean|null)[]" :
    (Date | null)[] extends T ? "(Date|null)[]" :
    (number)[] extends T ? "number[]" :
    (bigint)[] extends T ? "bigint[]" :
    (string)[] extends T ? "string[]" :
    (boolean)[] extends T ? "boolean[]" :
    (Date)[] extends T ? "Date[]" :
    null extends T ? "null" :
    undefined extends T ? "undefined" :
    T extends IComparable<any, infer TId, any, any, any, any, any, any> ? `${TId extends undefined ? "" : TId}` :
    T extends (infer TObj)[] ? `{${InferTypeName<TObj>}}[]` :
    T extends object ? `{${ObjectPropsToString<T>}}` :
    "unknown";

// Strip intersection by extracting the non-__key__ part
type StripIntersection<T, TK> = T extends infer U & { __key__: TK } ? U : T;

// Clean the tuple by recursively stripping intersections from each element
type CleanTuple<T extends readonly any[]> =
    T extends readonly [infer First, ...infer Rest] ?
    First extends { __key__: any } ?
    readonly [StripIntersection<First, First["__key__"]>, ...CleanTuple<Rest>] :
    never :
    readonly [];

type ObjectPropsToString<T> = JoinTuple<
    CleanTuple<RecordToTupleSafe<{
        [K in keyof T]: `${K & string}:${InferTypeName<T[K]>}`
    }>>,
    ","
>;


export type {
    InferTypeName,
    InferTypeNamesFromArgs
}