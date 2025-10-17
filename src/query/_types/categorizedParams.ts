import type { DbType } from "../../db.js";
import type { IName } from "../_interfaces/IName.js";
import type CTEObject from "../cteObject.js";
import type QueryParam from "../param.js";
import type { CategorizedParamsType, JoinSpecsTableType } from "../queryBuilder.js";

type AccumulateCategorizedParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>
> =
    [
        ...(TCategorizedParams["fromParams"] extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCategorizedParams["fromParams"] : []),
        ...(TCategorizedParams["selectParams"] extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCategorizedParams["selectParams"] : []),
        ...(TCategorizedParams["whereParams"] extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCategorizedParams["whereParams"] : []),
        ...(TCategorizedParams["orderByParams"] extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCategorizedParams["orderByParams"] : []),
        ...(TCategorizedParams["groupByParams"] extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCategorizedParams["groupByParams"] : []),
        ...(TCategorizedParams["havingParams"] extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCategorizedParams["havingParams"] : []),
        ...(AccumulateParamsCollection<TDbType, TCategorizedParams["joinParams"]>),
        ...(AccumulateParamsCollection<TDbType, TCategorizedParams["cteParams"]>)
    ]

type AccumulateParamsCollection<
    TDbType extends DbType,
    TJoinParams extends readonly { name: string, params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined }[]
> =
    TJoinParams extends [infer First, ...infer Rest] ?
    First extends { name: string, params: infer TParams } ?
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ?
    Rest extends readonly { name: string, params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined }[] ?
    [...TParams, ...AccumulateParamsCollection<TDbType, Rest>] :
    [...TParams] :
    Rest extends readonly { name: string, params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined }[] ?
    [...AccumulateParamsCollection<TDbType, Rest>] :
    [] :
    Rest extends readonly { name: string, params: readonly QueryParam<TDbType, any, any, any, any>[] | undefined }[] ?
    [...AccumulateParamsCollection<TDbType, Rest>] :
    [] :
    [];


type OverrideFromParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: TCategorizedParams["cteParams"],
        joinParams: TCategorizedParams["joinParams"],
        fromParams: TParams,
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TCategorizedParams["havingParams"]
    }

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
        joinParams: [...ExcludeExistingParams<TDbType, TCategorizedParams["joinParams"], TJoinResult>, { name: TJoinResult["name"], params: TParams }],
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TCategorizedParams["havingParams"]
    }


type OverrideCTEParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TCTE extends CTEObject<TDbType, any, any, any, any>,
    TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: [...ExcludeExistingParams<TDbType, TCategorizedParams["cteParams"], TCTE>, { name: TCTE["name"], params: TParams }],
        joinParams: TCategorizedParams["joinParams"],
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TCategorizedParams["havingParams"]
    }

type ExcludeExistingParams<
    TDbType extends DbType,
    TParamsCol extends readonly { name: string, params: readonly QueryParam<TDbType, string, any, any, any>[] | undefined }[],
    TJoinResult extends IName<string>
> =
    TParamsCol extends readonly [infer First, ...infer Rest] ?
    First extends { name: infer TName, params: readonly QueryParam<TDbType, string, any, any, any>[] | undefined } ?
    TJoinResult extends IName<infer TCheckName> ?
    TName extends TCheckName ?
    Rest extends readonly [any, ...any[]] ?
    [...ExcludeExistingParams<TDbType, Rest, TJoinResult>] :
    [] :
    Rest extends readonly [any, ...any[]] ?
    [First, ...ExcludeExistingParams<TDbType, Rest, TJoinResult>] :
    [First] :
    never :
    never :
    []
    ;

export type {
    OverrideJoinParams,
    OverrideCTEParams,
    OverrideSelectParams,
    OverrideWhereParams,
    OverrideGroupByParams,
    OverrideHavingParams,
    OverrideOrderByParams,
    OverrideFromParams,
    AccumulateCategorizedParams
}
