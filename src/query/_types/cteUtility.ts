import type { DbType } from "../../db.js";
import type { MapToQueryColumns } from "../../table/table.js";
import type Table from "../../table/table.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IDbType } from "../_interfaces/IDbType.js";
import type { MapResultToCTEObjectEntry } from "../cteObject.js";
import type CTEObject from "../cteObject.js";
import type QueryParam from "../param.js";
import type { CTEType } from "../queryBuilder.js";
import type QueryBuilder from "../queryBuilder.js";
import type QueryColumn from "../queryColumn.js";
import type QueryTable from "../queryTable.js";
import type { MapResultToSubQueryEntry, SubQueryEntry } from "../subQueryObject.js";
import type SubQueryObject from "../subQueryObject.js";
import type { ResultShape } from "./result.js";

type MapToCTEObject<TDbType extends DbType, TCTEName extends string, TCTEType extends CTEType, T> =
    T extends QueryBuilder<TDbType, any, any, any, infer TRes extends ResultShape<TDbType>, any, infer TAs extends string> ?
    CTEObject<TDbType, TCTEName, TCTEType, T, MapResultToCTEObjectEntry<TDbType, TRes>> : never
    ;



export type {
    MapToCTEObject
}