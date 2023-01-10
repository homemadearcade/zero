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
import VerticalLinearStepper from '../../ui/VerticalLinearStepper/VerticalLinearStepper';
import UserStatus from '../LobbyUserStatus/LobbyUserStatus';
import { ADMIN_ROLE, GAME_EDITOR_UI, MONOLOGUE_UI } from '../../game/constants';
import LobbyPowerIndicator from '../LobbyPowerIndicator/LobbyPowerIndicator';
import { unlockInterfaceId } from '../../store/actions/unlockableInterfaceActions';
import { isLocalHost } from '../../utils/webPageUtils';
import { completeCloseConstellation, openConstellation } from '../../store/actions/gameContextActions';

const LobbySetupFlow = ({
  addArcadeGame,
  editLobby,
  assignLobbyRole,
  updateArcadeGameCharacter,
  lobby: { lobby },
  completeCloseConstellation, 
  openConstellation
}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

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
        return <UserStatus titleOnly key={user.id} userId={user.id}
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
      <VerticalLinearStepper 
      initialStep={lobby.currentStep}
      onStepChange={(step) => {
        editLobby(lobby.id, {
          currentStep: step
        })
      }}
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
            <UserStatus userId={usersById[lobby.participantId]?.id}/>
          </>
        },
        {
          id: 'i0 - Reset Participant UI',
          title: <Typography component="h5" variant="h5">i0 - Reset Participant UI</Typography>,
          instructions: <>
            This will set the participants game screen to be able to see the Game View and the Game View only
          </>,
          onClickNext: () => {
            updateArcadeGameCharacter({
              userId: lobby.participantId,
              unlockableInterfaceIds: {}
            })
          },
          nextButtonText: 'Set Interface to i1'
        },
        {
          id: 'Review Launch Checklist',
          title: <Typography component="h5" variant="h5">Review Launch Checklist </Typography>,
          instructions: <LobbyChecklist/>,
          // disableContinueButtonCheck: () => {
          //   return !window.lobby?.isAllRequiredPassing
          // }
        },
        {
          id: 'Give Monologue 1',
          title: <Typography component="h5" variant="h5">Give Monologue 1</Typography>,
          instructions: <>
            When you are ready to start Monologue 1, click start Monologue 1
          </>,
          onClickNext: () => {
            editLobby(lobby.id, {
              experienceUI: MONOLOGUE_UI,
              monologueText: 'Hey I am a pixel, I am so small and blocky, yikes!'
            })
          },
          nextButtonText: 'Start Monologue'
        },
        {
          id: 'Load Prologue 1',
          title: <Typography component="h5" variant="h5">Load Prologue 1</Typography>,
          onClickNext: () => {
            editLobby(lobby.id, {
              currentGameId: isLocalHost() ? '63af7a2acd7df2644a508245' : '63bcb9f10d17e60053793a2a',
              isGamePoweredOn: true
            })
          },
          nextButtonText: 'Load Prologue 1'
        },
        {
          id: 'i1 - Reveal Game Screen',
          title: <Typography component="h5" variant="h5">i1 - Reveal Game Screen</Typography>,
          instructions: <>
            This will set the participants game screen to be able to see the Game View and the Game View only
          </>,
          onClickNext: () => {
            updateArcadeGameCharacter({
              userId: lobby.participantId,
              unlockableInterfaceIds: {
                gameView: true,
              }
            })
          },
          nextButtonText: 'Set Interface to i1'
        },
        {
          id: 'Send Participant to Stars',
          title: <Typography component="h5" variant="h5">Send Participant to Stars</Typography>,
          onClickNext: () => {
            openConstellation({ externalForceCobrowsingUpdateUserId: lobby.participantId })
          },
          nextButtonText: 'Send Participant to Stars'
        },
        {
          id: 'Load Prologue 2',
          title: <Typography component="h5" variant="h5">Load Prologue 2</Typography>,
          onClickNext: () => {
            editLobby(lobby.id, {
              currentGameId: isLocalHost() ? '63af1a6717b22f6245d88269' : '63af258a1a7bdd005363ac7e',
              isGamePoweredOn: true
            })
          },
          nextButtonText: 'Load Prologue 2'
        },
        {
          id: 'Return Participant to Stars',
          title: <Typography component="h5" variant="h5">Return Participant to Stars</Typography>,
          onClickNext: () => {
            completeCloseConstellation({ externalForceCobrowsingUpdateUserId: lobby.participantId })
          },
          nextButtonText: 'Return Participant to Stars'
        },
        {
          id: 'Load Editing Game',
          title: <Typography component="h5" variant="h5">Load Editing Game</Typography>,
          onClickNext: () => {
            editLobby(lobby.id, {
              currentGameId: lobby.game.id,
              isGamePoweredOn: true
            })
          },
          nextButtonText: 'Load Editing Game'
        },
      ]}
      completed={<>
          <Typography component="h5" variant="h5">Join Participant</Typography>
          <UserStatus hasJoinLink userId={usersById[lobby.participantId]?.id}/>
        </>}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { editLobby,addArcadeGame, assignLobbyRole, unloadArcadeGame, unlockInterfaceId, updateArcadeGameCharacter, openConstellation, completeCloseConstellation }),
)(LobbySetupFlow);
