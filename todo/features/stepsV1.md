STEPS UPGRADE
  Name step when creating step 

  STEP SECTIONS
  So tehy arent as long. Be able to add a step break in
  Use map for interface Ids
  Automatically run the steps
  Stay Selected with the Step you are moving up
  Mark down for prompts?? Rich Text please https://draftjs.org/docs/getting-started
  Optional Actions List for prompts

  Participant and Audience Roles do NOT cobrowse and their instructions should not ask for cobrowsing user. It is always for them. 

  Different kind of Steps Class for Non Faciliatators

  You have to select a game room or lobby! Right now u can just skip them!
  Also lets not allow Some roles to have instructions at all
  Roles need to have permissions like - is it a facilitator role, is it a participant role, etc. Do we require video?? etc
--

Posibble rename all Effect, Experience Effects -> Game Actions, Experience Actions, Interface Actions

I think that Effects should actually be called Actions. Effects are what we track, Actions cause effects.

---


I think you dO NOT HAVE experience effects. Thats all taken care of by the activity and view switcher, transition switcher, etc.

This is all edited within the lobby view. You can add lobbys etc, mid game. tottaly cool.

Id need to like turn it all into components that render children and I can compose and pass in what is needed. 

I think the instructions are based on a role. So you start with a role and you are like ok what steps do you need. What roles are you following? 

There are performers and facilitators. Each of these have tottaly different instruction classes. Facilatators are the only ones that cobrowse and like switch activitys and all that. We dont expect performers to do that. If a facilitator needs to then they can show their camera and can also embody entities. 

Performers on the  other hand have a decidedly simpler interface. and instructions

The difference is in control scheme -- The performer uses the arrows keys, performs emotions, and is talking a lot. Their mic is on by default. Some faciltator actions will be avilable to them.

Facilitator uses the mouse, and is not talking a lot. Their mic is off by default. They are clicking around, switching between interfaces. They will use point and click to move a character around if needed.

---

So instructions go linearly by role.

----

PARTICIPANT STEP BUILDER
 - A whole timer interface like at the bottom like an editor?
  It would be awesome to also be able to have a timer for the properties of an object. Where u can morph their property over time.

  Yes this is basically the steps model. I need to... Think a bit about how to integrate this into UI 

  But basically... If I can keep track of every action that occurs. Like EVERY ACTION. Specifically game effects that the editor does such as spawning - resizing... the INSTANCE effects are what are missing

  Record experience effects and add to step??

