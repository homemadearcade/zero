import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Unlockable.scss';
import Icon from '../../ui/Icon/Icon';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import MenuIconButton from '../../ui/MenuIconButton/MenuIconButton';
import { MenuItem } from '@mui/material';

const Unlockable = ({ unlockableInterface, interfaceId, children, isSlider, auth: { me } }) => {
  const ids = interfaceId.split(' ')
  const idLayers = ids.map((id) => {
    return id.split('/')
  })

  const isUnlocked = unlockableInterface['all'] || idLayers.every((layer) => {
    return layer.some((id) => {
      return unlockableInterface[id] || unlockableInterface[id + '/all']
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

  function UnlockableMenu() {
    return <div className={classNames("Unlockable__menu")}>
      <MenuIconButton icon={<Icon size="xs" icon={isUnlocked ? "faUnlock" : "faLock"} />} menu={(closeMenu) => {
      return <MenuItem onMenuItemClick={closeMenu}>Hello</MenuItem>
      }}/>
    </div>
  }

  if(me.role === 'ADMIN') {
    if(isUnlocked) {
      return <div className="Unlockable Unlockable--unlocked">
        {children}
        <UnlockableMenu/>
      </div>
    }

    // IF UNLOCKED AS THE ADMIN THEN STILL SHOW MENU
    return <div className="Unlockable Unlockable--admin">
      {children}
      <UnlockableMenu/>
    </div>
  }


  // FOR NON ADMINS, if UNLOCKED, JUST SHOW THE COMPONENT
  if(isUnlocked) {
    return children
  }
  
  // IF LOCKED UP THEN JUST SHOW A BLACK WALL
  return <div className="Unlockable Unlockable--locked">
    {children}
    <div className={classNames("Unlockable__cover", {'Unlockable__cover--slider': isSlider})}>
      <Icon icon="faQuestionCircle" />
    </div>
  </div>


  // if(isUnlocked) {
  //   return <Badge color="secondary" variant="dot">
  //     {children}
  //   </Badge>
  // }

  // if(me.role === 'ADMIN') {
  //   return <Badge color="secondary" variant="dot">
  //     {children}
  //   </Badge>
  // }

  // return <Badge color="secondary" variant="dot">
  //   {children}
  // </Badge>
  
  
  // if(isUnlocked) {
  //   return <Badge color="secondary" variant="dot">
  //     {children}
  //   </Badge>
  // }

  // if(me.role === 'ADMIN') {
  //   return <Badge color="secondary" variant="dot">
  //     {children}
  //   </Badge>
  // }

  // return <Badge color="secondary" variant="dot">
  //   {children}
  // </Badge>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  unlockableInterface: state.unlockableInterface,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, {  }),
)(Unlockable);
