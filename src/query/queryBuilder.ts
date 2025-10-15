import { DbType, dbTypes } from "../db.js";
import QueryColumn from "./queryColumn.js";
import Table, { type MapToQueryColumns } from "../table/table.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { MapCtesToSelectionType, TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { ColumnsToResultMap, QueryParamsToObject, ResultShape, ResultShapeItem } from "./_types/result.js";
import QueryTable from "./queryTable.js";
import type Column from "../table/column.js";
import type { DbFunctions, DbOperators } from "./_types/ops.js";
import type QueryParam from "./param.js";
import type { DbValueTypes } from "../table/column.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { AccumulateSubQueryParams, ConvertElementsToSubQueryCompliant, InferDbTypeFromFromFirstIDbType, MapToSubQueryObject } from "./_types/subQueryUtility.js";
import type { AccumulateComparisonParams } from "./_types/paramAccumulationComparison.js";
import type { AccumulateOrderByParams } from "./_types/paramAccumulationOrderBy.js";
import type { AccumulateColumnParams } from "./_types/paramAccumulationSelect.js";
import type ColumnsSelection from "./columnsSelection.js";
import { columnsSelectionFactory } from "./columnsSelection.js";
import { mysqlDbOperatorsWithAggregation, mysqlFunctions, mysqlFunctionsWithAggregation, pgDbOperatorsWithAggregation, pgFunctions, pgFunctionsWithAggregation } from "./dbOperations.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type IComparable } from "./_interfaces/IComparable.js";
import SubQueryObject from "./subQueryObject.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";
import between from "./comparisons/between.js";
import CTEObject from "./cteObject.js";
import type { MapToCTEObject } from "./_types/cteUtility.js";
import { mapCTESpecsToSelection } from "./utility.js";

type FromItemType<TDbType extends DbType> = QueryTable<TDbType, any, any, any, any, any> | SubQueryObject<TDbType, any, any, string> | CTEObject<TDbType, any, any, any, any>;
type FromType<TDbType extends DbType> = readonly FromItemType<TDbType>[];

const orderTypes = {
    asc: 'ASC',
    desc: 'DESC'
} as const;
type OrderType = typeof orderTypes[keyof typeof orderTypes];
type OrderBySpecs<TDbType extends DbType> = readonly (IComparable<TDbType, any, any, any, any, any> | [IComparable<TDbType, any, any, any, any, any>, OrderType])[];

const joinTypes = {
    inner: 'INNER',
    left: 'LEFT',
    right: 'RIGHT',
    full: 'FULL'
} as const;
type JoinType = typeof joinTypes[keyof typeof joinTypes];
type JoinSpecsTableType<TDbType extends DbType> = FromItemType<TDbType>;
type JoinSpecsItemType<TDbType extends DbType> = { joinType: JoinType, table: JoinSpecsTableType<TDbType> }
type JoinSpecsType<TDbType extends DbType> = readonly JoinSpecsItemType<TDbType>[]

type GroupBySpecs<TDbType extends DbType> = readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any>)[];

type ColumnsSelectionListType<TDbType extends DbType> = { [key: string]: ColumnsSelection<TDbType, any, any> }
type ComparisonType<TDbType extends DbType> = ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>;


const cteTypes = {
    NON_RECURSIVE: {
        name: 'NON_RECURSIVE'
    },
    RECURSIVE: {
        name: 'RECURSIVE'
    }
} as const;
type CTEType = (typeof cteTypes)[keyof typeof cteTypes];
type CTESpecs<TDbType extends DbType> = readonly CTEObject<TDbType, any, any, any, any>[];

type GetFirstTypeFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IComparable<TDbType, any, infer TValueType, any, any, any> ? TValueType :
    never :
    never;

type GetFirstFinalTypeFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IComparable<TDbType, any, any, infer TFinalValueType, any, any> ? TFinalValueType :
    never :
    never;

type GetFirstDefaultKeyFromResult<TDbType extends DbType, TResult extends ResultShape<TDbType> | undefined> =
    TResult extends undefined ? never :
    TResult extends ResultShape<TDbType> ?
    TResult[0] extends never ? never :
    TResult[0] extends IComparable<TDbType, any, any, any, infer TDefaultFieldKey, any> ? TDefaultFieldKey :
    never :
    never;

type CategorizedParamsType<TDbType extends DbType> = {
    cteParams: { [key: string]: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined },
    joinParams: { [key: string]: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined }
    fromParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    selectParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    whereParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    groupByParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    havingParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    orderByParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
}
type DefaultCategorizedParamsType = {
    cteParams: {},
    joinParams: {},
    fromParams: undefined,
    selectParams: undefined,
    whereParams: undefined,
    groupByParams: undefined,
    havingParams: undefined,
    orderByParam: undefined
}

class QueryBuilder<
    TDbType extends DbType,
    TFrom extends FromType<TDbType> | undefined,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TCTESpecs extends CTESpecs<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined = undefined,
    TAs extends string | undefined = undefined
>
    implements
    IDbType<TDbType>,
    IComparable<TDbType, TParams, GetFirstTypeFromResult<TDbType, TResult>, GetFirstFinalTypeFromResult<TDbType, TResult>, GetFirstDefaultKeyFromResult<TDbType, TResult>, TAs> {

    dbType: TDbType;

    [IComparableValueDummySymbol]?: GetFirstTypeFromResult<TDbType, TResult>;
    [IComparableFinalValueDummySymbol]?: GetFirstFinalTypeFromResult<TDbType, TResult>;

    params?: TParams;
    asName?: TAs;
    defaultFieldKey: GetFirstDefaultKeyFromResult<TDbType, TResult>;

    eq: typeof eq = eq;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;

    fromSpecs: TFrom;
    joinSpecs?: TJoinSpecs;
    cteSpecs?: TCTESpecs;
    columnsSelectionList?: ColumnsSelectionListType<TDbType>;
    resultSelection?: TResult;
    groupedColumns?: GroupBySpecs<TDbType>;
    havingSpec?: ComparisonType<TDbType>;
    orderBySpecs?: OrderBySpecs<TDbType>;

    constructor(
        dbType: TDbType,
        fromSpecs: TFrom,
        data?: {
            asName?: TAs,
            ownerName?: string,
            joinSpecs?: TJoinSpecs,
            resultSelection?: TResult,
            columnsSelectionList?: ColumnsSelectionListType<TDbType>,
            groupedColumns?: GroupBySpecs<TDbType>,
            havingSpec?: ComparisonType<TDbType>,
            orderBySpecs?: OrderBySpecs<TDbType>,
            cteSpecs?: TCTESpecs;
        }
    ) {
        this.dbType = dbType;

        this.fromSpecs = fromSpecs;
        this.joinSpecs = data?.joinSpecs;
        this.resultSelection = data?.resultSelection;
        this.columnsSelectionList = data?.columnsSelectionList;
        this.groupedColumns = data?.groupedColumns;
        this.havingSpec = data?.havingSpec;
        this.orderBySpecs = data?.orderBySpecs;
        this.cteSpecs = data?.cteSpecs;

        this.asName = data?.asName;

        this.defaultFieldKey = data?.resultSelection !== undefined && data.resultSelection.length > 0 ? data.resultSelection[0].defaultFieldKey : "";
    }


    ownerName?: string;
    setOwnerName(val: string): QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs> {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: val,
                resultSelection: this.resultSelection,
                joinSpecs: this.joinSpecs,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns
            });
    }

    as<TAs extends string>(asName: TAs): QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs> {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName,
                ownerName: this.ownerName,
                resultSelection: this.resultSelection,
                joinSpecs: this.joinSpecs,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns
            });
    }

    select<
        const TCbResult extends ResultShape<TDbType>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>,
            ops: DbFunctions<TDbType, true>
        ) => TCbResult
    ) {

        const cols = this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>;
        let isAgg = false;
        if (this.groupedColumns && this.groupedColumns.length > 0) {
            isAgg = true
        }

        let functions;
        if (this.dbType === dbTypes.postgresql && isAgg === true) {
            functions = pgFunctionsWithAggregation;
        } else if (this.dbType === dbTypes.postgresql && isAgg === false) {
            functions = pgFunctions;
        } else if (this.dbType === dbTypes.mysql && isAgg === true) {
            functions = mysqlFunctionsWithAggregation;
        } else if (this.dbType === dbTypes.mysql && isAgg === false) {
            functions = mysqlFunctions;
        } else {
            throw Error('Invalid query specification.');
        }

        const selectRes = cb(cols, functions as DbFunctions<TDbType, true>);

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TCbResult,
            AccumulateColumnParams<TParams, TCbResult>,
            TAs
        >(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: selectRes,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            });
    };


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
            MapToQueryColumns<TDbType, TDbType, TInnerCols>
        > :
        TInnerJoinTable extends QueryBuilder<TDbType, any, any, any, any, any, string> ? MapToSubQueryObject<TDbType, TInnerJoinTable> :
        TInnerJoinTable extends CTEObject<TDbType, any, any, any, any> ? TInnerJoinTable :
        TInnerJoinTable,
        const TInnerJoinAccumulated extends JoinSpecsType<TDbType> = readonly [...(TJoinSpecs extends undefined ? [] : TJoinSpecs), { joinType: TJoinType, table: TInnerJoinResult }],
        TAccumulatedParams extends QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TInnerJoinResult], AccumulateComparisonParams<TParams, TCbResult>>,
        TAccumulatedParamsResult extends QueryParam<TDbType, any, any, any, any>[] | undefined = TAccumulatedParams["length"] extends 0 ? undefined : TAccumulatedParams
    >(
        type: TJoinType,
        tableSelectionCb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TInnerJoinTable,
        cb: (tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TInnerJoinAccumulated>>, ops: DbOperators<TDbType, false>) => TCbResult
    ) {

        let cteSpecs = [] as MapCtesToSelectionType<TDbType, TCTESpecs>;
        if (this.cteSpecs !== undefined) {
            cteSpecs = mapCTESpecsToSelection(this.cteSpecs) as MapCtesToSelectionType<TDbType, TCTESpecs>;
        }
        const table = tableSelectionCb(cteSpecs);


        let columnsSelectionList = this.columnsSelectionList;

        let joinTable: TInnerJoinResult;
        if (table instanceof Table) {
            const queryColumns = table.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(table.dbType, col);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            let res = new QueryTable(table.dbType, table, queryColumns);
            let ownerName = res.asName ? res.asName : res.table.name;
            let columnsSelection = columnsSelectionFactory<TDbType>(res, res.columnsList.map(c => c.setOwnerName(ownerName)));

            joinTable = res as TInnerJoinResult;
            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }
        } else if (table instanceof QueryTable) {
            joinTable = table as QueryTable<TDbType, any, any, any, any, any> as TInnerJoinResult;
            let ownerName = table.asName ? table.asName : table.table.name;
            let columnsSelection = columnsSelectionFactory<TDbType>(table, table.columnsList.map((c: QueryColumn<TDbType, any, any, any, any, any, any>) => c.setOwnerName(ownerName)))

            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }
        } else if (table instanceof QueryBuilder) {
            let tmpTable: SubQueryObject<TDbType, any, any, any> = new SubQueryObject(this.dbType, table);

            if (typeof table.asName !== "string") {
                throw Error("Subquery alias must be provided.");
            }

            let ownerName = table.asName;
            let columnsSelection = columnsSelectionFactory<TDbType>(tmpTable, tmpTable.subQueryEntries);

            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }

            joinTable = tmpTable as TInnerJoinResult;
        } else if (table instanceof CTEObject) {
            let ownerName = table.cteName;
            let columnsSelection = columnsSelectionFactory<TDbType>(table, table.cteObjectEntries);

            joinTable = table as CTEObject<TDbType, any, any, any, any> as TInnerJoinResult;

            columnsSelectionList = {
                ...columnsSelection,
                [ownerName]: columnsSelection
            }
        } else {
            throw Error('Invalid table type.');
        }

        const newJoinSpec = { joinType: type, table: joinTable };
        const mergedJoinSpecs = [...(this.joinSpecs === undefined ? [newJoinSpec] : [...this.joinSpecs, newJoinSpec])] as TInnerJoinAccumulated;

        return new QueryBuilder<TDbType, TFrom, TInnerJoinAccumulated, TCTESpecs, TResult, TAccumulatedParamsResult, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                joinSpecs: mergedJoinSpecs,
                resultSelection: this.resultSelection,
                columnsSelectionList: columnsSelectionList,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            })
    }

    where<TCbResult extends ComparisonType<TDbType>>(cb: (
        tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
        ops: DbOperators<TDbType, true>
    ) => TCbResult) {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, AccumulateComparisonParams<TParams, TCbResult>, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                columnsSelectionList: this.columnsSelectionList,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            });
    }

    groupBy<
        const TCbResult extends GroupBySpecs<TDbType>
    >(cb: (
        tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
        ops: DbFunctions<TDbType, false>
    ) => TCbResult) {

        if (isNullOrUndefined(this.columnsSelectionList)) {
            throw Error("No query object provided.");
        }

        const functions = this.dbType === dbTypes.postgresql ? pgFunctions : this.dbType === dbTypes.mysql ? mysqlFunctions : undefined;
        if (isNullOrUndefined(functions)) {
            throw Error('Invalid db type.');
        }
        const res = cb(this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>, functions as DbFunctions<TDbType, false>);

        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: res,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            });
    }

    having<
        TCbResult extends ComparisonType<TDbType>
    >(cb: (
        tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
        ops: DbOperators<TDbType, true>
    ) => TCbResult) {
        const functions = this.dbType === dbTypes.postgresql ? pgDbOperatorsWithAggregation : this.dbType === dbTypes.mysql ? mysqlDbOperatorsWithAggregation : undefined;
        if (isNullOrUndefined(functions)) {
            throw Error('Invalid db type.');
        }

        const res = cb(this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>, functions as DbOperators<TDbType, true>)

        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                havingSpec: res,
                orderBySpecs: this.orderBySpecs
            });
    }

    orderBy<
        const TCbResult extends OrderBySpecs<TDbType>
    >(cb: (tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>) => TCbResult) {
        const res = cb(this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>);

        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, AccumulateOrderByParams<TDbType, TParams, TCbResult>, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: res
            });
    }

    from<
        TSelectedCTE extends (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string> |
            CTEObject<TDbType, any, any, any, any>
        )

    >(
        cb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TSelectedCTE
    ) {

        type TFromRes = ConvertElementsToSubQueryCompliant<TDbType, [TSelectedCTE]>;

        if (this.cteSpecs === undefined) {
            throw Error('No cte exists.');
        }

        const cteSpecs = mapCTESpecsToSelection(this.cteSpecs) as MapCtesToSelectionType<TDbType, TCTESpecs>;
        const res = cb(cteSpecs);

        let fromRes: FromItemType<TDbType>;
        if (res instanceof Table) {
            const queryColumns = res.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                new QueryColumn(res.dbType, col);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            fromRes = new QueryTable(res.dbType, res, queryColumns);
        } if (res instanceof QueryBuilder) {
            fromRes = new SubQueryObject(res.dbType, res);
        }
        else if (res instanceof QueryTable || res instanceof CTEObject) {
            fromRes = res;
        } else {
            throw Error('Invalid table type.')
        }

        return new QueryBuilder<TDbType, TFromRes, TJoinSpecs, TCTESpecs, TResult, TParams, TAs>(
            this.dbType,
            [fromRes] as TFromRes,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            })
    }

    exec(
        ...args: TParams extends undefined
            ? []
            : [params: QueryParamsToObject<TParams>]
    ):
        TResult extends ResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never {

        const params = args[0];

        if (isNullOrUndefined(this?.resultSelection)) {
            return {} as any;
        }

        return "x" as any;
    }
}



function from<
    TFrom extends readonly (
        Table<TDbType, any, any> |
        QueryTable<TDbType, any, any, any, any, any> |
        QueryBuilder<TDbType, any, any, any, any, any, string>
    )[],
    TDbType extends DbType = InferDbTypeFromFromFirstIDbType<TFrom>
>(...from: TFrom) {

    type TFromRes = ConvertElementsToSubQueryCompliant<TDbType, TFrom>;

    let dbType = from[0].dbType as TDbType;

    const fromResult = from.map(item => {
        if (item instanceof Table) {


            const queryColumns = item.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(item.dbType, col);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            return new QueryTable(item.dbType, item, queryColumns);
        } if (item instanceof QueryBuilder) {
            return new SubQueryObject(dbType, item);
        }
        else {
            return item;
        }
    }) as TFromRes;

    type AccumulatedParams = AccumulateSubQueryParams<TDbType, TFromRes>;
    type AccumulatedParamsResult = AccumulatedParams["length"] extends 0 ? undefined : AccumulatedParams;

    return new QueryBuilder<TDbType, TFromRes, undefined, undefined, undefined, AccumulatedParamsResult>(dbType, fromResult);
}

function withAs<
    TAs extends string,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never
>(as: TAs, qb: TQb) {
    type TCTEObject = MapToCTEObject<TDbType, TAs, typeof cteTypes.NON_RECURSIVE, TQb>;
    type TParams = TQb extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never;

    const cteObject = new CTEObject(qb.dbType, qb, as, cteTypes.NON_RECURSIVE) as TCTEObject;
    const cteSpecs = [cteObject] as const;

    return new QueryBuilder<TDbType, undefined, undefined, typeof cteSpecs, undefined, TParams>(qb.dbType, undefined, { cteSpecs });
}

export default QueryBuilder;

export {
    from,
    withAs,
    cteTypes
}

export type {
    JoinSpecsTableType,
    JoinSpecsItemType,
    JoinSpecsType,
    FromItemType,
    FromType,
    ComparisonType,
    GroupBySpecs,
    JoinType,
    OrderBySpecs,
    OrderType,
    CTEType,
    CTESpecs,
    CategorizedParamsType,
    DefaultCategorizedParamsType
}
