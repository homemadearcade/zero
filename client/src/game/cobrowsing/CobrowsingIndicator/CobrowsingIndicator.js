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
    <ButtonGroup orientation="vertical" value={getCobrowsingUI()} options={[
      {
        value: 'COBROWSE_EDIT',
        icon: <Icon size="xl" icon="faPenToSquare"></Icon>
      },
      {
        value: 'COBROWSE_ACTIVE',
        icon: <Icon size="xl" icon="faUserSecret"></Icon>
      },
      {
        value: 'COBROWSE_UNLOCK',
        icon: <Icon size="xl" icon="faUserLock"></Icon>
      }
    ]} onSelectOption={(event, value) => {
      if(value === 'COBROWSE_ACTIVE') {
        toggleActiveCobrowsing(true)
        toggleUnlockableInterfaceLocks(true)
      } else if(value === 'COBROWSE_UNLOCK') {
        toggleActiveCobrowsing(true)
        toggleUnlockableInterfaceLocks(true)
      } else if(value === 'COBROWSING_EDIT') {
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
