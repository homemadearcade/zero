/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import './CobrowsingIndicator.scss'
import Switch from '../../../ui/Switch/Switch';
import { toggleActiveCobrowsing } from '../../../store/actions/cobrowsingActions';

const CobrowsingIndicator = ({
  cobrowsing: { isSubscribedCobrowsing, isActivelyCobrowsing },
  toggleActiveCobrowsing
}) => {
  if(!isSubscribedCobrowsing) return null

  return <div
    className="CobrowsingIndicator"
    onClick={async () => {
      toggleActiveCobrowsing()
    }}
  > 
    <Icon icon="faPenToSquare"/>
    <Switch
      size="small"
      checked={!isActivelyCobrowsing}
      />
  </div>
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing,
});

export default compose(
  connect(mapStateToProps, { toggleActiveCobrowsing }),
)(CobrowsingIndicator);
