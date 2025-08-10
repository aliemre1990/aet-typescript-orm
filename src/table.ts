import { DbType, PgDbType } from "./db.js";
import { PgColumnType } from "./postgresql/dataTypes.js";
import { ComparableColumn } from "./queryBuilder/comparableColumn.js";
import { ComparisonOperation } from "./queryBuilder/comparisonOperation.js";
import type { IExecuteableQuery } from "./queryBuilder/interfaces/IExecuteableQuery.js";
import { IJoinQuery } from "./queryBuilder/interfaces/IJoinQuery.js";
import { ISelectQuery } from "./queryBuilder/interfaces/ISelectQuery.js";
import { QueryBuilder } from "./queryBuilder/queryBuilder.js";
import type { TableToColumnsMap, TableToObject } from "./types.js";
import { isNullOrUndefined } from "./utility/guards.js";



type ColumnTableSpecs = { tableName: string, tableAs?: string }

type ColumnType<TDbType extends DbType, TTableSpecs extends ColumnTableSpecs | undefined = ColumnTableSpecs | undefined, TAs extends string | undefined = string | undefined> = Column<TDbType, TDbType extends PgDbType ? PgColumnType : string, string, TTableSpecs, TAs>;
type ColumnsObjectType<TDbType extends DbType, TTableSpecs extends ColumnTableSpecs | undefined = undefined, TAs extends string | undefined = string | undefined> = { [key: string]: ColumnType<TDbType, TTableSpecs, TAs> };
type TableType<TDbType extends DbType, TColumns extends ColumnsObjectType<TDbType>, TTableName extends string = string> = Table<TDbType, TColumns, TTableName, string | undefined>;
type TablesObjectType<TDbType extends DbType, TTableName extends string = string> = { [key: string]: TableType<TDbType, ColumnsObjectType<TDbType>, TTableName> };

class ForeignKey {
    constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
}

class Column<
    TDbType extends DbType,
    TColumnType extends TDbType extends PgDbType ? PgColumnType : string,
    TColumnName extends string,
    TTableSpecs extends ColumnTableSpecs | undefined = undefined,
    TAs extends string | undefined = undefined

> {

    constructor(
        public name: TColumnName,
        public type: TColumnType,
        public defaultValue?: string,
        public tableSpecs?: ColumnTableSpecs,
        public asName?: TAs,
        public isNullable: boolean = false
    ) { }

    setTableSpecs<TTableSpecs extends ColumnTableSpecs>(val: TTableSpecs) {
        return new Column<TDbType, TColumnType, TColumnName, TTableSpecs, TAs>(this.name, this.type, this.defaultValue, val, this.asName, this.isNullable);
    }

    as<TAs extends string>(val: TAs) {
        return new Column<TDbType, TColumnType, TColumnName, TTableSpecs, TAs>(this.name, this.type, this.defaultValue, this.tableSpecs, val, this.isNullable);
    }
}

class Table<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string = string,
    TAs extends string | undefined = undefined
> implements
    ISelectQuery<TDbType, TablesObjectType<TDbType>>,
    IJoinQuery<TDbType, TablesObjectType<TDbType>> {


    constructor(
        public name: TTableName,
        public columns: TColumns,
        public primaryKeys?: (string[])[],
        public uniqueKeys?: (string[])[],
        public foreignKeys?: ForeignKey[],
        public asName?: TAs
    ) {

    }

    as<TAs extends string>(asName: TAs) {
        const newColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new Column(curr[1].name, curr[1].type, curr[1].defaultValue, { tableName: this.name, tableAs: asName }, curr[1].asName, curr[1].isNullable);
            return prev;
        }, {} as ColumnsObjectType<TDbType, { tableName: TTableName, tableAs: TAs }>) as { [K in keyof TColumns]: Column<TDbType, TColumns[K]["type"], TColumns[K]["name"], { tableName: TTableName, tableAs: TAs }, TColumns[K]["asName"]> };

        return new Table(this.name, newColumns, this.primaryKeys, this.uniqueKeys, this.foreignKeys, asName);
    }


    select<
        TSelectResult extends { [key: string]: ColumnType<TDbType, ColumnTableSpecs, string | undefined> | Record<string, ColumnType<TDbType, ColumnTableSpecs, string | undefined>> }
    >(
        cb: (cols: TableToColumnsMap<{ [key: string]: Table<TDbType, TColumns, TTableName, TAs> }>) => TSelectResult
    ): IExecuteableQuery<TDbType, TSelectResult> {

        const tables: { [x: string]: Table<TDbType, any, any, any> } = isNullOrUndefined(this.asName) ? { [this.name]: this } : { [this.asName as string]: this };

        return new QueryBuilder<TDbType, typeof tables>(tables).select(cb);
    }

    innerJoin<TInnerJoinTable extends Table<TDbType, any, any, any>>(
        table: TInnerJoinTable,
        cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName, TAs>> & TableToObject<TInnerJoinTable>>) => ComparisonOperation
    ):
        IJoinQuery<TDbType, TableToObject<Table<TDbType, TColumns, TTableName, TAs>> & TableToObject<TInnerJoinTable>> &
        ISelectQuery<TDbType, TableToObject<Table<TDbType, TColumns, TTableName, TAs>> & TableToObject<TInnerJoinTable>> {
        const tables: { [x: string]: Table<TDbType, any, any, any> } = isNullOrUndefined(this.asName) ? { [this.name]: this } : { [this.asName as string]: this };

        return new QueryBuilder(tables).innerJoin(table, cb);
    }


    leftJoin<TLeftJoinTable extends Table<TDbType, any, any>>(
        table: TLeftJoinTable,
        cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TLeftJoinTable>>) => ComparisonOperation
    ) {
        const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

        return new QueryBuilder(tables).innerJoin(table, cb);
    }

    rightJoin<TRightJoinTable extends Table<TDbType, any, any>>(
        table: TRightJoinTable,
        cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TRightJoinTable>>) => ComparisonOperation
    ) {
        const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

        return new QueryBuilder(tables).innerJoin(table, cb);
    }

    fullJoin<TFullJoinTable extends Table<TDbType, any, any>>(
        table: TFullJoinTable,
        cb: (cols: TableToColumnsMap<TableToObject<Table<TDbType, TColumns, TTableName>> & TableToObject<TFullJoinTable>>) => ComparisonOperation
    ) {
        const tables: { [x: string]: Table<TDbType, any, any, any> } = { [this.name]: this };

        return new QueryBuilder(tables).innerJoin(table, cb);
    }
}

function pgTable<
    TTableName extends string,
    TColumns extends ColumnsObjectType<PgDbType, { tableName: TTableName }, undefined>
>(
    name: TTableName,
    columns: TColumns,
    primaryKeys?: (string[])[],
    uniqueKeys?: (string[])[],
    foreignKeys?: ForeignKey[]
) {

    Object.entries(columns).reduce((prev, curr) => {
        prev[curr[0]] = curr[1].setTableSpecs({ tableName: name })
        return prev;
    }, {} as ColumnsObjectType<PgDbType, { tableName: TTableName }>) as TColumns;

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
    ColumnTableSpecs
}

export {
    Table,
    Column,
    ForeignKey,
    pgTable
}