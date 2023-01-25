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

const ExperiencePreview = ({
  lobby: { lobby },
  gameContext: { isConstellationOpen },
  editLobby
}) => {

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

  return (
    <div className="ExperiencePreview">
      <Typography variant="h5">Preview</Typography>

      <div className="ExperiencePreview__window">
        {renderExperiencePreview()}
        {isConstellationOpen && 
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
