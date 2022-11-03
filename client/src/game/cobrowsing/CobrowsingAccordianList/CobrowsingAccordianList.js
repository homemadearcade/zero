import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { AccordionListBody } from '../../../ui/AccordianList/AccordianList';
import { updateAccordianList } from '../../../store/actions/gameEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingAccordianList({listId, accordians, updateAccordianList, gameEditor}) {
  if(!gameEditor.accordianLists) return 

  const expanded = gameEditor.accordianLists[listId]

  const handleChange = (panel) => (event, newExpanded) => {
    updateAccordianList(listId, newExpanded ? panel : false);
  };

  return <AccordionListBody accordianList={accordians} expanded={expanded} onChange={handleChange}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameEditor: state.gameEditor,
});

export default compose(
  connect(mapStateToProps, { updateAccordianList }),
)(CobrowsingAccordianList);
