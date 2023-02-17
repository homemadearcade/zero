/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import './CobrowsingIndicator.scss'
import Switch from '../../../ui/Switch/Switch';
import { toggleActiveCobrowsing } from '../../../store/actions/cobrowsingActions';
import { GAME_EDITOR_ACTIVITY } from '../../../constants';

const CobrowsingIndicator = ({
  cobrowsing: { isSubscribedCobrowsing, isActivelyCobrowsing },
  lobby: { lobby: { currentActivity }},
  toggleActiveCobrowsing
}) => {
  
  if(!isSubscribedCobrowsing) return null

  return <div
    className="CobrowsingIndicator"
  > 
    <Icon icon="faPenToSquare"/>
    <Switch
      disabled={currentActivity !== GAME_EDITOR_ACTIVITY}
      onChange={async () => {
        toggleActiveCobrowsing()
      }}
      size="small"
      checked={!isActivelyCobrowsing}
      />
  </div>
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing,
  lobby: state.lobby
});

export default compose(
  connect(mapStateToProps, { toggleActiveCobrowsing }),
)(CobrowsingIndicator);
