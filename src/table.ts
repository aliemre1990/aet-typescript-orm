import { DbType, PgDbType } from "./db.js";
import { PgColumnType } from "./postgresql/dataTypes.js";
import { ComparableColumn } from "./queryBuilder/comparableColumn.js";
import { ComparisonOperation } from "./queryBuilder/comparisonOperation.js";
import type { IExecuteableQuery } from "./queryBuilder/interfaces/IExecuteableQuery.js";
import { IJoinQuery } from "./queryBuilder/interfaces/IJoinQuery.js";
import { ISelectQuery } from "./queryBuilder/interfaces/ISelectQuery.js";
import { QueryBuilder } from "./queryBuilder/queryBuilder.js";
import { isNullOrUndefined } from "./utility/guards.js";
import { type TableToColumnsMap, type TableToObject } from "./utility/types.js";


type ColumnType<TDbType extends DbType, TTableName extends string = string> = Column<TDbType, TDbType extends PgDbType ? PgColumnType : string, string, TTableName>;
type ColumnsObjectType<TDbType extends DbType, TTableName extends string = string> = { [key: string]: ColumnType<TDbType, TTableName> };
type TableType<TDbType extends DbType, TColumns extends ColumnsObjectType<TDbType>, TTableName extends string = string> = Table<TDbType, TColumns, TTableName, string | undefined>;
type TablesObjectType<TDbType extends DbType, TTableName extends string = string> = { [key: string]: TableType<TDbType, ColumnsObjectType<TDbType>, TTableName> };

class ForeignKey {
    constructor(public column: string, public references: { table: string; column: string | 'self-parent' | 'self-child' }) { }
}

class Column<
    TDbType extends DbType,
    TColumnType extends TDbType extends PgDbType ? PgColumnType : string,
    TColumnName extends string = string,
    TTableName extends string = string
> {

    tableName?: TTableName;

    constructor(
        public name: TColumnName,
        public type: TColumnType,
        public defaultValue?: string,
        public isNullable: boolean = false
    ) { }

    setTableName(val: TTableName) {
        this.tableName = val;
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
        return new Table(this.name, this.columns, this.primaryKeys, this.uniqueKeys, this.foreignKeys, asName);
    }


    select<
        TSelectResult extends { [key: string]: ColumnType<TDbType> | Record<PropertyKey, ColumnType<TDbType>> }
    >(
        cb: (cols: TableToColumnsMap<{ [key: string]: Table<TDbType, TColumns, TTableName, TAs> }>) => TSelectResult
    ): IExecuteableQuery<TDbType, TSelectResult> {

        const tables: { [x: string]: Table<TDbType, any, any, any> } = isNullOrUndefined(this.asName) ? { [this.name]: this } : { [this.asName as string]: this };

        return new QueryBuilder(tables).select(cb);
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
    TColumns extends ColumnsObjectType<PgDbType, TTableName>
>(
    name: TTableName,
    columns: TColumns,
    primaryKeys?: (string[])[],
    uniqueKeys?: (string[])[],
    foreignKeys?: ForeignKey[]
) {

    Object.entries(columns).forEach(ent => ent[1].setTableName(name));

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
    TablesObjectType
}

export {
    Table,
    Column,
    ForeignKey,
    pgTable
}