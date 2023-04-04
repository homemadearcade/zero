--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

LIBRARY
  DATA_SOURCE_SYSTEM needs to be elimnated or made read only. Because it will make library imports not work
  If THERE IS A CORE library, it DOES in fact need to be used in a special way. This is where my library api thing can be used
  Maybe I should wait to complete the interface stuff because I want to like make a special library interface but the truth is we dont want one

IMPLEMENT THESE EFFECTS
  Return from Stars
  Pause Game. Unpause Game

STEPS UPDATE
  Skippable option in a step
  If the instructions could be smart and understand if the requirements of their context has been and have a checkmark if it is, and a check mark if it isnt, 

COMBINE experienceModel with experience

INTERFACE IDS
  Generate interfaceIds based on the game model
  Interface Ids themselves may have to be auto generated, for dynamic lookup
  Default unlocked interface ids need to be not shown in the unlockables tree
  I think maybe the game room manages loading interface ids and what not? or do games do that? WHO manages that? why when a game is loaded? troubling. Its hard to manage both at the same time... You need both states

  What is up with these...Borders for the cobrowsing open tool. It seems as if Layers have a border around them, classes do not, and also only effects and events have around it in abstract menu?

What are interface types? Are they specific parts of the interface? Are they just a generalized format for doing actions?
Is there a difference between interfaceId and actionId??

to really clear this up I need to.. make sure all interface types dont include an 'action word' in them. But maybe they can! I mean... OPEN ___ is definitely an interface section. Differece I think actions starts with the VERB, and interfaces start with the NOUN