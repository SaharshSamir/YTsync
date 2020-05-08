//Make connection
var socket = io.connect(`http://localhost:8080`);
var people = $("#count");
var playButton = $("#playButton");
var pauseButton = $("#pauseButton");
var counter = 0;
var searchBtn = $("#btn");

//Emit events
playButton.click(function (event) {
  console.log("play");
  socket.emit("clientStateEvent", {
    state: "play",
    time: player.getCurrentTime(),
  });
});

pauseButton.click(function (event) {
  console.log("pause");
  socket.emit("clientStateEvent", {
    state: "pause",
    time: player.getCurrentTime(),
  });
});

//Emits event that says a player has finished loading
function playerConnected() {
  socket.emit("clientPlayerConnected");
}

//Listen to events
socket.on("serverStateEvent", function (data) {
  if (data.state == "pause") {
    player.pauseVideo();
  }
  if (data.state == "play") {
    player.playVideo();
  }
});

function newPlayer() {
  people.innerHTML = counter;
}

//Server gives us new count of players
socket.on("serverPlayerCount", function (count) {
  console.log("count is " + count);
  counter = count;
});

function timelineLoop() {
  var line = $("#line");
  var box = $("#box");
  var videoLength = player.getDuration();

  //Emit events
  line.click(function (event) {
    //send seek request
    var divOffset = $(this).offset();
    var seekTo = ((event.pageX - divOffset.left) / 600) * videoLength;
    // console.log(divOffset);
    socket.emit("clientLineEvent", { time: seekTo });
  });

  //Listen to events
  socket.on("serverLineEvent", function (data) {
    console.log(data.time);
    player.seekTo(data.time);
  });

  setInterval(function () {
    if (timeline == null || player == null) {
      return;
    }
    var fraction = (player.getCurrentTime() / player.getDuration()) * 100;
    box.css({ left: fraction + "%" });
    socket.emit("clientEvent", { currentTime: player.getCurrentTime() });

    socket.on("serverEvent", function (data) {
      player.seekTo(data.currentTime);
    });
    // socket.emit('clientSetState', {state: player.getPlayerState})
  }, 200);
}

var vidId;

//Set the video
function myVideo() {
  searchBtn.click(function () {
    var link;
    var input = document.getElementById("input").value;
    link = new URL(input);
    vidId = link.search.split("=")[1];
    socket.emit("clientMyVideo", { id: vidId });
  });

  socket.on("serverMyVideo", (data) => {
    player.cueVideoById(data.id);
  });
}

//Works
// function myVideo(){
//     searchBtn.click(function () {
//         var link;
//         var input = document.getElementById('input').value;
//         link = new URL(input);
//         vidId = link.search.split('=')[1];
//         player.loadVideoById(vidId);
//     })
// }
