/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperiencePreview.scss';
import GamePreview from '../../game/GamePreview/GamePreview';
import Typography from '../../ui/Typography/Typography';
import withCobrowsing from '../../hoc/withCobrowsing';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import Icon from '../../ui/Icon/Icon';
import { CHATROOM_UI, experienceStateKeyToDisplayName, GAME_EDITOR_UI, MONOLOGUE_UI, WAITING_UI } from '../../constants';
import SelectExperienceState from '../../ui/SelectExperienceState/SelectExperienceState';
import { editLobby } from '../../store/actions/lobbyActions';
import LobbyChatroom from '../LobbyChatroom/LobbyChatroom';
import LobbyUserStatus from '../LobbyUserStatus/LobbyUserStatus';
import GameStatus from '../GameStatus/GameStatus';

const ExperiencePreview = ({
  lobby: { lobby },
  gameContext: { isConstellationOpen },
  editLobby
}) => {

  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  function renderExperiencePreview() {   
    if(lobby.experienceState === CHATROOM_UI) {
      return <LobbyChatroom hideAutomated></LobbyChatroom>
    }

    if(lobby.experienceState === WAITING_UI) {
      return <>
        <Typography variant="h5">{experienceStateKeyToDisplayName[lobby.experienceState]}</Typography>
        <Typography variant="subtitle2">Your experience will start shortly...</Typography>
      </>
    }

    if(lobby.experienceState === GAME_EDITOR_UI) {
      return <GamePreview gameId={lobby.currentGameId} userId={lobby.participantId}></GamePreview>
    }

    if(lobby.experienceState === MONOLOGUE_UI) {
      return <>
        <Typography variant="h5">{experienceStateKeyToDisplayName[lobby.experienceState]}</Typography>
      </>
    }
  }

        // <Typography variant="h5">Preview</Typography>

  return (
    <div className="ExperiencePreview">

      <div className="ExperiencePreview__window">
        {renderExperiencePreview()}
        {isConstellationOpen && lobby.experienceState !== GAME_EDITOR_UI && 
          <div className="ExperiencePreview__star">
            <Icon size="lg" icon="faStar"></Icon>
            <br/>Star View is overlaying {experienceStateKeyToDisplayName[lobby.experienceState]}
          </div>
        }
      </div>
      <div className="ExperiencePreview__state">
        <SelectExperienceState 
          value={[lobby.experienceState]}
          onChange={(event, experienceState) => {
            editLobby(lobby.id, {
              experienceState: experienceState[experienceState.length-1]
            })       
          }}/>
      </div>
      <div className="ExperiencePreview__user">
        <LobbyUserStatus hasJoinLink hasUIButton userId={usersById[lobby.participantId]?.id}/>
      </div>
      <div className="ExperiencePreview__note"><GameStatus/></div>
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  gameContext: state.gameContext
}, { forceActiveCobrowsing: true });

export default compose(
  withCobrowsing,
  connect(mapStateToProps, {  editLobby }),
)(ExperiencePreview);
