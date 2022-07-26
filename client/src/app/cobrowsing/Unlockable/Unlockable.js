import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Unlockable.scss';
import Icon from '../../ui/Icon/Icon';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import MenuIconButton from '../../ui/MenuIconButton/MenuIconButton';
import { MenuItem } from '@mui/material';
import { lockInterfaceId, unlockInterfaceId } from '../../../store/actions/unlockableInterfaceActions';

const Unlockable = ({ lobby: { lobby }, isTiny, className, unlockableInterface, lockInterfaceId, unlockInterfaceId, interfaceId, children, isSlider, auth: { me } }) => {
  const originalComponent = <div className={className}>{children}</div>

  if(!lobby.id) return <div className={className}>{children}</div>

  const ids = interfaceId.split(' ')
  const idLayers = ids.map((id) => {
    return id.split('/')
  })

  const idAliases = idLayers.map((layers) => {
    return layers.map((idLayer, index) => {
      let prefix = ''
      for(let i = 0; i < index; i++) {
        if(prefix.length) {
          prefix = prefix + '/' + layers[i]
        } else {
          prefix = prefix + layers[i]
        }
      }

      if(prefix.length) {
        const idSection = prefix +'/'+ idLayer
        return idSection
      } else {
        return idLayer
      }
    })
  }, [])

  const isUnlocked = unlockableInterface['all'] || idAliases.every((aliases) => {
    return aliases.some((alias) => {
      return unlockableInterface[alias]
    })
  })

  // const childrenWithProps = React.Children.map(children, child => {
  //   // Checking isValidElement is the safe way and avoids a typescript
  //   // error too.
  //   if (React.isValidElement(child)) {
  //     return React.cloneElement(child, { doSomething });
  //   }
  //   return child;
  // });

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
        if(unlockableInterface[id]) {
          return <MenuItem key={id} onClick={() => {
            lockInterfaceId(id)
            closeMenu()
          }}>Lock {id}</MenuItem>
        } else return null
      })
    }
  }

  function UnlockableMenu() {
    return <div className={classNames("Unlockable__menu", {'Unlockable__menu--tiny': isTiny})}>
      <MenuIconButton 
        icon={<Icon size="xs" icon={isUnlocked ? "faLockOpen" : "faLock"} />} 
        menu={mapIdsToMenuItems}
      />
    </div>
  }

  if(me.role === 'ADMIN') {
    if(isUnlocked) {

      // not enough space to have an icon or menu when its unlocked
      if(isTiny) return originalComponent

      return <div className={className + " Unlockable Unlockable--unlocked"}>
        {children}
        <UnlockableMenu/>
      </div>
    }

    // IF UNLOCKED AS THE ADMIN THEN STILL SHOW MENU
    return <div className={className + " Unlockable Unlockable--admin"}>
      {/* if its locked and tiny, we just wont show the child so we can actually click the lock */}
      {!isTiny && children}
      <UnlockableMenu/>
    </div>
  }

  // FOR NON ADMINS, if UNLOCKED, JUST SHOW THE COMPONENT
  if(isUnlocked) {
    return <div className={className}>{children}</div>
  }
  
  // IF LOCKED UP THEN JUST SHOW A BLACK WALL
  return <div className={className + " Unlockable Unlockable--locked"}>
    {children}
    <div className={classNames("Unlockable__cover", {'Unlockable__cover--slider': isSlider})}>
      <Icon icon="faLock" />
    </div>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  unlockableInterface: state.unlockableInterface,
  auth: state.auth,
  lobby: state.lobby
});

export default compose(
  connect(mapStateToProps, { unlockInterfaceId, lockInterfaceId  }),
)(Unlockable);
