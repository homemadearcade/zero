/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole, editLobby } from '../../store/actions/lobbyActions';

import './ExperienceInstructions.scss';
import { addArcadeGame, copyArcadeGameToUser, unloadArcadeGame, updateArcadeGameCharacter } from '../../store/actions/arcadeGameActions';
import SelectGame from '../../ui/connected/SelectGame/SelectGame';
import GameCard from '../../app/arcadeGame/GameCard/GameCard';
import Typography from '../../ui/Typography/Typography';
import LobbyChecklist from '../lobby/LobbyChecklist/LobbyChecklist';
import { unlockInterfaceId } from '../../store/actions/unlockableInterfaceActions';
import { isLocalHost, requestFullscreen } from '../../utils/webPageUtils';
import { openGameMetadataModal, openSetupDefaultsModal } from '../../store/actions/gameEditorActions';
import { CREDITS_EXPERIENCE, GAME_EDITOR_EXPERIENCE, MONOLOGUE_EXPERIENCE } from '../../constants';
import { ANIMATION_CONFETTI, ANIMATION_SPAWN_CLASS_IN_CAMERA, PAUSED_STATE, PLAY_STATE } from '../../game/constants';
import LobbyVerticalLinearStepper from '../ExperienceVerticalLinearStepper/ExperienceVerticalLinearStepper';
import { forceCobrowsingUpdateDispatch } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { setCutAudio, setCutVideo } from '../../store/actions/videoActions';
import { openSnapshotTaker } from '../../store/actions/gameViewEditorActions';
import { ON_GAME_INSTANCE_ANIMATION } from '../../store/types';
import { editGameModel } from '../../store/actions/gameModelActions';
import { updateLobbyUser } from '../../store/actions/lobbyActions';
import { editGameSession, changeGameState } from '../../store/actions/gameSessionActions';
import GameAddForm from '../../app/arcadeGame/GameAddForm/GameAddForm';
import Button from '../../ui/Button/Button';
import LobbySelectRoles from '../lobby/LobbySelectRoles/LobbySelectRoles';
import Divider from '../../ui/Divider/Divider';

const ARCHIVE_USER_ID = isLocalHost ? '62143b5618ac51461e5ecf6b' : '61cf70be02f76000536708ee'

const GAME_IDS = {
  prologue1: isLocalHost() ? '63c3420b6a61ac00539b0dc5' : '63c3420b6a61ac00539b0dc5',
  prologue2: isLocalHost() ? '63c5e24c90a58a00531f4c1a' : '63c5e24c90a58a00531f4c1a',
}

const PROLOGUE_CLASS_IDS = {
  immoveablePixel: 'd39c037e-d7dd-47d0-8083-ef2edf98a573',
  movingPixel: '22098c1a-a6c4-448d-9e0d-5cc6a58c6d71',
  barPixel: '30e42315-88e0-4b75-b722-acd83069a879',
  byePixel: '5e1a3d02-ddfd-4df9-8a15-fb1dfe20b6da',
}

const PROLOGUE_2_CLASS_IDS = {
  barPixel2: 'd1a02b13-7636-49b9-b814-33629e6dac78',
  redJumpChanger: '72290fc4-67cc-4532-932b-b6f8c580701b',
  yellowFlyChanger: 'oc/n/0e6390fb-6e1c-41c7-8353-638d4669038c',
  byePixel2: 'oc/n/ed37c2cc-7b26-43f0-bcee-f0d9657ee5e7'
}


        // sendToStarsStep(),
        // {
        //   id: 'Load Demo World',
        //   title: <Typography component="h5" variant="h5">Load Demo World</Typography>,
        //   onClickNext: async () => {
        //     await editLobby(lobby.id, {
        //       experienceState: GAME_EDITOR_EXPERIENCE,
        //     })
        //     await editGameSession(lobby.gameSessionId, {
        //       gameId: isLocalHost() ? '63af1a6717b22f6245d88269' : '63dc59d383cc8500539a24d9',
        //       isSaveDisabled: true,
        //     })
        //   },
        //   nextButtonText: 'Load Demo World'
        // },
        // returnFromStarsStep(),

const ExperienceInstructions = ({
  addArcadeGame,
  editLobby,
  assignLobbyRole,
  updateArcadeGameCharacter,
  lobby: { lobby },
  updateLobbyUser,
  changeGameState,
  gameSession: { gameSession },
  setCutAudio,
  setCutVideo,
  editGameSession,
  cobrowsing: { remoteStateUserId },
  myTracks,
  userTracks
}) => {  
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  const requireCobrowsingConnection = {
    shouldContinueBeDisabledCheck: () => {
      return !remoteStateUserId
    },
    isContinueDisabledWarning: <>
      Participant has not interacted with the experience
    </>,
  }

  let returnFromStarsStepIndex = 0
  function returnFromStarsStep() {
    return {
      id: 'Return Participant From Stars' + returnFromStarsStepIndex++,
      title: <Typography component="h5" variant="h5">Return Participant From Stars</Typography>,
      onClickNext: () => {
        updateLobbyUser({
          lobbyId: lobby.id,
          userId: lobby.participantId, 
          user: {
            inConstellationView: false
          }
        })
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
        updateLobbyUser({
          lobbyId: lobby.id,
          userId: lobby.participantId, 
          user: {
            inConstellationView: true
          }
        })
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

  function spawnThis({classId, className, gameId}) {
    return {
      id: classId,
      title: <Typography component="h5" variant="h5">Spawn {className}</Typography>,
      instructions: <>
        This will spawn {className} inside of the Players camera view
      </>,
      shouldContinueBeDisabledCheck: () => {
        return gameSession.gameId !== gameId
      },
      isContinueDisabledWarning: <>
        Incorrect game loaded!
        <Button onClick={async () => {
          await editGameSession(lobby.gameSessionId, {
            gameId: gameId,
          })
        }}>Load Correct Game</Button>
      </>,
      onClickNext: () => {
        window.socket.emit(ON_GAME_INSTANCE_ANIMATION, { 
          gameSessionId: lobby.gameSessionId, 
          type: ANIMATION_SPAWN_CLASS_IN_CAMERA, 
          data: {
            classId,
            hostOnly: true
          }
        })
      },
      nextButtonText: 'Spawn'
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
      id: title,
      title: <Typography component="h3" variant="h3">{title}</Typography>,
      break: true
    }
  }

  function renderSelectGame() {
    return <>
      <div>
       A Game is created automatically when a lobby is created. Only edit this if you plan to edit a pre-existing game. If not click Continue.
      </div><br/>
      {false && lobby?.editGameId && 
      <GameCard gameId={lobby.editingGameId}/>}
      {lobby.participantId && <SelectGame label="Games owned by Participant" userId={lobby.participantId} gamesSelected={lobby.editingGameId ? [lobby.editingGameId] : []} onSelect={(games) => {
        if(games[0]) {
          editLobby(lobby.id, {
            editingGameId: games[games.length - 1]
          })
        }
      }}/>}
      <Divider></Divider>
      <GameAddForm onSubmit={(game) => {
        editLobby(lobby.id, {
          editingGameId: game.id
        })
      }} defaultValues={{userId: lobby.participantId}}></GameAddForm>
    </>
  }

  return (
    <div className="ExperienceInstructions">
      <div className="ExperienceInstructions__stepper">
      <LobbyVerticalLinearStepper 
      steps={[
        {
          id: 'Assign User Roles',
          title: <Typography component="h5" variant="h5">Assign User Roles</Typography>,
          instructions: <>
              <div>
                Roles are assigned automatically. If this does not need to be changed, click Continue.
              </div><br/>
              <LobbySelectRoles myTracks={myTracks} userTracks={userTracks}></LobbySelectRoles>
          </>
        },
        {
          id: 'Select Game to edit this session',
          title: <Typography component="h5" variant="h5">Select Game to edit this session</Typography>,
          instructions: renderSelectGame()
        },
        breakTitle('Setup (5mins)'),
        {
          id: 'Share Participant link',
          title: <Typography component="h5" variant="h5">Share Participant link</Typography>,
          instructions: <>
            The participant will automatically have recieved this link in the email for their ticket. You may also manually share this link with them if needed
            <input readOnly style={{width: '100%'}} value={window.location.origin + '/lobby/' + lobby.id + '/join/' + lobby.participantId}></input>
            The Chatlog will show you if they have joined
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
          // shouldContinueBeDisabledCheck: () => {
          //   return !window.lobby?.isAllRequiredPassing
          // }
        },
        breakTitle('Prologue 1 (10 mins)'),
        {
          id: 'Starting Monologue',
          title: <Typography component="h5" variant="h5">Starting Monologue</Typography>,
          instructions: <>
            When you are ready to start experience, click the button bellow to start the monologue
          </>,
          onClickNext: () => {
            editLobby(lobby.id, {
              experienceState: MONOLOGUE_EXPERIENCE,
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
              experienceState: GAME_EDITOR_EXPERIENCE,
            })
            await editGameSession(lobby.gameSessionId, {
              gameId: GAME_IDS.prologue1,
              isPoweredOn: true,
              isSaveDisabled: true,
              gameState: PAUSED_STATE
            })
          },
          nextButtonText: 'Load Prologue 1'
        },
        {
          id: 'Show Player Pixel',
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
          id: 'Allow Player Pixel Movement',
          title: <Typography component="h5" variant="h5">Allow Pixel Movement</Typography>,
          onClickNext: async () => {
            await editGameSession(lobby.gameSessionId, {
              gameState: PLAY_STATE
            })
          },
          nextButtonText: 'Unpause'
        },
        spawnThis({ classId: PROLOGUE_CLASS_IDS.immoveablePixel, className: 'Immoveable Pixel', gameId:  GAME_IDS.prologue1}),
        sayThis(`
          What do you encounter? What could it be?
          You answer as You interact.
        `),
        spawnThis({ classId: PROLOGUE_CLASS_IDS.movingPixel, className: 'Moving Pixel', gameId:  GAME_IDS.prologue1}),
        sayThis(`
          We repeat this answer, support and clarify it.
        `),
        spawnThis({ classId: PROLOGUE_CLASS_IDS.barPixel, className: 'Platform Pixel', gameId:  GAME_IDS.prologue1}),
        sayThis(`
          Another, larger block appears.

          And what is this?...

          You answer.  We affirm.
        `),
        spawnThis({ classId: PROLOGUE_CLASS_IDS.byePixel, className: 'Bye Pixel', gameId:  GAME_IDS.prologue1}),
        sayThis(`
          Another image appears…

          …And this?

          You answer, we affirm.
        `),
        sendToStarsStep(),
        {
          id: 'Load Prologue 2',
          title: <Typography component="h5" variant="h5">Load Prologue 2</Typography>,
          onClickNext: async () => {
            await editLobby(lobby.id, {
              experienceState: GAME_EDITOR_EXPERIENCE,
            })
            await editGameSession(lobby.gameSessionId, {
              gameId: GAME_IDS.prologue2,
              isPoweredOn: true,
              isSaveDisabled: true,
            })
          },
          nextButtonText: 'Load Prologue 2'
        },
        breakTitle('Prologue 2 (10 mins)'),
        sayThis(`And so you remind yourself, how simple instincts can lead to worlds of discovery.
             As many worlds as there are imaginative moments in the universe.  
             You take a breath, and dive in again, to connect with another world…`),
        returnFromStarsStep(),
        spawnThis({ classId: PROLOGUE_2_CLASS_IDS.barPixel2, className: 'Platform Pixel', gameId: GAME_IDS.prologue2}),
        spawnThis({ classId: PROLOGUE_2_CLASS_IDS.redJumpChanger, className: 'Red Jump Pixel', gameId: GAME_IDS.prologue2}),
        spawnThis({ classId: PROLOGUE_2_CLASS_IDS.yellowFlyChanger, className: 'Yellow Fly Pixel', gameId: GAME_IDS.prologue2}),
        spawnThis({ classId: PROLOGUE_2_CLASS_IDS.byePixel2, className: 'Bye Pixel', gameId: GAME_IDS.prologue2}),
        sayThis(`You encounter the world that loops, 
            adds color and individual powers, 
            naming those as You did before.`),
        sendToStarsStep(),
        {
          id: 'Load Editing Game',
          title: <Typography component="h5" variant="h5">Load Editing Game</Typography>,
          onClickNext: async () => {
            await editLobby(lobby.id, {
              experienceState: GAME_EDITOR_EXPERIENCE,
            })
            await editGameSession(lobby.gameSessionId, {
              gameId: lobby.editingGameId,
              isSaveDisabled: false,
              isPoweredOn: true,
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
          nextButtonText: 'Open',
          ...requireCobrowsingConnection,
        },
        sayThis(`
          As you know, not every world exists with the black background of the original pixel.  What is the background color we begin with today?
          You choose a BG color...

          Will we experience this world from the side, or overhead?

          You choose platformer or overhead…

          What are the parameters of our world?

          You choose a contained room / arena; you choose looped or unlooped.

          What is your perspective?
        `),
        returnFromStarsStep(),
        {
          id: 'Build a game!',
          title: <Typography component="h5" variant="h5">Build a game!</Typography>,
          instructions: <>
            Build a game with the user! Come back when you are ready to wrap up
          </>,
          nextButtonText: 'Ready to Wrap up'
        },
        breakTitle('Wrapping Up (10 mins)'),
        {
          id: 'Take a Cover Photo',
          title: <Typography component="h5" variant="h5">Take a Cover Photo</Typography>,
          onClickNext: () => {
            store.dispatch(forceCobrowsingUpdateDispatch(openSnapshotTaker()))
          },
          nextButtonText: 'Open Snapshot Taker',
          ...requireCobrowsingConnection
        },
        {
          id: 'Fill Out Game Metadata',
          title: <Typography component="h5" variant="h5">Fill Out Game Metadata</Typography>,
          onClickNext: () => {
            store.dispatch(forceCobrowsingUpdateDispatch(openGameMetadataModal()))
            editGameModel({
              metadata: {
                isPublished: true
              }
            })
          },
          nextButtonText: 'Open Game Metadata Modal',
          ...requireCobrowsingConnection,
        },
        {
          id: 'Congrats!',
          title: <Typography component="h5" variant="h5">Congrats!</Typography>,
          instructions: <>
            They finished making a game! Congrats to both of you
          </>,
          onClickNext: () => {
            window.socket.emit(ON_GAME_INSTANCE_ANIMATION, { gameSessionId: lobby.gameSessionId, type: ANIMATION_CONFETTI, data: {}})
          },
          nextButtonText: 'Blow Confetti'
        },
        {
          id: 'Send To Credits',
          title: <Typography component="h5" variant="h5">Send To Credits</Typography>,
          onClickNext: () => {
            editLobby(lobby.id, {
              experienceState: CREDITS_EXPERIENCE
            })
          },
          nextButtonText: 'Open'
        },
        sayThis(`Thank them for coming! Its now time to say goodbye`),
        {
          id: 'Turn off everyones Video/Audio',
          title: <Typography component="h5" variant="h5">Turn off everyones Video/Audio</Typography>,
          onClickNext: () => {
            // setCutVideo(true)
            // setCutAudio(true)
            // setCutVideo(true, true)
            // setCutAudio(true, true)
          },
          nextButtonText: 'Turn off my Video and Audio'
        },
        breakTitle('After the experience'),
        {
          id: 'Save a copy for the archive',
          title: <Typography component="h5" variant="h5">Save a copy for the archive</Typography>,
          instructions: <>
            We preserve a copy of each game after a session for demonstration and archival purposes
          </>,
          onClickNext: () => {
            store.dispatch(copyArcadeGameToUser({ userId: ARCHIVE_USER_ID, gameId: lobby.editingGameId, isArchival: true }))
          },
          nextButtonText: 'Archive'
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
  gameSession: state.gameSession,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { editGameSession, editLobby,addArcadeGame, editGameModel, assignLobbyRole, unloadArcadeGame, unlockInterfaceId, updateArcadeGameCharacter, updateLobbyUser, changeGameState, setCutAudio, setCutVideo }),
)(ExperienceInstructions);
