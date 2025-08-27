import type { DbType } from "../db.js";
import QueryColumn from "../query/queryColumn.js";
import type Table from "../table/table.js";
import type { ColumnsObjectType, QueryColumnsObjectType, QueryTableSpecsType } from "../table/types/utils.js";
import type { JoinType } from "../types.js";
import type { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";
import type { IJoinQuery } from "./_interfaces/IJoinQuery.js";
import type { ISelectQuery } from "./_interfaces/ISelectQuery.js";
import type { IWhereQuery } from "./_interfaces/IWhereQuery.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { TResultShape } from "./_types/result.js";
import type ColumnComparisonOperation from "./comparison.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import { QueryBuilder } from "./queryBuilder.js";

class QueryTable<
    TDbType extends DbType,
    TColumns extends ColumnsObjectType<TDbType>,
    TTableName extends string,
    TTable extends Table<TDbType, TColumns, TTableName>,
    TQColumns extends QueryColumnsObjectType<TDbType>,
    TAsName extends string | undefined = undefined
> implements
    ISelectQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>,
    IJoinQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>,
    IWhereQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]> {

    constructor(public table: TTable, public columns: TQColumns, public asName?: TAsName) { }

    as<TAsName extends string>(val: TAsName) {
        const queryColumns = Object.entries(this.columns).reduce((prev, curr) => {
            prev[curr[0]] = new QueryColumn(curr[1].column, curr[1].asName);
            return prev;

        }, {} as QueryColumnsObjectType<TDbType, QueryTableSpecsType>) as { [K in keyof TColumns]: QueryColumn<TDbType, TColumns[K], { tableName: TTableName, asTableName: TAsName }, string | undefined> };

        return new QueryTable<TDbType, TColumns, TTableName, Table<TDbType, TColumns, TTableName>, typeof queryColumns, TAsName>(this.table, queryColumns, val);
    }

    select<TCb extends undefined>():
        IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends ((cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>) => TResultShape<TDbType>)
    >(cb: TCb):
        IExecuteableQuery<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>], TCb extends (cols: any) => infer TR ? TR : undefined>
    select<
        TCb extends ((cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>) => TResultShape<TDbType>)
    >(
        cb?: TCb
    ) {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>([this]).select(cb);
    }

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
        cb: (cols:
            TableToColumnsMap<
                TablesToObject<
                    [
                        QueryTable<
                            TDbType,
                            TColumns,
                            TTableName,
                            TTable,
                            TQColumns,
                            TAsName
                        >
                        ,
                        TInnerJoinResult
                    ]
                >
            >) => TCbResult
    ) {

        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>([this])
            .join(type, table, cb);
    }

    where<
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>
    >(cb: (cols: TableToColumnsMap<TablesToObject<[QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>>) => TCbResult) {


        return new QueryBuilder<TDbType, [QueryTable<TDbType, TColumns, TTableName, TTable, TQColumns, TAsName>]>([this]).where(cb);
    }
}

export default QueryTable;