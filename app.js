let WSServer = require('ws').Server;
const ws = require('ws');
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

app.use("/api/auth", require("./routes/auth.route"));

app.use("/api/user", require("./routes/user.router"));

app.use("/api/register", require("./routes/register.router"));

app.use("/api/category", require("./routes/category.route"));

// app.use('/api/login', auth, require('./routes/login.route'));

app.use("/api/otp", require("./routes/otp.route"));

app.use("/api/role", require("./routes/role.router"));

app.use("/api/product", require("./routes/product.route"));

app.use("/api/admin", require("./routes/admin.route"));

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
        });
      });
}

server.listen(PORT, function() {
  console.log(`ws://server listening on ${PORT}`);
});

global.broadcastAll = function (msg){
  for( c of wss.clients){
    if(c.readyState === ws.OPEN)
    {
      c.send(msg);
    }
  }
}

/*app.listen(PORT, function () {
  console.log(`App express at http://localhost:${PORT}`);
});

require('./ws');*/

module.exports = {
  app: app,
}