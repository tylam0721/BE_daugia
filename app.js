let WSServer = require('ws').Server;
let server = require('http').createServer();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const auth = require("./middlewares/auth");

require("express-async-errors");


app.use(cors());
app.use(express.static("public/uploads"));

app.use(morgan("dev"));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/api/auth",require("./routes/auth.route"));

app.use("/api/user",require("./routes/user.router"));

app.use("/api/register", require("./routes/register.route"));

app.use("/api/category",require("./routes/category.route"));

app.use("/api/watchlist",require("./routes/watchList.route"));

// app.use('/api/login', auth, require('./routes/login.route'));

app.use("/api/otp", require("./routes/otp.route"));

app.use("/api/role",require("./routes/role.router"));

app.use("/api/product",require("./routes/product.route"));

app.use("/api/admin",require("./routes/admin.route"));

app.use("/api/action",require("./routes/action.route"));

app.use(function (req, res, next) {
  res.status(404).json({
    message: "endpoint not found",
  });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: "server failure",
  });
});

let wss;
var lookup = {};
if(!wss)
{
    wss = new WSServer({

        server: server
      });
      
      // Also mount the app here
      server.on('request', app);
      
      wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
          console.log(`received: ${message}`);
          ws.id = JSON.parse(message).id;
          lookup[ws.id] = ws;
        });
      });
}

server.listen(PORT, function() {
  console.log(`ws://server listening on ${PORT}`);
});

global.broadcastAll = function (msg){
  wss.clients.forEach(function each(client) {
    client.send(msg);
 });
}

global.broadcastSingle = function (id,msg){
  lookup[id].send(msg);
}

/*app.listen(PORT, function () {
  console.log(`App express at http://localhost:${PORT}`);
});

require('./ws');*/

module.exports = app;