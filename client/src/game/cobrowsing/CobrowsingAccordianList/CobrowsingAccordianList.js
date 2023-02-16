import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { AccordionListBody } from '../../../ui/AccordianList/AccordianList';
import { updateAccordianList } from '../../../store/actions/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingAccordianList({listId, accordians, updateAccordianList, gameSelector}) {
  if(!gameSelector.accordianLists) return 

  const expanded = gameSelector.accordianLists[listId]

  const handleChange = (panel) => (event, newExpanded) => {
    updateAccordianList(listId, newExpanded ? panel : false);
  };

  return <AccordionListBody accordianList={accordians} expanded={expanded} onChange={handleChange}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateAccordianList }),
)(CobrowsingAccordianList);
