/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateStageDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeCreateStageDialog, updateCreateStage } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import {  STAGE_DID} from '../../constants';
import { addLayersForArcadeGameStage } from '../../../store/actions/game/arcadeGameActions';
import CreateStage from '../CreateStage/CreateStage';

        // {/* <RadioGroupColumn
        //   formLabel={"Perspective"}
        //   value={stage.playerEntityModelId}
        //   onChange={(e, value) => {
        //     updateCreateStage({
        //       playerEntityModelId: value
        //     })
        //   }}
        //   options={[{
        //       value: directionalPlayerEntityId,
        //       label: 'Overhead'
        //     },
        //     {
        //       value: jumperPlayerEntityId,
        //       label: 'Platformer'
        //     },
        //   ]}
        // /> */}
const CreateStageDialog = ({ closeCreateStageDialog, editGameModel, updateCreateStage, gameFormEditor: { stage }, gameModel: { gameModel, currentStageId } }) => {
  function handleClose() {
    closeCreateStageDialog()
  }

  useEffect(() => {
    if(!stage.stageId) {
      updateCreateStage({ stageId: STAGE_DID+generateUniqueId(), isNew: true })
    }
  }, [])

  function isAutosaveDisabled() {
    if(stage.error) return false
    if(!stage.playerSpawnZoneEntityId) return true
    return false 
  }

  return <CobrowsingDialog open={true} onClose={handleClose}>
    <div className="CreateStageDialog">
        <CreateStage stage={stage} onUpdate={(stageUpdate) => {
          if(stage.stageId === currentStageId) {
            editGameModel({
              stages: {
                [stage.stageId] : {
                  ...stageUpdate,
                  isNew: false,
                }
              }
            })
          }
          updateCreateStage(stageUpdate)
        }}/>
        <div className="CreateStageDialog__buttons">
          <Button 
            disabled={isAutosaveDisabled()}
            onClick={async () => {
            editGameModel({
              stages: {
                [stage.stageId] : {
                  ...stage,
                  isNew: false,
                }
              }
            })
            if(stage.isNew) {
              await addLayersForArcadeGameStage(gameModel.id, gameModel.owner.id, stage.stageId)
            }
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
  </CobrowsingDialog>
}

const mapStateToProps = (state) => {
  return mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})
}

export default compose(
  connect(mapStateToProps, { updateCreateStage, closeCreateStageDialog, editGameModel }),
)(CreateStageDialog);
