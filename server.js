const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect to mongo
connectDB();

//set ejs view engine
app.set("view engine", "ejs"); //ignore this for now i only want to setup a frontend so we could populate the db
app.use(express.static("./public")); //and this

//Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.render("populate");
});

//Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/admins", require("./routes/admins"));

const PORT = 5500 || process.env.PORT;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
