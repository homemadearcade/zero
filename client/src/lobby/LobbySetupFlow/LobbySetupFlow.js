/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole, editLobby } from '../../store/actions/lobbyActions';

import './LobbySetupFlow.scss';
import { addArcadeGame, copyArcadeGameToUser, unloadArcadeGame, updateArcadeGameCharacter } from '../../store/actions/arcadeGameActions';
import SelectGame from '../../ui/connected/SelectGame/SelectGame';
import GameCard from '../../app/homemadeArcade/arcadeGame/GameCard/GameCard';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';
import LobbyChecklist from '../LobbyChecklist/LobbyChecklist';
import LobbyUserStatus from '../LobbyUserStatus/LobbyUserStatus';
import { unlockInterfaceId } from '../../store/actions/unlockableInterfaceActions';
import { isLocalHost, requestFullscreen } from '../../utils/webPageUtils';
import { changeGameState, completeCloseConstellation, openConstellation } from '../../store/actions/gameContextActions';
import { openGameMetadataModal, openSetupDefaultsModal } from '../../store/actions/gameEditorActions';
import { ADMIN_ROLE } from '../constants';
import { GAME_EDITOR_UI, MONOLOGUE_UI } from '../../constants';
import { PAUSED_STATE, PLAY_STATE } from '../../game/constants';
import LobbyVerticalLinearStepper from '../LobbyVerticalLinearStepper/LobbyVerticalLinearStepper';
import { forceCobrowsingUpdateDispatch } from '../../utils/cobrowsingUtils';
import store from '../../store';
import Icon from '../../ui/Icon/Icon';

const LobbySetupFlow = ({
  addArcadeGame,
  editLobby,
  assignLobbyRole,
  updateArcadeGameCharacter,
  lobby: { lobby },
  completeCloseConstellation, 
  openConstellation,
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
          title: <Typography component="h3" variant="h3">{title}</Typography>,
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
    return <>
      <div>
       A Game is created automatically when a lobby is created. Only edit this if you plan to edit a pre-existing game. If not click Continue.
      </div><br/>
      {lobby?.game?.id && 
      <GameCard game={lobby.game}/>}
      Select a pre-existing game that was created by the participant:
      {lobby.participantId && <SelectGame userId={lobby.participantId} onSelect={(game) => {
        editLobby(lobby.id, {
          game
        })
      }}/>}
      Create a new game for the particpant
      <Button disabled={!lobby.participantId} onClick={async () => {
        const response = await addArcadeGame({
          userId: lobby.participantId
        })
        editLobby(lobby.id, {
          game: response.data.game
        })
      }}
      startIcon={<Icon icon="faPlus"/>}>
        New Game
      </Button>
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
        breakTitle('Setup (5mins)'),
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
        breakTitle('Experience Begins (20mins)'),
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
          onClickNext: async () => {
            await editLobby(lobby.id, {
              currentGameId: isLocalHost() ? '63af7a2acd7df2644a508245' : '63c3420b6a61ac00539b0dc5',
              isGamePoweredOn: true,
              experienceState: GAME_EDITOR_UI,
              skipStageSave: true
            })
            changeGameState(PAUSED_STATE)
          },
          nextButtonText: 'Load Prologue 1'
        },
        {
          id: 'Show Pixel',
          title: <Typography component="h5" variant="h5">Show Pixel</Typography>,
          instructions: <>
            This will set the participants UI to be able to see the Game View.
          </>,
          onClickNext: () => {
            updateArcadeGameCharacter({
              userId: lobby.participantId,
              unlockableInterfaceIds: {
                gameView: true,
              },
              merge: true
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
          id: 'Allow Pixel Movement',
          title: <Typography component="h5" variant="h5">Allow Pixel Movement</Typography>,
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
          id: 'Load Demo World',
          title: <Typography component="h5" variant="h5">Load Demo World</Typography>,
          onClickNext: () => {
            editLobby(lobby.id, {
              currentGameId: isLocalHost() ? '63af1a6717b22f6245d88269' : '63dc59d383cc8500539a24d9',
              isGamePoweredOn: true,
              experienceState: GAME_EDITOR_UI,
              skipStageSave: true
            })
          },
          nextButtonText: 'Load Demo World'
        },
        returnFromStarsStep(),
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
        breakTitle('Game Creation Begins (40 mins)'),
        {
          id: 'Open Game Defaults Selector',
          title: <Typography component="h5" variant="h5">Open Game Defaults Selector</Typography>,
          onClickNext: () => {
            store.dispatch(forceCobrowsingUpdateDispatch(openSetupDefaultsModal()))
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
        {
          id: 'Open Command Center',
          title: <Typography component="h5" variant="h5">Open Command Center</Typography>,
          instructions: <>
            Click the command center at the top right and build a game with the user! Come back when you are ready to wrap up
          </>,
          nextButtonText: 'Ready to Wrap up'
        },
        breakTitle('Wrapping Up (10 mins)'),
        {
          id: 'Open Game Metadata Modal',
          title: <Typography component="h5" variant="h5">Open Game Metadata Modal</Typography>,
          onClickNext: () => {
            store.dispatch(forceCobrowsingUpdateDispatch(openGameMetadataModal()))
          },
          nextButtonText: 'Open'
        },
        breakTitle('After they leave'),
        {
          id: 'Open Game Metadata Modal',
          title: <Typography component="h5" variant="h5">Open Game Metadata Modal</Typography>,
          onClickNext: () => {
            store.dispatch(copyArcadeGameToUser({ gameId: lobby.game.id }))
          },
          nextButtonText: 'Open'
        },
      ]}
      completed={<>
          <Typography component="h5" variant="h5">Great job!</Typography>
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
  connect(mapStateToProps, { editLobby,addArcadeGame, assignLobbyRole, unloadArcadeGame, unlockInterfaceId, updateArcadeGameCharacter, openConstellation, completeCloseConstellation, changeGameState }),
)(LobbySetupFlow);
