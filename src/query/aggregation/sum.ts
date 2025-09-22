import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function generateSumFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TAggColumn extends IComparable<TDbType, any, any, number, any, true, any>
    >(arg: TAggColumn) => {
        return new BasicColumnAggregationOperation<
            TDbType,
            [TAggColumn],
            TAggColumn extends IComparable<TDbType, any, any, any, infer TFinalType, any, any> ? TFinalType : never
        >(dbType, [arg], aggregationOperations.sum);

    }
}

export default generateSumFn;