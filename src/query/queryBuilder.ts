import { DbType, dbTypes } from "../db.js";
import QueryColumn from "./queryColumn.js";
import Table, { type MapToQueryColumns } from "../table/table.js";
import { isNullOrUndefined } from "../utility/guards.js";
import type ColumnComparisonOperation from "./comparisons/_comparisonOperations.js";
import type ColumnLogicalOperation from "./logicalOperations.js";
import type { MapCtesToSelectionType, TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type { ColumnsToResultMap, QueryParamsToObject, SelectToAllColumnsMapRecursively, SelectToResultMapRecursively } from "./_types/result.js";
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
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type IComparable, type QueryBuilderContext } from "./_interfaces/IComparable.js";
import SubQueryObject from "./subQueryObject.js";
import eq from "./comparisons/eq.js";
import sqlIn from "./comparisons/in.js";
import between from "./comparisons/between.js";
import CTEObject from "./cteObject.js";
import { mapCTESpecsToSelection } from "./utility.js";


type ResultShapeItem<TDbType extends DbType> = IComparable<TDbType, any, any, any, any, any>;
type ResultShape<TDbType extends DbType> = readonly ResultShapeItem<TDbType>[];

type SelectSpecsType<TDbType extends DbType> = "*" | readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any>)[]

type FromItemType<TDbType extends DbType> = QueryTable<TDbType, any, any, any, any, any> | SubQueryObject<TDbType, any, any, string> | CTEObject<TDbType, any, any, any, any, any>;
type FromType<TDbType extends DbType> = readonly FromItemType<TDbType>[];

const orderTypes = {
    asc: 'ASC',
    desc: 'DESC'
} as const;
type OrderType = typeof orderTypes[keyof typeof orderTypes];
type OrderBySpecsType<TDbType extends DbType> = readonly (IComparable<TDbType, any, any, any, any, any> | [IComparable<TDbType, any, any, any, any, any>, OrderType])[];

const joinTypes = {
    inner: 'INNER',
    left: 'LEFT',
    right: 'RIGHT',
    full: 'FULL'
} as const;
type JoinType = typeof joinTypes[keyof typeof joinTypes];
type JoinSpecsTableType<TDbType extends DbType> = FromItemType<TDbType>;
type JoinSpecsItemType<TDbType extends DbType> = { joinType: JoinType, table: JoinSpecsTableType<TDbType>, comparison: ComparisonType<TDbType> }
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
type CTESpecsType<TDbType extends DbType> = readonly CTEObject<TDbType, any, any, any, any, any>[];

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

const queryTypes = {
    SELECT: 'SELECT',
    UPDATE: 'UPDATE',
    INSERT: 'INSERT'
}
type QUERY_TYPE = typeof queryTypes[keyof typeof queryTypes];


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

    cteSpecs?: TCTESpecs;
    fromSpecs: TFrom;
    joinSpecs?: TJoinSpecs;
    whereComparison?: ComparisonType<TDbType>;
    selectResult?: TResult;
    selectSpecs?: SelectSpecsType<TDbType>;
    groupedColumns?: GroupBySpecs<TDbType>;
    havingSpec?: ComparisonType<TDbType>;
    orderBySpecs?: OrderBySpecsType<TDbType>;
    combineSpecs?: CombineSpecsType<TDbType>;

    queryType?: QUERY_TYPE;

    constructor(
        dbType: TDbType,
        fromSpecs: TFrom,
        data?: {
            asName?: TAs,
            queryType?: QUERY_TYPE,
            cteSpecs?: TCTESpecs,
            joinSpecs?: TJoinSpecs,
            whereComparison?: ComparisonType<TDbType>,
            selectResult?: TResult,
            selectSpecs?: SelectSpecsType<TDbType>,
            groupedColumns?: GroupBySpecs<TDbType>,
            havingSpec?: ComparisonType<TDbType>,
            orderBySpecs?: OrderBySpecsType<TDbType>,
            combineSpecs?: CombineSpecsType<TDbType>
        }
    ) {
        this.dbType = dbType;

        this.cteSpecs = data?.cteSpecs;
        this.fromSpecs = fromSpecs;
        this.joinSpecs = data?.joinSpecs;
        this.whereComparison = data?.whereComparison;
        this.selectResult = data?.selectResult;
        this.selectSpecs = data?.selectSpecs;
        this.groupedColumns = data?.groupedColumns;
        this.havingSpec = data?.havingSpec;
        this.orderBySpecs = data?.orderBySpecs;
        this.combineSpecs = data?.combineSpecs;

        this.asName = data?.asName;

        this.queryType = data?.queryType;

        this.defaultFieldKey = data?.selectResult !== undefined && data.selectResult.length > 0 ? data.selectResult[0].defaultFieldKey : "";
    }

    as<TAs extends string>(asName: TAs): QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs> {
        return new QueryBuilder<TDbType, TFrom, TJoinSpecs, TCTESpecs, TResult, TParams, TAs>(
            this.dbType,
            this.fromSpecs,
            {
                asName,
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            });
    }

    #getDbFunctions(): DbFunctions<TDbType> {
        return (this.dbType === dbTypes.postgresql ? pgFunctions : this.dbType === dbTypes.mysql ? mysqlFunctions : undefined) as DbFunctions<TDbType>;
    }

    #getDbOperators() {
        return (this.dbType === dbTypes.postgresql ? pgDbOperators : this.dbType === dbTypes.mysql ? mysqlDbOperators : undefined) as DbOperators<TDbType>;
    }

    #getColumnsSelection() {
        let columnsSelection: ColumnsSelectionListType<TDbType> = {};
        if (this.fromSpecs !== undefined) {
            for (const spec of this.fromSpecs) {
                if (spec instanceof QueryTable) {
                    let ownerName = spec.name;
                    let selection = columnsSelectionFactory<TDbType>(spec, spec.columnsList)
                    columnsSelection[ownerName] = selection;
                } else if (spec instanceof SubQueryObject) {
                    let ownerName = spec.name;
                    let selection = columnsSelectionFactory<TDbType>(spec, spec.subQueryEntries);
                    columnsSelection[ownerName] = selection;
                } else if (spec instanceof CTEObject) {
                    let ownerName = spec.name;
                    let selection = columnsSelectionFactory(spec, spec.cteObjectEntries);
                    columnsSelection[ownerName] = selection;
                } else {
                    throw Error('Invalid from element type.')
                }
            }
        }

        if (this.joinSpecs !== undefined) {
            for (let spec of this.joinSpecs) {
                const { table } = spec;

                if (table instanceof QueryTable) {
                    let ownerName = table.name;
                    let selection = columnsSelectionFactory<TDbType>(table, table.columnsList)
                    columnsSelection[ownerName] = selection;
                } else if (table instanceof SubQueryObject) {
                    let ownerName = table.name;
                    let selection = columnsSelectionFactory<TDbType>(table, table.subQueryEntries);
                    columnsSelection[ownerName] = selection;
                } else if (table instanceof CTEObject) {
                    let ownerName = table.name;
                    let selection = columnsSelectionFactory(table, table.cteObjectEntries);
                    columnsSelection[ownerName] = selection;
                } else {
                    throw Error('Invalid from element type.')
                }
            }
        }

        return columnsSelection;
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }
        
        let result = '';

        if (this.queryType === queryTypes.SELECT) {

            if (this.selectSpecs === undefined || this.selectResult === undefined) {
                throw Error('Result not specified.');
            }

            if (this.fromSpecs === undefined) {
                throw Error('From clause not specified.');
            }

            let cteQueries: { name: string, query: { query: string, params: string[] } }[] = [];
            if (this.cteSpecs !== undefined) {
                cteQueries = this.cteSpecs.map(spec => ({ name: spec.name, query: spec.buildSQL() }));
            }
            let cteClause = '';
            if (cteQueries.length > 0) {
                cteClause = `WITH ${cteQueries.map(qry => `${qry.name} AS ${qry.query.query}`).join(', ')}`
            }

            let selectList;
            if (this.selectSpecs === "*") {
                selectList = this.selectSpecs;
            } else {
                selectList = this.selectSpecs
                    .map(sl => {
                        if (ColumnsSelectionQueryTableObjectSymbol in sl) {
                            return sl[ColumnsSelectionQueryTableObjectSymbol].name;
                        }

                        return sl.buildSQL().query;
                    }).join(' ,');
            }
            let fromClause = this.fromSpecs.map(frm => {
                if (frm instanceof QueryTable) {
                    return `${frm.name}${frm.asName === undefined ? '' : `AS ${frm.asName}`}`;
                }
                else if (frm instanceof CTEObject) {
                    return frm.name;
                } else {
                    return frm.buildSQL().query;
                }
            }).join(' ,');

            result = `${cteClause ? `${cteClause} ` : ''}${selectList} ${fromClause}`
        }

        return { query: result, params: [...(context?.params || [])] };
    }

    select(): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs>,
        TParams,
        TAs
    >
    select<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbFunctions<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
        TCbResult["length"] extends 0 ? TParams : AccumulateColumnParams<TParams, TFinalResult>,
        TAs
    >
    select<
        const TCbResult extends readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any>)[],
        TFinalResult extends ResultShape<TDbType> = SelectToResultMapRecursively<TDbType, TCbResult>
    >(
        cb?: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbFunctions<TDbType>
        ) => TCbResult
    ): QueryBuilder<
        TDbType,
        TFrom,
        TJoinSpecs,
        TCTESpecs,
        TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
        TCbResult["length"] extends 0 ? TParams : AccumulateColumnParams<TParams, TFinalResult>,
        TAs
    > {

        let selectRes: readonly (ColumnsSelection<TDbType, any, any> | IComparable<TDbType, any, any, any, any, any>)[] = [];
        if (!isNullOrUndefined(cb)) {
            const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>;
            const functions = this.#getDbFunctions();
            selectRes = cb(columnsSelection, functions);
        }

        if (isNullOrUndefined(cb) || selectRes.length === 0) {

            let finalSelectRes: ResultShapeItem<TDbType>[] = [];
            if (this.fromSpecs !== undefined) {
                for (const frm of this.fromSpecs) {
                    if (frm instanceof QueryTable) {
                        finalSelectRes.push(...frm.columnsList);
                    } else if (frm instanceof SubQueryObject) {
                        finalSelectRes.push(...frm.subQueryEntries);
                    } else if (frm instanceof CTEObject) {
                        finalSelectRes.push(...frm.cteObjectEntries);
                    } else {
                        throw Error('Invalid from element type.')
                    }
                }
            }

            if (this.joinSpecs !== undefined) {
                for (const join of this.joinSpecs) {
                    const { table } = join;
                    if (table instanceof QueryTable) {
                        finalSelectRes.push(...table.columnsList);
                    } else if (table instanceof SubQueryObject) {
                        finalSelectRes.push(...table.subQueryEntries);
                    } else if (table instanceof CTEObject) {
                        finalSelectRes.push(...table.cteObjectEntries);
                    } else {
                        throw Error('Invalid from element type.')
                    }
                }
            }

            return new QueryBuilder<
                TDbType,
                TFrom,
                TJoinSpecs,
                TCTESpecs,
                TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
                TCbResult["length"] extends 0 ? TParams : AccumulateColumnParams<TParams, TFinalResult>,
                TAs
            >(
                this.dbType,
                this.fromSpecs,
                {
                    asName: this.asName,
                    queryType: queryTypes.SELECT,
                    cteSpecs: this.cteSpecs,
                    joinSpecs: this.joinSpecs,
                    whereComparison: this.whereComparison,
                    selectResult: finalSelectRes as ResultShape<TDbType> as TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
                    selectSpecs: "*",
                    groupedColumns: this.groupedColumns,
                    havingSpec: this.havingSpec,
                    orderBySpecs: this.orderBySpecs,
                    combineSpecs: this.combineSpecs
                });

        } else {
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
                TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
                TCbResult["length"] extends 0 ? TParams : AccumulateColumnParams<TParams, TFinalResult>,
                TAs
            >(
                this.dbType,
                this.fromSpecs,
                {
                    asName: this.asName,
                    queryType: queryTypes.SELECT,
                    cteSpecs: this.cteSpecs,
                    joinSpecs: this.joinSpecs,
                    whereComparison: this.whereComparison,
                    selectResult: finalSelectRes as ResultShape<TDbType> as TCbResult["length"] extends 0 ? SelectToAllColumnsMapRecursively<TDbType, TFrom, TJoinSpecs> : TFinalResult,
                    selectSpecs: selectRes,
                    groupedColumns: this.groupedColumns,
                    havingSpec: this.havingSpec,
                    orderBySpecs: this.orderBySpecs,
                    combineSpecs: this.combineSpecs
                });

        }
    };


    join<
        TJoinType extends JoinType,
        TJoinTable extends Table<TDbType, any, any> | QueryTable<TDbType, any, any, any, any, any> | QueryBuilder<TDbType, any, any, any, any, any, string> | CTEObject<TDbType, any, any, any, any, any>,
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
        TJoinTable extends CTEObject<TDbType, any, any, any, any, any> ? TJoinTable :
        TJoinTable,
        TJoinParams extends readonly QueryParam<TDbType, any, any, any, any>[] = AccumulateSubQueryParams<TDbType, [TJoinResult], AccumulateComparisonParams<TParams, TCbResult>>,
        TJoinParamsResult extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TJoinParams["length"] extends 0 ? undefined : TJoinParams,
        const TJoinAccumulated extends JoinSpecsType<TDbType> = readonly [...(TJoinSpecs extends undefined ? [] : TJoinSpecs), { joinType: TJoinType, table: TJoinResult, comparison: ComparisonType<TDbType> }]
    >(
        type: TJoinType,
        tableSelection: TJoinTable | ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TJoinTable),
        comparisonCb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinAccumulated>>,
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

        let columnsSelection = this.#getColumnsSelection();

        let joinTable: TJoinResult;
        if (table instanceof Table) {
            const queryColumns = table.columnsList.map((col: Column<TDbType, any, any, any, any, any, any>) => {
                return new QueryColumn(table.dbType, col, { tableName: res.name });
            }) as QueryColumn<TDbType, any, any, any, any, any, any>[];

            let res = new QueryTable(table.dbType, table, queryColumns);
            let ownerName = res.name;
            let selection = columnsSelectionFactory<TDbType>(res, res.columnsList);

            joinTable = res as TJoinResult;
            columnsSelection = {
                ...columnsSelection,
                [ownerName]: selection
            }
        } else if (table instanceof QueryTable) {
            joinTable = table as QueryTable<TDbType, any, any, any, any, any> as TJoinResult;
            let ownerName = joinTable.name;
            let selection = columnsSelectionFactory<TDbType>(table, table.columnsList)

            columnsSelection = {
                ...columnsSelection,
                [ownerName]: selection
            }
        } else if (table instanceof QueryBuilder) {
            let tmpTable: SubQueryObject<TDbType, any, any, any> = new SubQueryObject(this.dbType, table);

            let ownerName = tmpTable.name;
            let selection = columnsSelectionFactory<TDbType>(tmpTable, tmpTable.subQueryEntries);

            columnsSelection = {
                ...columnsSelection,
                [ownerName]: selection
            }

            joinTable = tmpTable as TJoinResult;
        } else if (table instanceof CTEObject) {
            let ownerName = table.name;
            let selection = columnsSelectionFactory<TDbType>(table, table.cteObjectEntries);

            joinTable = table as CTEObject<TDbType, any, any, any, any, any> as TJoinResult;

            columnsSelection = {
                ...columnsSelection,
                [ownerName]: selection
            }
        } else {
            throw Error('Invalid table type.');
        }

        const dbOperators = this.#getDbOperators();

        const comparison = comparisonCb(
            columnsSelection as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinAccumulated>>,
            dbOperators
        );

        const newJoinSpec = { joinType: type, table: joinTable, comparison };
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
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: mergedJoinSpecs as TJoinAccumulated,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            })
    }

    where<
        TCbResult extends ComparisonType<TDbType>
    >(
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
        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>;
        const ops = this.#getDbOperators();

        const comparison = cb(columnsSelection, ops as DbOperators<TDbType>)

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
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: comparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
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

        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>;
        const functions = this.#getDbFunctions();
        const res = cb(columnsSelection, functions);

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
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: res,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
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
        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>;
        const operators = this.#getDbOperators();
        const res = cb(columnsSelection, operators)

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
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: res,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            });
    }

    orderBy<
        const TCbResult extends OrderBySpecsType<TDbType>
    >(
        cb: (
            tables: TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs>>,
            ops: DbFunctions<TDbType>
        ) => TCbResult
    ):
        QueryBuilder<
            TDbType,
            TFrom,
            TJoinSpecs,
            TCTESpecs,
            TResult,
            AccumulateOrderByParams<TDbType, TParams, TCbResult>,
            TAs
        > {
        const columnsSelection = this.#getColumnsSelection() as TableToColumnsMap<TDbType, TablesToObject<TDbType, TFrom, TJoinSpecs, TCTESpecs>>;
        const functions = this.#getDbFunctions();
        const res = cb(columnsSelection, functions);

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
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: res,
                combineSpecs: this.combineSpecs
            });
    }

    from<
        const TSelected extends readonly (
            Table<TDbType, any, any> |
            QueryTable<TDbType, any, any, any, any, any> |
            QueryBuilder<TDbType, any, any, any, any, any, string> |
            CTEObject<TDbType, any, any, any, any, any>
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
            CTEObject<TDbType, any, any, any, any, any>
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
            CTEObject<TDbType, any, any, any, any, any>
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
                    return new QueryColumn(item.dbType, col, { tableName: item.name });
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
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                selectSpecs: this.selectSpecs,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
                combineSpecs: this.combineSpecs
            })
    }

    withAs<
        TCTEName extends string,
        TQb extends QueryBuilder<TDbType, any, any, any, any, any, any>,
        // TCTEObject extends CTEObject<TDbType, any, any, any, any, any> = MapToCTEObject<TDbType, TCTEName, typeof cteTypes.NON_RECURSIVE, TQb>,
        TCTEObject extends CTEObject<TDbType, any, any, any, any, any> = CTEObject<TDbType, TCTEName, typeof cteTypes.NON_RECURSIVE, TQb>,
        TFinalCTESpec extends CTESpecsType<TDbType> = readonly [...(TCTESpecs extends CTESpecsType<TDbType> ? TCTESpecs : []), TCTEObject],
        TCTEParams extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TQb extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never,
        TParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] =
        [
            ...(TParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TParams : []),
            ...(TCTEParams extends readonly QueryParam<TDbType, any, any, any, any>[] ? TCTEParams : [])
        ],
        TFinalParamsAccumulated extends readonly QueryParam<TDbType, any, any, any, any>[] | undefined = TParamsAccumulated["length"] extends 0 ? undefined : TParamsAccumulated
    >(
        as: TCTEName,
        pick: TQb | ((ctes: MapCtesToSelectionType<TDbType, TCTESpecs>) => TQb)
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

        let res;
        if (typeof pick === "function") {

            let cteSpecs: MapCtesToSelectionType<TDbType, TCTESpecs>;
            if (this.cteSpecs === undefined) {
                cteSpecs = {} as MapCtesToSelectionType<TDbType, TCTESpecs>;
            } else {
                cteSpecs = mapCTESpecsToSelection(this.cteSpecs);
            }
            res = pick(cteSpecs);
        } else {
            res = pick;
        }

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
                queryType: this.queryType,
                cteSpecs: newCteSpecs as CTESpecsType<TDbType> as TFinalCTESpec,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
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
                queryType: this.queryType,
                cteSpecs: this.cteSpecs,
                joinSpecs: this.joinSpecs,
                whereComparison: this.whereComparison,
                selectResult: this.selectResult,
                groupedColumns: this.groupedColumns,
                havingSpec: this.havingSpec,
                orderBySpecs: this.orderBySpecs,
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


        if (isNullOrUndefined(this?.selectResult)) {
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
                return new QueryColumn(item.dbType, col, { tableName: item.name });
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
    ResultShape,
    ResultShapeItem,
    JoinSpecsTableType,
    JoinSpecsItemType,
    JoinSpecsType,
    FromItemType,
    FromType,
    ComparisonType,
    GroupBySpecs,
    JoinType,
    OrderBySpecsType,
    OrderType,
    CTEType,
    CTESpecsType,
    COMBINE_TYPE,
    UNION_TYPE
}
