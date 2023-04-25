import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { TabsBody } from '../../../ui/Tabs/Tabs';

function CobrowsingNestedList({interfaceGroupId, tabs, className, updateOpenInterfaceId, gameSelector}) {
   const open = gameSelector.openInterfaceIdGroups[interfaceGroupId]

  useEffect(() => {
    if(open === undefined) {
      updateOpenInterfaceId(interfaceGroupId, 0);
    }
  }, [])

  if(open === undefined) return

  const handleChange = (newTab) =>{
    updateOpenInterfaceId(interfaceGroupId, newTab);
  };

  return <TabsBody tabs={tabs} className={className} value={open} onChange={handleChange}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId }),
)(CobrowsingNestedList);
