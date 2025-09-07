import type { DbType } from "../../db.js";
import type { JsTypeToPgTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type QueryColumn from "../queryColumn.js";
import AggregatedColumn from "./_aggregatedColumn.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function sum<
    TDbType extends DbType,
    TAggColumn extends AggregatedColumn<TDbType, any>
>(column: TAggColumn) {
    const op = new BasicColumnAggregationOperation<TDbType, TAggColumn, number, number>(column, aggregationOperations.sum);

}

export default sum;