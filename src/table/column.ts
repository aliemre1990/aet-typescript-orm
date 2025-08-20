import type { DbType } from "../db.js";
import type { TableSpecsType } from "./types/tableSpecs.js";
import type { GetColumnType } from "./types/utils.js";

class Column<
    TDbType extends DbType,
    TColumnType extends GetColumnType<TDbType>,
    TColumnName extends string,
    TTableSpecs extends TableSpecsType
> {

    tableSpecs?: TTableSpecs;

    constructor(
        public name: TColumnName,
        public type: TColumnType,
        public defaultValue?: string,
        public isNullable: boolean = false
    ) { }

    setTableSpecs(val: TTableSpecs) {
        this.tableSpecs = val;
    }

}

export default Column;