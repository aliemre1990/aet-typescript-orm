type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// type ut1<T> = T extends any ? (t: T) => T : never;
// type ut2<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;
// type ut3<T> = T extends (_: any) => infer R ? R : never;

// type union = 'a' | 'b' | 'c' | 'd';
// type rt1 = ut1<union>;
// type rt2 = ut2<rt1>;
// type rt3 = ut3<rt2>;


// More reliable version using conditional types
type UnionToTupleOrdered<T> = UnionToIntersection<
    T extends any ? (t: T) => T : never
> extends (_: any) => infer W
    ? [...UnionToTupleOrdered<Exclude<T, W>>, W]
    : [];

export type {
    UnionToTupleOrdered
}