import type { DbType, PgDbType } from "../../../db.js";
import type { DbValueTypes } from "../../../table/column.js";
import type { RecordToTupleSafe } from "../../../utility/common.js";
import type { IComparable } from "../../_interfaces/IComparable.js";
import between from "../../comparisons/between.js";
import eq from "../../comparisons/eq.js";
import sqlIn from "../../comparisons/in.js";
import type { InferIsAggFromJSONFn, InferReturnTypeFromJSONBuildObjectParam } from "../../_types/args.js";

class JSONBuildObjectFunction<
    TDbType extends PgDbType,
    TObj extends JSONBuildObjectParam<TDbType>,
    TReturnType extends DbValueTypes | null = TDbType extends PgDbType ? InferReturnTypeFromJSONBuildObjectParam<TDbType, TObj> : never,
    TIsAgg extends boolean = InferIsAggFromJSONFn<TDbType, TObj>
> implements IComparable<TDbType, InferParamsFromJsonBuildObjectArg<TDbType, TObj>, NonNullable<TReturnType>, TReturnType, TIsAgg> {

    icomparableValueDummy?: NonNullable<TReturnType>;
    icomparableFinalValueDummy?: TReturnType;
    params?: InferParamsFromJsonBuildObjectArg<TDbType, TObj>;
    isAgg?: TIsAgg;
    dbType?: TDbType;

    constructor(
        public obj: TObj,
        public isJsonB: boolean,
    ) {
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
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>, ...InferParamsFromObjArr<TDbType, RestKeys>] :
    [...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any> ? [...(TParams extends undefined ? [] : TParams)] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>] :
    [] :
    [];

type InferParamsFromObjArr<TDbType extends DbType, TRest extends readonly any[]> =
    TRest extends readonly [infer FirstKey, ...infer RestKeys] ?
    RestKeys extends readonly any[] ?
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any> ? [...(TParams extends undefined ? [] : TParams), ...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>, ...InferParamsFromObjArr<TDbType, RestKeys>] :
    [...InferParamsFromObjArr<TDbType, RestKeys>] :
    FirstKey extends IComparable<TDbType, infer TParams, any, any, any> ? [...(TParams extends undefined ? [] : TParams)] :
    FirstKey extends JSONBuildObjectParam<TDbType> ? [...InferParamsFromObj<TDbType, FirstKey>] :
    [] :
    [];

type JSONBuildObjectParam<TDbType extends DbType> = {
    [key: string]:
    IComparable<TDbType, any, any, any, any> |
    JSONBuildObjectParam<TDbType>
}

function jsonBuildObjectFn<
    TObj extends JSONBuildObjectParam<TDbType>,
    TDbType extends PgDbType = PgDbType
>
    (obj: TObj) {

    return new JSONBuildObjectFunction<
        TDbType,
        TObj
    >(
        obj, false
    )
}

function jsonbBuildObjectFn<
    TObj extends JSONBuildObjectParam<TDbType>,
    TDbType extends PgDbType = PgDbType
>
    (obj: TObj) {

    return new JSONBuildObjectFunction<
        TDbType,
        TObj
    >(
        obj, true
    )
}

export default JSONBuildObjectFunction;

export { jsonBuildObjectFn, jsonbBuildObjectFn };

export type {
    JSONBuildObjectParam
}