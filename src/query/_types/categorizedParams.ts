import type { DbType } from "../../db.js";
import type { IName } from "../_interfaces/IName.js";
import type QueryParam from "../param.js";
import type { CategorizedParamsType, JoinSpecsTableType } from "../queryBuilder.js";

type OverrideOrderByParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: TCategorizedParams["cteParams"],
        joinParams: TCategorizedParams["joinParams"],
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TParams,
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TCategorizedParams["havingParams"]
    }

type OverrideHavingParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: TCategorizedParams["cteParams"],
        joinParams: TCategorizedParams["joinParams"],
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TParams
    }

type OverrideGroupByParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: TCategorizedParams["cteParams"],
        joinParams: TCategorizedParams["joinParams"],
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TParams,
        havingParams: TCategorizedParams["havingParams"]
    }

type OverrideWhereParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: TCategorizedParams["cteParams"],
        joinParams: TCategorizedParams["joinParams"],
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TParams,
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TCategorizedParams["havingParams"]
    }

type OverrideSelectParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: TCategorizedParams["cteParams"],
        joinParams: TCategorizedParams["joinParams"],
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TParams,
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TCategorizedParams["havingParams"]
    }

type OverrideJoinParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TJoinResult extends JoinSpecsTableType<TDbType>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: TCategorizedParams["cteParams"],
        joinParams: [...ExcludeExistingJoinParams<TDbType, TCategorizedParams["joinParams"], TJoinResult>, { name: TJoinResult["name"], params: TParams }],
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TCategorizedParams["havingParams"]
    }

type ExcludeExistingJoinParams<
    TDbType extends DbType,
    TJoinParams extends readonly { name: string, params: readonly QueryParam<TDbType, string, any, any, any>[] | undefined }[],
    TJoinResult extends JoinSpecsTableType<TDbType>
> =
    TJoinParams extends readonly [infer First, ...infer Rest] ?
    First extends { name: infer TName, params: readonly QueryParam<TDbType, string, any, any, any>[] | undefined } ?
    TJoinResult extends IName<infer TCheckName> ?
    TName extends TCheckName ?
    Rest extends readonly [any, ...any[]] ?
    [...ExcludeExistingJoinParams<TDbType, Rest, TJoinResult>] :
    [] :
    Rest extends readonly [any, ...any[]] ?
    [First, ...ExcludeExistingJoinParams<TDbType, Rest, TJoinResult>] :
    [First] :
    never :
    never :
    []
    ;

export type {
    OverrideJoinParams,
    OverrideSelectParams,
    OverrideWhereParams,
    OverrideGroupByParams,
    OverrideHavingParams,
    OverrideOrderByParams
}
