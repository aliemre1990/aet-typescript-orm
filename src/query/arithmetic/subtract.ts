import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsContainsNull } from "../_types/args.js";
import SQLArithmeticOperation, { arithmeticOperations } from "./_arithmeticOperations.js";

function generateArithmeticSubtraction<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TArgs extends (DbValueTypes | null | IComparable<TDbType, any, number, any, any, any, any>)[]
    >
        (...args: TArgs) => {

        return new SQLArithmeticOperation<
            TDbType,
            typeof arithmeticOperations.subtraction,
            TArgs,
            IsContainsNull<TDbType, TArgs> extends true ? number | null : number
        >(dbType, args, arithmeticOperations.subtraction);
    }
}

export {
    generateArithmeticSubtraction
}