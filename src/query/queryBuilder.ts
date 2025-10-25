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
import { mapCTESpecsToSelection } from "./utility.js";
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

const unionTypes = {
    UNION: { name: 'UNION' },
    UNION_ALL: { name: 'UNION_ALL' },
} as const;
type UNION_TYPE = typeof unionTypes[keyof typeof unionTypes]["name"];

const combineTypes = {
    ...unionTypes,
    INTERSECT: { name: 'INTERSECT' },
    INTERSECT_ALL: { name: 'INTERSECT_ALL' },
    EXCEPT: { name: 'EXCEPT' },
    EXCEPT_ALL: { name: 'EXCEPT_ALL' }
} as const;
type COMBINE_TYPE = typeof combineTypes[keyof typeof combineTypes]["name"];
type CombineSpecsType<TDbType extends DbType> = readonly { type: COMBINE_TYPE, qb: QueryBuilder<TDbType, any, any, any, any, any, any> }[];

class QueryBuilder<
    TDbType extends DbType,
    TFrom extends FromType<TDbType> | undefined,
    TJoinSpecs extends JoinSpecsType<TDbType> | undefined,
    TCTESpecs extends CTESpecsType<TDbType> | undefined,
    TResult extends ResultShape<TDbType> | undefined = undefined,
    TParams extends readonly QueryParam<TDbType, string, DbValueTypes | null, any, any>[] | undefined = undefined,
    TAs extends string | undefined = undefined,
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
    combineSpecs?: CombineSpecsType<TDbType>;
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
            cteSpecs?: TCTESpecs,
            combineSpecs?: CombineSpecsType<TDbType>
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
        this.combineSpecs = data?.combineSpecs;

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
                groupedColumns: this.groupedColumns,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
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
                groupedColumns: this.groupedColumns,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
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
        AccumulateColumnParams<TParams, TFinalResult>,
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
            AccumulateColumnParams<TParams, TFinalResult>,
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
                orderBySpecs: this.orderBySpecs,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
            });
    };


    join<
        TJoinType extends JoinType,
        TJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, string> | CTEObject<TDbType, any, any, any, any>,
        TCbResult extends ComparisonType<TDbType>,
        TJoinResult extends JoinSpecsTableType<TDbType> =
        TJoinTable extends Table<TDbType, infer TJoinCols, infer TJoinTableName> ?
        QueryTable<
            TDbType,
            TJoinCols,
            TJoinTableName,
            Table<TDbType, TJoinCols, TJoinTableName>,
            MapToQueryColumns<TDbType, TDbType, TJoinCols>
        > :
        TJoinTable extends QueryBuilder<TDbType, any, any, any, any, any, string> ? MapToSubQueryObject<TDbType, TJoinTable> :
        TJoinTable extends CTEObject<TDbType, any, any, any, any> ? TJoinTable :
        TJoinTable,
        TJoinParams extends readonly QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TJoinResult], AccumulateComparisonParams<TParams, TCbResult>>,
        TJoinParamsResult extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TJoinParams["length"] extends 0 ? undefined : TJoinParams,
        const TJoinAccumulated extends JoinSpecsType<TDbType> = readonly [...(TJoinSpecs extends undefined ? [] : TJoinSpecs), { joinType: TJoinType, table: TJoinResult }]

    >(
        type: TJoinType,
        tableSelection: TJoinTable | ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TJoinTable),
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinAccumulated, TCTESpecs>>,
            ops: DbOperators<TDbType>
        ) => TCbResult
    ): QueryBuilder<TDbType, TFrom, TJoinAccumulated, TCTESpecs, TResult, TJoinParamsResult, TAs> {

        let table;

        if (typeof tableSelection === "function") {
            let cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
            if (this.cteSpecs !== undefined) {
                cteSpecs = mapCTESpecsToSelection(this.cteSpecs) as MapCtesToSelectionType<TDbType, TCTESpecs>;
            }
            table = tableSelection(cteSpecs);
        } else {
            table = tableSelection;
        }

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

        return new QueryBuilder<TDbType, TFrom, TJoinAccumulated, TCTESpecs, TResult, TJoinParamsResult, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                joinSpecs: mergedJoinSpecs as TJoinAccumulated,
                resultSelection: this.resultSelection,
                columnsSelectionList: columnsSelectionList,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
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
            AccumulateComparisonParams<TParams, TCbResult>,
            TAs
        > {
        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateComparisonParams<TParams, TCbResult>,
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
                orderBySpecs: this.orderBySpecs,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
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
            AccumulateColumnParams<TParams, TCbResult>,
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
            AccumulateColumnParams<TParams, TCbResult>,
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
                orderBySpecs: this.orderBySpecs,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
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
        AccumulateComparisonParams<TParams, TCbResult>,
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
            AccumulateComparisonParams<TParams, TCbResult>,
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
                resultSelection: this.resultSelection,
                havingSpec: res,
                orderBySpecs: this.orderBySpecs,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
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
            AccumulateOrderByParams<TDbType, TParams, TCbResult>,
            TAs
        > {
        const res = cb(this.columnsSelectionList as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>);

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateOrderByParams<TDbType, TParams, TCbResult>,
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
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: res,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
            });
    }

    from<
        const TSelected extends readonly (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string> |
            CTEObject<TDbType, any, any, any, any>
        )[],
        TFromRes extends FromType<TDbType> = ConvertElementsToSubQueryCompliant<TDbType, TSelected>,
        AccumulatedParams extends readonly QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, TFromRes, TParams>,
        AccumulatedParamsResult extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = AccumulatedParams["length"] extends 0 ? undefined : AccumulatedParams

    >(
        ...tables: TSelected
    ):
        QueryBuilder<
            TDbType,
            TFromRes,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulatedParamsResult,
            TAs
        >
    from<
        const TSelected extends readonly (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string> |
            CTEObject<TDbType, any, any, any, any>
        )[],
        TFromRes extends FromType<TDbType> = ConvertElementsToSubQueryCompliant<TDbType, TSelected>,
        AccumulatedParams extends readonly QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, TFromRes, TParams>,
        AccumulatedParamsResult extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = AccumulatedParams["length"] extends 0 ? undefined : AccumulatedParams

    >(
        cteSelection: ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TSelected)
    ):
        QueryBuilder<
            TDbType,
            TFromRes,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulatedParamsResult,
            TAs
        >
    from(
        ...args: any
    ) {

        let res: (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string> |
            CTEObject<TDbType, any, any, any, any>
        )[];

        if (typeof args[0] === "function") {
            let cteSpecs: MapCtesToSelectionType<TDbType, TCTESpecs>;
            if (this.cteSpecs === undefined) {
                cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
            } else {
                cteSpecs = mapCTESpecsToSelection(this.cteSpecs);
            }
            res = args[0](cteSpecs);
        } else {
            res = args;
        }

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
        });


        return new QueryBuilder<TDbType, any, any, any, any, any, any>(
            this.dbType,
            fromResult,
            {
                asName: this.asName,
                ownerName: this.ownerName,
                columnsSelectionList: this.columnsSelectionList,
                groupedColumns: this.groupedColumns,
                joinSpecs: this.joinSpecs,
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                cteSpecs: this.cteSpecs,
                combineSpecs: this.combineSpecs
            })
    }

    withAs<
        TCTEName extends string,
        TQbResult extends QueryBuilder<TDbType, any, any, any, any, any, any>,
        TCTEObject extends CTEObject<TDbType, any, any, any, any> = CTEObject<TDbType, TCTEName, typeof cteTypes.NON_RECURSIVE, TQbResult>,
        TFinalCTESpec extends CTESpecsType<TDbType> = OverrideDuplicateCTESpec<TDbType, TCTESpecs, TCTEObject>,
        TCTEParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCTEParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCTEParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
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
            TFinalParamsAccumulated,
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
            TFinalParamsAccumulated,
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
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                cteSpecs: newCteSpecs as CTESpecsType<TDbType> as TFinalCTESpec,
                combineSpecs: this.combineSpecs
            });
    }

    #combine <
        TCombineType extends COMBINE_TYPE,
        TQbResult extends QueryBuilder<TDbType, any, any, any, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated

    >(
        combineType: TCombineType,
        cteSelectionCb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TResult,
        TFinalParamsAccumulated,
        TAs
    > {
        let cteSpecs: MapCtesToSelectionType<TDbType, TCTESpecs>;
        if (this.cteSpecs === undefined) {
            cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
        } else {
            cteSpecs = mapCTESpecsToSelection(this.cteSpecs);
        }
        const res = cteSelectionCb(cteSpecs);

        let newCombine = { type: combineType, qb: res };

        let newCombineSpecs: CombineSpecsType<TDbType> = [newCombine];
        if (this.combineSpecs !== undefined) {
            newCombineSpecs = [...this.combineSpecs, ...newCombineSpecs];
        }

        return new QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            TFinalParamsAccumulated,
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
                resultSelection: this.resultSelection,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                cteSpecs: this.cteSpecs,
                combineSpecs: newCombineSpecs
            });
    }


    union<
        TQbResult extends QueryBuilder<TDbType, any, any, any, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        cb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TResult,
        TFinalParamsAccumulated,
        TAs
    > {
        return this.#combine(combineTypes.UNION.name, cb);
    }


    unionAll<
        TQbResult extends QueryBuilder<TDbType, any, any, any, any, any, any>,
        TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQbResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCombineParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCombineParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        cb: (ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TResult,
        TFinalParamsAccumulated,
        TAs
    > {
        return this.#combine(combineTypes.UNION_ALL.name, cb);
    }


    exec(
        ...args: TParams extends undefined
            ? [] | [{ [key: string]: any }]
            : [{ [key: string]: any } & QueryParamsToObject<TParams>]
    ):
        TResult extends ResultShape<TDbType> ?
        ColumnsToResultMap<TDbType, TResult> :
        never {


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

    return new QueryBuilder<
        TDbType,
        TFromRes,
        undefined,
        undefined,
        undefined,
        AccumulatedParamsResult
    >(dbType, fromResult);
}

export default QueryBuilder;

export {
    from,
    cteTypes,
    unionTypes,
    combineTypes
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
    COMBINE_TYPE,
    UNION_TYPE
}
