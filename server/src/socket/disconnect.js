import { GAME_ROOMS_STORE, LOBBY_INSTANCE_STORE, ON_GAME_ROOM_INSTANCE_UPDATE, ON_LOBBY_INSTANCE_UPDATE, ON_SOCKET_DISCONNECT } from "../constants"

export const onSocketDisconnect = (io, socket, app) => (reason) => {
  if(socket.user?.userMongoId) {

    // connected ==

    const lobbyInstances = app.get(LOBBY_INSTANCE_STORE)
    lobbyInstances.forEach((lobbyInstance) => {
      lobbyInstance.members.forEach((member) => {
        if(member.userMongoId === socket.user.userMongoId) {
          socket.emit(ON_SOCKET_DISCONNECT)
          lobbyInstance.messages.push({
            user: {
              userMongoId: member.userMongoId,
              username: member.username
            },
            message: 'has disconnected',
            automated: true
          })
          io.to(lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance});
        }
      })
    })
    
    const gameRoomInstances = app.get(GAME_ROOMS_STORE)
    gameRoomInstances.forEach((gameRoomInstance) => {
      gameRoomInstance.members.forEach((member) => {
        if(member.userMongoId === socket.user.userMongoId) {
          // if(reason === 'ping timeout') user.loadedGameMongoId = null
          socket.emit(ON_SOCKET_DISCONNECT)
          gameRoomInstance.messages.push({
            user: {
              userMongoId: member.userMongoId,
              username: member.username
            },
            message: 'has disconnected',
            automated: true
          })
          io.to(gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance});
        }
      })
    })
  }
}
