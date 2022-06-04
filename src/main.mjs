import { Database } from "./database.mjs";

const database = new Database();
(async function () {
    try {
        await Promise.all([
            database.execute("create table author (id number, name string, age number, city string, state string, country string)"),
            database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)"),
            database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)"),
            database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)"),
            database.execute("insert into author (id, name, age) values (4, Alan Kay, 60)"),
            database.execute("insert into author (id, name, age) values (5, James Gosling, 58)"),
            database.execute("insert into author (id, name, age) values (6, Guido van Rossum, 55)"),
            database.execute("delete from author where id = 2"),
        ]);
        const result = await database.execute("select name, age from author");
        console.log(JSON.stringify(result, undefined, 2));
    } catch (e) {
        console.log(e.message);
    }
})();
