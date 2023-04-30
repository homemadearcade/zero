import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NestedListBody } from '../../../ui/NestedList/NestedList';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingNestedList({interfaceGroupId, children, onClick, updateOpenInterfaceId, gameSelector, title, interfaceId, moreMenu}) {
  if(!gameSelector.openInterfaceIdGroups) return 

  const expanded = gameSelector.openInterfaceIdGroups[interfaceGroupId]

  const handleChange = (panel) => (event) => {
    updateOpenInterfaceId(interfaceGroupId, expanded === interfaceId ? null : interfaceId);
  };

  return <NestedListBody obscureInterfaceIds interfaceGroupId={interfaceGroupId} onClick={onClick} title={title} interfaceId={interfaceId} children={children} expanded={expanded} onChange={handleChange} moreMenu={moreMenu}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId }),
)(CobrowsingNestedList);
