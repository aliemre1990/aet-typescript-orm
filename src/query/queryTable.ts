import type { DbType } from "../db.js";
import QueryColumn from "../query/queryColumn.js";
import type Column from "../table/column.js";
import type Table from "../table/table.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { IName } from "./_interfaces/IName.js";
import type { OverrideGroupByParams, OverrideJoinParams, OverrideOrderByParams, OverrideSelectParams } from "./_types/categorizedParams.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { DbFunctions, DbOperators } from "./_types/ops.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type { AccumulateOrderByParams } from "./_types/paramAccumulationOrderBy.js";
import type { AccumulateColumnParams } from "./_types/paramAccumulationSelect.js";
import type { ResultShape, SelectToResultMapRecursively } from "./_types/result.js";
import type { AccumulateSubQueryParams, MapToSubQueryObject } from "./_types/subQueryUtility.js";
import type ColumnsSelection from "./columnsSelection.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type CTEObject from "./cteObject.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type QueryParam from "./param.js";
import QueryBuilder, { type CategorizedParamsType, type ComparisonType, type DefaultCategorizedParamsType, type GroupBySpecs, type JoinSpecsTableType, type JoinSpecsType, type JoinType, type OrderBySpecs } from "./queryBuilder.js";

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
    IDbType<TDbType>,
    IName<TAsName extends undefined ? TTableName : TAsName> {

    dbType: TDbType;
    name: TAsName extends undefined ? TTableName : TAsName;

    table: TTable;

    columns: MapQueryColumnsToRecord<TQColumns>;

    constructor(
        dbType: TDbType,
        table: TTable,
        public columnsList: TQColumns,
        public asName?: TAsName
    ) {
        this.dbType = dbType;
        this.name = (asName === undefined ? table.name : asName) as TAsName extends undefined ? TTableName : TAsName;

        this.table = table;

        this.columns = columnsList.reduce((prev, curr) => {
            prev[curr.column.name] = curr;

            return prev;
        }, {} as { [key: string]: QueryColumn<TDbType, any, any, any, any, any, any> }) as typeof this.columns;
    }

    select<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>

    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
            ops: DbFunctions<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>],
        undefined,
        undefined,
        TFinalResult,
        OverrideSelectParams<TDbType, DefaultCategorizedParamsType, AccumulateColumnParams<undefined, TFinalResult>>
    > {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this]).select(cb);
    }

    join<
        TJoinType extends JoinType,
        TJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, string, any> | CTEObject<TDbType, any, any, any, any>,
        TCbResult extends ComparisonType<TDbType>,
        TJoinResult extends JoinSpecsTableType<TDbType> =
        TJoinTable extends Table<TDbType, infer TJoinCols, infer TJoinTableName> ?
        QueryTable<
            TDbType,
            TJoinCols,
            TJoinTableName,
            Table<TDbType, TJoinCols, TJoinTableName>,
            { [K in keyof TJoinCols]: QueryColumn<TDbType, TJoinCols[K], { tableName: TJoinTableName, asTableName: undefined }> }
        > :
        TJoinTable extends QueryBuilder<TDbType, any, any, any, any, any, string, any> ? MapToSubQueryObject<TDbType, TJoinTable> :
        TJoinTable extends CTEObject<TDbType, any, any, any, any> ? TJoinTable :
        TJoinTable,
        TAccumulatedParams extends QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TJoinResult], AccumulateComparisonParams<[], TCbResult>>,
        TAccumulatedParamsResult extends QueryParam<TDbType, any, any, any, any>[] | undefined = TAccumulatedParams["length"] extends 0 ? undefined : TAccumulatedParams,
        TJoinParams extends readonly QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TJoinResult], AccumulateComparisonParams<[], TCbResult>>,
        TJoinParamsResult extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TJoinParams["length"] extends 0 ? undefined : TJoinParams,
        TNewCategorizedParams extends CategorizedParamsType<TDbType> = OverrideJoinParams<TDbType, DefaultCategorizedParamsType, TJoinResult, TJoinParamsResult>,
        const TJoinAccumulated extends JoinSpecsType<TDbType> = [{ joinType: TJoinType, table: TJoinResult }]

    >(
        type: TJoinType,
        tableSelection: TJoinTable | (() => TJoinTable),
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], TJoinAccumulated>>,
            ops: DbOperators<TDbType>
        ) => TCbResult
    ):
        QueryBuilder<
            TDbType,
            [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>],
            TJoinAccumulated,
            undefined,
            undefined,
            TNewCategorizedParams
        > {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this])
            .join(type, tableSelection, cb);
    }

    where<TCbResult extends ComparisonType<TDbType>>(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
            ops: DbOperators<TDbType>
        ) => TCbResult) {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this]).where(cb);
    }


    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (
        tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>,
        ops: DbFunctions<TDbType>
    ) => TCbResult
    ): QueryBuilder<
        TDbType,
        [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>],
        undefined,
        undefined,
        undefined,
        OverrideGroupByParams<TDbType, DefaultCategorizedParamsType, AccumulateColumnParams<undefined, TCbResult>>
    > {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this]).groupBy(cb);
    }

    orderBy<
        const  TCbResult extends OrderBySpecs<TDbType>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>
        ) => TCbResult
    ):
        QueryBuilder<
            TDbType,
            [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>],
            undefined,
            undefined,
            undefined,
            OverrideOrderByParams<TDbType, DefaultCategorizedParamsType, AccumulateOrderByParams<TDbType, undefined, TCbResult>>
        > {
        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], undefined, undefined>(this.dbType, [this]).orderBy(cb);
    }

}

export default QueryTable;