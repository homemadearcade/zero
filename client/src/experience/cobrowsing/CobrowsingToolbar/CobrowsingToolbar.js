import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingToolbar.scss';
import { selectCobrowsingTool, toggleActiveCobrowsing } from '../../../store/actions/game/cobrowsingActions';
import IconButton from '../../../ui/IconButton/IconButton';
import { COBROWSE_ACTIVE_TOGGLE_AID, COBROWSE_CLICK_TOOL_AID, COBROWSE_UNLOCK_TOOL_AID } from '../../../constants/interfaceActionIds';

const toolToIcon = {
  [COBROWSE_UNLOCK_TOOL_AID]: 'faLockOpen',
  [COBROWSE_CLICK_TOOL_AID]: 'faBullseye',
  [COBROWSE_ACTIVE_TOGGLE_AID]: 'faWindowRestore'
}

const CobrowsingToolbar = ({
  cobrowsing: { selectedTool, isActivelyCobrowsing },
  selectCobrowsingTool,
  toggleActiveCobrowsing
 }) => {
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
        <IconButton size="small" sx={{backgroundColor: 'red'}} icon={isOverClose ? "faClose" :toolToIcon[selectedTool]} onClick={() => {
            selectCobrowsingTool(null)
        }}/>
      </div>
    }

    return <>
      <div className='CobrowsingToolbar__tool'>
        <IconButton size="small" icon={toolToIcon[COBROWSE_CLICK_TOOL_AID]} onClick={() => {
          if((!isActivelyCobrowsing)) return
          selectCobrowsingTool(COBROWSE_CLICK_TOOL_AID)
          setIsOverClose(false)
        }}/>
      </div>
      <div className='CobrowsingToolbar__tool'>
        <IconButton size="small" icon={toolToIcon[COBROWSE_UNLOCK_TOOL_AID]} onClick={() => {
          if((!isActivelyCobrowsing)) return

          selectCobrowsingTool(COBROWSE_UNLOCK_TOOL_AID)
          setIsOverClose(false)
        }}/>
      </div>
    </>
  }

  return (
    <div className="CobrowsingToolbar" style={{
      opacity: isActivelyCobrowsing ? 1 : 0.5
    }}>
      {renderBody()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { selectCobrowsingTool, toggleActiveCobrowsing }),
)(CobrowsingToolbar);
