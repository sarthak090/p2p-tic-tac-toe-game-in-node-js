const expres = require("express");
const app = expres();
const http = require("http").Server(app);
const { joinPlayer, playerByRoom, removePlayer } = require("./utils/players");
io = require("socket.io")(http);

app.use(expres.static(__dirname + "/public"));

io.on("connection", (socket) => {
  //console.log(socket.handshake.headers.referer)
  const {
    handshake: {
      headers: { referer },
    },
  } = socket;

  socket.on("join", (param, cb) => {
    const { name, room } = param;
    const player = joinPlayer(socket.id, name, room);

    socket.join(player.room);

    socket.emit(
      "firstPlayer",
      generateMessage("Admin", "Welcome to Tic tac toe")
    );

    socket.to(room).emit("serve", playerByRoom(room));
    socket.broadcast.to(room).emit("newUser", player);

    socket.on("Player1", (msg) => {
      msg.referer = referer;

      socket.broadcast.to(room).emit("player1Move", msg);
    });

    socket.on("restartGame", (msg) => {
      socket.broadcast.to(room).emit("rsGame");
    });
    socket.on("disconnect", (r) => {
      console.log(r);
      socket.broadcast.to(room).emit("offline", player);
    });
  });
});

const generateMessage = (from, to) => {
  return {
    from,
    to,
  };
};

http.listen(3000, () => console.log("listening on *:3000"));
