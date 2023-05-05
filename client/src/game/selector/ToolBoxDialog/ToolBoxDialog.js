/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeToolBoxDialog } from '../../../store/actions/game/gameSelectorActions';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import './ToolBoxDialog.scss'

import ToolBoxList from '../ToolBoxList/ToolBoxList';

const ToolBoxDialog = ({ 
  closeToolBoxDialog, 
 }) => {

  function handleClose(e) {
    closeToolBoxDialog()
  }

  return <><CobrowsingDialog open onClose={handleClose}>
    <div className="ToolBoxDialog">
      <ToolBoxList onSelectTool={(entityModelId) => {

        }}/>
      </div>
    </CobrowsingDialog>
  </>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {

})

export default compose(
  connect(mapStateToProps, { closeToolBoxDialog }),
)(ToolBoxDialog);
