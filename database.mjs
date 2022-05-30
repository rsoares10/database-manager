import { DatabaseError } from "./database-error.mjs";
import { Parser } from "./parser.mjs";
export class Database {
    constructor() {
        this.tables = {};
        this.parser = new Parser();
    }
    createTable(parsedStatement) {
        let [, tableName, columns] = parsedStatement;
        this.tables[tableName] = {
            columns: {},
            data: [],
        };
        columns = columns.split(", ");
        for (let column of columns) {
            const [name, type] = column.trim().split(" ");
            this.tables[tableName].columns[name] = type;
        }
    }
    insert(parsedStatement) {
        let [, tableName, columns, values] = parsedStatement;
        columns = columns.split(", ");
        values = values.split(", ");
        let row = {};
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            const value = values[i];
            row[column] = value;
        }
        this.tables[tableName].data.push(row);
    }
    select(parsedStatement) {
        let [, columns, tableName, whereClause] = parsedStatement;
        let rows = this.tables[tableName].data;
        columns = columns.split(", ");
        if (whereClause) {
            const [columnWhere, valueWhere] = whereClause.split(" = ");
            return rows.filter((row) => row[columnWhere] === valueWhere);
        }
        rows = rows.map((row) => {
            let selectedRow = {};
            columns.forEach((column) => (selectedRow[column] = row[column]));
            return selectedRow;
        });
        return rows;
    }
    delete(parsedStatement) {
        const [, tableName, whereClause] = parsedStatement;
        if (whereClause) {
            const [columnWhere, valueWhere] = whereClause.split(" = ");
            this.tables[tableName].data = this.tables[tableName].data.filter((row) => row[columnWhere] !== valueWhere);
        } else {
            this.tables[tableName].data = [];
        }
    }
    execute(statement) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = this.parser.parse(statement);
                if (result) resolve(this[result.command](result.parsedStatement));
                const message = `Syntax error: ${statement}`;
                reject(new DatabaseError(statement, message));
            }, 1000);
        });
    }
}
