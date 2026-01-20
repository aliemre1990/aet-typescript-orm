import { dbTypes, type DbType, type PgDbType } from "../../../db.js";
import type { DbValueTypes } from "../../../table/column.js";
import type { RecordToTupleSafe } from "../../../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, queryBuilderContextFactory, type DetermineFinalValueType, type DetermineValueType, type IComparable, type QueryBuilderContext } from "../../_interfaces/IComparable.js";
import between from "../../comparisons/between.js";
import eq from "../../comparisons/eq.js";
import sqlIn from "../../comparisons/in.js";
import type { InferReturnTypeFromJSONBuildObjectParam } from "../../_types/args.js";
import type QueryParam from "../../param.js";
import notEq from "../../comparisons/notEq.js";
import gt from "../../comparisons/gt.js";
import gte from "../../comparisons/gte.js";
import lt from "../../comparisons/lt.js";
import lte from "../../comparisons/lte.js";
import type { PgColumnType } from "../../../table/columnTypes.js";

type InferParamsFromJsonBuildObjectArg<TDbType extends DbType, TObj extends JSONBuildObjectParam<TDbType>> =
    InferParamsFromObj<TDbType, TObj>["length"] extends 0 ? undefined :
    InferParamsFromObj<TDbType, TObj>;

type InferParamsFromObj<TDbType extends DbType, TObj extends JSONBuildObjectParam<TDbType>> =
    RecordToTupleSafe<TObj> extends readonly [infer FirstKey, ...infer RestKeys] ?
    RestKeys extends readonly any[] ?
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>, ...InferParamsFromObjArr<TDbType, RestKeys>] :
    [...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams)] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>] :
    [] :
    [];

type InferParamsFromObjArr<TDbType extends DbType, TRest extends readonly any[]> =
    TRest extends readonly [infer FirstKey, ...infer RestKeys] ?
    RestKeys extends readonly any[] ?
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>, ...InferParamsFromObjArr<TDbType, RestKeys>] :
    [...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams)] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>] :
    [] :
    [];

type JSONBuildObjectParam<TDbType extends DbType> = {
    [key: string]:
    IComparable<TDbType, any, any, any, any, any, any> |
    JSONBuildObjectParam<TDbType>
}

class JSONBuildObjectFunction<
    TDbType extends PgDbType,
    TObj extends JSONBuildObjectParam<TDbType>,
    TReturnType extends DbValueTypes | null = TDbType extends PgDbType ? InferReturnTypeFromJSONBuildObjectParam<TDbType, TObj> : never,
    TParams extends QueryParam<TDbType, string, any, any, any, any>[] | undefined = InferParamsFromJsonBuildObjectArg<TDbType, TObj>,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = 'json_build_object',
    TCastType extends PgColumnType | undefined = undefined
> implements IComparable<
    TDbType,
    TParams,
    DetermineValueType<TCastType, NonNullable<TReturnType>>,
    DetermineFinalValueType<TReturnType, DetermineValueType<TCastType, NonNullable<TReturnType>>>,
    TDefaultFieldKey,
    TAs,
    TCastType
> {
    [IComparableValueDummySymbol]?: DetermineValueType<TCastType, NonNullable<TReturnType>>;
    [IComparableFinalValueDummySymbol]?: DetermineFinalValueType<TReturnType, DetermineValueType<TCastType, NonNullable<TReturnType>>>;

    dbType: TDbType;
    obj: TObj;
    isJsonB: boolean;

    params?: TParams;
    asName?: TAs;
    castType?: TCastType;
    defaultFieldKey: TDefaultFieldKey;

    as<TAs extends string>(asName: TAs) {
        return new JSONBuildObjectFunction<TDbType, TObj, TReturnType, TParams, TAs, TDefaultFieldKey, TCastType>(this.dbType, this.obj, this.isJsonB, asName, this.castType);
    }
    cast<TCastType extends PgColumnType>(type: TCastType) {
        return new JSONBuildObjectFunction<TDbType, TObj, TReturnType, TParams, TAs, TDefaultFieldKey, TCastType>(this.dbType, this.obj, this.isJsonB, this.asName, type);
    }

    buildSQL(context?: QueryBuilderContext) {
        if (context === undefined) {
            context = queryBuilderContextFactory();
        }

        const objStr = buildJSONBuildObjectArgSQL(this.obj, context);
        const result = `JSON_BUILD_OBJECT(${objStr})${this.asName ? ` AS ${this.asName}` : ''}`;

        return { query: result, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        obj: TObj,
        isJsonB: boolean,
        asName?: TAs,
        castType?: TCastType
    ) {
        this.dbType = dbType;
        this.obj = obj;
        this.isJsonB = isJsonB;
        this.asName = asName;
        this.defaultFieldKey = 'json_build_object' as TDefaultFieldKey;
        this.castType = castType;


        const tmpParams: QueryParam<TDbType, any, any, any, any, any>[] = [];
        let entries = Object.entries(this.obj);

        for (const entry of entries) {
            if (
                entry[1] instanceof Object &&
                "params" in entry[1] &&
                entry[1].params !== undefined &&
                entry[1].params.length > 0
            ) {
                tmpParams.push(...entry[1].params);
            }
        }


        if (tmpParams.length > 0) {
            this.params = tmpParams as TParams;
        }
    }

    eq: typeof eq = eq;
    notEq: typeof notEq = notEq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    lt: typeof lt = lt;
    lte: typeof lte = lte;
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;
}

function jsonBuildObjectFn<
    TObj extends JSONBuildObjectParam<PgDbType>
>
    (obj: TObj) {

    return new JSONBuildObjectFunction<
        PgDbType,
        TObj
    >(
        dbTypes.postgresql, obj, false
    )
}

function jsonbBuildObjectFn<
    TObj extends JSONBuildObjectParam<PgDbType>
>
    (obj: TObj) {

    return new JSONBuildObjectFunction<
        PgDbType,
        TObj
    >(
        dbTypes.postgresql, obj, true
    )
}

function buildJSONBuildObjectArgSQL(obj: JSONBuildObjectParam<any>, context?: QueryBuilderContext) {
    if (context === undefined) {
        context = queryBuilderContextFactory();
    }

    let results: string[] = [];
    for (const k in obj) {
        let valueStr: string;
        if ('buildSQL' in obj[k] && typeof obj[k]['buildSQL'] === 'function') {
            const buildSQLRes = obj[k].buildSQL(context);
            valueStr = buildSQLRes.query;
        } else if (!('buildSQL' in obj[k])) {
            valueStr = buildJSONBuildObjectArgSQL(obj[k], context);
        } else {
            throw Error(`Invalid object type in 'json_build_object' function.`);
        }
        results.push(`${k}, ${valueStr}`);
    }

    return results.join(', ');
}

export default JSONBuildObjectFunction;

export { jsonBuildObjectFn, jsonbBuildObjectFn };

export type {
    JSONBuildObjectParam
}