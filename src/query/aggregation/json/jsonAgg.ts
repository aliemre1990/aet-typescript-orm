import type { DbValueTypes, PgDbType } from "../../../db.js";
import type JSONBuildObjectFunction from "../../functions/jsonFunctions/jsonBuildObject.js";
import type { ColumnsSelection } from "../../queryColumn.js";
import type QueryColumn from "../../queryColumn.js";

function jsonAgg<
    TArg extends JSONBuildObjectFunction<TDbType, any, any, any> | DbValueTypes | ColumnsSelection<TDbType, any>,
    TDbType extends PgDbType = PgDbType
>(
    arg: TArg
) {

}