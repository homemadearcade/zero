ENTITY MEMBERS
  Sprite
  Movement
  Collider
  Collisions Response

  Projectiles
  Camera
  Interact Area
  Controls

  Editor

---

Everything is the same class
Camera, Controls are all on the class object, not based on the hero object

Front end fills in the blanks of every class, object, brush, stage, and player based on the default model. It also makes a brush for every class id!

The back end only stores what’s different than the default model and will delete any null key -> value pairs given to it

Never send an update with more data than you need! A deep merge takes place on the back end

GAME MODEL

Object ( Game Object )
Class
Brush
Stage

GAME INSTANCE

Object Instances
Projectile Instances
Spawned Instances
Player
Stage
Layers
Collision Grid
---

Default Class, Default Object get placed onto all classes and instance objects when loading the game model

Default Game Model gets placed onto the game model when loading up, it has a default stage on it

Default stage gets put on the create stage flow

Default relation gets placed onto relation ( in create relation menu ) data when resetting it

----

Order of EFFECTS are

IMMEDIATELY
  Teleport or Spawn ( no guaranteed order )
  Collide

AFTER PACKAGE UPDATE
  Destroy
  Reclass

---

Current Stage is controlled by UI, by one effect, and when cobrowsing. Its the local users choice and experience when not cobrowsing. When cobrowsing it is automatically updated to where the game hosts player is 

Current Game State is controlled by cobrowsing. Its a shared experience. Perhaps it should be on the lobby?. Its not on the lobby so it can also be used in single player as well

Player is controlled by the game host and broadcasts to all clients from the host. It also updates redux when the current cobrowsing player state is different than the redux state

--

Phaser keeps spawned object in some sort of memory pool between 'reloading' the scene. I tested via profiler. Even if you destroy all objects, phaser still is slower next time you boot. You have to turn game off and turn it on again.


--

SECTIONS
Admin
Marketing
Creator
Game
Lobby
Layout
Ticketing
Pages
ui
hoc
constants
state

-----

- for continuing words
_ for seperating words

---

UPDATE for changes that were made remotely, not by you

CHANGE for actions that YOU made that will happen occasionally

SET for actions that will likely/ideally happen once

TOGGLE 

EDIT

honestly i dont know what any of these mean...

--

remove for hidding objects from UI, 
delete for actuallt removing from atlasDB


---

You only leave the users array of a lobby or game session when you join a different lobby or game session


---

1. Lobby is joined
2. Host creates a game session
3. Host sets a game instance with a game instance id, and a game session id. Host gives the lobby the game session id
4. User in lobby wants to join this game session, they ask the game host to join
5. Game host responds back to lobby user with { gameInstanceId, playerId, initial gameData }
6. User in lobby becomes a game client, and begins recieving updates
7. Any user at any time can suggest a game state change
8. All users in the session recieve this 
