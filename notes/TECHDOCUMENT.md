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

GAME MODEL

Object ( Game Object )
Entity
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

GAME MODEL DDATA

Everything is the same class
Camera, Controls are all on the class object, not based on the hero object

Front end fills in the blanks of every class, object, brush, stage, and player based on the default model. It also makes a brush for every class id!

The back end only stores what’s different than the default model and will delete any null key -> value pairs given to it

Never send an update with more data than you need! A deep merge takes place on the back end


Default Entity, Default Object get placed onto all entityModels and instance entityInstance when loading the game model

Default stage gets put on the create stage flow

Default relation gets placed onto relation ( in create relation menu ) data when resetting it

All entitys and media are in the data model. However a lot of effects, relationships, relation tags are derived from the data model. 

Some entities and some media have reserved ids. These ids are common accross all games. When importing, if theres two objects with the same reserved id, the imported one is not included in the import

effects are derived in a very detailed manner. They are both derived from effects constants and from actions. Once derived they are normally enriched before being displayed

----

PHASER EFFECTS

Order of EFFECTS are

IMMEDIATELY
  Teleport or Spawn ( no guaranteed order )
  Collide

AFTER PACKAGE UPDATE
  Destroy
  Reclass

---
MULTIPLAYER GAME INSTANCE

Current Stage is controlled by UI, by one effect, and when cobrowsing. Its the local users choice and experience when not cobrowsing. When cobrowsing it is automatically updated to where the game hosts player is 

Player is controlled by the game host and broadcasts to all clients from the host. It also updates redux when the current cobrowsing player state is different than the redux state

--
PHASER

Phaser keeps spawned object in some sort of memory pool between 'reloading' the scene. I tested via profiler. Even if you destroy all entityInstance, phaser still is slower next time you boot. You have to turn game off and turn it on again.


-----

CONSTANTS

- for continuing words
_ for seperating words

---

ACTIONS

UPDATE for changes that were made remotely, not by you

CHANGE for actions that YOU made that will happen occasionally

SET for actions that will likely/ideally happen once

TOGGLE 

EDIT

honestly i dont know what any of these mean...

---

Actions 
  starts with the VERB
Interfaces 
  start with the NOUN

--

MONGOOSE 

remove for hidding entityInstance from UI, 
delete for actuallt removing from atlasDB

---

LOBBYS/GAME ROOMS
You only leave the users array of a lobby or game session when you join a different lobby or game session


---

GAME ROOMS

1. Lobby is joined
2. Host creates a game session
3. Host sets a game instance with a game instance id, and a game session id. Host gives the lobby the game session id
4. User in lobby wants to join this game session, they ask the game host to join, they can edit the game regardless, the ( game model )
  The game boots anyways, but it doesnt not listen for uppates, player can edit but cant play or... get updates or anything with a game Instance id, they can update the model tho!
5. Game host responds back to lobby user with { gameInstanceId, playerId, initial gameData }
  Now it listens for updates
6. User begins recieving updates
7. Any user at any time can suggest a game state change
8. All users in the session recieve this 

---

DIALOGS 

ROOT LEVEL
  Sprite Editor
  Metadata
  Cutscene
  Stage
  Relation
  Background Color
  Defaults
SECOND LEVEL
  Entity
  Brush
  My Images


---

An interface type ONLY effects how an object is treated in the interface
Behavior means there is code behind something, and likely a default property set, and then as well an interface to go long with it

--

Sprite comes from a sprite sheet
A texture id is a univeral id applied to an Entity
A canvas image is an aws image that can be drawn on

--