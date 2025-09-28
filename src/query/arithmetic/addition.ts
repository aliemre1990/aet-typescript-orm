import type { DbType } from "../../db.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsContainsNonNull } from "../_types/args.js";
import SQLArithmeticOperation, { arithmeticOperations } from "./_arithmeticOperations.js";

function generateArithmeticAddition<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TArgs extends IComparable<TDbType, any, any, number, any, any, any>[]
    >
        (...args: TArgs) => {

        return new SQLArithmeticOperation<
            TDbType,
            typeof arithmeticOperations.addition,
            TArgs,
            IsContainsNonNull<TDbType, TArgs> extends true ? number : number | null
        >(dbType, args, arithmeticOperations.addition);
    }
}

export {
    generateArithmeticAddition
}