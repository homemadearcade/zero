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
import { ADMIN_ROLE, OPEN_TOOL, UNLOCK_TOOL } from '../../constants';

const Unlockable = ({
  auth: { me },
  adminOnly,
  setMouseOverInterfaceId,
  hideLockToggle,
  className,
  lockInterfaceId,
  selectCobrowsingTool,
  unlockInterfaceId,
  interfaceId,
  children,
  isSlider,
  cobrowsing: { mouseOverInterfaceId, selectedTool }, 
  width,
  height,
  isDefaultUnlocked,
}) => {
  const { isUnlocked, isObscured, isLockToggleable } = getInterfaceIdData(interfaceId)
  window.allInterfaceIds.push(interfaceId)

  if(adminOnly && me?.role !== ADMIN_ROLE) {
    return null
  }

  const customClassName = className + ' id-' + interfaceId


  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return <Fade in><div>{React.cloneElement(child, {width, height})}</div></Fade>
    })
  }

  if(isDefaultUnlocked) return renderChildren()

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
      onClick={(e) => {
        if(selectedTool === UNLOCK_TOOL) {
          unlockInterfaceId(interfaceId)
        }

        if(!e.shiftKey) {
          selectCobrowsingTool(null)
        }
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

  function shouldShowCover() {
    if(selectedTool === UNLOCK_TOOL) {
      return !hideLockToggle && !adminOnly && !isUnlocked
    }
    if(selectedTool === OPEN_TOOL) {
      return false
    }
  }

  function isOpenable() {
    if(!hideLockToggle && selectedTool=== OPEN_TOOL) {
      return !hideLockToggle
    }
  }

  if(isLockToggleable) {
    return <div 
      onClick={(e) => {
        if(!hideLockToggle && selectedTool === OPEN_TOOL && !e.shiftKey) {
          selectCobrowsingTool(null)
        }
      }}
      className={classNames(customClassName + " Unlockable Unlockable--unlocked", { 'Unlockable--openable': isOpenable() })}
    >
      {renderChildren()}
      {shouldShowCover() && renderCover()}
    </div>
  }

  return renderChildren()
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  unlockableInterfaceIds: state.unlockableInterfaceIds,
  auth: state.auth,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { unlockInterfaceId, lockInterfaceId, setMouseOverInterfaceId, selectCobrowsingTool  }),
)(Unlockable);
