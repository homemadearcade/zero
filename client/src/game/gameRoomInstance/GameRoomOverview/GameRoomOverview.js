/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameRoomOverview.scss';
import Typography from '../../../ui/Typography/Typography';
import GameStatus from '../GameStatus/GameStatus';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import { editGameRoom } from '../../../store/actions/game/gameRoomInstanceActions';
import Divider from '../../../ui/Divider/Divider';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import LobbyUsername from '../../../experience/lobbyInstance/LobbyMember/LobbyMember';

const GameRoomOverview = ({
  gameRoomInstance: { gameRoomInstance },
  myTracks, userTracks,
  lobbyInstance: { lobbyInstance },
  editGameRoom,
}) => {
  return (
    <div className="GameRoomOverview">
      <Typography component="div" variant="subtitle1">Game:</Typography>
      <GameStatus/>
      <Divider></Divider>
      <SelectArcadeGame label="Select from games owned by host" userId={gameRoomInstance.hostUserId} onSelect={(games) => {
        if(games[0]) {
          editGameRoom(gameRoomInstance.id, {
            gameId: games[games.length - 1].id
          })
        }
      }}/>
      <Divider></Divider>
      <Typography component="span" variant="subtitle1">Game Host:</Typography>
      <LobbyUsername myTracks={myTracks} userTracks={userTracks} userId={gameRoomInstance.hostUserId}></LobbyUsername>
      {<SelectUsers userIds={lobbyInstance.members.map(({id}) => id)} label="Select Host" onSelect={(users) => {
        if(users[0]) {
          editGameRoom(gameRoomInstance.id, {
            hostUserId: users[users.length - 1],
          })
        }
      }}/>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameRoomInstance: state.gameRoomInstance,
  lobbyInstance: state.lobbyInstance
});

export default compose(
  connect(mapStateToProps, { editGameRoom }),
)(GameRoomOverview);
