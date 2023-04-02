import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';
import { MenuIconButtonBody } from '../../../ui/MenuIconButton/MenuIconButton';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingMenuIconButton({interfaceIdGroup, menu, icon, updateOpenInterfaceId, gameSelector, interfaceId}) {
  if(!gameSelector.openInterfaceIdGroups) return 

  const open = gameSelector.openInterfaceIdGroups[interfaceIdGroup] === interfaceId

  function handleChange(isOpen) {
    updateOpenInterfaceId(interfaceIdGroup, isOpen ? interfaceId : null);
  };

  return <MenuIconButtonBody icon={icon} interfaceId={interfaceId} onOpen={() => {
    handleChange(true)
  }} onClose={() => {
    handleChange(false)
  }} menu={menu} open={open}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId }),
)(CobrowsingMenuIconButton);
