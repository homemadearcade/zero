/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './StagesMenu.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeStagesMenu, openCreateStage, updateCreateCutscene } from '../../../store/actions/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { changeCurrentStage } from '../../../store/actions/gameModelActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';

const StagesMenu = ({ closeStagesMenu, openCreateStage, changeCurrentStage, gameModel: { gameModel, currentStageId }, editGameModel}) => {
  function handleClose() {
    closeStagesMenu()
  }

  const [showRemovedStages, setShowRemovedStages] = useState()

  const stages = gameModel.stages

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="StagesMenu">
      <Typography component="h2" variant="h2">Stages</Typography>
      {Object.keys(stages).map((stageId) => {

        const stage = stages[stageId]
        if(stage.isRemoved && !showRemovedStages) return null 

        return <div key={stageId} className="StagesMenu__stage">
          <Typography component="h4" variant="h4">{stage.name}</Typography>
          <Button onClick={() => {
            openCreateStage(stage)
          }}>Edit</Button>
          <Button onClick={() => {
            openCreateStage({
              ...stage,
              name: stage.name + 'copy'
            })
          }}>Copy</Button>
          {gameModel.player.initialStageId !== stageId && stage.playerClassId && <Button onClick={() => {
            editGameModel({
              player: {
                initialStageId: stageId
              }
            })
          }}>Set as Start Stage</Button>}
          {currentStageId !== stageId && <Button onClick={() => {
            changeCurrentStage(stageId)
          }}>Switch to this Stage</Button>}
        </div>
      })}
      <Button onClick={() => {
        openCreateStage({
          name: 'Stage #' + (Object.keys(stages).length + 1).toString()
        })
      }}><Icon icon="faPlus"/> New Stage</Button>
      {!showRemovedStages && <Unlockable interfaceId="stages/showRemoved">
        <Button onClick={() => {
          setShowRemovedStages(true)
        }}>Show Removed Stages</Button>
      </Unlockable>}
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})


export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeStagesMenu, openCreateStage, editGameModel, changeCurrentStage }),
)(StagesMenu);
