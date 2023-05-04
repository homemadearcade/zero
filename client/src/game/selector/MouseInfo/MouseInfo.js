/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import HoverPreview from '../HoverPreview/HoverPreview';
import ClickPreview from '../ClickPreview/ClickPreview';
import Icon from '../../../ui/Icon/Icon';
import './MouseInfo.scss'
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { MOUSE_INFO_TITLE_IID } from '../../../constants/interfaceIds';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils';

const MouseInfo = ({
  hoverPreviewOnly,
  gameSelector: { openInterfaceIdGroups },
  updateOpenInterfaceId
}) => {
  
  const isExpanded = openInterfaceIdGroups[MOUSE_INFO_TITLE_IID]
  
  return <div
    className="MouseInfo"
  > 
    {!hoverPreviewOnly &&  <Unlockable interfaceId={MOUSE_INFO_TITLE_IID}><div className="MouseInfo__header" onClick={() => {
      updateOpenInterfaceId(MOUSE_INFO_TITLE_IID, !isExpanded)
    }}>
      <Icon icon="faArrowPointer" color="#aaa" size="xs"/>
    </div></Unlockable> }
    {!hoverPreviewOnly && isExpanded && <ClickPreview/>}
    <HoverPreview/>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId }),
)(MouseInfo);
  