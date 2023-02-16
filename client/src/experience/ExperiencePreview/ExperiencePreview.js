/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperiencePreview.scss';
import GamePreview from '../../game/view/GamePreview/GamePreview';
import SelectExperienceState from '../../ui/SelectExperienceState/SelectExperienceState';
import { editLobby } from '../../store/actions/lobbyActions';
import Link from '../../ui/Link/Link';
import Button from '../../ui/Button/Button';

const ExperiencePreview = ({
  lobby: { lobby },
  editLobby
}) => {

  // const usersById = lobby.users.reduce((prev, next) => {
  //   prev[next.id] = next
  //   return prev
  // }, {})

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
        <Link to ={`/lobby/${lobby.id}/join/${lobby.participantId}`}>
          <Button variant="contained">
            Join Participant
          </Button>
        </Link>
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
