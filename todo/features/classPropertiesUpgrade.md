Try this with lighting
( more than 1 light on a class, you like 'add' it to the class, etc )

Also remember I think this is just that you are adding the idea of STATE to an entity. An entity model becomes less representative of what instance we create. Basically EntityState checks the EntityModel to see what data should be used to create the EntityInstance - YES

--
SPAWNING

Spawn Group Upgrade
  Basically its Spawn Group, can include classes involved, their custom tags, how MANY? This is given a name
  Then is ProjectileSpawnEvent, and StageSpawnEvent
  Projectile Spawn Event like is basically what you have on the classes right now

Stage Spawn Event 
    Dynamic vs Static. This means like. Ok so do you want the placement of spawns to be randomized WHEN THE EVENT runs or do you want 
  you can delete all instances created from the randomiziton anytime
  Map based, density, total items, etc
And yeah I think maybe you make a spawn group first before you can call 'spawn'
  and then it also becomes 'Spawn Instance' once you run it
  
SpawnEvents
SpawnGroupInstances or SpawnEvent Instance?

I think perhaps. This Spawn Group vs Spawn Event idea is not needed...Basically im trying to say 'ok when this 'thing' is created it should be different than what is classified here' The reason for that is optimization. If thats the case maybe just have an 'optimize switch' that allows you to spawn more things

Also how does this relate to particle effects? Those can basically be 'relationless classes'
  
Maybe its actually a 'Spawn Event' 'Projectile Event' and 'Particle Effect'

And when it comes to organizing it into a 'EntityGroup' YEah it would be so cool to also be able to like place Entity Groups on the map like two things at once

And then when it comes to optimizing this. When we generate things based on player behavior we need to perhaps optimize it. Ok yes optimize but also customize??? Shouldnt this just be exported to the class system. YES if the class system wasnt about to become virtualized anyways. So like if the class system changes completed via the 'Choices and Behaviors' In what way is it changing? in a way? How dos that combine with spawning optmizaton?

=--


BEHAVIORS
  I think you like 'add behaviors' and you can tweak these behaviors. Behaviors is an object like tags. Behaviors are also part of a game. A game can create behaviors. oh fuck. Yeah we can auto generate a lot of them. Behaviors understand conflicts between eachother. You can only have one movement behavior... Hmm yeah thats the thing like it kinda works the right way already. 
  Non conflicting behaviors??? im not certain

CHOICE EVENT
  On Choice Made
    Choice Can then run effects
  Also when a choice is made, a record of the choice is recorded in the gameInstance, yeah?
  also like a history of choices are recorded.
  Recording a choice is an effect, On Destroy -> Record Choice. On touch Start -> Record Choice, Or maybe its just a .recordEvent property on events. Maybe some choices dont need to be recorded
  An Object  can hold inside of it 'pre recorded changes' that when a choice is made or reversed, it will switch back and forth these properties, choice tree?
  How to resolve state change conflits? Does one change take priority? Do you go through conflict by conflict to determine the priority? Like swipe left, swipe right? Is there a better way?

  Jump, Movement, Collisions, Projectile property importedArcadeGames
    or Perhaps just add it to the interface system that already exists? Add a property object to it?
    The thing is that also properties themselelves. The very .zoneEntityModelId, .speed will need to be gamified eventually. We will want a way of expressing how this property can be gamified, who can change it, etc
    This is related to the CHOICE EVENT THING. "CHOICES HAVE PERMENANT CONSEQUENCES"
    soooo. Yeah what does a class look like after this. Is a Entity like something that starts, and theres an EntityAugmentation after that? 
    Or does a class understand its own augmentations. Nah nah. It would be cool if an augmentation can be applied to any class. Yeah.. why not? The class defines how it is augmented. Maybe its by TAG actually yeah. 
    Augment the property by tag. How to solve conflicts, regardless of how the data works?


--

PROPERTIES RECORDS

We may want to go through every single property and write security rules for it
  Admin or not
  debounce or not

default values

game rules like if its an in game property such as creating walls or something

if its immuteable or not

if changing it creates an animation, if so what kind?

for multiplayer networking - on what loop is it updated? how is it compressed? what data type is it?

max value, min value 

causes a reset of the instance

all sorts of editor view things. Ways to edit it?? Slider, Color Picker, On the map, etc

For objects
  augeneration rules
    Does it create another class?
    Does it create a relation?

For each property
  editorInterface
  security
  dataValidation
  gamePlay
  networking
  onUpdate
  library
    isAutogenerated means you dont add it to library, or isReadOnly means dont add this one to the library

For each Entity/Tag/Relation
  autogeneration

for every menu it could show up it can be customized to show up their or not. Each SelectTag or SelectEntity should have an id

-

Interface ids should have a related properties field so we know?? or nah I think its like the PROPERTY created the interface id, oh man...Thats SO BAD for CSS and stuff. Like just plop a list down? no thank you. But I think its possible that you can just connect it to the interface Id so toy dont need to add a component inside of it. Unlockable autogenerated a form for us

Is autogenerated a.... thing we can edit int he interface? Say like 'autogenreate this tag, dont autogenereat that tag, etc' I mean technically yes becaus eof editor interface object

--

Also make sure to minimize data