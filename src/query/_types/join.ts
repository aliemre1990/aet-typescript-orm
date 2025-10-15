import type { DbType } from "../../db.js";
import type { JoinSpecsType } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import type SubQueryObject from "../subQueryObject.js";

// type RemoveDuplicateJoinSpec<
//     TDbType extends DbType,
//     TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
//     TNew extends QueryTable<TDbType, any, any, any, any, any> | SubQueryObject<TDbType, any, any, string>
// > = TJoinSpecs extends undefined ? [] :
//     TJoinSpecs extends JoinSpecsType<TDbType> ? RemoveDuplicateJoinSpecRecursively<TDbType, TJoinSpecs, TNew> :
//     never;

// type RemoveDuplicateJoinSpecRecursively<
//     TDbType extends DbType,
//     TJoinSpecs extends JoinSpecsType<TDbType>,
//     TNew extends QueryTable<TDbType, any, any, any, any, any> | SubQueryObject<TDbType, any, any, string>
// > = TJoinSpecs extends [infer First, ...infer Rest] ?
//     First extends SubQueryObject<TDbType, any, any, infer TName> ? TNew extends SubQueryObject<TDbType, any, any, infer TNameComp> ?
//     TName extends TNameComp ?
//     Rest extends JoinSpecsType<TDbType>
//     RemoveDuplicateJoinSpecRecursively<TDbType, Rest, TNew>
// ;