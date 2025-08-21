import { DbType } from "../db.js";
import type { PgValueTypes } from "../postgresql/dataTypes.js";
import QueryColumn, { type QueryParam } from "../table/queryColumn.js";
import QueryTable from "../table/queryTable.js";
import type Table from "../table/table.js";
import type { QueryTableSpecsType } from "../table/types/tableSpecs.js";
import type { ColumnsObjectType, QueryColumnsObjectType, QueryTablesObjectType } from "../table/types/utils.js";
import type { JoinType } from "../types.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparison.js";
import { ComparisonOperation } from "./comparisonOperation.js";
import { IExecuteableQuery } from "./interfaces/IExecuteableQuery.js";
import { IJoinQuery } from "./interfaces/IJoinQuery.js";
import { ISelectQuery } from "./interfaces/ISelectQuery.js";
import type { TableToColumnsMap, TableToObject } from "./types/miscellaneous.js";
import type { ColumnsToResultMap, QueryParamsToObject, TablesToResultMap, TResultShape } from "./types/result.js";

// function getColsSelection<TTablesSelection extends Table[]>(tables: TTablesSelection) {
//     let colsSelection: TableToColumnsMap<TTablesSelection, ComparableColumn> = Object.entries(tables).reduce((prev, curr) => {
//         prev[curr[1].name] = Object.entries(curr[1].columns.reduce((prevInner, currInner) => {
//             prevInner[currInner.name] = new ComparableColumn(currInner);
//             return prevInner;
//         }, {} as any));

//         return prev;
//     }
//         , {} as any);

//     return colsSelection;
// }

class QueryBuilder<
    TDbType extends DbType,
    TTables extends QueryTablesObjectType<TDbType>, // turn this type to keyed querytable object
    TResult extends TResultShape<TDbType> | undefined = undefined,
    TParams extends QueryParam<TDbType, string, PgValueTypes>[] | undefined = undefined
>
    implements
    ISelectQuery<TDbType, any>,
    IJoinQuery<TDbType, any> {

    colsSelection?: TResult;

    tables: TTables;


    constructor(tables: TTables, colsSelection?: TResult) {
        this.tables = tables;
        this.colsSelection = colsSelection;
    }

    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>
    select<
        TCb extends ((cols: TableToColumnsMap<TTables>) => TResultShape<TDbType>)
    >(cb: TCb | undefined):
        IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>
    select<
        TCb extends ((cols: TableToColumnsMap<TTables>) => TResultShape<TDbType>)
    >(
        cb?: TCb
    ): IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined> {
        return this as unknown as IExecuteableQuery<TDbType, TTables, TCb extends (cols: any) => infer TR ? TR : undefined, TParams>;
    };


    join<
        TInnerJoinTableQueryTableSpecs extends QueryTableSpecsType,
        TInnerJoinTableAs extends string | undefined,
        TInnerJoinTableName extends string,
        TInnerJoinColumns extends ColumnsObjectType<TDbType>,
        TInnerJoinTable extends Table<TDbType, TInnerJoinColumns, TInnerJoinTableName> | QueryTable<TDbType, TInnerJoinColumns, TInnerJoinTableName, Table<TDbType, TInnerJoinColumns, TInnerJoinTableName>, { [K in keyof TInnerJoinColumns]: QueryColumn<TDbType, TInnerJoinColumns[K], TInnerJoinTableQueryTableSpecs, string | undefined> }, TInnerJoinTableAs>,
        TInnerJoinResult extends TInnerJoinTable extends Table<TDbType, infer TInnerCols, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerCols,
            TInnerTableName,
            Table<TDbType, TInnerCols, TInnerTableName>,
            { [K in keyof TInnerCols]: QueryColumn<TDbType, TInnerCols[K], { tableName: TInnerTableName }> }
        > :
        TInnerJoinTable,
        TJoinParams extends QueryParam<TDbType, string, PgValueTypes>[] | undefined = undefined
    >(
        type: JoinType,
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TTables & TableToObject<TInnerJoinResult>>) => ColumnComparisonOperation<TDbType, any, TJoinParams, any>
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TInnerJoinResult>, [...(TParams extends undefined ? never : TParams), ...(TJoinParams extends undefined ? never : TJoinParams)]> &
        ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinResult>, [...(TParams extends undefined ? never : TParams), ...(TJoinParams extends undefined ? never : TJoinParams)]> {
        let innerJoinTable: TInnerJoinResult;
        if ("table" in table) {
            innerJoinTable = table as TInnerJoinResult;
        } else if ("name" in table) {

            const innerQueryColumns = Object.entries(table.columns).reduce((prev, curr) => {
                prev[curr[0]] = new QueryColumn(curr[1]);
                return prev;
            }, {} as QueryColumnsObjectType<TDbType>);

            innerJoinTable = new QueryTable(table, innerQueryColumns) as TInnerJoinResult;
        } else {
            throw Error('Invalid inner join table type.');
        }

        const innerJoinTableKeyed = {
            [innerJoinTable.asName === undefined ? innerJoinTable.table.name : innerJoinTable.asName]: innerJoinTable
        } as TableToObject<TInnerJoinResult>

        const newTables = { ...this.tables, ...innerJoinTableKeyed };

        return new QueryBuilder(newTables) as
            IJoinQuery<TDbType, TTables & TableToObject<TInnerJoinResult>, [...(TParams extends undefined ? never : TParams), ...(TJoinParams extends undefined ? never : TJoinParams)]> &
            ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinResult>, [...(TParams extends undefined ? never : TParams), ...(TJoinParams extends undefined ? never : TJoinParams)]>
    }

    exec(params?: QueryParamsToObject<TParams>): TResult extends undefined ? TablesToResultMap<TDbType, TTables> : ColumnsToResultMap<TDbType, TResult> {
        if (isNullOrUndefined(this.colsSelection)) {
            throw Error();
        }

        return Object.keys(this.colsSelection).reduce((prev, curr) => { prev[curr] = 1; return prev; }, {} as any);
    }
}

export {
    QueryBuilder
}