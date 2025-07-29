export function isNullOrUndefined(val: unknown): val is null | undefined {
    return val === null || val === undefined;
}

export function hasValue<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}