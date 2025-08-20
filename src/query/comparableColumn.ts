import { DbType, PgDbType } from "../db.js";
import type Column from "../table/column.js";
import type { TableSpecsType } from "../table/types/tableSpecs.js";
import type { GetColumnType } from "../table/types/utils.js";
import { ComparisonOperation } from "./comparisonOperation.js";

class ComparableColumn<
    TDbType extends DbType,
    TColumnType extends GetColumnType<TDbType>,
    TColumnName extends string,
    TableSpecs extends TableSpecsType
> {
    column: Column<TDbType, TColumnType, TColumnName, TableSpecs>;

    constructor(column: Column<TDbType, TColumnType, TColumnName, TableSpecs>) {
        this.column = column;
    }

    equals(value: any) {
        return new ComparisonOperation();
    }

    between(leftValue: any, rightValue: any) {

    }
}

export {
    ComparableColumn
}