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
  Lifecycle

ATTRIBUTES
Attributes that are initially turned on but can be turned off
Attributes that are initially turned off but can be turned on

EVENT BASED
Actions that start when an event happens and resolve
  1. immediately
  2. when they are 'done'
  3. when another event happens

When we take into acount conditions that read the 'state' of the game, things get much more complex

---

Everything is the same class
Camera, Controls are all on the class object, not based on the hero object
... In the future I want everything to be able to be controlled. We need data for that. 

Front end fills in the blanks of every object and hero based on the default model. The question is - is this on a phaser level? Probably not, its probably on the redux store level

The back end only stores what’s different than the default model and will delete any null key -> value pairs given to it

Never send an update with more data than you need

GAME MODEL

Player
Object ( Game Object )
Class
Brush
World

GAME INSTANCE

Object Instance
Player
Collision Grid

OLD DISCUSSION TOPICS

ARCADE VS MATTER
  - Matter can do rotational collisions. Shit gets hit and spins around and stuff
  - Arcade can NOT rotate
  - Arcade can check easily where a collision occured - upleftrightdown
  - Static objects in matter can only move position, not via velocity or thrust or force
  - Arcade has immovable vs pushable. These are two different concepts

  Have to decide what to do... would suck to have to do two interfaces for everything. Unless we limited it to just what Arcade Physics can do...What can arcade physics do that matter physics toggle that matter physics cant?

  Does having 'path system' do anything? Does that resolve movement?

  What sort of games will come out of Matter JS, what sort of games will come out of Arcade? What are the real design strengths?
  What sort of gameplays? What sort of stories, What sort of world is this?

  POSSIBLE MATTER ADDITIONS

  Set Initial Velocity
  Rope
  'shoot'
  Create Force ( like a bomb type thing )

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

Current Stage is controlled by UI and by one effect. Its the local users choice and experience. It is never automatically updated except by the one effect. Outside of that it is always a choice

Current Game State is controlled by cobrowsing. Its a shared experience. Perhaps it should be on the lobby?. Its not on the lobby so it can also be used in single player

Player is controlled by the game host and broadcasts to all clients from the host. It also updates redux when the current cobrowsing player state is different than the redux state