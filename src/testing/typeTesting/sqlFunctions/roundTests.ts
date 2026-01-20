import type { IComparable } from "../../../query/_interfaces/IComparable.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import { employeesTable } from "../../_tables.js";

const res = employeesTable.select((cols, { round }) => {

    const res = round(cols.employees.salary, 2).as("calculatedColumn");

    return [round(cols.employees.salary, 2)];
}
).exec;


const res1 = employeesTable.select((cols, { round, coalesce, param }) => {
    const calculatedColumn = round(param("asd").type<number>(), coalesce(cols.employees.salary, null)).as("calculatedColumn");

    type t = typeof calculatedColumn;
    type args = t extends ColumnSQLFunction<any, any, infer args, any, any, any, any, any> ? args : never;
    type param = args[1];
    type finalType = param extends IComparable<any, any, any, infer TFinalType, any, any, any> ? TFinalType : never;

    return [calculatedColumn];
}).exec;
