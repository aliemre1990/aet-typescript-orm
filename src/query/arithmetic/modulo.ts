import type { DbType } from "../../db.js";
import type { DbValueTypes } from "../../table/column.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type { IsContainsNonNull } from "../_types/args.js";
import SQLArithmeticOperation, { arithmeticOperations } from "./_arithmeticOperations.js";

function generateArithmeticModulo<
    TDbType extends DbType
>(dbType: TDbType) {
    return <
        TArgs extends (DbValueTypes | null | IComparable<TDbType, any, any, any, any, any>)[]
    >
        (...args: TArgs) => {

        return new SQLArithmeticOperation<
            TDbType,
            typeof arithmeticOperations.modulo,
            TArgs,
            IsContainsNonNull<TDbType, TArgs> extends true ? number : number | null
        >(dbType, args, arithmeticOperations.modulo);
    }
}

export {
    generateArithmeticModulo
}