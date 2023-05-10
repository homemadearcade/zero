/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import KeyboardPreview from '../KeyboardPreview/KeyboardPreview';
import KeyboardShortcuts from '../KeyboardShortcuts/KeyboardShortcuts';
import './KeyboardInfo.scss'
import Icon from '../../../ui/Icon/Icon';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { KEYBOARD_INFO_TITLE_IID } from '../../../constants/interfaceIds';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils';

const KeyboardInfo = ({
  gameSelector: { openInterfaceIdGroups },
  updateOpenInterfaceId
}) => {
  
  const isExpanded = openInterfaceIdGroups[KEYBOARD_INFO_TITLE_IID]
  return <div
    className="KeyboardInfo"
  > 
    <Unlockable interfaceId={KEYBOARD_INFO_TITLE_IID}><div className="KeyboardInfo__header"  onClick={() => {
      updateOpenInterfaceId(KEYBOARD_INFO_TITLE_IID, !isExpanded)
    }}>
      <Icon icon="faKeyboard" color="#aaa" size="xs"/>
    </div></Unlockable>
    <KeyboardPreview isExpanded={isExpanded}/>
    <KeyboardShortcuts/>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId }),
)(KeyboardInfo);
  