import { dbTypes, type DbType, type PgDbType } from "../../../db.js";
import type { DbValueTypes } from "../../../table/column.js";
import type { RecordToTupleSafe } from "../../../utility/common.js";
import { IComparableFinalValueDummySymbol, IComparableValueDummySymbol, type IComparable, type QueryBuilderContext } from "../../_interfaces/IComparable.js";
import between from "../../comparisons/between.js";
import eq from "../../comparisons/eq.js";
import sqlIn from "../../comparisons/in.js";
import type { InferReturnTypeFromJSONBuildObjectParam } from "../../_types/args.js";
import type QueryParam from "../../param.js";


class JSONBuildObjectFunction<
    TDbType extends PgDbType,
    TObj extends JSONBuildObjectParam<TDbType>,
    TReturnType extends DbValueTypes | null = TDbType extends PgDbType ? InferReturnTypeFromJSONBuildObjectParam<TDbType, TObj> : never,
    TParams extends QueryParam<TDbType, string, any, any, any>[] | undefined = InferParamsFromJsonBuildObjectArg<TDbType, TObj>,
    TAs extends string | undefined = undefined,
    TDefaultFieldKey extends string = 'json_build_object'
> implements IComparable<TDbType, TParams, NonNullable<TReturnType>, TReturnType, TDefaultFieldKey, TAs> {

    dbType: TDbType;
    obj: TObj;
    isJsonB: boolean;

    [IComparableValueDummySymbol]?: NonNullable<TReturnType>;
    [IComparableFinalValueDummySymbol]?: TReturnType;
    params?: TParams;

    asName?: TAs;
    defaultFieldKey: TDefaultFieldKey;

    as<TAs extends string>(asName: TAs) {
        return new JSONBuildObjectFunction<TDbType, TObj, TReturnType, TParams, TAs, TDefaultFieldKey>(this.dbType, this.obj, this.isJsonB, asName);
    }

    buildSQL(context?: QueryBuilderContext) {
        return { query: ``, params: [...(context?.params || [])] };
    }

    constructor(
        dbType: TDbType,
        obj: TObj,
        isJsonB: boolean,
        asName?: TAs,
    ) {
        this.dbType = dbType;
        this.obj = obj;
        this.isJsonB = isJsonB;
        this.asName = asName;
        this.defaultFieldKey = 'json_build_object' as TDefaultFieldKey;


        const tmpParams: QueryParam<TDbType, any, any, any, any>[] = [];
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
    sqlIn: typeof sqlIn = sqlIn;
    between: typeof between = between;
}

type InferParamsFromJsonBuildObjectArg<TDbType extends DbType, TObj extends JSONBuildObjectParam<TDbType>> =
    InferParamsFromObj<TDbType, TObj>["length"] extends 0 ? undefined :
    InferParamsFromObj<TDbType, TObj>;

type InferParamsFromObj<TDbType extends DbType, TObj extends JSONBuildObjectParam<TDbType>> =
    RecordToTupleSafe<TObj> extends readonly [infer FirstKey, ...infer RestKeys] ?
    RestKeys extends readonly any[] ?
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>, ...InferParamsFromObjArr<TDbType, RestKeys>] :
    [...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams)] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>] :
    [] :
    [];

type InferParamsFromObjArr<TDbType extends DbType, TRest extends readonly any[]> =
    TRest extends readonly [infer FirstKey, ...infer RestKeys] ?
    RestKeys extends readonly any[] ?
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>, ...InferParamsFromObjArr<TDbType, RestKeys>] :
    [...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any, any> ? [...(TParams extends undefined ? [] : TParams)] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>] :
    [] :
    [];

type JSONBuildObjectParam<TDbType extends DbType> = {
    [key: string]:
    IComparable<TDbType, any, any, any, any, any> |
    JSONBuildObjectParam<TDbType>
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

export default JSONBuildObjectFunction;

export { jsonBuildObjectFn, jsonbBuildObjectFn };

export type {
    JSONBuildObjectParam
}