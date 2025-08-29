import type { DbType } from "../../db.js";
import type QueryColumn from "../queryColumn.js";
import type BasicColumnAggregationOperation from "./_aggregationOperations.js";

class AggregatedColumn<
    TDbType extends DbType,
    TQueryColumn extends QueryColumn<TDbType, any, any, any>,
    TAggOp extends BasicColumnAggregationOperation<TDbType, TQueryColumn, any, any>
> {
    constructor(public queryColumn: TQueryColumn, public op: TAggOp) {

    }
}

export default AggregatedColumn;