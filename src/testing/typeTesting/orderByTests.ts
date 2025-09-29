import type { orderTypes } from "../../query/_interfaces/IOrderByClause.js";
import type ISelectClause from "../../query/_interfaces/ISelectClause.js";
import type QueryColumn from "../../query/queryColumn.js";
import { customersTable, ordersTable, shipmentsTable, usersTable } from "./_tables.js";
import type { AssertEqual, AssertExtends, AssertTrue } from "./_typeTestingUtilities.js";

/**
 * 
 */
const SimpleOrderByQuery = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereparam")))
    .orderBy(cols => [cols.customers.name, [cols.customers.id, 'ASC']]);

type SimpleOrderByQueryType = typeof SimpleOrderByQuery;
type SimpleOrderByQuerySpecs = SimpleOrderByQueryType extends ISelectClause<any, any, any, any, infer Specs> ? Specs : never;

type SimpleOrderByQuerySpecsLengthTest = AssertTrue<AssertEqual<2, SimpleOrderByQuerySpecs["length"]>>

type Spec0 = SimpleOrderByQuerySpecs[0];
type Spec0Test = AssertTrue<AssertExtends<Spec0, QueryColumn<any, any, any, any, any, any>>>

type Spec1 = SimpleOrderByQuerySpecs[1];
type Spec1OrderTypeTest = AssertTrue<AssertEqual<Spec1[1], typeof orderTypes.asc>>;
type Spec1ColumnTypeTest = AssertTrue<AssertExtends<Spec1[0], QueryColumn<any, any, any, any, any, any>>>