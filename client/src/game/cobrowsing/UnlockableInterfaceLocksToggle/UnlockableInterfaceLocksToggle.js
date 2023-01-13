/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import './UnlockableInterfaceLocksToggle.scss'
import Switch from '../../../ui/Switch/Switch';
import { toggleUnlockableInterfaceLocks } from '../../../store/actions/cobrowsingActions';

const UnlockableInterfaceLocksToggle = ({
  cobrowsing: { showUnlockableInterfaceLocks, isSubscribedCobrowsing, isCurrentlyCobrowsing },
  toggleUnlockableInterfaceLocks
}) => {
  if(!isSubscribedCobrowsing) return null

  return <div
    className="UnlockableInterfaceLocksToggle"
    onClick={async () => {
      toggleUnlockableInterfaceLocks()
    }}
  > 
    <Icon icon="faLock"/>
    <Switch
      size="small"
      checked={!isCurrentlyCobrowsing && showUnlockableInterfaceLocks}
      />
  </div>
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing,
});

export default compose(
  connect(mapStateToProps, { toggleUnlockableInterfaceLocks }),
)(UnlockableInterfaceLocksToggle);
