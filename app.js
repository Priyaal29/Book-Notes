import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book",
  password: "",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let item = [];

//Displaying Contents OF SQL table
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
    item = result.rows;
    res.render("index.ejs", {
      listItems: item,
    });
  } catch (error) {
    console.log(error);
  }
});

// sort books by rating
app.post("/rating", (req, res) => {
  res.redirect("/");
});
//sort by when the book was added
app.post("/sort", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books ORDER BY id DESC");
    item = result.rows;
    res.render("index.ejs", {
      listItems: item,
    });
  } catch (error) {
    console.log(error);
  }
});

//adding new book
app.post("/new", async (req, res) => {
  res.render("add.ejs");
});

app.post("/add", async (req, res) => {
  const title = req.body["title"];
  const notes = req.body["notes"];
  const rating = req.body.rating;
  const isbn = req.body.isbn;

  try {
    const result = await db.query(
      "INSERT INTO books (title,notes,rating,isbn) VALUES($1,$2,$3,$4)RETURNING *;",
      [title, notes, rating, isbn]
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

//delete books from SQL table
app.post("/delete", async (req, res) => {
  const remove = req.body.deleteItemId;

  try {
    const result = await db.query(
      "DELETE FROM books WHERE id=$1 RETURNING *;",
      [remove]
    );
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
