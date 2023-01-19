/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './StagesMenu.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeStagesMenu, openCreateStage, updateCreateCutscene } from '../../../store/actions/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';

const StagesMenu = ({ closeStagesMenu, openCreateStage, gameModel: { gameModel }, editGameModel}) => {
  function handleClose() {
    closeStagesMenu()
  }

  const stages = gameModel.stages

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="StagesMenu">
      <Typography component="h2" variant="h2">Stages</Typography>
      {Object.keys(stages).map((stageId) => {
        const stage = stages[stageId]
        return <div key={stageId} className="StagesMenu__stage">
          <Typography component="h4" variant="h4">{stage.name}</Typography>
          <Button onClick={() => {
            openCreateStage(stage)
          }}>Edit</Button>
          {gameModel.player.initialStageId !== stageId && stage.playerClassId && <Button onClick={() => {
            editGameModel({
              player: {
                initialStageId: stageId
              }
            })
          }}>Set as Start Stage</Button>}
        </div>
      })}
      <Button onClick={() => {
        openCreateStage({
          name: 'Stage #' + (Object.keys(stages).length + 1).toString()
        })
      }}>New Stage</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeStagesMenu, openCreateStage, editGameModel }),
)(StagesMenu);
