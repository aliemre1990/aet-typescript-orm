type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// type ut1<T> = T extends any ? (t: T) => T : never;
// type ut2<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;
// type ut3<T> = T extends (_: any) => infer R ? R : never;

// type union = 'a' | 'b' | 'c' | 'd';
// type rt1 = ut1<union>;
// type rt2 = ut2<rt1>;
// type rt3 = ut3<rt2>;

// More reliable version using conditional types
type UnionToTuple<T> = UnionToIntersection<
    T extends any ? (t: T) => T : never
> extends (_: any) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];

type RecordToTupleSafe<T extends Record<PropertyKey, any>, TK extends PropertyKey = PropertyKey> =
    UnionToTuple<{ [K in Extract<keyof T, TK>]: T[K] & { __key__: K } }[Extract<keyof T, TK>]>

type DeepPrettify<T> = T extends Function
    ? T
    : T extends Date ? T
    : T extends object
    ? { [K in keyof T]: DeepPrettify<T[K]> }
    : T;


type FlattenObject<T> = T extends Date ? T : T extends object ?
    DeepPrettify<UnionToIntersection<{
        [K in keyof T]: T[K] extends Date ? { [P in K]: T[K] } : T[K] extends object ? FlattenObject<T[K]> : { [P in K]: T[K] }
    }[keyof T]>> : never
    ;

// type t1 = FlattenObject<{ a: { b: string, c: { d: string } } }>
// type t = FlattenObject<{ a: { b: { c: { d: string, f: { g: string, h: string } } }, e: string } }>

type SingleKeyObject<T> = UnionToTuple<keyof T>["length"] extends 1 ? T : never;

type SingleKeyObject2<T> = IsUnion<keyof T> extends true ? never : {} extends T ? never : T;

type SingleKeyObject3<T> = {
    [K in keyof T]: Pick<T, K> & { [P in Exclude<keyof T, K>]?: never }
}[keyof T];

type IsUnion<T, U extends T = T> =
    (T extends any ?
        (U extends T ? false : true)
        : never) extends false ? false : true

type IsAny<T> = 0 extends 1 & T ? true : false;

type NullableArray<T> = T extends Array<infer TItem> ? (TItem | null)[] : never;

type NonNullableArray<T> = T extends Array<infer TItem> ? null extends TItem ? NonNullable<TItem>[] : TItem[] : T;

type JoinTuple<T extends readonly string[], Delimiter extends string> =
    T extends readonly [infer First, ...infer Rest]
    ? First extends string
    ? Rest extends readonly string[]
    ? Rest["length"] extends 0
    ? First
    : `${First}${Delimiter}${JoinTuple<Rest, Delimiter>}`
    : First
    : ""
    : "";

export type {
    UnionToTuple,
    RecordToTupleSafe,
    DeepPrettify,
    UnionToIntersection,
    FlattenObject,
    SingleKeyObject,
    IsUnion,
    IsAny,
    NullableArray,
    NonNullableArray,
    JoinTuple
}