import type { DbType } from "../db.js";
import QueryParam from "./param.js";
import { QueryParamMedian } from "./param.js";
import type { ColumnType, QueryTableSpecsType } from "../table/types/utils.js";
import gte from "./comparisons/gte.js";
import gt from "./comparisons/gt.js";
import neq from "./comparisons/neq.js";
import eq from "./comparisons/eq.js";
import between from "./comparisons/between.js";
import sqlIn from "./comparisons/in.js";


class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined
> {

    qTableSpecs?: TQTableSpecs;

    eq: typeof eq = eq;
    neq: typeof neq = neq;
    gt: typeof gt = gt;
    gte: typeof gte = gte;
    sqlIn: typeof sqlIn = sqlIn;

    between: typeof between = between;

    constructor(public column: TColumn, public asName?: TAsName) { }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>(this.column, val);
    }

    setQTableSpecs(val: TQTableSpecs) {
        this.qTableSpecs = val;
    }
}
QueryColumn.prototype.gte = gte;


export default QueryColumn;

export {
    QueryParam,
    QueryParamMedian
}