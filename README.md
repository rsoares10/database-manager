# Database Manager

A simple database manager simulator written in JavaScript. The goal is to provide a simulation that emulates database interactions using SQL queries.

## The DataBase Object

This object provides methods for creating tables, query data, inserting and deleting rows.

## Database.execute()

Although the Database object has internally implemented methods for managing the database, to properly execute SQL commands use the execute() method. It's an API through which you can safely pass in sQL commands to be executed over the database.

```javascript
database.execute("create table author (id number, name string, age number, city string, state string, country string)"),
```

## Async Behavior

The simulation is based on asynchronous behavior, just like it would in real databases. The query latency can be adjusted on the execute method of Database object. The default latency is 1000ms (1s).

## DatabaseError

Consider wrapping the sQL queries inside try/catch blocks. To help error handling possible issues the catch block wil provide a DatabaseError in case of query failure. The error message can be retrieved through the DatabaseError.message field.

```javascript
export class DatabaseError {
    constructor(statement, message) {
        this.statement = statement;
        this.message = message;
    }
}
```

## SQL Parser

Every query is parsed using regular expressions. The way to add new query commands depends on extending or adding new RegExps.

```javascript
export class Parser {
    constructor() {
        this.commands = new Map();
        this.commands.set("createTable", /create table ([a-z]+) \((.+)\)/);
        this.commands.set("insert", /insert into ([a-z]+) \((.+)\) values \((.+)\)/);
        this.commands.set("select", /select (.+) from ([a-z]+)(?: where (.+))?/);
        this.commands.set("delete", /delete from ([a-z]+)(?: where (.+))?/);
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

Since the goal was to use the most of OOP, it's quite easy to use the database simulator. Only intantiate the Database object and start issuing SQL commands to the database! But careful when passing in syntaticaly bad queries. A nice approach is to wrap the query block into a try/atch block.

```javascript
const database = new Database(); // Get a database instance
(async function () {
    try {
        await Promise.all([
            // Perform a block of SQL commands
            database.execute("create table author (id number, name string, age number, city string, state string, country string)"),
            database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)"),
            database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)"),
            database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)"),
            database.execute("insert into author (id, name, age) values (4, Alan Kay, 60)"),
            database.execute("insert into author (id, name, age) values (5, James Gosling, 58)"),
            database.execute("insert into author (id, name, age) values (6, Guido van Rossum, 55)"),
            database.execute("delete from author where id = 2"),
        ]);
        const result = await database.execute("select name, age from author"); // Query some data right after
        console.log(JSON.stringify(result, undefined, 2)); // Console the queried data
    } catch (e) {
        console.log(e.message);
    }
})();
```

## Output

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

Since it's a simple project, contribute by opening pull requests to the develop branch. As soon as the changes reaches a stable state we merge them into the master branch.

### Contact

-   LinkedIn - linkedin.com/in/rsoares10/
