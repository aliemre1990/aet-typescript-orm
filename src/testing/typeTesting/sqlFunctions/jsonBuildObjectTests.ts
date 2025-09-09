import type { PgDbType } from "../../../db.js";
import AggregatedColumn from "../../../query/aggregation/_aggregatedColumn.js";
import type { InferIsAggFromJSONFn, InferReturnTypeFromJSONBuildObjectParam } from "../../../query/functions/_types/args.js";
import QueryColumn from "../../../query/queryColumn.js";
import { customersTable } from "../_tables.js";

const customerIdQC = new QueryColumn<PgDbType, typeof customersTable.columns.customerId, NonNullable<typeof customersTable.columns.customerId.tableSpecs>>(customersTable.columns.customerId);
const customerIdAggC = new AggregatedColumn<PgDbType, typeof customerIdQC>(customerIdQC)

const jsonObj = { ali: customerIdQC, veli: { ali: customerIdQC, asd: { bv: customerIdAggC } } };
type tp = InferIsAggFromJSONFn<PgDbType, typeof jsonObj>

type tpx = InferReturnTypeFromJSONBuildObjectParam<PgDbType, typeof jsonObj>;
