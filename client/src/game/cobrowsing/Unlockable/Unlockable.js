import React, { useEffect, useRef, useState } from 'react';
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
import { confetti } from 'tsparticles-confetti'
import { useWishTheme } from '../../../hooks/useWishTheme';

const noAnimInterfaces = ['contextMenu/*']
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
  cobrowsing: { mouseOverInterfaceId, selectedTool, remoteStateUserId }, 
  width,
  height,
}) => {
  const [wasComponentLocked, setWasComponentLocked] = useState(false)
  const unlockableRef = useRef()
  const theme = useWishTheme()

  let interfaceIdToUnlock = interfaceIdExtension ? interfaceId + '/' + interfaceIdExtension : interfaceId
  interfaceIdToUnlock = interfaceIdPrefix ? interfaceIdPrefix + '/' + interfaceIdToUnlock : interfaceIdToUnlock

  const { 
    isUnlocked, 
    isObscured,
    isToolInteractable,
    adminOnly 
  } = getInterfaceIdData(interfaceId, interfaceIdToUnlock)

  useEffect(() => {
    if(!remoteStateUserId) return 

    if(wasComponentLocked && isUnlocked) {
      var rect = unlockableRef.current.getBoundingClientRect();
      if(noAnimInterfaces.includes(interfaceId)) return 
      confetti({
        origin: {
          x: (rect.left + (rect.width/2))/window.innerWidth,
          y: (rect.top + (rect.height/2))/window.innerHeight,
        },
        spread: 10,
        ticks: 300,
        gravity: .3,
        decay: 0.94,
        startVelocity: 10,
        particleCount: 100,
        scalar: 1,
        shapes: ['square'],
        colors: ['#333', '#222', '#000', '#333', '#222', '#000', '#333', '#222', '#000', '#333', '#222', '#000', '#333', '#222', '#000', '#333', '#222', '#000', '#FFF', theme.primaryColor.hexString]
      });
    }

    setWasComponentLocked(isUnlocked === false)
  }, [isUnlocked, remoteStateUserId])

  if(adminOnly && me?.role !== ADMIN_ROLE) {
    return null
  }

  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return <Fade in><div ref={unlockableRef}>{React.cloneElement(child, {width, height})}</div></Fade>
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
