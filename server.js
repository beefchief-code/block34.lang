const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/employees", require("./api/employees"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
//404
app.use((req, res, next) => {
  next({ status: 404, message: "employee not found" });
});

//other error

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "server error");
});

app.listen(PORT, () => {
  `Listening on port ${PORT}...`;
});
