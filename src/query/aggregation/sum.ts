import type { DbType } from "../../db.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import type QueryColumn from "../queryColumn.js";
import AggregatedColumn from "./_aggregatedColumn.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function generateSumFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TAggColumn extends AggregatedColumn<TDbType, QueryColumn<TDbType, any, any, any, number>>
    >(arg: TAggColumn) => {
        return new BasicColumnAggregationOperation<
            TDbType,
            [TAggColumn],
            TAggColumn extends AggregatedColumn<any, infer TQCol> ? TQCol extends IComparable<any, any, any, infer TFinalType, any> ? TFinalType : never : never
        >(dbType, [arg], aggregationOperations.sum);

    }
}

export default generateSumFn;