import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { AccordionListBody } from '../../../ui/AccordianList/AccordianList';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

function CobrowsingAccordianList({interfaceGroupId, accordians, updateOpenInterfaceId, gameSelector}) {
  if(!gameSelector.openInterfaceIdGroups) return 

  const expanded = gameSelector.openInterfaceIdGroups[interfaceGroupId]

  const handleChange = (panel) => (event, newExpanded) => {
    updateOpenInterfaceId(interfaceGroupId, newExpanded ? panel : false);
  };

  return <AccordionListBody accordianList={accordians} expanded={expanded} onChange={handleChange}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId }),
)(CobrowsingAccordianList);
