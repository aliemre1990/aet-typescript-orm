import type { DbType } from "../../db.js";

interface IName<
    TName extends string | undefined
> {
    name: TName;
}

export type { IName };