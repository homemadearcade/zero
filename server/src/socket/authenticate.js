import { GAME_ROOMS_STORE, LOBBY_INSTANCE_STORE, ON_AUTHENTICATE_SOCKET_FAIL, ON_AUTHENTICATE_SOCKET_SUCCESS, ON_GAME_ROOM_INSTANCE_UPDATE, ON_LOBBY_INSTANCE_UPDATE, SOCKET_SESSIONS_STORE } from "../constants";
import User from "../models/User";
import jsonwebtoken from 'jsonwebtoken';

export const onSocketAuthenticate = (io, socket, app) => async ({token}) => {
  if (token) {
    const isProduction = process.env.NODE_ENV === 'production';
    const secretOrKey = isProduction ? process.env.JWT_SECRET_PROD : process.env.JWT_SECRET_DEV;

    const decoded = jsonwebtoken.verify(token, secretOrKey)
    const email = decoded.email
    const user = await User.findOne({ email: email.trim() });

    if (user) {
      socket.user = {
        email: user.email,
        userMongoId: user.id,
        username: user.username,
      }

      // connected == 

      const lobbyInstances = app.get(LOBBY_INSTANCE_STORE)
      lobbyInstances?.forEach((lobbyInstance) => {
        lobbyInstance.members.forEach((member) => {
          if(member.userMongoId === socket.user.userMongoId) {
            lobbyInstance.messages.push({
              user: {
                userMongoId: member.userMongoId,
                username: member.username
              },
              message: 'has connected',
              automated: true
            })
            io.to(lobbyInstance.id).emit(ON_LOBBY_INSTANCE_UPDATE, {lobbyInstance});
          }
        })
      })

      const gameRoomInstances = app.get(GAME_ROOMS_STORE)
      gameRoomInstances?.forEach((gameRoomInstance) => {
        gameRoomInstance.members.forEach((member) => {
          if(member.userMongoId === socket.user.userMongoId) {
            gameRoomInstance.messages.push({
              user: {
                userMongoId: member.userMongoId,
                username: member.username
              },
              message: 'has connected',
              automated: true
            })

            io.to(gameRoomInstance.id).emit(ON_GAME_ROOM_INSTANCE_UPDATE, {gameRoomInstance});
          }
        })
      })

      const socketSessions = app.get(SOCKET_SESSIONS_STORE)
      socket.emit(ON_AUTHENTICATE_SOCKET_SUCCESS)
      socketSessions.saveSession(user.id, socket);

    } else {
      socket.emit(ON_AUTHENTICATE_SOCKET_FAIL, { error: 'no such user'})
    }
  } else {
    socket.emit(ON_AUTHENTICATE_SOCKET_FAIL, { error: 'no token for socket'})
  }
}
