import type { DbType } from "../db.js";
import QueryColumn from "../query/queryColumn.js";
import type Column from "../table/column.js";
import type Table from "../table/table.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { DbFunctions, DbOperators } from "./_types/ops.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type { AccumulateOrderByParams } from "./_types/paramAccumulationOrderBy.js";
import type { AccumulateColumnParams } from "./_types/paramAccumulationSelect.js";
import type { ResultShape } from "./_types/result.js";
import type { AccumulateSubQueryParams, MapToSubQueryObject } from "./_types/subQueryUtility.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type CTEObject from "./cteObject.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type QueryParam from "./param.js";
import QueryBuilder, { type ComparisonType, type GroupBySpecs, type JoinSpecsTableType, type JoinSpecsType, type JoinType, type OrderBySpecs } from "./queryBuilder.js";
import type SubQueryObject from "./subQueryObject.js";

type MapQueryColumnsToRecord<TColumns extends readonly QueryColumn<any, any, any, any, any, any, any>[]> = {
    [C in TColumns[number]as C["column"]["name"]]: C
}

class QueryTable<
    TDbType extends DbType,
    TColumns extends readonly Column<TDbType, any, any, any, any, any, any>[],
    TTableName extends string,
    TTable extends Table<TDbType, TColumns, TTableName>,
    TQColumns extends readonly QueryColumn<TDbType, any, any, any, any, any, any>[],
    TAsName extends string | undefined = undefined
> implements
    IDbType<TDbType> {

    dbType: TDbType;

    columns: MapQueryColumnsToRecord<TQColumns>;

    constructor(dbType: TDbType, public table: TTable, public columnsList: TQColumns, public asName?: TAsName) {
        this.dbType = dbType;

        this.columns = columnsList.reduce((prev, curr) => {
            prev[curr.column.name] = curr;

            return prev;
        }, {} as { [key: string]: QueryColumn<TDbType, any, any, any, any, any, any> }) as typeof this.columns;
    }

    select<
        const TCbResult extends ResultShape<TDbType>

    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
            ops: DbFunctions<TDbType, false>
        ) => TCbResult
    ): QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined, TCbResult, AccumulateColumnParams<undefined, TCbResult>> {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this]).select(cb);
    }

    join<
        TJoinType extends JoinType,
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, string> | CTEObject<TDbType, any, any, any, any>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>,
        TInnerJoinResult extends JoinSpecsTableType<TDbType> =
        TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            { [K in keyof TInnerCols]: QueryColumn<TDbType, TInnerCols[K], { tableName: TInnerTableName, asTableName: undefined }> }
        > :
        TInnerJoinTable extends QueryBuilder<TDbType, any, any, any, any, any, string> ? MapToSubQueryObject<TDbType, TInnerJoinTable> :
        TInnerJoinTable extends CTEObject<TDbType, any, any, any, any> ? TInnerJoinTable :
        TInnerJoinTable,
        TAccumulatedParams extends QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TInnerJoinResult], AccumulateComparisonParams<[], TCbResult>>,
        TAccumulatedParamsResult extends QueryParam<TDbType, any, any, any, any>[] | undefined = TAccumulatedParams["length"] extends 0 ? undefined : TAccumulatedParams
    >(
        type: TJoinType,
        tableSelectionCb: () => TInnerJoinTable,
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], [{ joinType: TJoinType, table: TInnerJoinResult }]>>,
            ops: DbOperators<TDbType, false>
        ) => TCbResult
    ): QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], [{ joinType: TJoinType, table: TInnerJoinResult }], undefined, undefined, TAccumulatedParamsResult> {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this])
            .join(type, tableSelectionCb, cb);
    }

    where<TCbResult extends ComparisonType<TDbType>>(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
            ops: DbOperators<TDbType, false>
        ) => TCbResult) {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this]).where(cb);
    }


    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (
        tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
        ops: DbFunctions<TDbType, false>
    ) => TCbResult) {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this]).groupBy(cb);
    }

    orderBy<
        const  TCbResult extends OrderBySpecs<TDbType>
    >(cb: (tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>) => TCbResult):
        QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined, undefined, AccumulateOrderByParams<TDbType, undefined, TCbResult>> {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this]).orderBy(cb);
    }

}

export default QueryTable;