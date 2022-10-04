/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../ui/Icon/Icon';
import './ConstellationToggle.scss'
import Switch from '../ui/Switch/Switch';
import { openConstellation, completeCloseConstellation } from '../../store/actions/homemadeArcadeActions';
import { getCurrentGameScene } from '../../utils/editorUtils';

const ConstellationToggle = ({
  cobrowsing: { isSubscribedCobrowsing, 
    remoteState: {
      homemadeArcade: { isConstellationOpen, isConstellationClosing },
    } 
  },
  completeCloseConstellation,
  openConstellation,
}) => {

  if(!isSubscribedCobrowsing) return null
  
  return <div
    className="ConstellationToggle"
    onClick={async () => {
      if(isConstellationOpen) {
        completeCloseConstellation()
      } else {
        openConstellation()
      }
    }}
  > 
    <Icon icon="faStar"/>
    <Switch
      size="small"
      checked={isConstellationOpen}
      />
  </div>
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing,
  game: state.game
});

export default compose(
  connect(mapStateToProps, { completeCloseConstellation, openConstellation }),
)(ConstellationToggle);
