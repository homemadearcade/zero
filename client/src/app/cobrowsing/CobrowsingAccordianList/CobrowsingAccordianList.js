import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { AccordionListBody } from '../../ui/AccordianList/AccordianList';
import { updateAccordianList } from '../../../store/actions/editorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingAccordianList({listId, accordians, updateAccordianList, editor}) {
  if(!editor.accordianLists) return 

  const expanded = editor.accordianLists[listId]

  const handleChange = (panel) => (event, newExpanded) => {
    updateAccordianList(listId, newExpanded ? panel : false);
  };

  return <AccordionListBody accordianList={accordians} expanded={expanded} onChange={handleChange}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editor: state.editor,
});

export default compose(
  connect(mapStateToProps, { updateAccordianList }),
)(CobrowsingAccordianList);
