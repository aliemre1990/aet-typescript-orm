import type { DbType } from "../../db.js";
import type { IComparable } from "../../query/_interfaces/IComparable.js";
import type QueryColumn from "../../query/queryColumn.js";
import { customerIdQC, empSalaryQC } from "../_columns.js";
import { paramTester } from "../_functions.js";
import { customersTable } from "../_tables.js";

const qc = empSalaryQC.cast("DATE");
type typeofQC = typeof qc extends IComparable<any, any, infer Tval, any, any, any,any> ? Tval : never;

// const param = paramTester("num").type<number>().cast("DATE");
// type typeofParam = typeof param extends IComparable<any, any, any, infer TValType, any, any> ? TValType : never;