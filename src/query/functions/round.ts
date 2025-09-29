import type { DbType } from "../../db.js";
import type { IsAny } from "../../utility/common.js";
import type { IComparable } from "../_interfaces/IComparable.js";
import type QueryParam from "../param.js";
import ColumnSQLFunction, { sqlFunctions } from "./_functions.js";

type IsExplicitTypeNumber<TDbType extends DbType, TFirstArg extends QueryParam<TDbType, string, any, any, any> | IComparable<TDbType, any, any, number, any, any, any, any> | number | null> =
    TFirstArg extends QueryParam<TDbType, string, infer TValueType, any, any> ? IsAny<TValueType> extends true ? TFirstArg :
    number extends TValueType ? TFirstArg : never :
    TFirstArg
    ;


function generateRoundFn<TDbType extends DbType>(dbType: TDbType) {
    return <
        TFirstArg extends QueryParam<TDbType, string, any, any, any> | IComparable<TDbType, any, any, number, any, any, any, any> | number | null,
        TSecondArg extends QueryParam<TDbType, string, any, any, any> | IComparable<TDbType, any, any, number, any, any, any, any> | number | null,

    >(firstArg: TFirstArg & (IsExplicitTypeNumber<TDbType, TFirstArg>), secondArg: TSecondArg & (IsExplicitTypeNumber<TDbType, TSecondArg>)) => {

        type TFirstArgFormatted = TFirstArg extends QueryParam<TDbType, infer TParamName, infer TValueType, any, any> ?
            IsAny<TValueType> extends true ? QueryParam<TDbType, TParamName, number | null, any, any, any> : QueryParam<TDbType, TParamName, TValueType, any, any, any> :
            TFirstArg;

        type TSecondArgFormatted = TSecondArg extends QueryParam<TDbType, infer TParamName, infer TValueType, any, any> ?
            IsAny<TValueType> extends true ? QueryParam<TDbType, TParamName, number | null, any, any, any> : QueryParam<TDbType, TParamName, TValueType, any, any, any> :
            TSecondArg;

        let firstArgValue: TFirstArg = firstArg;
        let secondArgValue: TSecondArg = secondArg;

        return new ColumnSQLFunction<
            TDbType,
            typeof sqlFunctions.round,
            [TFirstArgFormatted, TSecondArgFormatted],
            [TFirstArgFormatted, TSecondArgFormatted] extends [null, any] | [any, null] | [null, null] ? number | null :
            TFirstArgFormatted extends IComparable<TDbType, any, any, any, infer TFinalType, any, any, any> ? number | null extends TFinalType ? number | null :
            TSecondArgFormatted extends IComparable<TDbType, any, any, any, infer TFinalType, any, any, any> ? number | null extends TFinalType ? number | null :
            number :
            number :
            number
        >(dbType, [firstArgValue as TFirstArgFormatted, secondArgValue as TSecondArgFormatted], sqlFunctions.round);

    }
}

export default generateRoundFn;