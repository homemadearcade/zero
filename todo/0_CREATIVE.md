--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
CREATIVE
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
Randomizations  
  Create a new randomization!
    Dynamic vs Static
    Is it randomized each time the game is loaded? or once while editing?
      you can delete all instances created from the randomiziton anytime
      Map based, density, total items, etc
  I think its called ( Spawn Group )
    And yeah I think maybe you make a spawn group first before you can call 'spawn'
  and then it also becomes 'Spawn Instance' once you run it

TOUR component for admins? There this 'tour component' I found when searching ui libraries, its dope!

AUDIO EFFECTS :)

CHOICE EVENT
  On Choice Made
    Choice Can then run effects
  Also when a choice is made, a record of the choice is recorded in the gameInstance, yeah?
  also like a history of choices are recorded.
  Recording a choice is an effect, On Destroy -> Record Choice. On touch Start -> Record Choice, Or maybe its just a .recordEvent property on events. Maybe some choices dont need to be recorded
  An Object  can hold inside of it 'pre recorded changes' that when a choice is made or reversed, it will switch back and forth these properties, choice tree?
  How to resolve state change conflits? Does one change take priority? Do you go through conflict by conflict to determine the priority? Like swipe left, swipe right? Is there a better way?

  Jump, Movement, Collisions, Projectile property librarys
    or Perhaps just add it to the interface system that already exists? Add a property object to it?
    The thing is that also properties themselelves. The very .zoneClassId, .speed will need to be gamified eventually. We will want a way of expressing how this property can be gamified, who can change it, etc
    This is related to the CHOICE EVENT THING. "CHOICES HAVE PERMENANT CONSEQUENCES"
    soooo. Yeah what does a class look like after this. Is a Class like something that starts, and theres an EntityAugmentation after that? 
    Or does a class understand its own augmentations. Nah nah. It would be cool if an augmentation can be applied to any class. Yeah.. why not? The class defines how it is augmented. Maybe its by TAG actually yeah. 
    Augment the property by tag. How to solve conflicts, regardless of how the data works?

TIMER SYSTEM
 - A whole timer interface like at the bottom like an editor?
  It would be awesome to also be able to have a timer for the properties of an object. Where u can morph their property over time.

  LOOK @ TWEENS?

Voice to TExt? NLP Tab? Create 2 X with 8 layers, etc, eetc