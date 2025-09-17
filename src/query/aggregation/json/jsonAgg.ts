import { dbTypes, type DbValueTypes, type PgDbType } from "../../../db.js";
import type { UnionToTuple } from "../../../utility/common.js";
import type { IComparable } from "../../comparisons/_interfaces/IComparable.js";
import type JSONBuildObjectFunction from "../../functions/jsonFunctions/jsonBuildObject.js";
import type { ColumnsSelection } from "../../queryColumn.js";
import type QueryColumn from "../../queryColumn.js";
import type QueryTable from "../../queryTable.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "../_aggregationOperations.js";

type InferReturnTypeFromArg<TArg> =
    TArg extends IComparable<any, any, any, infer TFinalType, any> ? TFinalType[] :
    TArg extends ColumnsSelection<any, any, infer TColumns> ? MapQueryColumnsToTuple<UnionToTuple<TColumns[keyof TColumns]>> :
    never
    ;

type MapQueryColumnsToTuple<TQColumns> =
    TQColumns extends readonly [infer First, ...infer Rest] ?
    First extends QueryColumn<any, any, any, any, any, infer TFinalType> ? [TFinalType, ...MapQueryColumnsToTuple<Rest>] :
    [] :
    [];


function jsonAggFn<
    TArg extends IComparable<PgDbType, any, any, any, any> | ColumnsSelection<PgDbType, any, any>
>(
    arg: TArg
) {
    return new BasicColumnAggregationOperation<
        PgDbType,
        [TArg],
        InferReturnTypeFromArg<TArg>
    >(dbTypes.postgresql, [arg], aggregationOperations.jsonAgg);
}

export default jsonAggFn;