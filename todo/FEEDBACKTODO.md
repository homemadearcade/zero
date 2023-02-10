Spawn inside of hero camera effect from the lobby setup flow

Agora User Video, have it load a user and have it like upload it as a profile pic??

Fix how modals work...Youve got ALL THESE MODALS STACKED ON TOP OF EACHOTHER IN game Editor. Sometimes we want to open a modal on top of another, how can we let this happen? We need to be able to open Cutscene maker, and class maker inside of another modal ( mainly from the relations menu )

IF KEY ISSUES PERSIST
set Interval for keyboard capture issue?

BUG - Can an object you DONT collide with allow you to jump again? Any object?

HostCanvas
ClientCanvas
  CodrawingCanvas
  Canvas

game state changing doesnt work
ESCAPE EXPERIENCE KEY - SAFETY KEY

heres how game state will work for now
...

1. Lobby is joined
2. Host creates a game session
3. Host sets a game instance with a game instance id, and a game session id. Host gives the lobby the game session id
4. User in lobby wants to join this game session, they ask the game host to join
5. Game host responds back to lobby user with { gameInstanceId, playerId, initial gameData }
6. User in lobby becomes a game client, and begins recieving updates
7. Any user at any time can suggest a game state change
8. All users in the session recieve this 

GameContext reducer -> PlayerInterfaceReducer

Ok so you have a session on redux, the lobby just assumes u got ur session taken care of, doesnt ask about it. In the future in a multiplayer game, lobby will have to keep track of some things...

or no so....

// set initially
hostUserId
isNetworked
isEdit
gameSessionId

// set each time its powered on
gameInstanceId
gameId

// set based on user action
gameState
isPoweredOn
skipSave

and the way this would work is...
everyone gets an event listener ON_GAME_SESSION_UPDATE
it works the same as ON_GAME_INSTANCE_UPDATE!

youll have a withGameSession thing as well

withMultiPlayerGameSession would mean it needs a lobby id but its lower level than withLobby. It gets the game id and host id from the lobby. Itll like do the whole 8 step process I described above

withGameSession needs a game id, it created a session with that gameId, sets the host id as this user of course, a

and both
it IT SENDS UPDATES OUT ( as any good computer host would ) and then IT RECIEVES THEM BACK AND THATS WHEN IT IMPLEMENETS THEM, the same exact thing as ON_GAME_MODEL_UPDATE, which is the real issue of host vs client right now. This will be a duplicate. This is one of the ONLY things you have to solve when going multiplayer

( which Im now realizing if I just solve interpolation and if I implement webRTC then... ive created the most ultimate light weight metaverse ever )

its blowing me timbers

omg wait

so yeah like actually....You WANT a client to be able to run the game, and in a serverless system you want the host to also be a client basically!! so yeah hrmphty durmpty
its perfect

----

