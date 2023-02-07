/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperiencePreview.scss';
import GamePreview from '../../game/GamePreview/GamePreview';
import Typography from '../../ui/Typography/Typography';
import Icon from '../../ui/Icon/Icon';
import { CHATROOM_UI, experienceStateKeyToDisplayName, GAME_EDITOR_UI, MONOLOGUE_UI, WAITING_UI } from '../../constants';
import SelectExperienceState from '../../ui/SelectExperienceState/SelectExperienceState';
import { editLobby } from '../../store/actions/lobbyActions';
import LobbyChatroom from '../LobbyChatroom/LobbyChatroom';
import LobbyUserStatus from '../LobbyUserStatus/LobbyUserStatus';

const ExperiencePreview = ({
  lobby: { lobby },
  editLobby
}) => {

  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  function renderExperiencePreview() {   
    return <GamePreview userId={lobby.participantId}></GamePreview>
  }
  
  return (
    <div className="ExperiencePreview">

      <div className="ExperiencePreview__window">
        {renderExperiencePreview()}

      </div>
      <div className="ExperiencePreview__state">
        <SelectExperienceState 
          value={[lobby.experienceState]}
          onChange={(event, experienceState) => {
            editLobby(lobby.id, {
              experienceState: experienceState
            })       
          }}/>
      </div>
      <div className="ExperiencePreview__user">
        <LobbyUserStatus hasJoinLink hasUIButton userId={usersById[lobby.participantId]?.id}/>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, {  editLobby }),
)(ExperiencePreview);
