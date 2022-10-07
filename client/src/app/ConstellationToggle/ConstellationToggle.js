/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../ui/Icon/Icon';
import './ConstellationToggle.scss'
import Switch from '../ui/Switch/Switch';
import { openConstellation, completeCloseConstellation } from '../../store/actions/gameContextActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';

const ConstellationToggle = ({
  cobrowsing: { isSubscribedCobrowsing},
  gameContext: { isConstellationOpen, isConstellationClosing },
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

const mapStateToProps = (state) => mapCobrowsingState(state, {
  cobrowsing: state.cobrowsing,
  gameContext: state.gameContext
});

export default compose(
  connect(mapStateToProps, { completeCloseConstellation, openConstellation }),
)(ConstellationToggle);
