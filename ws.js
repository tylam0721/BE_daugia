let {wss} = require('./app')

function broadcastAll(msg){
    for( c of wss.clients){
      if(c.readyState === ws.OPEN)
      {
        c.send(msg);
      }
    }
  }

  module.exports={
      broadcastAll
  };