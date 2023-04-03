/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CutscenesMenu.scss';
import CobrowsingDialog from '../../../game/cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeCutscenesMenu, openCreateCutscene, updateCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { SHOW_REMOVED_IID } from '../../../constants/interfaceIds';

const CutscenesMenu = ({ closeCutscenesMenu, openCreateCutscene, gameModel: { gameModel }}) => {
  const [showRemovedCutscenes, setShowRemovedCutscenes] = useState()
  
  function handleClose() {
    closeCutscenesMenu()
  }

  const cutscenes = gameModel.cutscenes

  function renderCutscene(cutscene) {
     return <div key={cutscene.cutsceneId} className="CutscenesMenu__cutscene">
      <Typography component="h4" variant="h4">{cutscene.name}</Typography>
      <Button onClick={() => {
        openCreateCutscene(cutscene)
      }}>Edit</Button>
    </div>
  }

  return <CobrowsingDialog open={true} onClose={handleClose}>
    <div className="CutscenesMenu">
      <Typography component="h2" variant="h2">Cutscenes</Typography>
      {Object.keys(cutscenes).map((cutsceneId) => {
        const cutscene = cutscenes[cutsceneId]
        if(cutscene.isRemoved && !showRemovedCutscenes) return null
        return renderCutscene(cutscene)
      })}
      <Button onClick={() => {
        openCreateCutscene({
          name: 'Cutscene #' + (Object.keys(cutscenes).length + 1).toString()
        })
      }}><Icon icon="faPlus"/> New Cutscene</Button>
      {!showRemovedCutscenes && <Unlockable interfaceId={SHOW_REMOVED_IID}>
        <Button onClick={() => {
          setShowRemovedCutscenes(true)
        }}>Show Removed Cutscenes</Button>
      </Unlockable>}
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeCutscenesMenu, openCreateCutscene }),
)(CutscenesMenu);
