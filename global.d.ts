declare type MinLengthArray<T, N extends number, R extends T[] = []> = R['length'] extends N ? [...R, ...T[]] : MinLengthArray<T, N, [T, ...R]>;
