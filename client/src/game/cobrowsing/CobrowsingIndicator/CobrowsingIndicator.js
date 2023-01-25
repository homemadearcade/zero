/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';
import { toggleActiveCobrowsing, toggleUnlockableInterfaceLocks } from '../../../store/actions/cobrowsingActions';

import './CobrowsingIndicator.scss'
import ButtonGroup from '../../../ui/ButtonGroup/ButtonGroup';


const CobrowsingIndicator = ({
  cobrowsing: { isSubscribedCobrowsing, isActivelyCobrowsing, showUnlockableInterfaceLocks },
  toggleActiveCobrowsing,
  toggleUnlockableInterfaceLocks
}) => {
  if(!isSubscribedCobrowsing) return null

  function getCobrowsingUI() {
    if(isActivelyCobrowsing) {
      return 'COBROWSE_ACTIVE'
    } else if(showUnlockableInterfaceLocks) {
      return 'COBROWSE_UNLOCK'
    } else {
      return 'COBROWSE_EDIT'
    }
}
  
  return <div
    className="CobrowsingIndicator"
  > 
    <ButtonGroup value={getCobrowsingUI()} options={[
      {
        value: 'COBROWSE_EDIT',
        icon: <Icon icon="faUser"></Icon>
      },
      {
        value: 'COBROWSE_ACTIVE',
        icon: <Icon icon="faUserSecret"></Icon>
      },
      {
        value: 'COBROWSE_UNLOCK',
        icon: <Icon icon="faUserLock"></Icon>
      }
    ]} onSelectOption={(event, value) => {
      if(value === 'COBROWSE_ACTIVE') {
        toggleActiveCobrowsing(true)
        toggleUnlockableInterfaceLocks(false)
      } else if(value === 'COBROWSE_UNLOCK') {
        toggleActiveCobrowsing(false)
        toggleUnlockableInterfaceLocks(true)
      } else {
        toggleActiveCobrowsing(false)
        toggleUnlockableInterfaceLocks(false)
      }
    }}>
    </ButtonGroup>
  </div>
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing,
});

export default compose(
  connect(mapStateToProps, { toggleActiveCobrowsing, toggleUnlockableInterfaceLocks }),
)(CobrowsingIndicator);
