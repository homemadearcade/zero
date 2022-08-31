/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../app/ui/Icon/Icon';

import './GridToggle.scss'
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import { toggleGridView } from '../../store/actions/editorActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import Switch from '../../app/ui/Switch/Switch';

const GridToggle = ({
  editor: { isGridViewOn}, 
  toggleGridView
}) => {
  return <Unlockable interfaceId="toolbar/toggleGrid">
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
  editor: state.editor,
});

export default compose(
  connect(mapStateToProps, { toggleGridView }),
)(GridToggle);
