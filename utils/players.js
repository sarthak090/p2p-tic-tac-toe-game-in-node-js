const players = [];

const joinPlayer = (id, playerName, room) => {
  const player = { id, playerName, room };
  players.push(player);
  return player;
};

const removePlayer = (id) => {
  players.filter((player) => player.id == id);
  players.splice(
    players.findIndex(function (i) {
      return i.id === id;
    }),
    1
  );
  return players;
};
const playerByRoom = (room) => {
  return players.filter((player) => player.room === room);
};
module.exports = {
  joinPlayer,
  playerByRoom,
  removePlayer,
};
