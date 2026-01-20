import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function generateAvgFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TAggColumn extends IComparable<TDbType, any, number, any, any, any, any>
    >(arg: TAggColumn) => {
        return new BasicColumnAggregationOperation<
            TDbType,
            typeof aggregationOperations.avg,
            [TAggColumn],
            TAggColumn extends IComparable<TDbType, any, any, infer TFinalType, any, any, any> ? TFinalType : never
        >(dbType, [arg], aggregationOperations.avg);

    }
}

export default generateAvgFn;