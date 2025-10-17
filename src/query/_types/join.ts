import type { DbType } from "../../db.js";
import type { IName } from "../_interfaces/IName.js";
import type { JoinSpecsItemType, JoinSpecsTableType, JoinSpecsType } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import type SubQueryObject from "../subQueryObject.js";

type OverrideDuplicateJoinSpec<
    TDbType extends DbType,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TNew extends JoinSpecsItemType<TDbType>
> = TJoinSpecs extends undefined ? [TNew] :
    TJoinSpecs extends JoinSpecsType<TDbType> ? [...ExtractDuplicateJoinSpecRecursively<TDbType, TJoinSpecs, TNew>, TNew] :
    never;

type ExtractDuplicateJoinSpecRecursively<
    TDbType extends DbType,
    TJoinSpecs extends JoinSpecsType<TDbType>,
    TNew extends JoinSpecsItemType<TDbType>
> = TJoinSpecs extends [...infer Rest, infer Last] ?
    Last extends { joinType: any, table: infer TTable extends JoinSpecsTableType<TDbType> } ?
    TNew extends { joinType: any, table: infer TCheckTable extends JoinSpecsTableType<TDbType> } ?
    TTable extends IName<infer TCurName> ?
    TCheckTable extends IName<infer TCheckName> ?
    TCurName extends TCheckName ?
    Rest extends readonly [any, ...any[]] ?
    [...ExtractDuplicateJoinSpecRecursively<TDbType, Rest, TNew>] :
    [] :
    Rest extends readonly [any, ...any[]] ?
    [...ExtractDuplicateJoinSpecRecursively<TDbType, Rest, TNew>, Last] :
    [Last] :
    never :
    never :
    never :
    never :
    [TNew];

export type {
    OverrideDuplicateJoinSpec
}