const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect to mongo
connectDB();

//Middleware
app.use(express.json({ extended: false }));

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("populate");
});

//Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/admins", require("./routes/admins"));

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
