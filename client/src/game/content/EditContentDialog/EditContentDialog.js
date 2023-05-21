/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditContentDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeEditContentDialog } from '../../../store/actions/game/gameFormEditorActions';
import CobrowsingTabs from '../../cobrowsing/CobrowsingTabs/CobrowsingTabs';
import StagesList from '../../stages/StagesList/StagesList';
import GameTextures from '../../textures/GameTextures/GameTextures';
import { EDIT_CONTENT_STAGES_TAB_IID, EDIT_CONTENT_TAB_CONTANER_IID, EDIT_CONTENT_TEXTURES_TAB_IID, EDIT_CUTSCENES_TAB_IID } from '../../../constants/interfaceIds';
import CutscenesList from '../../cutscene/CutscenesList/CutscenesList';

const EditContentDialog = ({ 
  closeEditContentDialog, 
}) => {
  function handleClose() {
    closeEditContentDialog()
  }

  const stagesTab = {
    interfaceId: EDIT_CONTENT_STAGES_TAB_IID,
    label: 'Stages',
    body: <>
      <StagesList/>
    </>
  }

  const cutscenesTab = {
    interfaceId: EDIT_CUTSCENES_TAB_IID,
    label: 'Cutscenes',
    body: <>
      <CutscenesList/>
    </>
  }

  const texturesTab = {
    interfaceId: EDIT_CONTENT_TEXTURES_TAB_IID,
    label: 'Sprites',
    body: <>
      <GameTextures/>
    </>
  }

  const tabs = [stagesTab, cutscenesTab, texturesTab]
  
  return <CobrowsingDialog widthModifier={1} open={true} onClose={handleClose}>
    <div className="EditContentDialog">
      <CobrowsingTabs className="EditContentDialog__tabs" interfaceGroupId={EDIT_CONTENT_TAB_CONTANER_IID} tabs={tabs}/>
    </div>

  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {

})

export default compose(
  connect(mapStateToProps, { closeEditContentDialog }),
)(EditContentDialog);
