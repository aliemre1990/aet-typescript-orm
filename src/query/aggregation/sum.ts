import type { DbType } from "../../db.js";
import AggregatedColumn from "./_aggregatedColumn.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function generateSumFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TAggColumn extends AggregatedColumn<TDbType, any>
    >(column: TAggColumn) => {
        const op = new BasicColumnAggregationOperation<TDbType, TAggColumn, number, number>(dbType, column, aggregationOperations.sum);

    }
}

export default generateSumFn;