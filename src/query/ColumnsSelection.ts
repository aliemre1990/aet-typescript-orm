import type { DbType } from "../db.js";
import type { IComparable } from "./_interfaces/IComparable.js";
import type { IExecuteableQuery } from "./_interfaces/IExecuteableQuery.js";
import type QueryTable from "./queryTable.js";

const ColumnsSelectionQueryTableObjectSymbol = Symbol();
type ColumnsSelection<
    TDbType extends DbType,
    TQItem extends QueryTable<TDbType, any, any, any, any, any> | IExecuteableQuery<TDbType, any, any, any, any, any, any>,
    TColumns extends readonly IComparable<TDbType, any, any, any, any, any, any, any>[]
> =
    {
        [ColumnsSelectionQueryTableObjectSymbol]: TQItem;
    } &
    {
        [K in TColumns[number]as K["defaultFieldKey"]]: K;
    };


export default ColumnsSelection;

export {
    ColumnsSelectionQueryTableObjectSymbol
}
