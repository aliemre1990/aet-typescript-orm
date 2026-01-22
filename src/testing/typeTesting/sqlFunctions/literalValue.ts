import type { DbType } from "../../../db.js";
import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type QueryColumn from "../../../query/queryColumn.js";
import { customerIdQC, empSalaryQC } from "../../_columns.js";
import { jsonBuildObjectTester, literalTester, paramTester } from "../../_functions.js";
import { customersTable } from "../../_tables.js";
import type { AssertEqual, AssertTrue } from "../_typeTestingUtilities.js";

const nullLiteral = literalTester(null);
type typeofNullLiteral = typeof nullLiteral;
type typeofNullLiteralValueType = typeofNullLiteral extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofNullLiteralFinalValueType = typeofNullLiteral extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type nullLiteralValueTypeTest = AssertTrue<AssertEqual<typeofNullLiteralValueType, null>>;
type nullLiteralFinalValueTypeTest = AssertTrue<AssertEqual<typeofNullLiteralFinalValueType, null>>;

const objectLiteral = literalTester({ a: 1, b: "str" });
type typeofObjectLiteral = typeof objectLiteral;
type typeofObjectLiteralValueType = typeofObjectLiteral extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofObjectLiteralFinalValueType = typeofObjectLiteral extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type objectLiteralValueTypeTest = AssertTrue<AssertEqual<typeofObjectLiteralValueType, { a: 1, b: "str" }>>;
type objectLiteralFinalValueTypeTest = AssertTrue<AssertEqual<typeofObjectLiteralFinalValueType, { a: 1, b: "str" }>>;

const numberLiteral = literalTester(1);
type typeofNumberLiteral = typeof numberLiteral;
type typeofNumberLiteralValueType = typeofNumberLiteral extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofNumberLiteralFinalValueType = typeofNumberLiteral extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type numberLiteralValueTypeTest = AssertTrue<AssertEqual<typeofNumberLiteralValueType, 1>>;
type numberLiteralFinalValueTypeTest = AssertTrue<AssertEqual<typeofNumberLiteralFinalValueType, 1>>;

const jsonBuildObjectWithLiteral = jsonBuildObjectTester({ id: customerIdQC, type: literalTester("CUSTOMER_TYPE") });
type typeofJSONBuildObjectWithLiteral = typeof jsonBuildObjectWithLiteral;
type typeofJSONBuildObjectWithLiteralValueType = typeofJSONBuildObjectWithLiteral extends IComparable<any, any, infer TValueType, any, any, any, any> ? TValueType : never;
type typeofJSONBuildObjectWithLiteralFinalValueType = typeofJSONBuildObjectWithLiteral extends IComparable<any, any, any, infer TFinalValueType, any, any, any> ? TFinalValueType : never;
type jsonBuildObjectWithLiteralValueTypeTest = AssertTrue<AssertEqual<typeofJSONBuildObjectWithLiteralValueType, { id: number, type: 'CUSTOMER_TYPE' }>>;
type jsonBuildObjectWithLiteralFinalValueTypeTest = AssertTrue<AssertEqual<typeofJSONBuildObjectWithLiteralFinalValueType, { id: number, type: 'CUSTOMER_TYPE' }>>;