import { DbType, dbTypes } from "../db.js";
import QueryColumn from "./queryColumn.js";
import Table, { type MapToQueryColumns } from "../table/table.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { MapCtesToSelectionType, TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { ColumnsToResultMap, QueryParamsToObject, ResultShape, ResultShapeItem, SelectToResultMapRecursively } from "./_types/result.js";
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
import { columnsSelectionFactory, ColumnsSelectionQueryTableObjectSymbol } from "./columnsSelection.js";
import { mysqlDbOperators, mysqlFunctions, pgDbOperators, pgFunctions } from "./dbOperations.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type IComparable } from "./_interfaces/IComparable.js";
import SubQueryObject from "./subQueryObject.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";
import between from "./comparisons/between.js";
import CTEObject from "./cteObject.js";
import type { MapToCTEObject } from "./_types/cteUtility.js";
import { mapCTESpecsToSelection } from "./utility.js";
import { OverrideFromParams, OverrideOrderByParams, OverrideWhereParams, type AccumulateCategorizedParams, type OverrideCTEParams, type OverrideGroupByParams, type OverrideHavingParams, type OverrideJoinParams, type OverrideSelectParams } from "./_types/categorizedParams.js";
import type { OverrideDuplicateJoinSpec } from "./_types/join.js";
import type { OverrideDuplicateCTESpec } from "./_types/cte.js";

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
type CTESpecsType<TDbType extends DbType> = readonly CTEObject<TDbType, any, any, any, any>[];

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
    cteParams: readonly { name: string, params: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined }[],
    joinParams: readonly { name: string, params: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined }[],
    fromParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    selectParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    whereParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    groupByParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    havingParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
    orderByParams: readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined,
}
type DefaultCategorizedParamsType = {
    cteParams: [],
    joinParams: [],
    fromParams: undefined,
    selectParams: undefined,
    whereParams: undefined,
    groupByParams: undefined,
    havingParams: undefined,
    orderByParams: undefined
}

class QueryBuilder<
    TDbType extends DbType,
    TFrom extends FromType<TDbType> | undefined,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined = undefined,
    TCategorizedParams extends CategorizedParamsType<TDbType> = DefaultCategorizedParamsType,
    TAs extends string | undefined = undefined,
    TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined =
    AccumulateCategorizedParams<TDbType, TCategorizedParams>["length"] extends 0 ? undefined : AccumulateCategorizedParams<TDbType, TCategorizedParams>
>
    implements
    IDbType<TDbType>,
    IComparable<TDbType, TParamsAccumulated, GetFirstTypeFromResult<TDbType, TResult>, GetFirstFinalTypeFromResult<TDbType, TResult>, GetFirstDefaultKeyFromResult<TDbType, TResult>, TAs> {

    dbType: TDbType;

    [IComparableValueDummySymbol]?: GetFirstTypeFromResult<TDbType, TResult>;
    [IComparableFinalValueDummySymbol]?: GetFirstFinalTypeFromResult<TDbType, TResult>;

    params?: TParamsAccumulated;
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
    setOwnerName(val: string): QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TCategorizedParams, TAs, TParamsAccumulated> {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TCategorizedParams, TAs, TParamsAccumulated>(
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

    as<TAs extends string>(asName: TAs): QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TCategorizedParams, TAs, TParamsAccumulated> {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TCategorizedParams, TAs, TParamsAccumulated>(
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
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>,
            ops: DbFunctions<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TFinalResult,
        OverrideSelectParams<TDbType, TCategorizedParams, AccumulateColumnParams<undefined, TFinalResult>>,
        TAs
    > {

        const cols = this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>;


        let functions;
        if (this.dbType === dbTypes.postgresql) {
            functions = pgFunctions;
        } else if (this.dbType === dbTypes.mysql) {
            functions = mysqlFunctions;
        } else {
            throw Error('Invalid query specification.');
        }

        const selectRes = cb(cols, functions as DbFunctions<TDbType>);

        let finalSelectRes: ResultShapeItem<TDbType>[] = [];
        for (const it of selectRes) {
            if (ColumnsSelectionQueryTableObjectSymbol in it) {
                for (const k in it) {
                    let comparable = it[k] as IComparable<TDbType, any, any, any, any, any>;
                    finalSelectRes.push(comparable);
                }
            } else {
                finalSelectRes.push(it);
            }
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TFinalResult,
            OverrideSelectParams<TDbType, TCategorizedParams, AccumulateColumnParams<undefined, TFinalResult>>,
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
                resultSelection: finalSelectRes as ResultShape<TDbType> as TFinalResult,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            });
    };


    join<
        TJoinType extends JoinType,
        TJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, string, any> | CTEObject<TDbType, any, any, any, any>,
        TCbResult extends ColumnComparisonOperation<TDbType, any, any, any> | ColumnLogicalOperation<TDbType, any>,
        TJoinResult extends JoinSpecsTableType<TDbType> =
        TJoinTable extends Table<TDbType, infer TJoinCols, infer TJoinTableName> ?
        QueryTable<
            TDbType,
            TJoinCols,
            TJoinTableName,
            Table<TDbType, TJoinCols, TJoinTableName>,
            MapToQueryColumns<TDbType, TDbType, TJoinCols>
        > :
        TJoinTable extends QueryBuilder<TDbType, any, any, any, any, any, string, any> ? MapToSubQueryObject<TDbType, TJoinTable> :
        TJoinTable extends CTEObject<TDbType, any, any, any, any> ? TJoinTable :
        TJoinTable,
        TJoinParams extends readonly QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TJoinResult], AccumulateComparisonParams<[], TCbResult>>,
        TJoinParamsResult extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TJoinParams["length"] extends 0 ? undefined : TJoinParams,
        TNewCategorizedParams extends CategorizedParamsType<TDbType> = OverrideJoinParams<TDbType, TCategorizedParams, TJoinResult, TJoinParamsResult>,
        const TJoinAccumulated extends JoinSpecsType<TDbType> = OverrideDuplicateJoinSpec<TDbType, TJoinSpecs, { joinType: TJoinType, table: TJoinResult }>

    >(
        type: TJoinType,
        tableSelectionCb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TJoinTable,
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinAccumulated, TCTESpecs>>,
            ops: DbOperators<TDbType>
        ) => TCbResult
    ): QueryBuilder<TDbType, TFrom, TJoinAccumulated, TCTESpecs, TResult, TNewCategorizedParams, TAs> {

        let cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
        if (this.cteSpecs !== undefined) {
            cteSpecs = mapCTESpecsToSelection(this.cteSpecs) as MapCtesToSelectionType<TDbType, TCTESpecs>;
        }
        const table = tableSelectionCb(cteSpecs);

        let columnsSelectionList = this.columnsSelectionList;

        let joinTable: TJoinResult;
        if (table instanceof Table) {
            const queryColumns = table.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(table.dbType, col);
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            let res = new QueryTable(table.dbType, table, queryColumns);
            let ownerName = res.name;
            let columnsSelection = columnsSelectionFactory<TDbType>(res, res.columnsList.map(c => c.setOwnerName(ownerName)));

            joinTable = res as TJoinResult;
            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }
        } else if (table instanceof QueryTable) {
            joinTable = table as QueryTable<TDbType, any, any, any, any, any> as TJoinResult;
            let ownerName = joinTable.name;
            let columnsSelection = columnsSelectionFactory<TDbType>(table, table.columnsList.map((c: QueryColumn<TDbType, any, any, any, any, any, any>) => c.setOwnerName(ownerName)))

            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }
        } else if (table instanceof QueryBuilder) {
            let tmpTable: SubQueryObject<TDbType, any, any, any> = new SubQueryObject(this.dbType, table);

            let ownerName = tmpTable.name;
            let columnsSelection = columnsSelectionFactory<TDbType>(tmpTable, tmpTable.subQueryEntries);

            columnsSelectionList = {
                ...columnsSelectionList,
                [ownerName]: columnsSelection
            }

            joinTable = tmpTable as TJoinResult;
        } else if (table instanceof CTEObject) {
            let ownerName = table.name;
            let columnsSelection = columnsSelectionFactory<TDbType>(table, table.cteObjectEntries);

            joinTable = table as CTEObject<TDbType, any, any, any, any> as TJoinResult;

            columnsSelectionList = {
                ...columnsSelection,
                [ownerName]: columnsSelection
            }
        } else {
            throw Error('Invalid table type.');
        }

        const newJoinSpec = { joinType: type, table: joinTable };
        let mergedJoinSpecs: JoinSpecsType<TDbType> = [];
        if (this.joinSpecs === undefined) {
            mergedJoinSpecs = [newJoinSpec];
        } else {
            const existingIndex = this.joinSpecs.findIndex(spec => spec.table.name === joinTable.name);
            mergedJoinSpecs = existingIndex >= 0 ? [...this.joinSpecs.toSpliced(existingIndex, 1), newJoinSpec] : [...this.joinSpecs, newJoinSpec];
        }

        return new QueryBuilder<TDbType, TFrom, TJoinAccumulated, TCTESpecs, TResult, TNewCategorizedParams, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                joinSpecs: mergedJoinSpecs as TJoinAccumulated,
                resultSelection: this.resultSelection,
                columnsSelectionList: columnsSelectionList,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            })
    }

    where<TCbResult extends ComparisonType<TDbType>>
        (
            cb: (
                tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
                ops: DbOperators<TDbType>
            ) => TCbResult
        ):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideWhereParams<TDbType, TCategorizedParams, AccumulateComparisonParams<undefined, TCbResult>>,
            TAs
        > {
        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideWhereParams<TDbType, TCategorizedParams, AccumulateComparisonParams<undefined, TCbResult>>,
            TAs
        >(
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
        ops: DbFunctions<TDbType>
    ) => TCbResult):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideGroupByParams<TDbType, TCategorizedParams, AccumulateColumnParams<undefined, TCbResult>>,
            TAs
        > {

        if (isNullOrUndefined(this.columnsSelectionList)) {
            throw Error("No query object provided.");
        }

        const functions = this.dbType === dbTypes.postgresql ? pgFunctions : this.dbType === dbTypes.mysql ? mysqlFunctions : undefined;
        if (isNullOrUndefined(functions)) {
            throw Error('Invalid db type.');
        }
        const res = cb(this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>, functions as DbFunctions<TDbType>);

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideGroupByParams<TDbType, TCategorizedParams, AccumulateColumnParams<undefined, TCbResult>>,
            TAs
        >(
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
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbOperators<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TResult,
        OverrideHavingParams<TDbType, TCategorizedParams, AccumulateComparisonParams<undefined, TCbResult>>,
        TAs
    > {
        const functions = this.dbType === dbTypes.postgresql ? pgDbOperators : this.dbType === dbTypes.mysql ? mysqlDbOperators : undefined;
        if (isNullOrUndefined(functions)) {
            throw Error('Invalid db type.');
        }

        const res = cb(this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>, functions as DbOperators<TDbType>)

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideHavingParams<TDbType, TCategorizedParams, AccumulateComparisonParams<undefined, TCbResult>>,
            TAs
        >(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                cteSpecs: this.cteSpecs,
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
    >(cb: (tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>) => TCbResult):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideOrderByParams<TDbType, TCategorizedParams, AccumulateOrderByParams<TDbType, undefined, TCbResult>>,
            TAs
        > {
        const res = cb(this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>);

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideOrderByParams<TDbType, TCategorizedParams, AccumulateOrderByParams<TDbType, undefined, TCbResult>>,
            TAs
        >(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                cteSpecs: this.cteSpecs,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: res
            });
    }

    from<
        const  TSelected extends readonly (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string, any> |
            CTEObject<TDbType, any, any, any, any>
        )[],
        TFromRes extends FromType<TDbType> = ConvertElementsToSubQueryCompliant<TDbType, TSelected>,
        AccumulatedParams extends readonly QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, TFromRes>,
        AccumulatedParamsResult extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = AccumulatedParams["length"] extends 0 ? undefined : AccumulatedParams

    >(
        cteSelectionCb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TSelected
    ):
        QueryBuilder<
            TDbType,
            TFromRes,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideFromParams<TDbType, TCategorizedParams, AccumulatedParamsResult>,
            TAs
        > {


        let cteSpecs: MapCtesToSelectionType<TDbType, TCTESpecs>;
        if (this.cteSpecs === undefined) {
            cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
        } else {
            cteSpecs = mapCTESpecsToSelection(this.cteSpecs);
        }
        const res = cteSelectionCb(cteSpecs);


        const fromResult = res.map(item => {
            if (item instanceof Table) {
                const queryColumns = item.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                    return new QueryColumn(item.dbType, col);
                }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

                return new QueryTable(item.dbType, item, queryColumns);
            } if (item instanceof QueryBuilder) {
                return new SubQueryObject(item.dbType, item);
            }
            else {
                return item;
            }
        }) as FromType<TDbType> as TFromRes;


        return new QueryBuilder<
            TDbType,
            TFromRes,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            OverrideFromParams<TDbType, TCategorizedParams, AccumulatedParamsResult>,
            TAs
        >(
            this.dbType,
            fromResult,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                cteSpecs: this.cteSpecs,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            })
    }

    withAs<
        TCTEName extends string,
        TQbResult extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
        TCTEObject extends CTEObject<TDbType, any, any, any, any> = CTEObject<TDbType, TCTEName, typeof cteTypes.NON_RECURSIVE, TQbResult>,
        TFinalCTESpec extends CTESpecsType<TDbType> = OverrideDuplicateCTESpec<TDbType, TCTESpecs, TCTEObject>,
        TParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, any, any, infer TParams> ? TParams : never,
        TCategorizedParamsResult extends CategorizedParamsType<TDbType> = OverrideCTEParams<TDbType, TCategorizedParams, TCTEObject, TParams>
    >(
        as: TCTEName,
        cteSelectionCb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TFinalCTESpec,
            TResult,
            TCategorizedParamsResult,
            TAs
        > {

        let cteSpecs: MapCtesToSelectionType<TDbType, TCTESpecs>;
        if (this.cteSpecs === undefined) {
            cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
        } else {
            cteSpecs = mapCTESpecsToSelection(this.cteSpecs);
        }
        const res = cteSelectionCb(cteSpecs);

        let newCteSpecs = [...(this.cteSpecs || [] as CTESpecsType<TDbType>)];
        const newSpec = new CTEObject(this.dbType, res, as, cteTypes.NON_RECURSIVE);

        let foundIndex = newCteSpecs.findIndex(spec => spec.name === newSpec.name) || -1;
        if (foundIndex >= 0) {
            newCteSpecs.toSpliced(foundIndex, 1);
        }
        newCteSpecs.push(newSpec);


        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TFinalCTESpec,
            TResult,
            TCategorizedParamsResult,
            TAs
        >(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                cteSpecs: newCteSpecs as CTESpecsType<TDbType> as TFinalCTESpec,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs
            })
    }

    exec(
        ...args: TParamsAccumulated extends undefined
            ? []
            : [params: QueryParamsToObject<TParamsAccumulated>]
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
        QueryBuilder<TDbType, any, any, any, any, any, string, any>
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

    return new QueryBuilder<
        TDbType,
        TFromRes,
        undefined,
        undefined,
        undefined,
        OverrideFromParams<TDbType, DefaultCategorizedParamsType, AccumulatedParamsResult>
    >(dbType, fromResult);
}

function withAs<
    TAs extends string,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TDbType extends DbType = TQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never
>(as: TAs, qb: TQb) {
    type TCTEObject = MapToCTEObject<TDbType, TAs, typeof cteTypes.NON_RECURSIVE, TQb>;
    type TParams = TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, infer TParams> ? TParams : never;

    const cteObject = new CTEObject(qb.dbType, qb, as, cteTypes.NON_RECURSIVE) as TCTEObject;
    const cteSpecs = [cteObject] as const;

    return new QueryBuilder<
        TDbType,
        undefined,
        undefined,
        typeof cteSpecs,
        undefined,
        OverrideCTEParams<TDbType, DefaultCategorizedParamsType, TCTEObject, TParams>
    >(qb.dbType, undefined, { cteSpecs });
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
    CTESpecsType,
    CategorizedParamsType,
    DefaultCategorizedParamsType
}
