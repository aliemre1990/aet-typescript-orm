type AssertTrue<T extends true> = T;
type AssertFalse<T extends false> = T;
type AssertEqual<T, U> =
    [T] extends [U]
    ? [U] extends [T]
    ? true
    : false
    : false;
type AssertEqualAlt<T, U> = T extends U ? U extends T ? true : false : false;

export type {
    AssertTrue,
    AssertFalse,
    AssertEqual,
    AssertEqualAlt
}