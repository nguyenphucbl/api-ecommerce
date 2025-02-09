const app = require("./src/app");
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server"));
});
