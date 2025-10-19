import type { DbType } from "../../db.js";
import type { IName } from "../_interfaces/IName.js";
import type CTEObject from "../cteObject.js";
import type { CTESpecsType, JoinSpecsItemType, JoinSpecsTableType, JoinSpecsType } from "../queryBuilder.js";

type OverrideDuplicateCTESpec<
    TDbType extends DbType,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TNew extends CTEObject<TDbType, any, any, any, any>
> = TCTESpecs extends undefined ? [TNew] :
    TCTESpecs extends CTESpecsType<TDbType> ? [...ExtractDuplicateCTESpecRecursively<TDbType, TCTESpecs, TNew>, TNew] :
    never;

type ExtractDuplicateCTESpecRecursively<
    TDbType extends DbType,
    TCTESpecs extends CTESpecsType<TDbType>,
    TNew extends CTEObject<TDbType, any, any, any, any>
> = TCTESpecs extends [...infer Rest, infer Last] ?
    Last extends IName<infer TCurName> ?
    TNew extends IName<infer TCheckName> ?
    TCurName extends TCheckName ?
    Rest extends readonly [any, ...any[]] ?
    [...ExtractDuplicateCTESpecRecursively<TDbType, Rest, TNew>] :
    [] :
    Rest extends readonly [any, ...any[]] ?
    [...ExtractDuplicateCTESpecRecursively<TDbType, Rest, TNew>, Last] :
    [Last] :
    never :
    never :
    [];

export type {
    OverrideDuplicateCTESpec
}