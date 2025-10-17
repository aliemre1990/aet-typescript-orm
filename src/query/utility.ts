import type { DbType } from "../db.js";
import type { MapCtesToSelectionType } from "./_types/miscellaneous.js";
import type CTEObject from "./cteObject.js";
import type { CTESpecs } from "./queryBuilder.js";

function mapCTESpecsToSelection<TDbType extends DbType, TCTESpecs extends CTESpecs<TDbType>>(cteSpecs: TCTESpecs) {
    const res = cteSpecs.reduce((prev, curr) => {
        prev[curr.name] = curr;
        return prev;
    }, {} as { [key: string]: CTEObject<any, any, any, any, any> }) as MapCtesToSelectionType<TDbType, TCTESpecs>;

    return res;
}

export {
    mapCTESpecsToSelection
}
