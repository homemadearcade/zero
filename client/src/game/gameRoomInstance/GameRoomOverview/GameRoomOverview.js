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
import LobbyMember from '../../../experience/lobbyInstance/LobbyMember/LobbyMember';
import GameRoomPowerIndicator from '../GameRoomPowerIndicator/GameRoomPowerIndicator';
import Icon from '../../../ui/Icon/Icon';
import Switch from '../../../ui/Switch/Switch';

const GameRoomOverview = ({
  gameRoomInstance: { gameRoomInstance, gameRoomInstance: { isPoweredOn, isAutosaveDisabled } },
  myTracks, userTracks,
  lobbyInstance: { lobbyInstance },
  editGameRoom,
}) => {
  return (
    <div className="GameRoomOverview">
      <Typography component="div" variant="subtitle1">Game:</Typography>
      <GameStatus/>
      <Divider></Divider>
        <GameRoomPowerIndicator/>
        <div className="GameRoomDrawer__not-saving-stage">
          <Icon icon="faFloppyDisk"></Icon>
          <Typography variant="subtitle2">Autosave Disabled</Typography>
          <Switch
            size="small"
            onChange={() => {
              editGameRoom(gameRoomInstance.id, {
                isAutosaveDisabled: !isAutosaveDisabled
              })
            }}
            checked={isAutosaveDisabled}
          />
        </div>
      <Divider></Divider>
      <SelectArcadeGame label="Select from games owned by host" userMongoId={gameRoomInstance.hostUserMongoId} onSelect={(games) => {
        if(games[0]) {
          editGameRoom(gameRoomInstance.id, {
            arcadeGameMongoId: games[games.length - 1].id
          })
        }
      }}/>
      <Divider></Divider>
      <Typography component="span" variant="subtitle1">Game Host:</Typography>
      <LobbyMember myTracks={myTracks} userTracks={userTracks} userMongoId={gameRoomInstance.hostUserMongoId}></LobbyMember>
      {<SelectUsers userMongoIds={lobbyInstance.members.map((member) => member.userMongoId)} label="Select Host" onSelect={(users) => {
        if(users[0]) {
          editGameRoom(gameRoomInstance.id, {
            hostUserMongoId: users[users.length - 1],
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
