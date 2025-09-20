import type { DbType } from "../../db.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import type { IGroupedComparable } from "../comparisons/_interfaces/IGroupedComparable.js";
import type QueryColumn from "../queryColumn.js";
import AggregatedColumn from "./_aggregatedColumn.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function generateSumFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TAggColumn extends IComparable<TDbType, any, number, any, true>
    >(arg: TAggColumn) => {
        return new BasicColumnAggregationOperation<
            TDbType,
            [TAggColumn],
            TAggColumn extends IComparable<TDbType, any, any, infer TFinalType, any> ? TFinalType : never
        >(dbType, [arg], aggregationOperations.sum);

    }
}

export default generateSumFn;