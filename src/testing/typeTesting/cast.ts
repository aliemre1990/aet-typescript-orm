import type { DbType } from "../../db.js";
import type { IComparable } from "../../query/_interfaces/IComparable.js";
import type SQLArithmeticOperation from "../../query/arithmetic/_arithmeticOperations.js";
import type QueryColumn from "../../query/queryColumn.js";
import { customerIdQC, empSalaryQC } from "../_columns.js";
import { arithmeticAdditionTester, jsonBuildObjectTester, literalTester, paramTester, roundTester, sumTester } from "../_functions.js";
import { customersTable } from "../_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

//
const castNullableNumberQCToDate = empSalaryQC.cast("DATE");
type typeofCastNullableNumberQCToDateValueType = typeof castNullableNumberQCToDate extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofCastNullableNumberQCToDateFinalValueType = typeof castNullableNumberQCToDate extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type castNullableNumberQCToDateValueTypeTest = AssertTrue<AssertEqual<typeofCastNullableNumberQCToDateValueType, Date>>;
type castNullableNumberQCToDateFinalValueTypeTest = AssertTrue<AssertEqual<typeofCastNullableNumberQCToDateFinalValueType, Date | null>>;
//
const castNumberQCToVarchar = customerIdQC.cast("VARCHAR");
type typeofCastNumberQCToVarcharValueType = typeof castNumberQCToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofCastNumberQCToVarcharFinalValueType = typeof castNumberQCToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type castNumberQCToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofCastNumberQCToVarcharValueType, string>>;
type castNumberQCToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofCastNumberQCToVarcharFinalValueType, string>>;
//
const castNullableNumberQCToJSON = empSalaryQC.cast("JSON");
type typeofCastNullableNumberQCToJSONValueType = typeof castNullableNumberQCToJSON extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofCastNullableNumberQCToJSONFinalValueType = typeof castNullableNumberQCToJSON extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type castNullableNumberQCToJSONValueTypeTest = AssertTrue<AssertEqual<typeofCastNullableNumberQCToJSONValueType, number>>;
type castNullableNumberQCToJSONFinalValueTypeTest = AssertTrue<AssertEqual<typeofCastNullableNumberQCToJSONFinalValueType, number | null>>;
//
const castNullLiteralToNumber = literalTester(null).cast("INTEGER");
type typeofCastNullLiteralToNumberValueType = typeof castNullLiteralToNumber extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofCastNullLiteralToNumberFinalValueType = typeof castNullLiteralToNumber extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type castNullLiteralToNumberValueTypeTest = AssertTrue<AssertEqual<typeofCastNullLiteralToNumberValueType, null>>;
type castNullLiteralToNumberFinalValueTypeTest = AssertTrue<AssertEqual<typeofCastNullLiteralToNumberFinalValueType, null>>;
//
const jsonBuildObjectResultToJSONB = jsonBuildObjectTester({ id: customerIdQC, type: literalTester("CUSTOMER_TYPE") }).cast("JSONB");
type typeofJSONBuildObjectResultToJSONBValueType = typeof jsonBuildObjectResultToJSONB extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofJSONBuildObjectResultToJSONBFinalValueType = typeof jsonBuildObjectResultToJSONB extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type jsonBuildObjectResultToJSONBValueTypeTest = AssertTrue<AssertEqual<typeofJSONBuildObjectResultToJSONBValueType, { id: number, type: 'CUSTOMER_TYPE' }>>
type jsonBuildObjectResultToJSONBFinalValueTypeTest = AssertTrue<AssertEqual<typeofJSONBuildObjectResultToJSONBFinalValueType, { id: number, type: 'CUSTOMER_TYPE' }>>
//
const castNumberLiteralToJSON = literalTester(1).cast("JSON");
type typeofCastNumberLiteralToJSONValueType = typeof castNumberLiteralToJSON extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofCastNumberLiteralToJSONFinalValueType = typeof castNumberLiteralToJSON extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type castNumberLiteralToJSONValueTypeTest = AssertTrue<AssertEqual<typeofCastNumberLiteralToJSONValueType, 1>>
type castNumberLiteralToJSONFinalValueTypeTest = AssertTrue<AssertEqual<typeofCastNumberLiteralToJSONFinalValueType, 1>>

//
const roundFnToVarchar = roundTester(customerIdQC, 2).cast("VARCHAR");
type typeofRoundFnToVarcharValueType = typeof roundFnToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofRoundFnToVarcharFinalValueType = typeof roundFnToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type roundFnToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofRoundFnToVarcharValueType, string>>;
type roundFnToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofRoundFnToVarcharFinalValueType, string>>;
//
const nullableRoundFnToVarchar = roundTester(empSalaryQC, 2).cast("VARCHAR");
type typeofNullableRoundFnToVarcharValueType = typeof nullableRoundFnToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofNullableRoundFnToVarcharFinalValueType = typeof nullableRoundFnToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type nullableRoundFnToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofNullableRoundFnToVarcharValueType, string>>;
type nullableRoundFnToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofNullableRoundFnToVarcharFinalValueType, string | null>>;

//
const sumFnToVarchar = sumTester(customerIdQC).cast("VARCHAR");
type typeofSumFnToVarcharValueType = typeof sumFnToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofSumFnToVarcharFinalValueType = typeof sumFnToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type sumFnToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofSumFnToVarcharValueType, string>>;
type sumFnToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofSumFnToVarcharFinalValueType, string>>;
//
const nullableSumFnToVarchar = sumTester(empSalaryQC).cast("VARCHAR");
type typeofNullableSumFnToVarcharValueType = typeof nullableSumFnToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofNullableSumFnToVarcharFinalValueType = typeof nullableSumFnToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type nullableSumFnToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofNullableSumFnToVarcharValueType, string>>;
type nullableSumFnToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofNullableSumFnToVarcharFinalValueType, string | null>>;

// 
const additionToVarchar = arithmeticAdditionTester(customerIdQC, 1).cast("VARCHAR");
type typeofAdditionToVarcharValueType = typeof additionToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofAdditionToVarcharFinalValueType = typeof additionToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type additionToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofAdditionToVarcharValueType, string>>;
type additionToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofAdditionToVarcharFinalValueType, string>>;
//
const nullableAdditionToVarchar = arithmeticAdditionTester(customerIdQC, empSalaryQC).cast("VARCHAR");
type typeofNullableAdditionToVarcharValueType = typeof nullableAdditionToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofNullableAdditionToVarcharFinalValueType = typeof nullableAdditionToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type nullableAdditionToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofNullableAdditionToVarcharValueType, string>>;
type nullableAdditionToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofNullableAdditionToVarcharFinalValueType, string | null>>;

//
const paramToNumber = paramTester("num").cast("INTEGER");
type typeofParamToNumberValueType = typeof paramToNumber extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofParamToNumberFinalValueType = typeof paramToNumber extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type paramToNumberValueTypeTest = AssertTrue<AssertEqual<typeofParamToNumberValueType, number>>;
type paramToNumberFinalValueTypeTest = AssertTrue<AssertEqual<typeofParamToNumberFinalValueType, number | null>>;
//
const numberTypedParamToVarchar = paramTester("num").type<number>().cast("VARCHAR");
type typeofNumberTypedParamToVarcharValueType = typeof numberTypedParamToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofNumberTypedParamToVarcharFinalValueType = typeof numberTypedParamToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type numberTypedParamToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofNumberTypedParamToVarcharValueType, string>>;
type numberTypedParamToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofNumberTypedParamToVarcharFinalValueType, string>>;

const nullableNumberTypedParamToVarchar = paramTester("num").type<number | null>().cast("VARCHAR");
type typeofNullableNumberTypedParamToVarcharValueType = typeof nullableNumberTypedParamToVarchar extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofNullableNumberTypedParamToVarcharFinalValueType = typeof nullableNumberTypedParamToVarchar extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type nullableNumberTypedParamToVarcharValueTypeTest = AssertTrue<AssertEqual<typeofNullableNumberTypedParamToVarcharValueType, string>>;
type nullableNumberTypedParamToVarcharFinalValueTypeTest = AssertTrue<AssertEqual<typeofNullableNumberTypedParamToVarcharFinalValueType, string | null>>;;
// const param = paramTester("num").type<number>().cast("DATE");
// type typeofParam = typeof param extends IComparable<any, any, any, infer TValType, any, any> ? TValType : never;