import { from } from "../../query/queryBuilder.js";
import { customersTable, employeesTable, ordersTable } from "./_tables.js";
import type { AssertEqual, AssertTrue } from "./_typeTestingUtilities.js";

const subQuery = customersTable
    .where((cols, { param }) => cols.customers.id.eq(param("whereparam")))
    .select((cols, { round, param }) => ([cols.customers.id, round(cols.customers.createdBy, param("roundParam1")).as("roundResult")]))
    .as("sq1");

/**
 * 
 */
const MultipleFromQueryWithSubQuery = from(employeesTable.as("employeesAs"), subQuery)
    .select((tab) => [tab.sq1.id])
    .exec

type MultipleFromQueryWithSubQueryResult = {
    id: number
}[]
type MultipleFromQueryWithSubQueryReturnType = ReturnType<typeof MultipleFromQueryWithSubQuery>
type MultipleFromQueryWithSubQueryTest = AssertTrue<AssertEqual<MultipleFromQueryWithSubQueryResult, MultipleFromQueryWithSubQueryReturnType>>;

type MultipleFromQueryWithSubQueryParams = {
    whereParam: number | null,
    roundParam1: number | null
}
type MultipleFromQueryWithSubQueryParamsResult = typeof MultipleFromQueryWithSubQuery extends (param: infer TParams) => any ? TParams : never;
type MultipleFromQueryWithSubQueryParamsTest = AssertTrue<AssertEqual<MultipleFromQueryWithSubQueryParams, MultipleFromQueryWithSubQueryParams>>



/**
 * 
 */
const SubQueryJoin = customersTable
    .join('INNER', () => employeesTable, cols => cols.employees.id.eq(cols.customers.id))
    .join('LEFT', () => subQuery, cols => cols.sq1.id.eq(cols.customers.id))
    .select(cols => [cols.sq1.id])
    .exec;


/**
 * 
 */
const SubQuerySelect = customersTable
    .select((tables) => [
        tables.customers.id,
        ordersTable
            .select((tabInner, { sum }) => [
                sum(tabInner.orders.customerId)
            ])
            .where((tabInner) => tables.customers.id.eq(tabInner.orders.customerId))
            .as("sqSelect")
    ])
    .exec