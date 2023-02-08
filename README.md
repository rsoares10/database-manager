# Database Simulator

Database simulator written in JavaScript. The goal is to provide a simulation that emulates database interactions using SQL queries.

# Getting Started

## The DataBase Object

This object provides methods for creating tables, query data, inserting and deleting rows.

## Database.execute()

Use the `execute()` method to safely pass in SQL commands to be executed over the database. The internal methods for managing the database are implemented within the `Database` object.

```javascript
database.execute("CREATE TABLE author (id NUMBER, name STRING, age NUMBER, city STRING, state STRING, country STRING)");
```

## Async Behavior

The simulation is based on asynchronous behavior, like in real databases. The latency for queries can be adjusted in the `execute` method of the `Database` object. The default latency is 1000ms (1s).

## DatabaseError

Wrap SQL queries in try/catch blocks to handle any issues. If a query fails, a `DatabaseError` will be provided in the catch block. Retrieve the error message through the `DatabaseError.message` field.

```javascript
export class DatabaseError {
    constructor(statement, message) {
        this.statement = statement;
        this.message = message;
    }
}
```

## SQL Parser

Every query is parsed using regular expressions. New query commands can be added by extending or adding new RegExps in the `Parser` class.

```javascript
export class Parser {
    constructor() {
        this.commands = new Map();
        this.commands.set("createTable", /CREATE TABLE ([a-z]+)\s+\((.+)\)/);
        this.commands.set("insert", /INSERT INTO ([a-z]+)\s+\((.+)\)\s+VALUES\s+\((.+)\)/);
        this.commands.set("select", /SELECT (.+)\s+FROM\s+([a-z]+)\s+(?:WHERE\s+(.+))?/);
        this.commands.set("delete", /DELETE FROM ([a-z]+)\s+(?:WHERE\s+(.+))?/);
    }
    parse(statement) {
        for (let [command, regexp] of this.commands) {
            const parsedStatement = statement.match(regexp);
            if (parsedStatement) {
                return {
                    command,
                    parsedStatement,
                };
            }
        }
    }
}
```

## Usage Example

It's easy to use the database simulator since the project makes use of OOP. Simply instantiate the `Database` object and start issuing SQL commands. Wrap the query block in a try/catch block to handle any syntax errors.

```javascript
const database = new Database(); // Get a database instance
(async function () {
    try {
        await Promise.all([
            // Perform a block of SQL commands
            database.execute("CREATE TABLE author (id NUMBER, name STRING, age NUMBER, city STRING, state STRING, country STRING)"),
            database.execute("INSERT INTO author (id, name, age) VALUES (1, 'Douglas Crockford', 62)"),
            database.execute("INSERT INTO author (id, name, age) VALUES (2, 'Linus Torvalds', 47)"),
            database.execute("INSERT INTO author (id, name, age) VALUES (3, 'Martin Fowler', 54)"),
            database.execute("INSERT INTO author (id, name, age) VALUES (4, 'Alan Kay', 60)"),
            database.execute("INSERT INTO author (id, name, age) VALUES (5, 'James Gosling', 58)"),
            database.execute("INSERT INTO author (id, name, age) VALUES (6, 'Guido van Rossum', 55)"),
            database.execute("DELETE FROM author WHERE id = 2"),
        ]);
        const result = await database.execute("SELECT name, age FROM author"); // Query some data right after
        console.log(JSON.stringify(result, undefined, 2)); // Console the queried data
    } catch (e) {
        console.log(e.message);
    }
})();
```

### Output

```console
[
  {
    "name": "Douglas Crockford",
    "age": "62"
  },
  {
    "name": "Martin Fowler",
    "age": "54"
  },
  {
    "name": "Alan Kay",
    "age": "60"
  },
  {
    "name": "James Gosling",
    "age": "58"
  },
  {
    "name": "Guido van Rossum",
    "age": "55"
  }
]
```

## Contribute

If you'd like to contribute to the project, feel free to fork the repository and make a pull request.

## License

This project is licensed under the MIT license.
