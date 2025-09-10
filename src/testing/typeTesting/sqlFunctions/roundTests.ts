import { PgDbType } from "../../../db.js";
import round from "../../../query/functions/round.js";
import QueryColumn from "../../../query/queryColumn.js";
import { employeesTable } from "../_tables.js";

const res = employeesTable.select(cols => ({ calculatedColumn: round(cols.employees.salary, 2) })).exec;