/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import UserStatus from '../../UserStatus/UserStatus';

import './LobbyDetail.scss';
import Typography from '../../ui/Typography/Typography';
import GameStatus from '../../game/GameStatus/GameStatus';

const LobbyDetail = ({
  lobby: { lobby },
  userTracks, 
  myTracks
}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  return (
    <div className="LobbyDetail">
      <Typography component="div" variant="subtitle1">{"Lobby: "}<br/></Typography>
      <Typography component="div" variant="subtitle2">{lobby.id}</Typography>
      <div className="LobbyDetail__roles">
        <div className="LobbyDetail__role">
        <Typography component="div" variant="subtitle1">Game Host:</Typography>
          {lobby.gameHostId && !usersById[lobby.gameHostId] && <Typography component="div" variant="subtitle2">User is not in room</Typography>}
          {lobby.gameHostId && usersById[lobby.gameHostId] && <UserStatus hasJoinLink myTracks={myTracks} userTracks={userTracks} userId={usersById[lobby.gameHostId]?.id}/>}
          {!lobby.gameHostId && <Typography component="div" variant="subtitle2">No Game Host Selected</Typography>}
        </div>
        <div className="LobbyDetail__role">
          <Typography component="div" variant="subtitle1">Participant:</Typography>
          {lobby.participantId && !usersById[lobby.participantId] && <Typography component="div" variant="subtitle2">User is not in room</Typography>}
          {lobby.participantId && usersById[lobby.participantId] && <UserStatus hasJoinLink myTracks={myTracks} userTracks={userTracks} userId={usersById[lobby.participantId]?.id}/>}
          {!lobby.participantId && <Typography component="div" variant="subtitle2">No Participant Selected</Typography>}
        </div>
        <div className="LobbyDetail__role">
          <Typography component="div" variant="subtitle1">Guide:</Typography>
          {lobby.guideId && !usersById[lobby.guideId] && <Typography component="div" variant="subtitle2">User is not in room</Typography>}
          {lobby.guideId && usersById[lobby.guideId] && <UserStatus hasJoinLink myTracks={myTracks} userTracks={userTracks} userId={usersById[lobby.guideId]?.id}/>}
          {!lobby.guideId && <Typography component="div" variant="subtitle2">No Guide Selected</Typography>}
        </div>
        <div className="LobbyDetail__others">
          <Typography component="div" variant="subtitle1">Watchers:</Typography>
          <div>{lobby.users.filter((user) => {
            if(user.id ===lobby.guideId || user.id === lobby.participantId || user.id === lobby.gameHostId) return null
            return true
          }).length === 0 && <Typography component="div" variant="subtitle2">No one watching</Typography>}</div>
          <div>{lobby.users.map((user) => {
            if(user.id ===lobby.guideId || user.id === lobby.participantId || user.id === lobby.gameHostId) return null
            return <UserStatus hasJoinLink key={user.id} myTracks={myTracks} userTracks={userTracks} userId={user.id}/>
          })}</div>
        </div>
      </div>
      <Typography component="div" variant="subtitle1">Game:</Typography>
      <GameStatus/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { }),
)(LobbyDetail);
