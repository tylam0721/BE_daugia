let WSServer = require('ws').Server;
let server = require('http').createServer();
let app = require('./app');

const PORT = process.env.PORT || 4000;
// Create web socket server on top of a regular http server
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
  console.log(`http/ws server listening on ${PORT}`);
});


module.exports = {
};