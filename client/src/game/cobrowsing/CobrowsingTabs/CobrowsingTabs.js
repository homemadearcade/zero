import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { TabsBody } from '../../../ui/Tabs/Tabs';

function CobrowsingNestedList({interfaceGroupId, tabs, className, updateOpenInterfaceId, gameSelector}) {
   const currentTabInterfaceId = gameSelector.openInterfaceIdGroups[interfaceGroupId]

  const handleChange = (newTab) =>{
    updateOpenInterfaceId(interfaceGroupId, newTab);
  };

  return <TabsBody tabs={tabs} obscureInterfaceIds className={className} currentTabInterfaceId={currentTabInterfaceId} onChange={handleChange}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId }),
)(CobrowsingNestedList);
