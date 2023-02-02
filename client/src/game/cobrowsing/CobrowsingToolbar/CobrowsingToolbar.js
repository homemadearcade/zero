import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingToolbar.scss';
import { selectCobrowsingTool } from '../../../store/actions/cobrowsingActions';
import Icon from '../../../ui/Icon/Icon';
import { OPEN_TOOL, UNLOCK_TOOL } from '../../constants';
import IconButton from '../../../ui/IconButton/IconButton';

const toolToIcon = {
  [UNLOCK_TOOL]: 'faLockOpen',
  [OPEN_TOOL]: 'faHandPointer'
}

const CobrowsingToolbar = ({cobrowsing: { selectedTool }, selectCobrowsingTool }) => {
  const [isOverClose, setIsOverClose] = useState(false)

  function renderBody() {
    if(selectedTool) {
      return <div 
        onMouseEnter={() => {
          setIsOverClose(true)
        }}
        onMouseLeave={() => {
          setIsOverClose(false)
        }} 
      >
        <IconButton size="large" icon={isOverClose ? "faClose" :toolToIcon[selectedTool]} onClick={() => {
            selectCobrowsingTool()
        }}/>
      </div>
    }

    return <>
      <IconButton size="large" icon="faHandPointer" onClick={() => {
        selectCobrowsingTool(OPEN_TOOL)
        setIsOverClose(false)
      }}/>
      <IconButton size="large" icon="faLockOpen" onClick={() => {
        selectCobrowsingTool(UNLOCK_TOOL)
        setIsOverClose(false)
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
