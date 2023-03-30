/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../../ui/Icon/Icon';

import './GridToggle.scss'
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { toggleGridView } from '../../../store/actions/game/gameViewEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Switch from '../../../ui/Switch/Switch';
import { GRID_VIEW_TOGGLE_IID } from '../../../constants/interfaceIds';

const GridToggle = ({
  gameViewEditor: { isGridViewOn}, 
  toggleGridView
}) => {
  return <Unlockable interfaceId={GRID_VIEW_TOGGLE_IID}>
    <div
      className="GridToggle"
      onClick={() => {
        toggleGridView()
      }}
    > 
    <Icon icon="faTableCells"/>
    <Switch
      size="small"
      checked={isGridViewOn}
      />
    </div>
  </Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
});

export default compose(
  connect(mapStateToProps, { toggleGridView }),
)(GridToggle);
