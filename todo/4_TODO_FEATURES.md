--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
FEATURES TODO
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------

GAME
-------------

LIBRARY
  DATA_SOURCE_SYSTEM needs to be elimnated or made read only. Because it will make library imports not work
  If THERE IS A CORE library, it DOES in fact need to be used in a special way. This is where my library api thing can be used
  Maybe I should wait to complete the interface stuff because I want to like make a special library interface but the truth is we dont want one
  perhaps 'REPLACE_ID_1', REPLACE_ID_2, etc

IMPLEMENT THESE EFFECTS
  Return from Stars
  Pause Game. Unpause Game
  Also transform while touching 
    auto generate zones for this effect
  Should go to stars, return to stars be an EXPERIENCE EFFECT not a game effect?
    Yes I think so

INSTRUCTIONS
------------------
PROMPT UPGRADE
  step requirements, perhaps 
  Mark down for prompts?? Rich Text please https://draftjs.org/docs/getting-started
  Optional Actions List for prompts

EXPERIENCE EFFECTS
  Return to Control Booth view experienceEffect

WHEN ADDING INSTRUCTIONS MANUALLY
  You have to select a game room or lobby! Right now u can just skip them!

COMBINE 
  experienceModel with experience
      GAME HOST ACTIONS instructions need to be run by the GAME HOST
  ROLE
    Have this update the cobrowsing color

INTERFACE IDS
--------------------
INTERFACE IDS
  Generate interfaceIds based on the game model. 

  Then...generate action ids for the game model based off the interfaceIds 

  Add effects to the game model for each of the actions and interfaceIds..

  Then have the experience model generate experienceEffects based on the effects of the game model 

  interfaceIds[userId] === their default interfaceId... for us to use?

  Interface Ids should not have on click

  UIUX ISSUE
    What is up with these...Borders for the cobrowsing open tool. It seems as if Layers have a border around them, classes do not, and also only effects and events have around it in abstract menu?

RENAME
---
  Effect -> GameEffects
  actions -> interfaceActions

BUGS
  Add Player defaults are broken in EntityAdd
  Change Stages was broken 

UI
  Change autogeneration inside of EDIT ENTITY MODAL