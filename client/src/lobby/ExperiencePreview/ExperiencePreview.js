/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperiencePreview.scss';
import GamePreview from '../../game/GamePreview/GamePreview';
import Typography from '../../ui/Typography/Typography';
import { GAME_EDITOR_UI, MONOLOGUE_UI, WAITING_UI } from '../../game/constants';
import withCobrowsing from '../../hoc/withCobrowsing';

const ExperiencePreview = ({
  lobby: { lobby },
}) => {

  function renderExperiencePreview() {   
    if(lobby.experienceUI === WAITING_UI) {
      return <>
        <Typography variant="h5">Waiting View</Typography>
        <Typography variant="subtitle2">Your experience will start shortly...</Typography>
      </>
    }

    if(lobby.experienceUI === GAME_EDITOR_UI) {
      return <GamePreview gameId={lobby.currentGameId} userId={lobby.participantId}></GamePreview>
    }

    if(lobby.experienceUI === MONOLOGUE_UI) {
      return <Typography variant="h5">Monologue View</Typography>
    }
  }

  return (
    <div className="ExperiencePreview">
      {renderExperiencePreview()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  withCobrowsing,
  connect(mapStateToProps, { }),
)(ExperiencePreview);
