import { GAME_ROOMS_STORE, LOBBY_INSTANCE_STORE } from "./constants"
import AppSettings from "./models/AppSettings"
import GameRoomInstance from "./models/GameRoomInstance"
import LobbyInstance from "./models/LobbyInstance"

export async function onMongoDBConnected(app) {

  // const ticketPurchase = {
  //  ticketedEvent: '63af7a7e2196ea6520e100b7',
  //  user: '62143b5618ac51461e5ecf6c',
  //  lobbyInstance: '63af254fe01d446c03c80f56',
  //  ticketId: 'genadmin',
  //  dateId: 'a9f14b3e-90d3-423d-a3bf-b0682960ffc0'
  // }
  
  // await TicketPurchase.create(ticketPurchase)

  const appSettings = await AppSettings.findOne()
  if(!appSettings) {
    await AppSettings.create({})
  }

  let lobbyInstances = await LobbyInstance.find().populate('invitedUsers gameRoomInstances')
  
  if(lobbyInstances) {
    lobbyInstances =  lobbyInstances.map((lob) => {
      const lobbyInstance = lob.toJSON()
      return {
        ...lobbyInstance,
        messages: [],
        usersInLine: [],
        members: lobbyInstance.invitedUsers.map((user) => {
          return {
            email: user.email,
            userMongoId: user.id,
            username: user.username,
            role: user.role,
            inTransitionView: false,
            joined: false
          }
        }),
      }
    })

    app.set(LOBBY_INSTANCE_STORE, lobbyInstances);  
  } else {
    app.set(LOBBY_INSTANCE_STORE, []);  
  }

  let gameRoomInstances = await GameRoomInstance.find().populate('invitedUsers').populate()

  if(gameRoomInstances) {
    gameRoomInstances =  gameRoomInstances.map((gri) => {
      const gameRoomInstance = gri.toJSON()
      return {
        ...gameRoomInstance,
        gameStatus: 'PLAY_STATE',
        messages: [],
        isPoweredOn: true,
        resetDate: Date.now(),
        members: gameRoomInstance.invitedUsers.map((user) => {
          return {
            email: user.email,
            userMongoId: user.id,
            username: user.username,
            loadedGameMongoId: null,
            role: user.role,
            joined: false
          }
        }),
      }
    })
    

    app.set(GAME_ROOMS_STORE, gameRoomInstances);  
  } else {
    app.set(GAME_ROOMS_STORE, []);  

  }
}