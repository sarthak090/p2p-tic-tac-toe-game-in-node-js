var socket = io.connect("http://localhost:3000");
var count = 0;
var trackRef = [];
var lastMove = [];
var playerDetails;
const notification = document.querySelector(".notf");

function flashMessage(msg, time) {
  setTimeout((e) => {
    notification.innerHTML = null;
    notification.classList.remove(".alert");
    notification.classList.remove("alert-success");

    return notification.textContent;
  }, time);
}

const addActivePlayerToDom = (playerName) => {
  notification.innerHTML += playerName;
  notification.innerHTML += `<span class="badge badge-success ml-3">Active</span>`;
  notification.classList.add("alert");
  notification.classList.add("alert-success");
};

const removePlayerFromDom = () => {
  notification.innerHTML = "";
  notification.classList.remove("alert");
  notification.classList.remove("alert-success");
};
function firstMove(arr) {
  return arr[0].player;
}
function stop(player) {
  if (count >= 1) {
    let lastplayermove = trackRef.slice(-1)[0].player;

    player !== lastplayermove ? true : false;
  }
}

(function () {
  socket.on("firstPlayer", (data) => {
    messageServer(data.to);
  });
})();

function nextMove(square) {
  const playerName = deparam(window.location.search).name;
  let playerObject = {
    player: playerName,
    url: `http://localhost:3000/${window.location.search}`,
  };

  if (stop(playerName) || count == 0) {
    if (document.winner != null) {
      setMessage(document.winner + " Already Won the Game!");
    } else if (square.textContent == "") {
      square.textContent = document.turn;
      socket.emit("Player1", {
        id: square.id,
        turn: document.turn,
        trackRef: window.location.href,
        count,
      });
      switchTurn();
    } else {
      setMessage("That Square is Already Used.");
    }
  }
  trackRef.push(playerObject);
  firstMove(trackRef);
  count++;
}

function nextMoveRemotely(id, referer) {
  let passById = document.getElementById(id);
  trackRef.push({ player: deparam(referer).name, url: referer });
  firstMove(trackRef);

  if (document.winner != null) {
    setMessage(document.winner + " Already Won the Game!");
  } else if (passById.textContent == "") {
    passById.innerText = document.turn;

    switchTurn();
  } else {
    setMessage("That Square is Already Used.");
  }
}

/**
 * Socket methods goes here
 */
socket.on("serve", (data) => console.log(`serve`, data));
socket.on("newUser", (data) => {
  //ADD USER TO HTML DOM
  playerDetails = data;
  addActivePlayerToDom(data.playerName);

  // flashMessage(data.playerName, 2500);
});
socket.on("player1Move", function (msg) {
  count = msg.count;
  nextMoveRemotely(msg.id, msg.referer);
});

document.querySelector("button").addEventListener("click", (e) => {
  socket.emit("restartGame");
});

socket.on("rsGame", (e) => {
  startGame();
});
socket.on("offline", (d) => {
  removePlayerFromDom();
});

socket.on("connect", function () {
  const param = deparam(window.location.search);
  socket.emit("join", param, (err) => {});
});
