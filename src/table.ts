import { DbType, PgDbType } from "./db.js";
import { PgColumnType } from "./postgresql/dataTypes.js";
import { ComparableColumn } from "./queryBuilder/comparableColumn.js";
import { ComparisonOperation } from "./queryBuilder/comparisonOperation.js";
import type { IExecuteableQuery } from "./queryBuilder/interfaces/IExecuteableQuery.js";
import { IJoinQuery } from "./queryBuilder/interfaces/IJoinQuery.js";
import { ISelectQuery } from "./queryBuilder/interfaces/ISelectQuery.js";
import { QueryBuilder } from "./queryBuilder/queryBuilder.js";
import { isNullOrUndefined } from "./utility/guards.js";

// Create a mapping of table names to their column names
type TableToColumnsMap<T extends { [key: string]: QueryTable<any, any, any, any, any, any> }, TIsComparableColumn extends boolean = false, TColumn = null> = {
    [K in keyof T as T[K]["asName"] extends undefined ? T[K]["table"]["name"] : T[K]["asName"]]: {
        [C in keyof T[K]["table"]["columns"]as T[K]["table"]["columns"][C]["name"]]: TIsComparableColumn extends false ? QueryColumn<DbType, T[K]["table"]["columns"][C], QueryTableSpecsType, string | undefined> : TColumn extends Column<infer TDbType, infer TColumnName, infer TColumnType, infer TTableSpecs> ? ComparableColumn<TDbType, TColumnName, TColumnType, TTableSpecs> : never;
    }
};

type TableToObject<TTable extends QueryTable<any, any, any, any, any, any>> = {
    [K in TTable["asName"]as K extends undefined ? TTable["table"]["name"] : K]: TTable
}

type GetColumnType<TDbType extends DbType> = TDbType extends PgDbType ? PgColumnType : string;


type TableSpecsType<TTableName extends string = string> = { tableName: TTableName }
type QueryTableSpecsType<TAsName extends string = string> = { asTableName: TAsName }

type ColumnType<TDbType extends DbType> = Column<TDbType, GetColumnType<TDbType>, string, TableSpecsType>;
type ColumnsObjectType<TDbType extends DbType> = { [key: string]: ColumnType<TDbType> };
type TableType<TDbType extends DbType, TColumns extends ColumnsObjectType<TDbType>, TTableName extends string = string> = Table<TDbType, TColumns, TTableName>;
type TablesObjectType<TDbType extends DbType> = { [key: string]: TableType<TDbType, ColumnsObjectType<TDbType>> };
type QueryTablesObjectType<TDbType extends DbType, TAsName extends string | undefined = string | undefined> = { [key: string]: QueryTable<TDbType, ColumnsObjectType<TDbType>, string, TableType<TDbType, ColumnsObjectType<TDbType>>, QueryColumnsObjectType<TDbType, QueryTableSpecsType>, TAsName> }
type QueryColumnsObjectType<TDbType extends DbType, TQTableSpecs extends QueryTableSpecsType> = { [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, TQTableSpecs, string | undefined> }

class ForeignKey {
    constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
}

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined
> {

    qTableSpecs?: TQTableSpecs;

    constructor(public column: TColumn, public asName?: TAsName) { }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>(this.column, val);
    }

    setQTableSpecs(val: TQTableSpecs) {
        this.qTableSpecs = val;
    }
}

class QueryTable<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string,
    TTable extends Table<TDbType, TColumns, TTableName>,
    TQColumns extends QueryColumnsObjectType<TDbType, QueryTableSpecsType>,
    TAsName extends string | undefined = undefined
> {

    constructor(public table: TTable, public columns: TQColumns, public asName?: TAsName) { }

    as<TAsName extends string>(val: TAsName) {
        return new QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>(this.table, this.columns, val);
    }

}

class Column<
    TDbType extends DbType,
    TColumnType extends GetColumnType<TDbType>,
    TColumnName extends string,
    TTableSpecs extends TableSpecsType
> {

    tableSpecs?: TTableSpecs;

    constructor(
        public name: TColumnName,
        public type: TColumnType,
        public defaultValue?: string,
        public isNullable: boolean = false
    ) { }

    setTableSpecs(val: TTableSpecs) {
        this.tableSpecs = val;
    }

}

class Table<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string = string,
    TQueryColumns extends QueryColumnsObjectType<TDbType, QueryTableSpecsType<string>> = { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], QueryTableSpecsType, undefined> }
> implements
    ISelectQuery<TDbType, QueryTablesObjectType<TDbType>>,
    IJoinQuery<TDbType, QueryTablesObjectType<TDbType>> {

    constructor(
        public name: TTableName,
        public columns: TColumns,
        public primaryKeys?: (string[])[],
        public uniqueKeys?: (string[])[],
        public foreignKeys?: ForeignKey[]
    ) {

    }

    as<TAsName extends string>(val: TAsName) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;

        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], QueryTableSpecsType, undefined> };

        return new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, typeof queryColumns, TAsName>(this, queryColumns, val);
    }


    select<
        TSelectResult extends { [key: string]: QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined> | Record<PropertyKey, QueryColumn<TDbType, ColumnType<TDbType>, QueryTableSpecsType, string | undefined>> }
    >(
        cb: (cols: TableToColumnsMap<{ [key: string]: QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, QueryColumnsObjectType<TDbType, QueryTableSpecsType>, undefined> }>) => TSelectResult
    ): IExecuteableQuery<TDbType, TSelectResult> {

        const queryColumns = Object.entries(this.columns)
            .reduce((prev, ent) => {
                prev[ent[1].name] = new QueryColumn(ent[1]);
                return prev;
            }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>);


        const tables = { [this.name]: new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, QueryColumnsObjectType<TDbType, QueryTableSpecsType>, undefined>(this, queryColumns) };

        return new QueryBuilder(tables).select(cb);
    }

    innerJoin<
        TInnerJoinAs extends string | undefined,
        TInnerJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, TInnerJoinAs>,
        TInnerJoinResult extends TInnerJoinTable extends Table<TDbType, infer TInnerColumns, infer TInnerTableName> ?
        QueryTable<
            TDbType,
            TInnerColumns,
            TInnerTableName,
            Table<TDbType, TInnerColumns, TInnerTableName>,
            { [K in keyof TInnerColumns]: QueryColumn<TDbType, TInnerColumns[K], QueryTableSpecsType, string | undefined> },
            undefined
        > :
        TInnerJoinTable

    >(
        table: TInnerJoinTable,
        cb: (cols:
            TableToColumnsMap<
                TableToObject<
                    QueryTable<
                        TDbType,
                        TColumns,
                        TTableName,
                        Table<TDbType, TColumns, TTableName>,
                        TQueryColumns
                    >
                > &
                TableToObject<TInnerJoinResult>
            >) => ComparisonOperation
    ): IJoinQuery<TDbType,
        TableToObject<
            QueryTable<
                TDbType,
                TColumns,
                TTableName,
                Table<TDbType, TColumns, TTableName>,
                TQueryColumns
            >> &
        TableToObject<TInnerJoinResult>
    > &
        ISelectQuery<TDbType,
            TableToObject<
                QueryTable<
                    TDbType,
                    TColumns,
                    TTableName,
                    Table<TDbType, TColumns, TTableName>,
                    TQueryColumns
                >> &
            TableToObject<TInnerJoinResult>
        > {


        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1]);
            return prev;
        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as TQueryColumns
        const tables = {
            [this.name]: new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, TQueryColumns, undefined>(this, queryColumns)
        };

        return new QueryBuilder(tables).innerJoin(table, cb);
    }


    // leftJoin<TLeftJoinTable extends Table<TDbType, any, any>>(
    //     table: TLeftJoinTable,
    //     cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TLeftJoinTable>>) => ComparisonOperation
    // ) {
    //     const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

    //     return new QueryBuilder(tables).innerJoin(table, cb);
    // }

    // rightJoin<TRightJoinTable extends Table<TDbType, any, any>>(
    //     table: TRightJoinTable,
    //     cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TRightJoinTable>>) => ComparisonOperation
    // ) {
    //     const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

    //     return new QueryBuilder(tables).innerJoin(table, cb);
    // }

    // fullJoin<TFullJoinTable extends Table<TDbType, any, any>>(
    //     table: TFullJoinTable,
    //     cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TFullJoinTable>>) => ComparisonOperation
    // ) {
    //     const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

    //     return new QueryBuilder(tables).innerJoin(table, cb);
    // }
}

function pgTable<
    TTableName extends string,
    TColumns extends Record<string, Column<PgDbType, GetColumnType<PgDbType>, string, TableSpecsType<TTableName>>>
>(
    name: TTableName,
    columns: TColumns,
    primaryKeys?: (string[])[],
    uniqueKeys?: (string[])[],
    foreignKeys?: ForeignKey[]
) {


    return new Table<PgDbType, TColumns, TTableName>(
        name,
        columns,
        primaryKeys,
        uniqueKeys,
        foreignKeys
    );
}

export type {
    ColumnType,
    ColumnsObjectType,
    TableType,
    TablesObjectType,
    QueryTablesObjectType,
    TableSpecsType,
    QueryTableSpecsType,
    QueryColumn,
    QueryColumnsObjectType,
    QueryTable,
    TableToColumnsMap,
    TableToObject,
    GetColumnType
}

export {
    Table,
    Column,
    ForeignKey,
    pgTable
}



// import { DbType, PgDbType } from "./db.js";
// import { PgColumnType } from "./postgresql/dataTypes.js";
// import { ComparableColumn } from "./queryBuilder/comparableColumn.js";
// import { ComparisonOperation } from "./queryBuilder/comparisonOperation.js";
// import type { IExecuteableQuery } from "./queryBuilder/interfaces/IExecuteableQuery.js";
// import { IJoinQuery } from "./queryBuilder/interfaces/IJoinQuery.js";
// import { ISelectQuery } from "./queryBuilder/interfaces/ISelectQuery.js";
// import { QueryBuilder } from "./queryBuilder/queryBuilder.js";
// import { isNullOrUndefined } from "./utility/guards.js";
// import { type GetColumnType, type TableToColumnsMap, type TableToObject } from "./utility/types.js";


// type ColumnType<TDbType extends DbType> = Column<TDbType, TDbType extends PgDbType ? PgColumnType : string, string, string, any>;
// type ColumnsObjectType<TDbType extends DbType> = { [key: string]: ColumnType<TDbType> };
// type TableType<TDbType extends DbType, TColumns extends ColumnsObjectType<TDbType>> = Table<TDbType, TColumns, string, string | undefined>;
// type TablesObjectType<TDbType extends DbType> = { [key: string]: TableType<TDbType, ColumnsObjectType<TDbType>> };

// class ForeignKey {
//     constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
// }

// class Column<
//     TDbType extends DbType,
//     TColumnType extends TDbType extends PgDbType ? PgColumnType : string,
//     TColumnName extends string,
//     TTableName extends string,
//     TColumns extends { [key: string]: Column<TDbType, GetColumnType<TDbType>, string, TTableName, TColumns> },
//     TTable extends Table<TDbType, TColumns, TTableName> = Table<TDbType, TColumns, TTableName>
// > {

//     table?: TTable;

//     constructor(
//         public name: TColumnName,
//         public type: TColumnType,
//         public defaultValue?: string,
//         public isNullable: boolean = false
//     ) { }

//     setTable(val: TTable) {
//         this.table = val;
//     }
// }

// class Table<
//     TDbType extends DbType,
//     TColumns extends { [key: string]: Column<TDbType, GetColumnType<TDbType>, string, TTableName, TColumns> },
//     TTableName extends string,
//     TAs extends string | undefined = undefined
// >
// // implements
// //     ISelectQuery<TDbType, TablesObjectType<TDbType>>,
// // IJoinQuery<TDbType, TablesObjectType<TDbType>>
// {


//     constructor(
//         public name: TTableName,
//         public columns: TColumns,
//         public primaryKeys?: (string[])[],
//         public uniqueKeys?: (string[])[],
//         public foreignKeys?: ForeignKey[],
//         public asName?: TAs
//     ) {

//     }

//     // as<TAs extends string>(asName: TAs) {
//     //     return new Table(this.name, this.columns, this.primaryKeys, this.uniqueKeys, this.foreignKeys, asName);
//     // }


//     // select<
//     //     TSelectResult extends { [key: string]: ColumnType<TDbType> | Record<PropertyKey, ColumnType<TDbType>> }
//     // >(
//     //     cb: (cols: TableToColumnsMap<{ [key: string]: Table<TDbType, TColumns, TTableName, TAs> }>) => TSelectResult
//     // ): IExecuteableQuery<TDbType, TSelectResult> {

//     //     const tables: { [x: string]: Table<TDbType, any, any, any> } = isNullOrUndefined(this.asName) ? { [this.name]: this } : { [this.asName as string]: this };

//     //     return new QueryBuilder(tables).select(cb);
//     // }

//     // innerJoin<TInnerJoinTable extends Table<TDbType, any, any, any>>(
//     //     table: TInnerJoinTable,
//     //     cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName, TAs>> & TableToObject<TInnerJoinTable>>) => ComparisonOperation
//     // ):
//     //     IJoinQuery<TDbType, TableToObject<Table<TDbType, TColumns, TTableName, TAs>> & TableToObject<TInnerJoinTable>> &
//     //     ISelectQuery<TDbType, TableToObject<Table<TDbType, TColumns, TTableName, TAs>> & TableToObject<TInnerJoinTable>> {
//     //     const tables: { [x: string]: Table<TDbType, any, any, any> } = isNullOrUndefined(this.asName) ? { [this.name]: this } : { [this.asName as string]: this };

//     //     return new QueryBuilder(tables).innerJoin(table, cb);
//     // }


//     // leftJoin<TLeftJoinTable extends Table<TDbType, any, any>>(
//     //     table: TLeftJoinTable,
//     //     cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TLeftJoinTable>>) => ComparisonOperation
//     // ) {
//     //     const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

//     //     return new QueryBuilder(tables).innerJoin(table, cb);
//     // }

//     // rightJoin<TRightJoinTable extends Table<TDbType, any, any>>(
//     //     table: TRightJoinTable,
//     //     cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TRightJoinTable>>) => ComparisonOperation
//     // ) {
//     //     const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

//     //     return new QueryBuilder(tables).innerJoin(table, cb);
//     // }

//     // fullJoin<TFullJoinTable extends Table<TDbType, any, any>>(
//     //     table: TFullJoinTable,
//     //     cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TFullJoinTable>>) => ComparisonOperation
//     // ) {
//     //     const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

//     //     return new QueryBuilder(tables).innerJoin(table, cb);
//     // }
// }

// function pgTable<
//     TTableName extends string,
//     TColumns extends { [key: string]: Column<PgDbType, GetColumnType<PgDbType>, string, TTableName, TColumns> }
// >(
//     name: TTableName,
//     columns: TColumns,
//     primaryKeys?: (string[])[],
//     uniqueKeys?: (string[])[],
//     foreignKeys?: ForeignKey[]
// ): Table<PgDbType, TColumns, TTableName> {


//     const tbl = new Table<PgDbType, TColumns, TTableName>(
//         name,
//         columns,
//         primaryKeys,
//         uniqueKeys,
//         foreignKeys
//     );


//     Object.entries(columns).forEach(ent => ent[1].setTable(tbl));

//     return tbl;
// }

// export type {
//     ColumnType,
//     ColumnsObjectType,
//     TableType,
//     TablesObjectType
// }

// export {
//     Table,
//     Column,
//     ForeignKey,
//     pgTable
// }
