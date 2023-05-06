import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import KeyIndicator from '../../ui/KeyIndicator/KeyIndicator';
import './ControlsPopup.scss';

const ControlsPopup = ({ playerInterface: { cutsceneId, interactOppurtunity }}) => {
  if(!interactOppurtunity) return 
  if(cutsceneId) return

  return <div className="ControlsPopup">
    <div className="ControlsPopup__text-container">
      Press
      <KeyIndicator keyName="X" />
      to Interact
    </div>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  playerInterface: state.playerInterface,
});

export default compose(
  connect(mapStateToProps, { }),
)(ControlsPopup)