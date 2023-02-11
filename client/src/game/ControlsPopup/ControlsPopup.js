import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import KeyIndicator from '../ui/KeyIndicator/KeyIndicator';
import './ControlsPopup.scss';

const ControlsPopup = ({ playerInterface: { controlsToPress }}) => {
  if(!controlsToPress) return 

  return <div className="ControlsPopup">
    <div className="ControlsPopup__text-container">
      Press
      <KeyIndicator className="ControlsPopup__key" keyName={controlsToPress.key} />
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