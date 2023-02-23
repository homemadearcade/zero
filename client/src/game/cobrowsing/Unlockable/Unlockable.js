import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Unlockable.scss';
import { getInterfaceIdData } from '../../../utils/unlockableInterfaceUtils';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { Fade } from '@mui/material';
import { lockInterfaceId, unlockInterfaceId } from '../../../store/actions/unlockableInterfaceActions';
import { setMouseOverInterfaceId, selectCobrowsingTool } from '../../../store/actions/cobrowsingActions';
import { OPEN_TOOL, UNLOCK_TOOL } from '../../../constants';
import { ADMIN_ROLE } from '../../../constants';

const Unlockable = ({
  auth: { me },
  className,
  setMouseOverInterfaceId,
  lockInterfaceId,
  interfaceIdPrefix,
  interfaceIdExtension,
  selectCobrowsingTool,
  unlockInterfaceId,
  interfaceId,
  children,
  isSlider,
  cobrowsing: { mouseOverInterfaceId, selectedTool }, 
  width,
  height,
}) => {
  let interfaceIdToUnlock = interfaceIdExtension ? interfaceId + '/' + interfaceIdExtension : interfaceId
  interfaceIdToUnlock = interfaceIdPrefix ? interfaceIdPrefix + '/' + interfaceIdToUnlock : interfaceIdToUnlock

  const { 
    isUnlocked, 
    isObscured,
    isToolInteractable,
    adminOnly 
  } = getInterfaceIdData(interfaceId, interfaceIdToUnlock)

  if(adminOnly && me?.role !== ADMIN_ROLE) {
    return null
  }

  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return <Fade in><div>{React.cloneElement(child, {width, height})}</div></Fade>
    })
  }

  function renderUnlockedChildren() {
    return <div 
      className={classNames(className)}
      onMouseEnter={() => {
        setMouseOverInterfaceId(interfaceIdToUnlock)
      }}
      onMouseLeave={() => {
        setMouseOverInterfaceId(null)
      }}>
      {renderChildren()}
    </div>
  }

  function renderUnlockCover() {
    return <div 
      className={
        classNames(
          "Unlockable__unlock-cover", 
          { 
            'Unlockable__unlock-cover--mouse-over': mouseOverInterfaceId === interfaceIdToUnlock, 
            'Unlockable__unlock-cover--slider': isSlider 
          }
        )
      }
      onClick={(e) => {
        if(selectedTool === UNLOCK_TOOL) {
          unlockInterfaceId(interfaceIdToUnlock)
        }

        if(!e.shiftKey) {
          selectCobrowsingTool(null)
        }
      }}
      onMouseEnter={() => {
        setMouseOverInterfaceId(interfaceIdToUnlock)
      }}
      onMouseLeave={() => {
        setMouseOverInterfaceId(null)
      }}
    >

    </div>
  }

  if(isObscured) return null

  function shouldShowUnlockCover() {
    if(selectedTool === UNLOCK_TOOL) {
      return !adminOnly && !isUnlocked
    }
    if(selectedTool === OPEN_TOOL) {
      return false
    }
  }

  if(isToolInteractable) {
    return <div 
      onClick={(e) => {
        if(selectedTool === OPEN_TOOL && !e.shiftKey) {
          selectCobrowsingTool(null)
        }
      }}
      className={classNames(className, "Unlockable", { 'Unlockable--openable': selectedTool=== OPEN_TOOL })}
    >
      {renderChildren()}
      {shouldShowUnlockCover() && renderUnlockCover()}
    </div>
  }

  return renderUnlockedChildren()
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  unlockableInterfaceIds: state.unlockableInterfaceIds,
  auth: state.auth,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { unlockInterfaceId, lockInterfaceId, setMouseOverInterfaceId, selectCobrowsingTool  }),
)(Unlockable);
