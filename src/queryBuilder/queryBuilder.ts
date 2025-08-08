import { DbType, PgDbType } from "../db.js";
import { PgColumnType } from "../postgresql/dataTypes.js";
import type { ColumnTableSpecs, ColumnType, Table, TablesObjectType } from "../table.js";
import type { ColumnsToResultMap, TableToColumnsMap, TableToObject } from "../types.js";
import { isNullOrUndefined } from "../utility/guards.js";
import { ComparableColumn } from "./comparableColumn.js";
import { ComparisonOperation } from "./comparisonOperation.js";
import { IExecuteableQuery } from "./interfaces/IExecuteableQuery.js";
import { IJoinQuery } from "./interfaces/IJoinQuery.js";
import { ISelectQuery } from "./interfaces/ISelectQuery.js";

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
    TTables extends TablesObjectType<TDbType>,
    TResult extends { [key: string]: ColumnType<TDbType> } | undefined = undefined
>
    implements
    ISelectQuery<TDbType, TTables>,
    IJoinQuery<TDbType, TTables> {

    colsSelection?: TResult;

    tables: TTables;


    constructor(tables: TTables, colsSelection?: TResult) {
        this.tables = tables;
        this.colsSelection = colsSelection;
    }


    select<TSelectResult extends { [key: string]: ColumnType<TDbType, ColumnTableSpecs, string | undefined> | Record<PropertyKey, ColumnType<TDbType, ColumnTableSpecs, string | undefined>> }>(
        cb: (cols: TableToColumnsMap<TTables>) => TSelectResult
    ): IExecuteableQuery<TDbType, TSelectResult> {
        return this as unknown as IExecuteableQuery<TDbType, TSelectResult>;
    };


    innerJoin<TInnerJoinTable extends Table<TDbType, any, any, any>>(
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TTables & TableToObject<TInnerJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TInnerJoinTable>> &
        ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinTable>> {

        const newTables = { ...this.tables, [table.name]: table };

        return new QueryBuilder(newTables) as unknown as
            IJoinQuery<TDbType, TTables & TableToObject<TInnerJoinTable>> &
            ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinTable>>
    }


    leftJoin<TLeftJoinTable extends Table<TDbType, any, any>>(
        table: TLeftJoinTable,
        cb: (cols: TableToColumnsMap<TTables & TableToObject<TLeftJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TLeftJoinTable>> &
        ISelectQuery<TDbType, TTables & TableToObject<TLeftJoinTable>> {

        const newTables = { ...this.tables, [table.name]: table };

        return new QueryBuilder(newTables) as unknown as
            IJoinQuery<TDbType, TTables & TableToObject<TLeftJoinTable>> &
            ISelectQuery<TDbType, TTables & TableToObject<TLeftJoinTable>>
    }


    rightJoin<TRightJoinTable extends Table<TDbType, any, any>>(
        table: TRightJoinTable,
        cb: (cols: TableToColumnsMap<TTables & TableToObject<TRightJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TRightJoinTable>> &
        ISelectQuery<TDbType, TTables & TableToObject<TRightJoinTable>> {

        const newTables = { ...this.tables, [table.name]: table };

        return new QueryBuilder(newTables) as unknown as
            IJoinQuery<TDbType, TTables & TableToObject<TRightJoinTable>> &
            ISelectQuery<TDbType, TTables & TableToObject<TRightJoinTable>>
    }


    fullJoin<TFullJoinTable extends Table<TDbType, any, any>>(
        table: TFullJoinTable,
        cb: (cols: TableToColumnsMap<TTables & TableToObject<TFullJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TFullJoinTable>> &
        ISelectQuery<TDbType, TTables & TableToObject<TFullJoinTable>> {

        const newTables = { ...this.tables, [table.name]: table };

        return new QueryBuilder(newTables) as unknown as
            IJoinQuery<TDbType, TTables & TableToObject<TFullJoinTable>> &
            ISelectQuery<TDbType, TTables & TableToObject<TFullJoinTable>>
    }

    exec(): ColumnsToResultMap<TDbType, TResult> {
        if (isNullOrUndefined(this.colsSelection)) {
            throw Error();
        }

        return Object.keys(this.colsSelection).reduce((prev, curr) => { prev[curr] = 1; return prev; }, {} as any);
    }
}

export {
    QueryBuilder
}