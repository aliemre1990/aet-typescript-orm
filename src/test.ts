import { pgColumnTypes } from "./postgresql/dataTypes.js";
import type ColumnComparisonOperation from "./query/comparison.js";
import type { IJoinQuery } from "./query/_interfaces/IJoinQuery.js";
import ColumnLogicalOperation, { and } from "./query/logicalOperations.js";
import { param } from "./query/param.js";
import Column from "./table/column.js";
import { ForeignKey, pgTable } from "./table/table.js";
import type { InferParamsFromOps } from "./query/_types/result.js";

// const res2 = customersTable.innerJoin(usersTable,(cols)=> cols.customers.id).select(cols=>({userId:cols.users.id,customerId:cols.customers.id})).exec();


// const query = customersTable.innerJoin(usersTable, (cols) => new ComparisonOperation()).select(cols => ({ asdfa: cols.users.username }))

// const res = query.exec();