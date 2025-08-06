import { DbType, PgDbType } from "../db.js";
import { PgColumnType } from "../postgresql/dataTypes.js";
import { ColumnType, Table, type QueryColumn, type QueryTable, type QueryTablesObjectType, type QueryTableSpecsType, type TableToColumnsMap, type TableToObject } from "../table.js";
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
    TTables extends QueryTablesObjectType<TDbType>, // turn this type to keyed querytable object
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


    select<
        TSelectResult extends { [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined> | Record<PropertyKey, QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined>> }>(
            cb: (cols: TableToColumnsMap<TTables>) => TSelectResult
        ): IExecuteableQuery<TDbType, TSelectResult> {
        return this as unknown as IExecuteableQuery<TDbType, TSelectResult>;
    };


    innerJoin<
        TInnerJoinAs extends string | undefined,
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, TInnerJoinAs>,
        TInnerJoinResult extends
        TInnerJoinTable extends Table<TDbType, infer TColumns, infer TTableName> ?
        QueryTable<
            TDbType,
            TColumns,
            TTableName,
            Table<TDbType, TColumns, TTableName>,
            { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], QueryTableSpecsType, string | undefined> }
        > : TInnerJoinTable

    >(
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TTables & TableToObject<TInnerJoinResult>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TTables & TableToObject<TInnerJoinResult>> &
        ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinResult>> {

        // const newTables = { ...this.tables, [table.name]: table };

        return this as unknown as
            IJoinQuery<TDbType, TTables & TableToObject<TInnerJoinResult>> &
            ISelectQuery<TDbType, TTables & TableToObject<TInnerJoinResult>>
    }


    // leftJoin<TLeftJoinTable extends Table<TDbType, any, any>>(
    //     table: TLeftJoinTable,
    //     cb: (cols: TableToColumnsMap<TTables & TableToObject<TLeftJoinTable>>) => ComparisonOperation
    // ):
    //     IJoinQuery<TDbType, TTables & TableToObject<TLeftJoinTable>> &
    //     ISelectQuery<TDbType, TTables & TableToObject<TLeftJoinTable>> {

    //     const newTables = { ...this.tables, [table.name]: table };

    //     return new QueryBuilder(newTables) as unknown as
    //         IJoinQuery<TDbType, TTables & TableToObject<TLeftJoinTable>> &
    //         ISelectQuery<TDbType, TTables & TableToObject<TLeftJoinTable>>
    // }


    // rightJoin<TRightJoinTable extends Table<TDbType, any, any>>(
    //     table: TRightJoinTable,
    //     cb: (cols: TableToColumnsMap<TTables & TableToObject<TRightJoinTable>>) => ComparisonOperation
    // ):
    //     IJoinQuery<TDbType, TTables & TableToObject<TRightJoinTable>> &
    //     ISelectQuery<TDbType, TTables & TableToObject<TRightJoinTable>> {

    //     const newTables = { ...this.tables, [table.name]: table };

    //     return new QueryBuilder(newTables) as unknown as
    //         IJoinQuery<TDbType, TTables & TableToObject<TRightJoinTable>> &
    //         ISelectQuery<TDbType, TTables & TableToObject<TRightJoinTable>>
    // }


    // fullJoin<TFullJoinTable extends Table<TDbType, any, any>>(
    //     table: TFullJoinTable,
    //     cb: (cols: TableToColumnsMap<TTables & TableToObject<TFullJoinTable>>) => ComparisonOperation
    // ):
    //     IJoinQuery<TDbType, TTables & TableToObject<TFullJoinTable>> &
    //     ISelectQuery<TDbType, TTables & TableToObject<TFullJoinTable>> {

    //     const newTables = { ...this.tables, [table.name]: table };

    //     return new QueryBuilder(newTables) as unknown as
    //         IJoinQuery<TDbType, TTables & TableToObject<TFullJoinTable>> &
    //         ISelectQuery<TDbType, TTables & TableToObject<TFullJoinTable>>
    // }

    exec(): { [K in keyof TResult as K]: number } {
        if (isNullOrUndefined(this.colsSelection)) {
            throw Error();
        }

        return Object.keys(this.colsSelection).reduce((prev, curr) => { prev[curr] = 1; return prev; }, {} as any);
    }
}

export {
    QueryBuilder
}