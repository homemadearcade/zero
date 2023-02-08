/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateStage.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateStage, updateCreateStage } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import SelectClass from '../../ui/SelectClass/SelectClass';
import { STAGE_ID_PREFIX, ZONE_CLASS } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import StageNameForm from '../StageNameForm/StageNameForm';

const CreateStage = ({ closeCreateStage, editGameModel, updateCreateStage, gameFormEditor: { stage }, gameModel: { gameModel} }) => {
  function handleClose() {
    closeCreateStage()
  }

  useEffect(() => {
    if(!stage.stageId) {
      updateCreateStage({ stageId: STAGE_ID_PREFIX+generateUniqueId(), isNew: true })
    }
  }, [])

  function isSaveDisabled() {
    if(stage.error) return false
    if(!stage.spawnZoneClassId) return true
    return false 
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateStage">
        <Typography component="h2" variant="h2">{stage.name}</Typography>
        <StageNameForm initialName={stage.name}/>
        <SelectClass 
          classType={ZONE_CLASS}
          formLabel={"Into which zone should the Player spawn?"}
          value={stage.spawnZoneClassId ? [stage.spawnZoneClassId] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            updateCreateStage({
              spawnZoneClassId: newClassId
            })
         }}/>
        <SelectClass
          formLabel="Should the player spawn as a new class? ( Leave blank to keep the same hero )"
          value={stage.playerClassId ? [stage.playerClassId] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            updateCreateStage({
              playerClassId: newClassId
            })
         }}/>
        <div className="CreateStage__buttons">
          <Button 
            disabled={isSaveDisabled()}
            onClick={() => {
            editGameModel({
              stages: {
                [stage.stageId] : {
                  ...stage,
                  isNew: false,
                }
              }
            })
            handleClose()
          }}>
            Save
          </Button>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          {!stage.isNew && !stage.isRemoved && <Button onClick={() => {
            editGameModel({
              stages: {
                [stage.stageId]: {
                  isRemoved: true
                }
              }
            })
            handleClose()
          }}>Remove</Button>}
          {stage.isRemoved && <Button onClick={() => {
            editGameModel({
              stages: {
                [stage.stageId]: {
                  isRemoved: false
                }
              }
            })
            handleClose()
          }}>Restore</Button>}
      </div>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateStage, closeCreateStage, editGameModel }),
)(CreateStage);
