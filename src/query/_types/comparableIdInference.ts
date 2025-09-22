import type { JoinTuple, RecordToTupleSafe } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";

type InferTypeName<T> =
    T extends number ? "number" :
    T extends bigint ? "bigint" :
    T extends string ? "string" :
    T extends boolean ? "boolean" :
    T extends Date ? "Date" :
    T extends Buffer ? "Buffer" :
    T extends number | null ? "number|null" :
    T extends bigint | null ? "bigint|null" :
    T extends string | null ? "string|null" :
    T extends boolean | null ? "boolean|null" :
    T extends Date | null ? "Date|null" :
    T extends Buffer | null ? "Buffer|null" :
    T extends number[] ? "number[]" :
    T extends bigint[] ? "bigint[]" :
    T extends string[] ? "string[]" :
    T extends boolean[] ? "boolean[]" :
    T extends Date[] ? "Date[]" :
    T extends number[] | null ? "number[]|null" :
    T extends bigint[] | null ? "bigint[]|null" :
    T extends string[] | null ? "string[]|null" :
    T extends boolean[] | null ? "boolean[]|null" :
    T extends Date[] | null ? "Date[]|null" :
    T extends (number | null)[] ? "(number|null)[]" :
    T extends (bigint | null)[] ? "(bigint|null)[]" :
    T extends (string | null)[] ? "(string|null)[]" :
    T extends (boolean | null)[] ? "(boolean|null)[]" :
    T extends (Date | null)[] ? "(Date|null)[]" :
    T extends (number | null)[] | null ? "(number|null)[]|null" :
    T extends (bigint | null)[] | null ? "(bigint|null)[]|null" :
    T extends (string | null)[] | null ? "(string|null)[]|null" :
    T extends (boolean | null)[] | null ? "(boolean|null)[]|null" :
    T extends (Date | null)[] | null ? "(Date|null)[]|null" :
    T extends Buffer[] ? "Buffer[]" :
    T extends null ? "null" :
    T extends undefined ? "undefined" :
    T extends IComparable<any, infer TId, any, any, any, any, any> ? `IComparable<${TId extends undefined ? "" : TId}>` :
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


// Example usage:
type Example = {
    key1: number;
    key2: number;
    key3: {
        key4: string;
    };
};


type Result = InferTypeName<Example>;

export type {
    InferTypeName
}