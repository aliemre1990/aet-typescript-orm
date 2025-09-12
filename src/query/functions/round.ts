import type { DbType, PgDbType } from "../../db.js";
import type { IComparable } from "../comparisons/_interfaces/IComparable.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";

function generateRoundFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TFirstArg extends IComparable<TDbType, any, number, any, any> | number | null,
        TSecondArg extends IComparable<TDbType, any, number, any, any> | number | null,
    >(firstArg: TFirstArg, secondArg: TSecondArg) => {

        return new ColumnSQLFunction<
            TDbType,
            typeof sqlFunctions.round,
            [TFirstArg, TSecondArg],
            [TFirstArg, TSecondArg] extends [null, any] | [any, null] | [null, null] ? number | null :
            TFirstArg extends IComparable<TDbType, any, any, infer TFinalType, any> ? number | null extends TFinalType ? number | null :
            number :
            TSecondArg extends IComparable<TDbType, any, any, infer TFinalType, any> ? number | null extends TFinalType ? number | null :
            number :
            number
        >(dbType, [firstArg, secondArg], sqlFunctions.round);

    }
}

export default generateRoundFn;