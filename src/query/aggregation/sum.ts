import type { DbType } from "../../db.js";
import type { JsTypeToPgTypes } from "../../postgresql/dataTypes.js";
import type Column from "../../table/column.js";
import type QueryColumn from "../queryColumn.js";
import AggregatedColumn from "./_aggregatedColumn.js";
import BasicColumnAggregationOperation, { aggregationOperations } from "./_aggregationOperations.js";

function sum<
    TDbType extends DbType,
    TQueryColumn extends QueryColumn<TDbType, Column<TDbType, JsTypeToPgTypes<TDbType, number>, any, any>, any, any>
>(column: TQueryColumn) {
    const op = new BasicColumnAggregationOperation<TDbType, TQueryColumn, number, number>(column, aggregationOperations.sum);
    const aggregatedColumn = new AggregatedColumn<TDbType, TQueryColumn, typeof op>(column, op);

    return aggregatedColumn;
}

export default sum;