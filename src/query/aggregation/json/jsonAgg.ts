import type { PgDbType } from "../../../db.js";
import type { GetColumnValueTypes } from "../../../table/types/utils.js";
import type JSONBuildObjectFunction from "../../functions/jsonFunctions/jsonBuildObject.js";

function jsonAgg<
    TDbType extends PgDbType,
    TArg extends JSONBuildObjectFunction<TDbType, any, any, any> | GetColumnValueTypes<TDbType>
>(
    arg: TArg
) {

}