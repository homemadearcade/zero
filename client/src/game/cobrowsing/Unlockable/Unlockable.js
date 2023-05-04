import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Unlockable.scss';
import { getInterfaceIdData } from '../../../utils/unlockedInterfaceUtils';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { Fade } from '@mui/material';
import { setInterfaceIdHovering, selectCobrowsingTool } from '../../../store/actions/game/cobrowsingActions';
import { APP_ADMIN_ROLE } from '../../../constants';
import { confetti } from 'tsparticles-confetti'
import { useWishTheme } from '../../../hooks/useWishTheme';
import { updateArcadeGameCharacter } from '../../../store/actions/game/arcadeGameActions';
import { COBROWSE_CLICK_TOOL_AID, COBROWSE_UNLOCK_TOOL_AID } from '../../../constants/interfaceActionIds';

const noAnimInterfaces = ['contextMenu/*']
const Unlockable = ({
  auth: { me },
  className,
  setInterfaceIdHovering,
  selectCobrowsingTool,
  experienceModel: { experienceModel },
  updateArcadeGameCharacter,
  interfaceId,
  children,
  isSlider,
  cobrowsing: { interfaceIdHovering, selectedTool, remoteStateUserMongoId, isSubscribedCobrowsing }, 
  width,
  height,
}) => {
  const [wasComponentLockedUserMongoId, setWasComponentLockedUserMongoId] = useState(false)
  const unlockableRef = useRef()
  const theme = useWishTheme()

  const { 
    isUnlocked, 
    isObscured,
    isToolInteractable,
    appAdminOnly 
  } = getInterfaceIdData(interfaceId)

  useEffect(() => {
    if(!remoteStateUserMongoId && isSubscribedCobrowsing) return 

    if(wasComponentLockedUserMongoId === remoteStateUserMongoId && isUnlocked) {
      var rect = unlockableRef.current.getBoundingClientRect();
      if(noAnimInterfaces.includes(interfaceId)) return 
      // console.log('conffetti for', interfaceId)
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

    setWasComponentLockedUserMongoId(isUnlocked === false ? remoteStateUserMongoId : false)
  }, [isUnlocked, remoteStateUserMongoId, isSubscribedCobrowsing])

  if(appAdminOnly && !me?.roles[APP_ADMIN_ROLE]) {
    return null
  }

  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return <Fade in><div ref={unlockableRef}>{React.cloneElement(child, {width: width ? width: null, height: height ? height : null})}</div></Fade>
    })
  }

  function renderUnlockedChildren() {
    return <div 
      className={classNames(className)}
      onMouseEnter={() => {
        setInterfaceIdHovering(interfaceId)
      }}
      onMouseLeave={() => {
        setInterfaceIdHovering(null)
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
            'Unlockable__unlock-cover--mouse-over': interfaceIdHovering === interfaceId, 
            'Unlockable__unlock-cover--slider': isSlider 
          }
        )
      }
      onClick={(e) => {
        if(selectedTool === COBROWSE_UNLOCK_TOOL_AID) {
          updateArcadeGameCharacter({
            experienceModelMongoId: experienceModel.id,
            userMongoId: remoteStateUserMongoId,
            unlockedInterfaceIds: {
              [interfaceId]: true
            },
            merge: true
          })
        }

        if(!e.shiftKey) {
          selectCobrowsingTool(null)
        }
      }}
      onMouseEnter={() => {
        setInterfaceIdHovering(interfaceId)
      }}
      onMouseLeave={() => {
        setInterfaceIdHovering(null)
      }}
    >

    </div>
  }

  if(isObscured) return null

  function shouldShowUnlockCover() {
    if(selectedTool === COBROWSE_UNLOCK_TOOL_AID) {
      return !appAdminOnly && !isUnlocked
    }
    if(selectedTool === COBROWSE_CLICK_TOOL_AID) {
      return false
    }
  }

  if(isToolInteractable) {
    return <div 
      onClick={(e) => {
        if(selectedTool === COBROWSE_CLICK_TOOL_AID && !e.shiftKey) {
          // selectCobrowsingTool(null)
        }
      }}
      className={classNames(className, "Unlockable", { 'Unlockable--openable': selectedTool=== COBROWSE_CLICK_TOOL_AID })}
    >
      {renderChildren()}
      {shouldShowUnlockCover() && renderUnlockCover()}
    </div>
  }

  return renderUnlockedChildren()
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  unlockedInterfaceIds: state.unlockedInterfaceIds,
  auth: state.auth,
  cobrowsing: state.cobrowsing,
  experienceModel: state.experienceModel
});

export default compose(
  connect(mapStateToProps, { setInterfaceIdHovering, selectCobrowsingTool, updateArcadeGameCharacter  }),
)(Unlockable);
