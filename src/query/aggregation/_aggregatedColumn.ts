import type { DbType } from "../../db.js";
import type QueryColumn from "../queryColumn.js";
import type BasicColumnAggregationOperation from "./_aggregationOperations.js";

class AggregatedColumn<
    TDbType extends DbType,
    TQueryColumn extends QueryColumn<TDbType, any, any, any>
> {
    constructor(public queryColumn: TQueryColumn) {

    }
}

export default AggregatedColumn;