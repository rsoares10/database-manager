import { Database } from "./database.mjs";

try {
    const database = new Database();
    database
        .execute("create table author (id number, name string, age number, city string, state string, country string)")
        .then(() => {
            return Promise.all([
                database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)"),
                database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)"),
                database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)"),
                database.execute("select name, age from author where id = 1"),
                database.execute("select name, age from author "),
                database.execute("create table author (id number, name string, age number, city string, state string, country string)"),
                database.execute("insert into author (id, name, age) values (1, Douglas Crockford, 62)"),
                database.execute("insert into author (id, name, age) values (2, Linus Torvalds, 47)"),
                database.execute("insert into author (id, name, age) values (3, Martin Fowler, 54)"),
                database.execute("delete from author where id = 2"),
                database.execute("select name, age from author"),
            ]).then((_) => {
                return console.log(JSON.stringify(database, undefined, 2));
            });
        })
        .catch((err) => {
            console.log(err);
        });
} catch (e) {
    console.log(e.message);
}
