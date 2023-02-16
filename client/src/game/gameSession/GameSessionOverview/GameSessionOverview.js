/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameSessionOverview.scss';
import Typography from '../../../ui/Typography/Typography';
import GameStatus from '../../GameStatus/GameStatus';
import SelectGame from '../../../ui/connected/SelectGame/SelectGame';
import { editGameSession } from '../../../store/actions/gameSessionActions';
import Divider from '../../../ui/Divider/Divider';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import LobbyUsername from '../../../experience/LobbyUsername/LobbyUsername';

const GameSessionOverview = ({
  gameSession: { gameSession },
  myTracks, userTracks,
  lobby: { lobby },
  editGameSession,
}) => {
  return (
    <div className="GameSessionOverview">
      <Typography component="div" variant="subtitle1">Game:</Typography>
      <GameStatus/>
      <Divider></Divider>
      <SelectGame label="Select from games owned by host" userId={gameSession.hostUserId} onSelect={(games) => {
        if(games[0]) {
          editGameSession(gameSession.id, {
            gameId: games[games.length - 1]
          })
        }
      }}/>
      <Divider></Divider>
      <Typography component="span" variant="subtitle1">Game Host:</Typography>
      <LobbyUsername myTracks={myTracks} userTracks={userTracks} userId={gameSession.hostUserId}></LobbyUsername>
      {gameSession.hostUserId && <SelectUsers userIds={lobby.users.map(({id}) => id)} label="Select Host" onSelect={(users) => {
        if(users[0]) {
          editGameSession(gameSession.id, {
            hostUserId: users[users.length - 1],
          })
        }
      }}/>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameSession: state.gameSession,
  lobby: state.lobby
});

export default compose(
  connect(mapStateToProps, { editGameSession }),
)(GameSessionOverview);
