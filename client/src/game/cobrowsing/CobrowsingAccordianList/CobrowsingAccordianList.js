import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { AccordionListBody } from '../../../ui/AccordianList/AccordianList';
import { updateOpenList } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingAccordianList({listId, accordians, updateOpenList, gameSelector}) {
  if(!gameSelector.openLists) return 

  const expanded = gameSelector.openLists[listId]

  const handleChange = (panel) => (event, newExpanded) => {
    updateOpenList(listId, newExpanded ? panel : false);
  };

  return <AccordionListBody accordianList={accordians} expanded={expanded} onChange={handleChange}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenList }),
)(CobrowsingAccordianList);
