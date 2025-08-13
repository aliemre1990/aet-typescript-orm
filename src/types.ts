const joinTypes = {
    inner: 'INNER',
    left: 'LEFT',
    right: 'RIGHT',
    full: 'FULL'
} as const;

type JoinType = typeof joinTypes[keyof typeof joinTypes];

export {
    joinTypes
}

export type {
    JoinType
}