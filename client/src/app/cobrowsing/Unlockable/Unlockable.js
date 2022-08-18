import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Unlockable.scss';
import Icon from '../../ui/Icon/Icon';
import { getInterfaceIdData } from '../../../utils/unlockableInterface';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import MenuIconButton from '../../ui/MenuIconButton/MenuIconButton';
import { MenuItem } from '@mui/material';
import { lockInterfaceId, unlockInterfaceId } from '../../../store/actions/unlockableInterfaceActions';

const Unlockable = ({isTiny, hideIfObscured, hideLockToggle, className, unlockableInterfaceIds, lockInterfaceId, unlockInterfaceId, interfaceId, children, isSlider, cobrowsing: { isCurrentlyCobrowsing, isSubscribedCobrowsing }}) => {

  const { isUnlocked, idAliases, isObscured, isLockToggleable } = getInterfaceIdData(interfaceId)

  const customClassName = className + ' id-' + interfaceId

  function mapIdsToMenuItems(closeMenu) {
    if(!isUnlocked) {
      return idAliases[0].slice().reverse().map((id) => {
        return <MenuItem key={id} onClick={() => {
          unlockInterfaceId(id)
          closeMenu()
        }}>Unlock {id}</MenuItem>
      })
    } else {
      return idAliases[0].map((id) => {
        if(unlockableInterfaceIds[id]) {
          return <MenuItem key={id} onClick={() => {
            lockInterfaceId(id)
            closeMenu()
          }}>Lock {id}</MenuItem>
        } else return null
      })
    }
  }

  function ToggleLockMenu() {
    return <div className={classNames("Unlockable__menu", {'Unlockable__menu--tiny': isTiny})}>
      <MenuIconButton 
        icon={<Icon size="xs" icon={isUnlocked ? "faLockOpen" : "faLock"} />} 
        menu={mapIdsToMenuItems}
      />
    </div>
  }

  // essentally for admins
  if(isLockToggleable) {
    if(isTiny) {
      if(isUnlocked || (!isCurrentlyCobrowsing && isSubscribedCobrowsing)) {
        return children
      }
      
      return <ToggleLockMenu/>
    }

    return <div className={customClassName + " Unlockable Unlockable--unlocked"}>
      {children}
      {/* not enough space to have unlockable icon when its unlocked */}
      {!hideLockToggle && <ToggleLockMenu/>}
    </div>
  }

  if(isUnlocked) {
    // if(isTiny) return children
    return <div className={customClassName}>{children}</div>
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

  return <div className={customClassName}>{children}</div>
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
