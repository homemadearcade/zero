/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateStageModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateStageModal, updateCreateStage } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import {  STAGE_ID_PREFIX} from '../../constants';
import { addLayersForArcadeGameStage } from '../../../store/actions/game/arcadeGameActions';
import CreateStage from '../CreateStage/CreateStage';

        // {/* <RadioGroupColumn
        //   formLabel={"Perspective"}
        //   value={stage.playerClassId}
        //   onChange={(e, value) => {
        //     updateCreateStage({
        //       playerClassId: value
        //     })
        //   }}
        //   options={[{
        //       value: directionalPlayerClassId,
        //       label: 'Overhead'
        //     },
        //     {
        //       value: jumperPlayerClassId,
        //       label: 'Platformer'
        //     },
        //   ]}
        // /> */}
const CreateStageModal = ({ closeCreateStageModal, editGameModel, updateCreateStage, gameFormEditor: { stage }, gameModel: { gameModel} }) => {
  function handleClose() {
    closeCreateStageModal()
  }

  useEffect(() => {
    if(!stage.stageId) {
      updateCreateStage({ stageId: STAGE_ID_PREFIX+generateUniqueId(), isNew: true })
    }
  }, [])

  function isAutosaveDisabled() {
    if(stage.error) return false
    if(!stage.playerSpawnZoneClassId) return true
    return false 
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateStageModal">
        <CreateStage stage={stage} onUpdate={(props) => {
          updateCreateStage(props)
        }}/>
        <div className="CreateStageModal__buttons">
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
  </CobrowsingModal>
}

const mapStateToProps = (state) => {
  return mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})
}

export default compose(
  connect(mapStateToProps, { updateCreateStage, closeCreateStageModal, editGameModel }),
)(CreateStageModal);
