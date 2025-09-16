import type { DbValueTypes, PgDbType } from "../../../db.js";
import type { IComparable } from "../../comparisons/_interfaces/IComparable.js";
import type JSONBuildObjectFunction from "../../functions/jsonFunctions/jsonBuildObject.js";
import type { ColumnsSelection } from "../../queryColumn.js";
import type QueryColumn from "../../queryColumn.js";

function jsonAgg<
    TArg extends IComparable<TDbType, any, any, any, any> | JSONBuildObjectFunction<TDbType, any, any, any> | ColumnsSelection<TDbType, any>,
    TDbType extends PgDbType = PgDbType
>(
    arg: TArg
) {
    
}