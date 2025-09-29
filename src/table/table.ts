import { DbType, dbTypes, PgDbType } from "../db.js";
import type { PgColumnType } from "./columnTypes.js";
import type ColumnComparisonOperation from "../query/comparisons/_comparisonOperations.js";
import type { IExecuteableQuery } from "../query/_interfaces/IExecuteableQuery.js";
import type ColumnLogicalOperation from "../query/logicalOperations.js";
import QueryBuilder from "../query/queryBuilder.js";
import type { TablesToObject, TableToColumnsMap } from "../query/_types/miscellaneous.js";
import type { AccumulateColumnParams, AccumulateOrderByParams, TResultShape } from "../query/_types/result.js";
import Column, { type ColumnsObjectType } from "./column.js";
import QueryColumn, { type QueryColumnsObjectType } from "../query/queryColumn.js";
import QueryTable from "../query/queryTable.js";
import type IJoinClause from "../query/_interfaces/IJoinClause.js";
import type ISelectClause from "../query/_interfaces/ISelectClause.js";
import type IWhereClause from "../query/_interfaces/IWhereClause.js";
import type IGroupByClause from "../query/_interfaces/IGroupByClause.js";
import type { DbFunctions, DbOperators } from "../query/_types/ops.js";
import type { JoinType } from "../query/_interfaces/IJoinClause.js";
import type IOrderByClause from "../query/_interfaces/IOrderByClause.js";
import type { OrderBySpecs } from "../query/_interfaces/IOrderByClause.js";
import type { GroupBySpecs } from "../query/_interfaces/IGroupByClause.js";
import type { IDbType } from "../query/_interfaces/IDbType.js";

type TableSpecsType<TTableName extends string = string> = { tableName: TTableName }

class ForeignKey {
    constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
}

type MapToQueryColumns<TTableName extends string, TColumns extends readonly any[], TAsTableName extends string | undefined = undefined> =
    TColumns extends readonly [infer First, ...infer Rest] ?
    First extends Column<infer TDbType, infer TType, infer TColumnName, infer TTableSpecs, infer TIsNullable> ?
    [QueryColumn<TDbType, Column<TDbType, TType, TColumnName, TTableSpecs, TIsNullable>, { tableName: TTableName, asTableName: TAsTableName }, undefined>, ...MapToQueryColumns<TTableName, Rest>] :
    never :
    []
    ;

type MapToColumnsRecord<TColumns extends readonly Column<any, any, any, any, any, any, any>[]> = {
    [C in TColumns[number]as C["name"]]: C
}

class Table<
    TDbType extends DbType,
    TColumns extends readonly Column<TDbType, any, any, any, any, any, any>[],
    TTableName extends string
> implements
    IDbType<TDbType> {

    dbType: TDbType;

    columns: MapToColumnsRecord<TColumns>;

    constructor(
        dbType: TDbType,
        public name: TTableName,
        public columnsList: TColumns,
        public primaryKeys?: (string[])[],
        public uniqueKeys?: (string[])[],
        public foreignKeys?: ForeignKey[]
    ) {
        this.dbType = dbType;

        this.columns = columnsList.reduce((prev, curr) => {
            prev[curr.name] = curr;

            return prev;
        }, {} as { [key: string]: Column<TDbType, any, any, any, any, any, any> }) as typeof this.columns;

    }

    as<TAsName extends string>(val: TAsName) {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col);
        }) as MapToQueryColumns<TTableName, TColumns, TAsName>;

        return new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, typeof queryColumns, TAsName>(this.dbType, this, queryColumns, val);
    }

    select<
        const TCbResult extends TResultShape<TDbType>

    >(
        cb: (
            cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>]>>,
            ops: DbFunctions<TDbType, false>
        ) => TCbResult
    ): IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>], TCbResult, AccumulateColumnParams<undefined, TCbResult>> {

        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col);
        }) as MapToQueryColumns<TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>(this.dbType, this, queryColumns);


        return new QueryBuilder<TDbType, [typeof queryTable]>(this.dbType, queryTable).select(cb);
    }

    join<
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>,
        TInnerJoinResult extends QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any> = TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            { [K in keyof TInnerCols]: QueryColumn<TDbType, TInnerCols[K], { tableName: TInnerTableName, asTableName: undefined }> }
        > :
        TInnerJoinTable,

    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (
            cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>>, TInnerJoinResult]>>,
            ops: DbOperators<TDbType, false>
        ) => TCbResult
    ) {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col);
        }) as MapToQueryColumns<TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>>(this.dbType, this, queryColumns);


        return new QueryBuilder<TDbType, [typeof queryTable]>(this.dbType, queryTable)
            .join(type, table, cb);
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>]>>,
        ops: DbOperators<TDbType, false>
    ) => TCbResult) {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col);
        }) as MapToQueryColumns<TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>(this.dbType, this, queryColumns);

        return new QueryBuilder<TDbType, [typeof queryTable]>(this.dbType, queryTable).where(cb);
    }

    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (
        cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>]>>,
        ops: DbFunctions<TDbType, false>
    ) => TCbResult
    ) {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col);
        }) as MapToQueryColumns<TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>(this.dbType, this, queryColumns);

        return new QueryBuilder<TDbType, [typeof queryTable]>(this.dbType, queryTable).groupBy(cb);
    }

    orderBy<
        const TCbResult extends OrderBySpecs<TDbType>
    >(cb: (cols: TableToColumnsMap<TDbType, TablesToObject<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>]>>) => TCbResult):
        ISelectClause<TDbType, [QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>], AccumulateOrderByParams<TDbType, undefined, TCbResult>> {
        const queryColumns = this.columnsList.map((col) => {
            return new QueryColumn(this.dbType, col);
        }) as MapToQueryColumns<TTableName, TColumns>;

        const queryTable = new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, MapToQueryColumns<TTableName, TColumns>, undefined>(this.dbType, this, queryColumns);

        return new QueryBuilder<TDbType, [typeof queryTable]>(this.dbType, queryTable).orderBy(cb);
    }
}

function pgTable<
    TTableName extends string,
    const TColumns extends Column<PgDbType, PgColumnType, string, TableSpecsType<string>, boolean>[],
>(
    name: TTableName,
    columns: TColumns,
    primaryKeys?: (string[])[],
    uniqueKeys?: (string[])[],
    foreignKeys?: ForeignKey[]
) {

    type MapToFinalColumns<TColumns extends readonly any[]> =
        TColumns extends readonly [infer First, ...infer Rest] ?
        First extends Column<infer TDbType, infer TType, infer TColumnName, any, infer TIsNullable> ?
        [Column<TDbType, TType, TColumnName, TableSpecsType<TTableName>, TIsNullable>, ...MapToFinalColumns<Rest>] :
        never :
        []
        ;

    type TFinalColumns = MapToFinalColumns<TColumns>;

    return new Table<PgDbType, TFinalColumns, TTableName>(
        dbTypes.postgresql,
        name,
        columns as unknown as TFinalColumns,
        primaryKeys,
        uniqueKeys,
        foreignKeys
    );
}

function pgColumn<
    TColumnName extends string,
    TColumnType extends PgColumnType,
    TIsNull extends boolean,
>(
    name: TColumnName,
    type: TColumnType,
    isNullable: TIsNull
): Column<PgDbType, TColumnType, TColumnName, TableSpecsType, TIsNull> {
    return new Column<PgDbType, TColumnType, TColumnName, TableSpecsType, TIsNull>(dbTypes.postgresql, name, type, isNullable);
}

export default Table;

export {
    ForeignKey,
    pgTable,
    pgColumn
}

export type {
    TableSpecsType,
    MapToQueryColumns
}