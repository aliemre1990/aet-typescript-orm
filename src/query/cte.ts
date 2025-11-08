import type { DbType } from "../db.js";
import type { IDbType } from "./_interfaces/IDbType.js";
import type { MapToCTEObject, MapToCTEObjectForRecursive } from "./_types/cteUtility.js";
import type { TablesToObject, TableToColumnsMap } from "./_types/miscellaneous.js";
import type ColumnsSelection from "./columnsSelection.js";
import { columnsSelectionFactory } from "./columnsSelection.js";
import CTEObject, { CTEObjectEntry } from "./cteObject.js";
import type QueryParam from "./param.js";
import { cteTypes, type ResultShape, type UNION_TYPE } from "./queryBuilder.js";
import QueryBuilder from "./queryBuilder.js";

function withAs<
    TCTEName extends string,
    TQb extends QueryBuilder<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never
>(as: TCTEName, qb: TQb) {
    type TCTEObject = MapToCTEObject<TDbType, TCTEName, typeof cteTypes.NON_RECURSIVE, TQb>;
    type TParams = TQb extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never;

    const cteObject = new CTEObject(qb.dbType, qb, as, cteTypes.NON_RECURSIVE) as TCTEObject;
    const cteSpecs = [cteObject] as const;

    return new QueryBuilder<
        TDbType,
        undefined,
        undefined,
        typeof cteSpecs,
        undefined,
        TParams
    >(qb.dbType, undefined, { cteSpecs });
}

function withRecursiveAs<
    TCTEName extends string,
    const TColumnNames extends readonly string[],
    TAnchorQb extends QueryBuilder<TDbType, any, any, any, ResultShape<TDbType> | undefined, any, any>,
    TRecursivePartResult extends QueryBuilder<TDbType, any, any, any, any, any, any>,
    TDbType extends DbType = TAnchorQb extends IDbType<infer TDbTypeInner> ? TDbTypeInner : never,
    TFinalCTE extends CTEObject<TDbType, any, any, any, any, any> = MapToCTEObjectForRecursive<TDbType, TCTEName, typeof cteTypes.RECURSIVE, TColumnNames, TAnchorQb>
>(
    cteName: TCTEName,
    columnNames: TColumnNames,
    anchorQb: TAnchorQb,
    unionType: UNION_TYPE,
    recursivePart: (self: ColumnsSelection<TDbType, TFinalCTE, TFinalCTE["cteObjectEntries"]>) => TRecursivePartResult

) {
    // Map anchorqb to cte object with name TCTEName and columns are TColumnsList if specified, else TAnchorQb columns
    // Pass the cte object to recursive part
    let cte: TFinalCTE;
    let finalCTEentries: CTEObjectEntry<TDbType, any, any, any, any>[] = [];
    if (columnNames.length === 0) {
        cte = new CTEObject(anchorQb.dbType, anchorQb, cteName, cteTypes.RECURSIVE) as TFinalCTE;
    } else {
        let resultSelection = anchorQb.resultSelection;
        if (resultSelection === undefined) {
            throw Error("Column list must match the selected columns.");
        }

        if (resultSelection.length !== columnNames.length) {
            throw Error("Column list must match the selected columns.");
        }

        for (let i = 0; i < columnNames.length; i++) {
            let currName = columnNames[i];
            let currComp = resultSelection[i];

            finalCTEentries.push(new CTEObjectEntry(anchorQb.dbType, currComp, undefined, cteName, currName));
        }

        cte = new CTEObject(anchorQb.dbType, anchorQb, cteName, cteTypes.RECURSIVE, finalCTEentries) as TFinalCTE;
    }

    let self = columnsSelectionFactory(cte, cte.cteObjectEntries);
    let recursiveQb = recursivePart(self);

    let finalQb: QueryBuilder<TDbType, any, any, any, any, any, any>;
    if (unionType === "UNION") {
        finalQb = anchorQb.union(() => recursiveQb);
    } else {
        finalQb = anchorQb.unionAll(() => recursiveQb);
    }

    type TAnchorParams = TAnchorQb extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never;
    type TRecursiveParams = TRecursivePartResult extends QueryBuilder<TDbType, any, any, any, any, infer TParams, any> ? TParams : never;
    type TParams = [...(TAnchorParams extends undefined ? [] : TAnchorParams), ...(TRecursiveParams extends undefined ? [] : TRecursiveParams)];
    type TParamsResult = TParams["length"] extends 0 ? undefined : TParams;


    const cteObject = new CTEObject(
        anchorQb.dbType,
        finalQb,
        cteName,
        cteTypes.RECURSIVE,
        finalCTEentries.length === 0 ? undefined : finalCTEentries // Override entries from column list if specified
    ) as TFinalCTE;
    const cteSpecs = [cteObject] as const;

    return new QueryBuilder<
        TDbType,
        undefined,
        undefined,
        typeof cteSpecs,
        undefined,
        TParamsResult
    >(anchorQb.dbType, undefined, { cteSpecs });
}

export {
    withAs,
    withRecursiveAs
}