/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './StagesList.scss';
import {  openCreateStageDialog, updateCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { changeCurrentStage } from '../../../store/actions/game/gameModelActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { REMOVED_DATA_SHOW_IID, STAGE_ADD_IID, } from '../../../constants/interfaceIds';
import { initialStage, STAGE_DID } from '../../constants';
import { generateUniqueId } from '../../../utils';
import Divider from '../../../ui/Divider/Divider';

          // {gameModel.player.startingStageId !== stageId && stage.playerEntityModelId && <Button onClick={() => {
          //   editGameModel({
          //     player: {
          //       startingStageId: stageId
          //     }
          // })
          // }}>Set as Start Stage</Button>}

const StagesList = ({  openCreateStageDialog, changeCurrentStage, gameRoomInstance: { gameRoomInstance: { currentStageId } }, gameModel: { gameModel }, editGameModel}) => {

  const [showRemovedStages, setShowRemovedStages] = useState()

  const stages = gameModel.stages

  return <div className="StagesList">
    {Object.keys(stages).map((stageId) => {

      const stage = stages[stageId]
      if(stage.isRemoved && !showRemovedStages) return null 

      return <div key={stageId} className="StagesList__stage">
        <Typography component="h5" variant="h5">{stage.name}</Typography>
        {currentStageId !== stageId && <Button startIcon={<Icon icon="faShuffle"/>} onClick={() => {
          changeCurrentStage(stageId)
        }}>Switch to {stage.name}</Button>}
        {/* <Unlockable interfaceId={STAGE_ADD_IID}>
          <Button startIcon={<Icon icon="faPlus"/>} onClick={() => {
            const newStageId = STAGE_DID + generateUniqueId()
            openCreateStageDialog({
              ...stage,
              stageId: newStageId,
              name: stage.name + 'copy'
            })
            // changeCurrentStage(newStageId)
          }}>New stage from {stage.name}</Button>
        </Unlockable> */}
      </div>
    })}
    <Divider/>
    <Unlockable interfaceId={STAGE_ADD_IID}>
      <Button startIcon={<Icon icon="faPlus"/>} onClick={() => {
        // const newStageId = STAGE_DID + generateUniqueId()
        openCreateStageDialog({
          ...initialStage,
          // stageId: newStageId,
          // isNew: true,
        })
        // changeCurrentStage(newStageId)
      }}>New Stage</Button>
    </Unlockable>
    {!showRemovedStages && <Unlockable interfaceId={REMOVED_DATA_SHOW_IID}>
      <Button onClick={() => {
        setShowRemovedStages(true)
      }}>Show Removed Stages</Button>
    </Unlockable>}
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameRoomInstance: state.gameRoomInstance,
})


export default compose(
  connect(mapStateToProps, { updateCreateCutscene, openCreateStageDialog, editGameModel, changeCurrentStage }),
)(StagesList);
