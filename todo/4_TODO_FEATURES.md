--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

INSTRUCTIONS
------------------
  Select Whose View you are Cobrowsing for each step. Possibly this works for LOBBY TOO!!! You dont have to CHOOSE ROLE :)
  The effect is the effect, no role
----

IMPLEMENT THESE EFFECTS
  Pause Game. Unpause Game
  Also transform while touching 
    auto generate zones for this effect

---------------

CLEAN UP

if the host is not online fuck the whole thing. It should maybe be a route for this reason so we can reject it. Also We need a warning

Spawning not so good right now?? the delay seems to just straight up not be considered into spawning. I already broke my browser trying to do it. Test out delay and also maybe put a hard limit

Cobrowsing initialization of interface Ids is not so good right now...?

I think that the reregistration of relations is causing a problem with collisions.... cuz it lets you slip through them.... Need to figure that out... Maybe DONT reregister collisions at the same time as registering relations

Open Create Entity Model is a little messy. Should it accept an entity optonally? Or like a seperate action for that? Dont pass in textureTint the way I was doing it. Pass that in... via the action

I have to deal with game power on / power off

across lobby problems. Two game instances were getting mixed up. Do I have the same problem I had with lobbys before with game instances?? sockets listening to game instances even tho they are in anotehr lobby?

---
