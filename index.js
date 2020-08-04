const http = require("http");
const app = require("./app");

const server = http.createServer(app);

server.listen(process.env.PORT || 4000, () => {
  console.log("Listening to requests");
});