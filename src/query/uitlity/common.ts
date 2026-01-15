import type { DbValueTypes } from "../../table/column.js";
import { queryBuilderContextFactory, type IComparable, type QueryBuilderContext } from "../_interfaces/IComparable.js";

export function convertArgsToQueryString(args: (DbValueTypes | null | IComparable<any, any, any, any, any, any>)[], context?: QueryBuilderContext) {
    if (context === undefined) {
        context = queryBuilderContextFactory();
    }

    let argQueries = [];
    for (const arg of args) {
        if (typeof arg === 'object' && arg !== null && 'buildSQL' in arg) {
            argQueries.push(arg.buildSQL(context).query);
        } else if (arg === null) {
            argQueries.push('NULL');
        } else if (typeof arg === "string") {
            argQueries.push(`'${arg}'`);
        } else if (typeof arg === 'boolean') {
            argQueries.push(String(arg).toUpperCase());
        } else if (arg instanceof Buffer) {
            argQueries.push(`${arg.toString('utf-8')}`);
        } else if (typeof arg === 'object') {
            argQueries.push(JSON.stringify(arg));
        } else {
            argQueries.push(arg.toString());
        }
    }

    return argQueries;
}

export function convertValueToQueryString(value: DbValueTypes | null) {
    if (value === null) {
        return 'NULL';
    } else if (typeof value === "string") {
        return `'${value}'`;
    } else if (typeof value === 'boolean') {
        return String(value).toUpperCase();
    } else if (value instanceof Buffer) {
        return `${value.toString('utf-8')}`;
    } else if (typeof value === 'object') {
        return JSON.stringify(value);
    } else {
        return value.toString();
    }
}
