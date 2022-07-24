/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import UserStatus from '../UserStatus/UserStatus';

import './LobbyDetail.scss';
import GameCard from '../GameCard/GameCard';
import Typography from '../ui/Typography/Typography';
import GameStatus from '../GameStatus/GameStatus';

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
      <Typography component="div" variant="subtitle1">{"Lobby: " + lobby.id}</Typography>
      <div className="LobbyDetail__roles">
        <div className="LobbyDetail__role">
        <Typography component="div" variant="subtitle1">Game Host:</Typography>
          {lobby.gameHostId && <UserStatus myTracks={myTracks} userTracks={userTracks} userId={usersById[lobby.gameHostId]?.id}/>}
          {!lobby.gameHostId && <div>No Game Host Selected</div>}
        </div>
        <div className="LobbyDetail__role">
          <Typography component="div" variant="subtitle1">Participant:</Typography>
          {lobby.participantId && <UserStatus myTracks={myTracks} userTracks={userTracks} userId={usersById[lobby.participantId]?.id}/>}
          {!lobby.participantId && <div>No Participant Selected</div>}
        </div>
        <div className="LobbyDetail__role">
          <Typography component="div" variant="subtitle1">Guide:</Typography>
          {lobby.guideId && <UserStatus myTracks={myTracks} userTracks={userTracks} userId={usersById[lobby.guideId]?.id}/>}
          {!lobby.guideId && <div>No Guide Selected</div>}
        </div>
        <div className="LobbyDetail__others">
          <Typography component="div" variant="subtitle1">Watching:</Typography>
          {lobby.users.filter((user) => {
            if(user.id ===lobby.guideId || user.id === lobby.participantId || user.id === lobby.gameHostId) return null
            return true
          }).length === 0 && 'No one watching'}
          {lobby.users.map((user) => {
            if(user.id ===lobby.guideId || user.id === lobby.participantId || user.id === lobby.gameHostId) return null
            return <UserStatus key={user.id} myTracks={myTracks} userTracks={userTracks} userId={user.id}/>
          })}
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
