import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import './Unlockable.scss';
import Icon from '../../ui/Icon/Icon';
import { openUnlockableContextMenu } from '../../../store/actions/contextMenuActions';

const Unlockable = ({ unlockableInterface, interfaceId, children, isSlider, auth: { me }, openUnlockableContextMenu }) => {
  const ids = interfaceId.split(' ')
  const idLayers = ids.map((id) => {
    return id.split('/')
  })

  const isUnlocked = idLayers.some((layer) => {
    return layer.some((id) => {
      return unlockableInterface[id]
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
    return <div className={classNames("Unlockable__menu")} onClick={(event) => {
      openUnlockableContextMenu(event)
    }}>
      <Icon  size="sm" icon={isUnlocked ? "faUnlock" : "faLock"} />
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

const mapStateToProps = (state) => ({
  unlockableInterface: state.unlockableInterface,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { openUnlockableContextMenu }),
)(Unlockable);
