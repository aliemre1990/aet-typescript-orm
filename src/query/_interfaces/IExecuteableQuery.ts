import { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { ColumnsToResultMap, QueryParamsToObject, ResultShape } from "../_types/result.js";
import type QueryParam from "../param.js";
import type { FromType, JoinSpecsType } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import type { IDbType } from "./IDbType.js";
import type { GroupBySpecs } from "./IGroupByClause.js";
import type { OrderBySpecs } from "./IOrderByClause.js";

interface IExecuteableQuery<
    TDbType extends DbType,
    TFrom extends FromType<TDbType>,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any, any>[] | undefined = undefined,
    TGroupedColumns extends GroupBySpecs<TDbType> | undefined = undefined,
    TOrderBySpecs extends OrderBySpecs<TDbType> | undefined = undefined,
    TAs extends string | undefined = undefined
> extends IDbType<TDbType> {

    dbType: TDbType;
    asName?: TAs;

    resultSelection?: TResult;

    as<TAs extends string>(asName: TAs): IExecuteableQuery<TDbType, TFrom, TJoinSpecs, TResult, TParams, TGroupedColumns, TOrderBySpecs, TAs>;

    exec: (...args: TParams extends undefined ? [] : [params: QueryParamsToObject<TParams>]) =>
        TResult extends ResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never
}

export type {
    IExecuteableQuery
}