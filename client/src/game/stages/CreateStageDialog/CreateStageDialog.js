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
import { addStageToGameModel, editGameModel } from '../../../store/actions/game/gameModelActions';
import {  STAGE_DID} from '../../constants';
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
const CreateStageDialog = ({ 
  closeCreateStageDialog, editGameModel,
  updateCreateStage, gameFormEditor: { stage }, 
  gameModel: { gameModel, currentStageId, isStageAddLoading }, 
  addStageToGameModel
}) => {
  function handleClose() {
    closeCreateStageDialog()
  }

  const defaultStageName = 'Stage #' + (Object.keys(gameModel.stages).length + 1).toString()
  useEffect(() => {
    if(!stage.stageId) {
      updateCreateStage({ 
        name: defaultStageName,
        stageId: STAGE_DID+generateUniqueId(), isNew: true
       })
    }
  }, [])

  function isSaveDisabled() {
    if(!stage.playerSpawnZoneEntityId) return true
    if(isStageAddLoading) return true
    return false 
  }

  function renderSelectSpawn() {
    return <SelectEntityModel
    entityModelClass={ZONE_ENTITY_IID}
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

  return <CobrowsingDialog open={true}>
    <StageNameForm initialName={stage.name || defaultStageName}/>
    {/* {renderSelectSpawn()} */}
    <div className="CreateStageDialog__buttons">
      <Button 
        disabled={isSaveDisabled()}
        onClick={async () => {
        if(stage.isNew) {
          await addStageToGameModel(stage, gameModel)
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
        {stage.isNew ? 'Create' : 'Save'}
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
  connect(mapStateToProps, { addStageToGameModel, updateCreateStage, closeCreateStageDialog, editGameModel }),
)(CreateStageDialog);
