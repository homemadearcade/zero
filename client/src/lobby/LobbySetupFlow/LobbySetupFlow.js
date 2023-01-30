/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole, editLobby } from '../../store/actions/lobbyActions';

import './LobbySetupFlow.scss';
import { addArcadeGame, unloadArcadeGame, updateArcadeGameCharacter } from '../../store/actions/arcadeGameActions';
import GameSelect from '../../app/homemadeArcade/arcadeGame/GameSelect/GameSelect';
import GameCard from '../../app/homemadeArcade/arcadeGame/GameCard/GameCard';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';
import LobbyChecklist from '../LobbyChecklist/LobbyChecklist';
import LobbyUserStatus from '../LobbyUserStatus/LobbyUserStatus';
import { unlockInterfaceId } from '../../store/actions/unlockableInterfaceActions';
import { isLocalHost, requestFullscreen } from '../../utils/webPageUtils';
import { changeGameState, completeCloseConstellation, openConstellation } from '../../store/actions/gameContextActions';
import { openSetupDefaultsModal } from '../../store/actions/gameEditorActions';
import { ADMIN_ROLE } from '../constants';
import { GAME_EDITOR_UI, MONOLOGUE_UI } from '../../constants';
import { BASIC_INSTANCE_CANVAS_ID, NPC_INSTANCE_CANVAS_ID, PAUSED_STATE, PLAYER_INSTANCE_CANVAS_ID, PLAYGROUND_CANVAS_ID, PLAYTHROUGH_PLAY_STATE, PLAY_STATE } from '../../game/constants';
import LobbyVerticalLinearStepper from '../LobbyVerticalLinearStepper/LobbyVerticalLinearStepper';

const LobbySetupFlow = ({
  addArcadeGame,
  editLobby,
  assignLobbyRole,
  updateArcadeGameCharacter,
  lobby: { lobby },
  completeCloseConstellation, 
  openConstellation,
  openSetupDefaultsModal,
  changeGameState,
}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  let returnFromStarsStepIndex = 0
  function returnFromStarsStep() {
    return {
      id: 'Return Participant From Stars' + returnFromStarsStepIndex++,
      title: <Typography component="h5" variant="h5">Return Participant From Stars</Typography>,
      onClickNext: () => {
        completeCloseConstellation({ forceCobrowsingUpdate: true })
      },
      nextButtonText: 'Return Participant From Stars'
    }
  }

  let sendToStarsStepIndex = 0
  function sendToStarsStep() {
    return {
      id: 'Send Participant to Stars' + sendToStarsStepIndex++,
      title: <Typography component="h5" variant="h5">Send Participant to Stars</Typography>,
      onClickNext: () => {
        openConstellation({ forceCobrowsingUpdate: true })
      },
      nextButtonText: 'Send Participant to Stars'
    }
  }

  function sayThis(text) {
     return {
      id: text,
      title: <Typography component="h5" variant="h5">Say This</Typography>,
      instructions: <>
        {text}
      </>,
      nextButtonText: 'I said it'
    }
  }

    function unlockThis(description, ids) {
     return {
      id: description,
      title: <Typography component="h5" variant="h5">{description}</Typography>,
      instructions: <>

      </>,
      onClickNext: () => {
        updateArcadeGameCharacter({
          userId: lobby.participantId,
          unlockableInterfaceIds: ids,
          merge: true
        })
      },
      nextButtonText: 'Unlock'
    }
  }

    function breakTitle(title) {
          return {
          id:title,
          title: <Typography component="h2" variant="h2">{title}</Typography>,
          break: true
        }
  }


  function renderAssignRoles() {

    function getRoles(userId) {
      const roles = []

     if(lobby.gameHostId === userId) {
      roles.push('Game Host')
     }

     if(lobby.participantId === userId) {
      roles.push('Participant')
     }

    if(lobby.guideId === userId) {
      roles.push('Guide')
     }

     return roles.join(' ,')
    }

    return <>
      <div>
        Roles are assigned automatically. By default, the participant is the Game Host and the Participant role and the first admin into the lobby is assiged the Guide role. If this does not need to be changed, click Continue.
      </div><br/>
      <div className="LobbySetupFlow__roles">

      {lobby.users.map((user) => {
        return <LobbyUserStatus titleOnly key={user.id} userId={user.id}
          titleChildren={<>
            <br/>
            <div>Current Roles: {getRoles(user.id)}</div><br/>
            <Button onClick={() => {
              assignLobbyRole(lobby.id, {
                userId: user.id, 
                role: 'gameHost'
              });
            }}>Assign as Game Host</Button>
            <Button onClick={() => {
              assignLobbyRole(lobby.id, {
                userId: user.id, 
                role: 'participant'
              });
            }}>Assign as Participant</Button>
            {user.role === ADMIN_ROLE && <Button onClick={() => {
              assignLobbyRole(lobby.id, {
                userId: user.id, 
                role: 'guide'
              });
            }}>Assign as Guide</Button>}
          </>}
        />
      })}
      </div>
    </>
  }

  function renderSelectGame() {
      // <Button disabled={!lobby.participantId} onClick={async () => {
      //   const response = await addArcadeGame({
      //     userId: lobby.participantId
      //   })
      //   editLobby(lobby.id, {
      //     game: response.data.game
      //   })
      // }} 
      // startIcon={<Icon icon="faPlus"/>}>
      //   New Game
      // </Button>
    return <>
      <div>
       A Game is created automatically when a lobby is created. Only edit this if you plan to edit a pre-existing game. If not click Continue.
      </div><br/>
      {lobby?.game?.id && 
      <GameCard game={lobby.game}/>}
      Select a pre-existing game:
      <GameSelect onSelect={(game) => {
        editLobby(lobby.id, {
          game
        })
      }}/>
    </>
  }

  return (
    <div className="LobbySetupFlow">
      <div className="LobbySetupFlow__stepper">
      <LobbyVerticalLinearStepper 
      steps={[
        {
          id: 'Assign User Roles',
          title: <Typography component="h5" variant="h5">Assign User Roles</Typography>,
          instructions: !lobby.isGamePoweredOn ? renderAssignRoles() : <Typography component="h5" variant="h5">You can not assign roles while the game is powered on</Typography>
        },
        {
          id: 'Select Game to be Edited',
          title: <Typography component="h5" variant="h5">Select Game to be Edited</Typography>,
          instructions: !lobby.isGamePoweredOn ? renderSelectGame() : <Typography component="h5" variant="h5">You can not change the selected game when the game is powered on</Typography>
        },
        {
          id: 'Share Participant link',
          title: <Typography component="h5" variant="h5">Share Participant link</Typography>,
          instructions: <>
            The participant will automatically have recieved this link in the email for their ticket. You may also manually share this link with them if needed
            <input readOnly style={{width: '100%'}} value={window.location.origin + '/lobby/' + lobby.id + '/join/' + lobby.participantId}></input>
            When they have joined, the card below will be lit up and have a green dot in the corner
            <LobbyUserStatus userId={usersById[lobby.participantId]?.id}/>
          </>
        },
        {
          id: 'Go Fullscreen',
          title: <Typography component="h5" variant="h5">Go Fullscreen</Typography>,
          instructions: <>
          </>,
          onClickNext: () => {
            requestFullscreen(document.body)
          },
          nextButtonText: 'Go Fullscreen'
        },
        {
          id: 'UI - Lock All',
          title: <Typography component="h5" variant="h5">UI - Lock All</Typography>,
          instructions: <>
            This will set the participants UI to not see any thing including the Game View
          </>,
          onClickNext: () => {
            updateArcadeGameCharacter({
              userId: lobby.participantId,
              unlockableInterfaceIds: {}
            })
          },
          nextButtonText: 'Lock All'
        },
        {
          id: 'Review Launch Checklist',
          title: <Typography component="h5" variant="h5">Review Launch Checklist </Typography>,
          instructions: <>
            <LobbyChecklist/>
          </>,
          // disableContinueButtonCheck: () => {
          //   return !window.lobby?.isAllRequiredPassing
          // }
        },
        breakTitle('Experience Begins'),
        {
          id: 'Starting Monologue',
          title: <Typography component="h5" variant="h5">Starting Monologue</Typography>,
          instructions: <>
            When you are ready to start experience, click the button bellow to start the monologue
          </>,
          onClickNext: () => {
            editLobby(lobby.id, {
              experienceState: MONOLOGUE_UI,
              monologueText: `More and more, the world interacts with reflections made on the screen in front of you. These began as pixels. So we begin with our relationship to pixels, through the tools of the keyboard you know so well.
We’ll use it to create - a story, a piece of art, a game… however You feel inspired.`
            })
          },
          nextButtonText: 'Open Monologue View'
        },
        {
          id: 'Load Prologue 1',
          title: <Typography component="h5" variant="h5">Load Prologue 1</Typography>,
          onClickNext: () => {
            editLobby(lobby.id, {
              currentGameId: isLocalHost() ? '63af7a2acd7df2644a508245' : '63c3420b6a61ac00539b0dc5',
              isGamePoweredOn: true,
              experienceState: GAME_EDITOR_UI,
              skipStageSave: true
            })
          },
          nextButtonText: 'Load Prologue 1'
        },
        {
          id: 'Pause Game',
          title: <Typography component="h5" variant="h5">Pause Game</Typography>,
          onClickNext: () => {
            changeGameState(PAUSED_STATE)
          },
          nextButtonText: 'Pause'
        },
        {
          id: 'UI - Unlock Game View',
          title: <Typography component="h5" variant="h5">UI - Unlock Game View</Typography>,
          instructions: <>
            This will set the participants UI to be able to see the Game View and the Game View only
          </>,
          onClickNext: () => {
            updateArcadeGameCharacter({
              userId: lobby.participantId,
              unlockableInterfaceIds: {
                gameView: true,
              }
            })
          },
          nextButtonText: 'Unlock'
        },
        sayThis(`
          You start with a square on a screen.  It expands to a larger square.

          This, as You remember, is a pixel, magnified. The relationship, the interpretation we have with this very block… is our building block.
          You’ll begin to use what some call WASD keys, the arrow keys.
          As you move, it first seems nothing happens, yes?
          Then, you encounter something.
          `
        ),
        {
          id: 'Unpause Game',
          title: <Typography component="h5" variant="h5">Unpause Game</Typography>,
          onClickNext: () => {
            changeGameState(PLAY_STATE)
          },
          nextButtonText: 'Unpause'
        },
        sayThis(`
          What do you encounter? What could it be?

          You answer as You interact.

          We repeat this answer, support and clarify it.

          Another, larger block appears.

          And what is this?...

          You answer.  We affirm.
            Another image appears…

          …And this?

          You answer, we affirm.
        `),
        sendToStarsStep(),
        {
          id: 'Load Prologue 2',
          title: <Typography component="h5" variant="h5">Load Prologue 2</Typography>,
          onClickNext: () => {
            editLobby(lobby.id, {
              currentGameId: isLocalHost() ? '63af1a6717b22f6245d88269' : '63c5e24c90a58a00531f4c1a',
              isGamePoweredOn: true,
              experienceState: GAME_EDITOR_UI,
              skipStageSave: true
            })
          },
          nextButtonText: 'Load Prologue 2'
        },
        sayThis(`And so you remind yourself, how simple instincts can lead to worlds of discovery.
             As many worlds as there are imaginative moments in the universe.  
             You take a breath, and dive in again, to connect with another world…`),
        returnFromStarsStep(),
        sayThis(`You encounter the world that loops, 
            adds color and individual powers, 
            naming those as You did before.`),
        sendToStarsStep(),
        {
          id: 'Load Editing Game',
          title: <Typography component="h5" variant="h5">Load Editing Game</Typography>,
          onClickNext: () => {
            editLobby(lobby.id, {
              currentGameId: lobby.game.id,
              isGamePoweredOn: true,
              experienceState: GAME_EDITOR_UI,
              skipStageSave: false
            })
          },
          nextButtonText: 'Load Editing Game'
        },
        sayThis(`And now, We hope, unless you need a moment, are you ready to begin?`),
        breakTitle('Game Creation Begins'),
        {
          id: 'Open Game Defaults Selector',
          title: <Typography component="h5" variant="h5">Open Game Defaults Selector</Typography>,
          onClickNext: () => {
            openSetupDefaultsModal({ forceCobrowsingUpdate: true })
          },
          nextButtonText: 'Open'
        },
        returnFromStarsStep(),
        sayThis(`
          As you know, not every world exists with the black background of the original pixel.  What is the background color we begin with today?
          You choose a BG color...

          Will we experience this world from the side, or overhead?

          You choose platformer or overhead…

          What are the parameters of our world?

          You choose a contained room / arena; you choose looped or unlooped.

          What is your perspective?
        `),
        unlockThis('Unlock Add Color', {
          addColor: true
        }),
        unlockThis('Unlock Playground Color Brush', {
           [PLAYGROUND_CANVAS_ID+'/colorSelect']: true
        }),
        unlockThis('Unlock Playground Sprite Brush', 
          {
            [PLAYGROUND_CANVAS_ID+'/addBrush']: true,
            [PLAYGROUND_CANVAS_ID+'/brushSelect']: true,
            ['chooseSprites']: true,
          }),
        unlockThis('Unlock Eraser', 
          {
            ['eraser']: true,
          }),
         unlockThis('Unlock Draw New Sprite', 
          {
            ['drawNewSprite']: true,
          }),
         unlockThis('Unlock Drag Sprite', 
          {
            ['contextMenu/instance/move']: true,
          }),
        unlockThis('Unlock Add Object', 
          {
            [BASIC_INSTANCE_CANVAS_ID+'/addObject']: true,
            ['chooseSprites']: true,
          }
        ),
        unlockThis('Unlock Add NPC', 
          {
            [NPC_INSTANCE_CANVAS_ID+'/addNPC']: true,
            ['chooseSprites']: true,
          }
        ),
        unlockThis('Unlock Add Player', 
          {
            [PLAYER_INSTANCE_CANVAS_ID+'/addPlayer']: true,
            ['chooseSprites']: true,
          }
        )
      ]}
      completed={<>
          <Typography component="h5" variant="h5">Join Participant</Typography>
          <LobbyUserStatus hasJoinLink userId={usersById[lobby.participantId]?.id}/>
        </>}
      />
    </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { openSetupDefaultsModal, editLobby,addArcadeGame, assignLobbyRole, unloadArcadeGame, unlockInterfaceId, updateArcadeGameCharacter, openConstellation, completeCloseConstellation, changeGameState }),
)(LobbySetupFlow);
