import { DbType, PgDbType } from "../../db.js";
import { PgColumnType, type PgValueTypes } from "../../postgresql/dataTypes.js";
import type { QueryParam } from "../queryColumn.js";
import type QueryColumn from "../queryColumn.js";
import type Table from "../../table/table.js";
import type { ColumnsObjectType, QueryTablesObjectType, QueryTableSpecsType } from "../../table/types/utils.js";
import type { JoinType } from "../../types.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap, TableToObject } from "../_types/miscellaneous.js";
import type { AccumulateParams, InferParamsFromOps } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type IGroupByClause from "./IGroupByClause.js";

interface IJoinClause<
    TDbType extends DbType,
    TTables extends QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends QueryParam<TDbType, string, TDbType extends PgDbType ? PgValueTypes : never>[] | undefined = undefined
> {

    join<
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any, any> | ColumnLogicalOperation<TDbType, any>,
        TInnerJoinResult extends QueryTable<TDbType, any, any, any, any, any> = TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            { [K in keyof TInnerCols]: QueryColumn<TDbType, TInnerCols[K], { tableName: TInnerTableName }> }
        > :
        TInnerJoinTable,
    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TablesToObject<[...TTables, TInnerJoinResult]>>) => TCbResult
    ):
        IJoinClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> &
        ISelectClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateParams<TParams, TCbResult>>

}

export default IJoinClause;