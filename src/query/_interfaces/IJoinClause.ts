import { DbType, type DbValueTypes } from "../../db.js";
import type QueryColumn from "../queryColumn.js";
import type Table from "../../table/table.js";
import type { JoinType } from "../../types.js";
import type ColumnComparisonOperation from "../comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "../logicalOperations.js";
import type { TablesToObject, TableToColumnsMap } from "../_types/miscellaneous.js";
import type { AccumulateComparisonParams } from "../_types/result.js";
import type QueryTable from "../queryTable.js";
import type ISelectClause from "./ISelectClause.js";
import type IGroupByClause from "./IGroupByClause.js";
import type { DbOperators } from "../_types/ops.js";
import type IWhereClause from "./IWhereClause.js";
import type QueryParam from "../param.js";
import type { ColumnsSelection } from "../queryColumn.js";

interface IJoinClause<
    TDbType extends DbType,
    TTables extends readonly QueryTable<TDbType, any, any, any, any, any>[],
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null>[] | undefined = undefined,
    TGroupedColumns extends (ColumnsSelection<TDbType, any, any> | QueryColumn<TDbType, any, any, any>)[] | undefined = undefined,
> {

    join<
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>,
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
        cb: (cols: TableToColumnsMap<TDbType, TablesToObject<[...TTables, TInnerJoinResult]>>, ops: DbOperators<TDbType, false>) => TCbResult
    ):
        IJoinClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        ISelectClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IWhereClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>> &
        IGroupByClause<TDbType, [...TTables, TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>>

}

export default IJoinClause;