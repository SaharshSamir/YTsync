//Make connection
var socket = io.connect(`http://localhost:8080`); 

var people = $('#count');
var playButton  = $('#playButton');
var pauseButton = $('#pauseButton');



//Emit events







    //Emit events
    playButton.click(function (event) {
        console.log('play');
        socket.emit('clientStateEvent', {
            state:"play",
            time:player.getCurrentTime()
        })
    })
    
    pauseButton.click(function(event) {
        console.log('pause');
        socket.emit('clientStateEvent', {
            state:"pause",
            time: player.getCurrentTime()
        })
    })

    function playerConnected() {
        socket.emit('clientPlayerConnected');
    }

    //Listen to events
    socket.on('serverStateEvent', function(data) {
        if(data.state == 'pause'){
            player.pauseVideo();
        }
        if(data.state == 'play'){
            player.playVideo();
        }
    })

    socket.on('serverPlayerCount', function(count) {
        people.innerHTML = count;
    }) 





function timelineLoop()
{
  var line = $("#line");
  var box = $("#box");
  var videoLength = player.getDuration();

  //Emit events  
  line.click(function(event) {
    //send seek request
    var divOffset = $(this).offset();
    var seekTo = (event.pageX - divOffset.left)/600*videoLength;
    // console.log(divOffset);
    socket.emit('clientLineEvent', {time: seekTo});
    
  });

  

  //Listen to events
  socket.on('serverLineEvent', function(data) {
    console.log(data.time);
    player.seekTo(data.time, false);
  })

  


  setInterval(function (){
    if (timeline == null || player == null) {
      return;
    } var fraction = (player.getCurrentTime()/player.getDuration())*100;
    box.css({left: fraction + "%"});
    console.log(player.getCurrentTime());

    socket.emit('clientEvent',{currentTime: player.getCurrentTime()});

    socket.on('serverEvent', function(data){
        player.seekTo(data.currentTime);
      })
    // socket.emit('clientSetState', {state: player.getPlayerState})
  }, 200);

}

