import { dbTypes, type PgDbType } from "../db.js";
import QueryColumn from "../query/queryColumn.js";
import { customersTable, employeesTable } from "./_tables.js";


const customerIdQC = new QueryColumn<
    PgDbType,
    typeof customersTable.columns.id,
    NonNullable<typeof customersTable.columns.id.tableSpecs>,
    undefined
>(
    dbTypes.postgresql,
    customersTable.columns.id,
    { tableName: customersTable.name }
);
const createdByQC = new QueryColumn<
    PgDbType,
    typeof customersTable.columns.createdBy,
    NonNullable<typeof customersTable.columns.createdBy.tableSpecs>,
    undefined
>(
    dbTypes.postgresql,
    customersTable.columns.createdBy,
    { tableName: customersTable.name }
);
const customerCreatedByQC = new QueryColumn<
    PgDbType,
    typeof customersTable.columns.createdBy,
    NonNullable<typeof customersTable.columns.createdBy.tableSpecs>,
    undefined
>(
    dbTypes.postgresql,
    customersTable.columns.createdBy,
    { tableName: customersTable.name }
);
const customerNameQC = new QueryColumn<
    PgDbType,
    typeof customersTable.columns.name,
    NonNullable<typeof customersTable.columns.name.tableSpecs>,
    undefined
>(
    dbTypes.postgresql,
    customersTable.columns.name,
    { tableName: customersTable.name }
);
const empSalaryQC = new QueryColumn<
    PgDbType,
    typeof employeesTable.columns.salary,
    NonNullable<typeof employeesTable.columns.salary.tableSpecs>,
    undefined
>(
    dbTypes.postgresql,
    employeesTable.columns.salary,
    { tableName: employeesTable.name }
);

export {
    customerIdQC,
    customerCreatedByQC,
    customerNameQC,
    empSalaryQC
}

