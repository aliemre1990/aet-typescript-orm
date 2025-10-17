import type { DbType } from "../db.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type { FromItemType } from "./queryBuilder.js";

const ColumnsSelectionQueryTableObjectSymbol = Symbol();
type ColumnsSelection<
    TDbType extends DbType,
    TQItem extends FromItemType<TDbType>,
    TColumns extends readonly IComparable<TDbType, any, any, any, any, any>[]
> =
    {
        [ColumnsSelectionQueryTableObjectSymbol]: TQItem;
    } &
    {
        [K in TColumns[number]as K["defaultFieldKey"]]: K;
    };

function columnsSelectionFactory<TDbType extends DbType>(
    queryObject: FromItemType<TDbType>,
    columns: readonly IComparable<TDbType, any, any, any, string, any>[]
): ColumnsSelection<TDbType, any, any> {

    let res: ColumnsSelection<TDbType, any, any> = {
        [ColumnsSelectionQueryTableObjectSymbol]: queryObject,
    }

    for (const col of columns) {
        res[col.defaultFieldKey] = col;
    }

    return res;
}

export default ColumnsSelection;

export {
    ColumnsSelectionQueryTableObjectSymbol,
    columnsSelectionFactory
}
