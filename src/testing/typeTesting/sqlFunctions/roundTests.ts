import { PgDbType } from "../../../db.js";
import type { IComparable } from "../../../query/comparisons/_interfaces/IComparable.js";
import type ColumnSQLFunction from "../../../query/functions/_functions.js";
import round from "../../../query/functions/round.js";
import QueryColumn from "../../../query/queryColumn.js";
import { employeesTable } from "../_tables.js";

const res = employeesTable.select((cols, { round }) => ({ calculatedColumn: round(cols.employees.salary, 2) })).exec;


const res1 = employeesTable.select((cols, { round, coalesce, param }) => {
    const calculatedColumn = round(param("asd").type<number>(), coalesce(cols.employees.salary, null));

    type t = typeof calculatedColumn;
    type args = t extends ColumnSQLFunction<any, any, infer args, any> ? args : never;
    type param = args[1];
    type finalType = param extends IComparable<any, any, any, infer TFinalType, any> ? TFinalType : never;

    return { calculatedColumn };
}).exec;
