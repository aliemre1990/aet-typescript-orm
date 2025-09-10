import type { DbValueTypes, PgDbType } from "../../../db.js";
import type JSONBuildObjectFunction from "../../functions/jsonFunctions/jsonBuildObject.js";

function jsonAgg<
    TDbType extends PgDbType,
    TArg extends JSONBuildObjectFunction<TDbType, any, any, any> | DbValueTypes
>(
    arg: TArg
) {

}