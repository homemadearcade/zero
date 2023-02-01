import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingToolbar.scss';
import { selectCobrowsingTool } from '../../../store/actions/cobrowsingActions';
import Icon from '../../../ui/Icon/Icon';
import { OPEN_TOOL, UNLOCK_TOOL } from '../../constants';
import IconButton from '../../../ui/IconButton/IconButton';

const CobrowsingToolbar = ({cobrowsing: { selectedTool }, selectCobrowsingTool }) => {
  function renderBody() {
    if(selectedTool) {
      return <IconButton size="large" icon="faClose" onClick={() => {
        selectCobrowsingTool()
      }}/>
    }

    return <>
      <IconButton size="large" icon="faLockOpen" onClick={() => {
        selectCobrowsingTool(UNLOCK_TOOL)
      }}/>
      <IconButton size="large" icon="faDoorOpen" onClick={() => {
        selectCobrowsingTool(OPEN_TOOL)
      }}/>
    </>
  }

  return (
    <div className="CobrowsingToolbar">
      {renderBody()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { selectCobrowsingTool }),
)(CobrowsingToolbar);
