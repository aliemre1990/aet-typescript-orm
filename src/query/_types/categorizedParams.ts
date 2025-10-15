import type { DbType } from "../../db.js";
import type CTEObject from "../cteObject.js";
import type QueryParam from "../param.js";
import type { CategorizedParamsType } from "../queryBuilder.js";
import type QueryTable from "../queryTable.js";
import type SubQueryObject from "../subQueryObject.js";

type OverrideJoinParams<
    TDbType extends DbType,
    TCategorizedParams extends CategorizedParamsType<TDbType>,
    TInnerJoinResult extends QueryTable<TDbType, any, any, any, any, any> | SubQueryObject<TDbType, any, any, string> | CTEObject<TDbType, any, any, any, any>,
    TParams extends QueryParam<TDbType, any, any, any, any>[] | undefined
> =
    {
        cteParams: TCategorizedParams["cteParams"],
        joinParams: (
            Omit<
                TCategorizedParams["joinParams"],
                TInnerJoinResult extends QueryTable<TDbType, any, any, infer TTable, any, infer TAs> ? TAs extends undefined ? TTable["name"] : TAs :
                TInnerJoinResult extends SubQueryObject<TDbType, any, any, infer TAs> ? TAs :
                TInnerJoinResult extends CTEObject<TDbType, infer TCTEName, any, any, any> ? TCTEName :
                never
            > & {
                [
                K in (
                    TInnerJoinResult extends QueryTable<TDbType, any, any, infer TTable, any, infer TAs> ? TAs extends undefined ? TTable["name"] : TAs :
                    TInnerJoinResult extends SubQueryObject<TDbType, any, any, infer TAs> ? TAs :
                    TInnerJoinResult extends CTEObject<TDbType, infer TCTEName, any, any, any> ? TCTEName :
                    never
                )
                ]: TParams
            }
        ),
        fromParams: TCategorizedParams["fromParams"],
        selectParams: TCategorizedParams["selectParams"],
        whereParams: TCategorizedParams["whereParams"],
        orderByParams: TCategorizedParams["orderByParams"],
        groupByParams: TCategorizedParams["groupByParams"],
        havingParams: TCategorizedParams["havingParams"]
    }


export type {
    OverrideJoinParams
}
