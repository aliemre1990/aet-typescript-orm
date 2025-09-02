import type { DbType } from "../../db.js";
import type QueryColumn from "../queryColumn.js";

class GroupedColumn<
    TDbType extends DbType,
    TQueryColumn extends QueryColumn<TDbType, any, any, any>
> {
    constructor(public column: TQueryColumn) { }
}


export default GroupedColumn;
