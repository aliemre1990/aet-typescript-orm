import { DbType, PgDbType } from "../db.js";
import { PgColumnType } from "../postgresql/dataTypes.js";
import { Column } from "../table.js";
import { ComparisonOperation } from "./comparisonOperation.js";

class ComparableColumn<
    TDbType extends DbType,
    TColumnType extends TDbType extends PgDbType ? PgColumnType : string,
    TColumnName extends string
> {
    column: Column<TDbType, TColumnType, TColumnName>;

    constructor(column: Column<TDbType, TColumnType, TColumnName>) {
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