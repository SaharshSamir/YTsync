var express = require("express");
var app = express();
var port = process.env.PORT || 8080;
var socket = require("socket.io");

var server = app.listen(port, function () {
  console.log(`listening on port ${port}`);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname));

var io = socket(server);

var count = 0;

io.on("connection", function (socket) {
  console.log("Connection made.." + count);

  socket.on("clientStateEvent", function (data) {
    io.sockets.emit("serverStateEvent", data);
  });

  socket.on("clientLineEvent", function (data) {
    io.sockets.emit("serverLineEvent", data);
  });

  socket.on("clientEvent", function (data) {
    io.sockets.emit("ServerEvent", { data });
  });

  var clientIds = [];
  socket.on("clientPlayerConnected", async () => {
    await io.sockets.clients((err, clients) => {
      console.log(clients);
      clientIds = clients;
    });
    io.sockets.emit("serverPlayerCount", clientIds.length);
  });

  socket.on("clientMyVideo", (data) => {
    io.sockets.emit("serverMyVideo", data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    clientIds.forEach(function reduce(val, i, arr) {
      if (val == socket.id) arr.splice(i, 1);
    });
    console.log(clientIds);
    io.sockets.emit("serverPlayerCount", clientIds.length);
  });
});

io.on("disconnect", function (socket) {
  console.log("disconnectd");
  c;
});
