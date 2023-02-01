import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Unlockable.scss';
import Icon from '../../../ui/Icon/Icon';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import MenuIconButton from '../../../ui/MenuIconButton/MenuIconButton';
import { Fade, MenuItem } from '@mui/material';
import { lockInterfaceId, unlockInterfaceId } from '../../../store/actions/unlockableInterfaceActions';
import { setMouseOverInterfaceId, toggleUnlockableInterfaceLocks } from '../../../store/actions/cobrowsingActions';

const Unlockable = ({setMouseOverInterfaceId, hideLockToggle, className, unlockableInterfaceIds, lockInterfaceId, toggleUnlockableInterfaceLocks, unlockInterfaceId, interfaceId, children, isSlider, cobrowsing: { mouseOverInterfaceId }, width, height}) => {
  const { isUnlocked, idAliases, isObscured, isLockToggleable } = getInterfaceIdData(interfaceId)

  // window.allInterfaceIds.push(interfaceId)

  const customClassName = className + ' id-' + interfaceId

  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return <Fade in><div>{React.cloneElement(child, {width, height})}</div></Fade>
    })
  }

  function renderCover() {
    return <div 
      className={
        classNames(
          "Unlockable__cover", 
          { 
            'Unlockable__cover--mouse-over': mouseOverInterfaceId === interfaceId, 
            'Unlockable__cover--slider': isSlider 
          }
        )
      }
      onClick={() => {
        unlockInterfaceId(interfaceId)
        toggleUnlockableInterfaceLocks(false)
      }}
      onMouseEnter={() => {
        setMouseOverInterfaceId(interfaceId)
      }}
      onMouseLeave={() => {
        setMouseOverInterfaceId(null)
      }}
    >

    </div>
  }

  if(isObscured) return null

  if(isLockToggleable) {
    return <div className={classNames(customClassName + " Unlockable Unlockable--unlocked")}>
      {renderChildren()}
      {!hideLockToggle && !isUnlocked && renderCover()}
    </div>
  }

  return renderChildren()
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  unlockableInterfaceIds: state.unlockableInterfaceIds,
  auth: state.auth,
  lobby: state.lobby,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { unlockInterfaceId, lockInterfaceId, setMouseOverInterfaceId, toggleUnlockableInterfaceLocks  }),
)(Unlockable);
