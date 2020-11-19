const express = require('express');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');




var codeToSession = {}; //only for joining lobbies
var SocketToSession ={};

function socketEvents(socket){
    //making session create (player 1)
    socket.on("create-session",(name)=> {
      //create new session and store it to two datastructures
      
      var code = Math.floor(Math.random()*1000000).toString();
      const session = new Session(name,socket,code);

      codeToSession = {...codeToSession, 
                       [code]:session };
        
      SocketToSession = {...SocketToSession,
                        [socket]:session};
      
      
      socket.emit("session-created",name,code);
      socket.on("disconnect", ()=> {
          try{
            SocketToSession[socket].player_two_socket.emit("user-disconnected");
          }
          catch(err){
              ;
          }
          
          delete codeToSession[code];
          delete SocketToSession[socket];     
      });
    });
    //making join session (player 2)
    socket.on("join-session",(code,name)=>{

        //failed session code 
        if(codeToSession[code]===undefined){
            socket.emit("invalid-code");
        }
        else{
            codeToSession[code].JoinSession(name,socket);
            codeToSession[code].Broadcast("valid-code",codeToSession[code].gameState);
            SocketToSession = {...SocketToSession,
            [socket]: codeToSession[code]};

            delete codeToSession[code];
            socket.on("disconnect", ()=> {
                try{
                    SocketToSession[socket].player_one_socket.emit("user-disconnected");

                }
                catch(err){
                    ;
                }
                
                delete SocketToSession[socket];
            })
        }
    })

    //making game logic
    socket.on("player-move", (index,value)=> { 
        SocketToSession[socket].PlayerMove(index,value);
        switch(SocketToSession[socket].checkWinner()){
            case "player_one":
                
                SocketToSession[socket].Broadcast("announcement","player_one");
                break;
            case "player_two":
                
                SocketToSession[socket].Broadcast("announcement","player_two");
                break;
            case "tie":
                
                SocketToSession[socket].Broadcast("announcement","tie");
                break;
            case "ongoing":
                
                break;
            default:
                console.log("no switch cases hit");
        
        }       
        //TODO: check winners before broadcasting
        SocketToSession[socket].Broadcast("update",SocketToSession[socket].gameState);  

    });   
    }
io.on('connection',socketEvents);

    

//initialisng port
const port = process.env.PORT || 8000;

//making logic for production build
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'));
    app.get('*', (req,res)=>{
        res.sendFile(path.join(__dirname,'frontend','build','index.html'));
    });
}

server.listen(port,()=>{
    console.log("server is running",port)
});