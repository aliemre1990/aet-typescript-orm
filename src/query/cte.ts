import type { DbType } from "../db.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { OverrideCTEParams } from "./_types/categorizedParams.js";
import type { MapToCTEObject } from "./_types/cteUtility.js";
import CTEObject from "./cteObject.js";
import { cteTypes, type DefaultCategorizedParamsType } from "./queryBuilder.js";
import QueryBuilder from "./queryBuilder.js";

function withAs<
    TCTEName extends string,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TDbType extends DbType = TQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never
>(as: TCTEName, qb: TQb) {
    type TCTEObject = MapToCTEObject<TDbType, TCTEName, typeof cteTypes.NON_RECURSIVE, TQb>;
    type TParams = TQb extends QueryBuilder<TDbType, any, any, any, any, any, any, infer TParams> ? TParams : never;

    const cteObject = new CTEObject(qb.dbType, qb, as, cteTypes.NON_RECURSIVE) as TCTEObject;
    const cteSpecs = [cteObject] as const;

    return new QueryBuilder<
        TDbType,
        undefined,
        undefined,
        typeof cteSpecs,
        undefined,
        OverrideCTEParams<TDbType, DefaultCategorizedParamsType, TCTEObject, TParams>
    >(qb.dbType, undefined, { cteSpecs });
}

function withRecursiveAs<
    TCTEName extends string,
    const TColumnList extends readonly string[],
    TAnchorQb extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TRecursivePartResult extends QueryBuilder<TDbType, any, any, any, any, any, any, any>,
    TDbType extends DbType = TAnchorQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never
>(
    cteName: TCTEName,
    columnList: TColumnList,
    anchorQb: TAnchorQb,
    recursivePart: () => TRecursivePartResult
) {
    // Map anchorqb to cte object with name TCTEName and columns are TColumnsList if specified, else TAnchorQb columns
    // Pass the cte object to recursive part


}

export {
    withAs,
    withRecursiveAs
}