/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './StagesMenu.scss';
import CobrowsingDialog from '../../../game/cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeStagesMenu, openCreateStageDialog, updateCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { changeCurrentStage } from '../../../store/actions/game/gameModelActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { SHOW_REMOVED_DATA_IID } from '../../../constants/interfaceIds';
import { initialStage } from '../../constants';

const StagesMenu = ({ closeStagesMenu, openCreateStageDialog, changeCurrentStage, gameModel: { gameModel, currentStageId }, editGameModel}) => {
  function handleClose() {
    closeStagesMenu()
  }

  const [showRemovedStages, setShowRemovedStages] = useState()

  const stages = gameModel.stages

  return <CobrowsingDialog open={true} onClose={handleClose}>
    <div className="StagesMenu">
      <Typography component="h2" variant="h2">Stages</Typography>
      {Object.keys(stages).map((stageId) => {

        const stage = stages[stageId]
        if(stage.isRemoved && !showRemovedStages) return null 

        return <div key={stageId} className="StagesMenu__stage">
          <Typography component="h4" variant="h4">{stage.name}</Typography>
          <Button onClick={() => {
            openCreateStageDialog(stage)
          }}>Edit</Button>
          <Button onClick={() => {
            openCreateStageDialog({
              ...stage,
              name: stage.name + 'copy'
            })
          }}>Copy</Button>
          {gameModel.player.startingStageId !== stageId && stage.playerEntityModelId && <Button onClick={() => {
            editGameModel({
              player: {
                startingStageId: stageId
              }
          })
          }}>Set as Start Stage</Button>}
          {currentStageId !== stageId && <Button onClick={() => {
            changeCurrentStage(stageId)
          }}>Switch to this Stage</Button>}
        </div>
      })}
      <Unlockable interfaceId={SHOW_REMOVED_DATA_IID}>
        <Button onClick={() => {
          openCreateStageDialog({
            ...initialStage,
            name: 'Stage #' + (Object.keys(stages).length + 1).toString(),
          })
        }}><Icon icon="faPlus"/> New Stage</Button>
      </Unlockable>
      {!showRemovedStages && <Unlockable interfaceId={SHOW_REMOVED_DATA_IID}>
        <Button onClick={() => {
          setShowRemovedStages(true)
        }}>Show Removed Stages</Button>
      </Unlockable>}
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})


export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeStagesMenu, openCreateStageDialog, editGameModel, changeCurrentStage }),
)(StagesMenu);
