const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect to mongo
connectDB();

//Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.json({ msg: "Welcome" });
});

//Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/admins", require("./routes/admins"));

const PORT = 5500 || process.env.PORT;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
