import type { DbType, PgDbType } from "../../db.js";
import type { PgValueTypes } from "../../postgresql/dataTypes.js";
import type { GetColumnValueTypes } from "../../table/types/utils.js";
import type AggregatedColumn from "../aggregation/_aggregatedColumn.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";
import type { InferIsAggFromJSONFn, InferReturnTypeFromJSONBuildObjectParam } from "./_types/args.js";

// class JSONBuildObjectFunction<
//     TDbType extends PgDbType,
//     TObj extends JSONBuildObjectParam<TDbType>,
//     TReturnType extends GetColumnValueTypes<TDbType> | null,
//     TIsAgg extends boolean = false
// > implements IComparable<TDbType, InferParamsFromFnArgs<TArgs>, NonNullable<TReturnType>, TReturnType, TIsAgg> {

//     icomparableValueDummy?: NonNullable<TReturnType>;
//     icomparableFinalValueDummy?: TReturnType;
//     params?: InferParamsFromFnArgs<TArgs>;
//     isAgg?: TIsAgg;
//     dbType?: TDbType;


//     eq: typeof eq = eq;
//     between: typeof between = between;

//     constructor(
//         public args: TArgs,
//         public sqlFunction: TSQLFunction,
//     ) {
//     }
// }


type JSONBuildObjectParam<TDbType extends DbType> = {
    [key: string]:
    IComparable<TDbType, any, any, any, any> |
    AggregatedColumn<TDbType, any> |
    JSONBuildObjectParam<TDbType>
}

function jsonBuildObject<
    TDbType extends PgDbType,
    TObj extends JSONBuildObjectParam<TDbType>,
    TReturnType extends GetColumnValueTypes<TDbType> | null = TDbType extends PgDbType ? InferReturnTypeFromJSONBuildObjectParam<TDbType, TObj> : never,
    TIsAggregation extends boolean = InferIsAggFromJSONFn<TDbType, TObj>
>
    (obj: TObj) {

    return new ColumnSQLFunction<
        TDbType,
        typeof sqlFunctions.jsonBuildObject,
        any,
        TReturnType,
        TIsAggregation
    >(
        [obj], sqlFunctions.jsonBuildObject
    )
}

export default jsonBuildObject;

export type {
    JSONBuildObjectParam
}