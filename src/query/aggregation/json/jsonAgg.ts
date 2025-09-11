import type { DbValueTypes, PgDbType } from "../../../db.js";
import type JSONBuildObjectFunction from "../../functions/jsonFunctions/jsonBuildObject.js";
import type QueryColumn from "../../queryColumn.js";

function jsonAgg<
    TArg extends JSONBuildObjectFunction<TDbType, any, any, any> | DbValueTypes | { [key: string]: QueryColumn<TDbType, any, any, any> },
    TDbType extends PgDbType = PgDbType
>(
    arg: TArg
) {

}