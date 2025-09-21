import type { DbType } from "../../db.js";

interface IDbType<
    TDbType extends DbType
> {
    dbType: TDbType;
}

export type { IDbType };