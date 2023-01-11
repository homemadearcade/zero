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

const Unlockable = ({isTiny, hideIfObscured = true, hideLockToggle, className, unlockableInterfaceIds, lockInterfaceId, unlockInterfaceId, interfaceId, children, isSlider, cobrowsing: { isCurrentlyCobrowsing, isSubscribedCobrowsing, showUnlockableInterfaceLocks }, width, height}) => {
  const { isUnlocked, idAliases, isObscured, isLockToggleable } = getInterfaceIdData(interfaceId)

  // window.allInterfaceIds.push(interfaceId)

  const customClassName = className + ' id-' + interfaceId

  function mapIdsToMenuItems(closeMenu) {
    const list = []

    if(isTiny && children.props.onClick) {
      const names = interfaceId.split('/')
      list.push(<MenuItem key="click" onClick={(e) => {
         children.props.onClick(e) 
         closeMenu()
      }}>Click {names[names.length-1]}</MenuItem>)
    }

    if(!isUnlocked) {
      idAliases.forEach(alias => alias.slice().reverse().forEach((id) => {
        list.push(<MenuItem key={id + alias} onClick={() => {
          unlockInterfaceId(id)
          closeMenu()
        }}>Unlock {id}</MenuItem>)
      }))
    } else {
      idAliases.forEach(alias => alias.forEach((id) => {
        if(unlockableInterfaceIds[id]) {
          list.push(<MenuItem key={id + alias} onClick={() => {
            lockInterfaceId(id)
            closeMenu()
          }}>Lock {id}</MenuItem>)
        }
      }))
    }

    return list
  }

  function ToggleLockMenu() {
    if(!showUnlockableInterfaceLocks) return 

    return <div className={classNames("Unlockable__menu", {'Unlockable__menu--tiny': isTiny})}>
      <MenuIconButton 
        icon={<Icon size="xs" icon={isUnlocked ? "faLockOpen" : "faLock"} />} 
        menu={mapIdsToMenuItems}
      />
    </div>
  }

  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return <Fade in><div>{React.cloneElement(child, {width, height})}</div></Fade>
    })
  }

  if(isObscured) {
    if(hideIfObscured) {
      return null
    }

    // IF LOCKED UP THEN JUST SHOW A BLACK WALL
    return <div className={classNames("Unlockable__cover", {'Unlockable__cover--slider': isSlider})}>
      <div className={customClassName + " Unlockable Unlockable--locked"}>
        {children}
      </div>
      <div className="Unlockable__obscured-icon">
        <Icon icon="faLock" />
      </div>
    </div>
  }

  // essentally for admins
  if(isLockToggleable) {
    if(isTiny) {
      if(isUnlocked || !showUnlockableInterfaceLocks) {
        return renderChildren()
      }
      
      return <ToggleLockMenu/>
    }

    return <div className={customClassName + " Unlockable Unlockable--unlocked"}>
      {!isObscured && renderChildren()}
      {/* not enough space to have unlockable icon when its unlocked */}
      {!hideLockToggle && <ToggleLockMenu/>}
    </div>
  }

  // if(isUnlocked) {
  //   // if(isTiny) return children
  //   return <Grow in>{children}</Grow>
  // }

  return renderChildren()
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  unlockableInterfaceIds: state.unlockableInterfaceIds,
  auth: state.auth,
  lobby: state.lobby,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { unlockInterfaceId, lockInterfaceId  }),
)(Unlockable);
