import { Table } from "./table.js";

type ExtractColumnNames<T extends Table[]> = T[number]['columns'][number]['name'];
type ExtractTableNames<T extends Table[]> = T[number]['name'];

// Create a mapping of table names to their column names
type TableToColumnsMap<T extends Table[]> = {
    [K in T[number]as K['name']]: {
        [C in K['columns'][number]as C['name']]: boolean
    }
};

interface IQuery<TTables extends Table[]> {
select: (cb: (columns: Partial<TableToColumnsMap<TTables>>) => void) => void;}

// *TTables[number]['columns'][number]['name'])

function fromTables<TTables extends Table[]>(...tables: TTables): IQuery<TTables> {
    return {
        select: (cb) => {
        }
    }
}

export {
    fromTables
}

export type {
    ExtractColumnNames
}