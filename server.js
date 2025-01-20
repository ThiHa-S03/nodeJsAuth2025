require("dotenv").config();

const connectToDb = require("./database/db");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");

connectToDb();

const express = require("express");
const app = express();
const authRoute = require("./routes/auth-routes");
const port = process.env.PORT;
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is now listening at port ${port}`);
});
