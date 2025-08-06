import { DbType, PgDbType } from "../db.js";
import { PgColumnType } from "../postgresql/dataTypes.js";
import { Column, type GetColumnType, type TableSpecsType } from "../table.js";
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