import User from "../models/User";
import ArcadeGame from "../models/ArcadeGame";

export async function updateUserAppLocation({ authenticatedUser, userMongoId, experienceInstanceId, lobbyInstanceMongoId, gameRoomInstanceMongoId }) {
  if(authenticatedUser.id != userMongoId) return false

  const appLocation = {}
    
  if(lobbyInstanceMongoId != undefined) {
    console.log('updating lobby instance mongo id')
    appLocation.lobbyInstanceMongoId = lobbyInstanceMongoId
    return true
  }
  
  if(gameRoomInstanceMongoId != undefined) {
    console.log('updating game room instance mongo id')
    appLocation.gameRoomInstanceMongoId = gameRoomInstanceMongoId
    return false
  }

  if(experienceInstanceId != undefined) {
    console.log('updating experience instance id')
    appLocation.experienceInstanceId = experienceInstanceId
    return false
  }

  if(Object.keys(appLocation).length) {
     await User.findByIdAndUpdate(userMongoId, {...authenticatedUser.appLocation, ...appLocation})
  }
}


export async function updateArcadeGameAppLocation({ arcadeGame, experienceInstanceId, gameRoomInstanceMongoId }) {
  // if(arcadeGame.id != userMongoId) return false

  const appLocation = {}
  
  if(gameRoomInstanceMongoId != undefined) {
    console.log('updating arcadegame - game room instance mongo id')
    appLocation.gameRoomInstanceMongoId = gameRoomInstanceMongoId
    return false
  }

  if(experienceInstanceId != undefined) {
    console.log('updating arcadegame - experience instance id')
    appLocation.experienceInstanceId = experienceInstanceId
    return false
  }

  if(Object.keys(appLocation).length) {
     await ArcadeGame.findByIdAndUpdate(userMongoId, {...arcadeGame.appLocation, ...appLocation})
  }
}