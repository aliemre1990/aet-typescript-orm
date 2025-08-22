import type { DbType, PgDbType } from "../db.js";
import type { PgColumnType, PgTypeToJsType, PgValueTypes } from "../postgresql/dataTypes.js";
import ColumnComparisonOperation, { comparisonOperations } from "./comparison.js";
import QueryParam from "./param.js";
import { QueryParamMedian } from "./param.js";
import type { ColumnType, QueryTableSpecsType } from "../table/types/utils.js";
import Equals from "./comparisons/Equals.js";
import NotEquals from "./comparisons/NotEquals.js";
import GreaterThan from "./comparisons/GreaterThan.js";

class QueryColumn<
    TDbType extends DbType,
    TColumn extends ColumnType<TDbType>,
    TQTableSpecs extends QueryTableSpecsType,
    TAsName extends string | undefined = undefined
> {

    qTableSpecs?: TQTableSpecs;
    private _equalsOperator: Equals<TDbType, TColumn, TQTableSpecs, TAsName>;
    private _notEqualsOperator: NotEquals<TDbType, TColumn, TQTableSpecs, TAsName>;
    private _greaterThanOperator: GreaterThan<TDbType, TColumn, TQTableSpecs, TAsName>;

    neq: typeof this._notEqualsOperator.neq;
    eq: typeof this._equalsOperator.eq;
    gt: typeof this._greaterThanOperator.gt;

    constructor(public column: TColumn, public asName?: TAsName) {
        this._equalsOperator = new Equals<TDbType, TColumn, TQTableSpecs, TAsName>(this);
        this._notEqualsOperator = new NotEquals<TDbType, TColumn, TQTableSpecs, TAsName>(this);
        this._greaterThanOperator = new GreaterThan<TDbType, TColumn, TQTableSpecs, TAsName>(this);

        this.neq = this._notEqualsOperator.neq;
        this.eq = this._equalsOperator.eq;
        this.gt = this._greaterThanOperator.gt;
    }

    as<TAsName extends string>(val: TAsName) {
        return new QueryColumn<TDbType, TColumn, TQTableSpecs, TAsName>(this.column, val);
    }

    setQTableSpecs(val: TQTableSpecs) {
        this.qTableSpecs = val;
    }
}

export default QueryColumn;

export {
    QueryParam,
    QueryParamMedian
}