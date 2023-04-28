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
import StageNameForm from '../StageNameForm/StageNameForm';
import SelectEntityModel from '../../ui/SelectEntityModel/SelectEntityModel';
import { STAGE_SPAWN_ZONE_SELECT_IID, ZONE_ENTITY_IID } from '../../../constants/interfaceIds';

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

  function renderSelectSpawn() {
    return <SelectEntityModel
    entityModelType={ZONE_ENTITY_IID}
    interfaceId={STAGE_SPAWN_ZONE_SELECT_IID}
    formLabel={"Into which zone should the Player spawn?"}
    value={stage.playerSpawnZoneEntityId ? [stage.playerSpawnZoneEntityId] : []}
    onChange={(event, entityModels) => {
      const newEntityId = entityModels[entityModels.length-1]
      editGameModel({
        stages: {
          [stage.stageId] : {
            playerSpawnZoneEntityId: newEntityId
          }
        }
      })
    }}/>
  }

  return <CobrowsingDialog open={true} onClose={handleClose}>
    <StageNameForm initialName={stage.name}/>
    {/* {renderSelectSpawn()} */}
    <div className="CreateStageDialog__buttons">
      <Button 
        disabled={isAutosaveDisabled()}
        onClick={async () => {
        if(stage.isNew) {
          const layers = await addLayersForArcadeGameStage(gameModel.id, gameModel.owner.id, stage.stageId)
          editGameModel({
            stages: {
              [stage.stageId] : {
                ...stage,
                isNew: false,
              }
            },
            layers,
          })
        } else {
          editGameModel({
            stages: {
              [stage.stageId] : {
                ...stage,
                isNew: false,
              }
            }
          })
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
