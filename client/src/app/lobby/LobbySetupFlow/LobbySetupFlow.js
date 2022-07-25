/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { assignLobbyRole, editLobby } from '../../../store/actions/lobbyActions';

import './LobbySetupFlow.scss';
import { addGame, unloadGame } from '../../../store/actions/gameActions';
import GameSelect from '../../GameSelect/GameSelect';
import GameCard from '../../GameCard/GameCard';
import Typography from '../../ui/Typography/Typography';
import Button from '../../ui/Button/Button';
import LobbyChecklist from '../LobbyChecklist/LobbyChecklist';
import VerticalLinearStepper from '../../ui/VerticalLinearStepper/VerticalLinearStepper';
import UserStatus from '../../UserStatus/UserStatus';

const UNASSIGNED_ROLE = 'unassigned'

// {lobby.isGamePoweredOn && <Button
//   type="button"
//   variant="contained"
//   onClick={() => {
//     editLobby(lobby.id, {
//       isGamePoweredOn:false
//     })
//     unloadGame()
//   }}
// >
//   End game
// </Button>}

const LobbySetupFlow = ({
  addGame,
  editLobby,
  assignLobbyRole,
  unloadGame,
  lobby: { lobby },
}) => {

  function renderAssignRoles() {
    return <div className="LobbySetupFlow__roles">
      {lobby.users.map((user) => {
        return <UserStatus titleOnly key={user.id} userId={user.id}
          titleChildren={<>
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
            {user.role === 'ADMIN' && <Button onClick={() => {
              assignLobbyRole(lobby.id, {
                userId: user.id, 
                role: 'guide'
              });
            }}>Assign as Guide</Button>}
          </>}
        />
      })}
    </div>
  }

  function renderSelectGame() {

    return <>{lobby?.game?.id && 
      <GameCard game={lobby.game}/>}
      <GameSelect onSelect={(game) => {
        editLobby(lobby.id, {
          game
        })
      }}/>
      <Button disabled={!lobby.participantId} variant="contained" onClick={async () => {
        const response = await addGame({
          userId: lobby.participantId
        })
        editLobby(lobby.id, {
          game: response.data.game
        })
      }} startIcon={<i className="fas fa-plus"/>}>
        New Game
      </Button>
    </>
  }

  return (
    <div className="LobbySetupFlow">
      <VerticalLinearStepper steps={[
        {
          id: 'Assign Roles',
          title: <Typography component="h5" variant="h5">Assign Roles</Typography>,
          instructions: renderAssignRoles()
        },
        {
          id: 'Select Game',
          title: <Typography component="h5" variant="h5">Select Game</Typography>,
          instructions: renderSelectGame()
        },
        {
          id: 'Review Launch Checklist',
          title: <Typography component="h5" variant="h5">Review Launch Checklist </Typography>,
          instructions: <LobbyChecklist/>
        }
      ]}
      completed={<>
          All steps completed - you&apos;re finished
        </>}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { editLobby,addGame, assignLobbyRole, unloadGame }),
)(LobbySetupFlow);
