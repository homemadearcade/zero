import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NestedListBody } from '../../../ui/NestedList/NestedList';
import { updateOpenList } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingNestedList({listId, id, children, onClick, updateOpenList, gameSelector, title, interfaceId, moreMenu}) {
  if(!gameSelector.openLists) return 

  const expanded = gameSelector.openLists[listId]

  const handleChange = (panel) => (event) => {
    updateOpenList(listId, expanded === id ? null : id);
  };

  return <NestedListBody listId={listId} id={id} onClick={onClick} title={title} interfaceId={interfaceId} children={children} expanded={expanded} onChange={handleChange} moreMenu={moreMenu}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenList }),
)(CobrowsingNestedList);
