#!/usr/bin/env -S deno run --allow-read
import { fromFileUrl } from "$std/path/mod.ts";
import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

const db = new DB(fromFileUrl(new URL("../static/test.db", import.meta.url)), {
  mode: "read",
});
const count = db.query("SELECT count(id) FROM jokes;")[0][0] as number;
const randomIndex = Math.floor(Math.random() * count);
const body = db.query(
  `SELECT joke FROM jokes WHERE id == ${randomIndex};`,
)[0][0] as string;
console.log(body);
db.close();
