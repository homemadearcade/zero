/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeEntityBoxDialog } from '../../../store/actions/game/gameSelectorActions';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import './EntityBoxDialog.scss'
import EntityBoxList from '../EntityBoxList/EntityBoxList';
import EntityModelAdd from '../EntityModelAdd/EntityModelAdd';
import { ENTITY_BOX_DIALOG_IID } from '../../../constants/interfaceIds';
import Button from '../../../ui/Button/Button';
import { entityModelClassToDisplayName } from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import EditEntityGraphics from '../EditEntityGraphics/EditEntityGraphics';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { IMPORT_DATA_SOURCE_AID } from '../../../constants/interfaceActionIds';
import { changeEntityIdHovering } from '../../../store/actions/game/hoverPreviewActions';

const EntityBoxDialog = ({ 
  closeEntityBoxDialog, 
  gameSelector: { entityBoxDialogType, entityBoxDialogActionId }, 
  gameFormEditor: { isEditEntityGraphicsOpen },
  gameModel : { gameModel, currentStageId, gameModel : { entityModels }},
  editGameModel
 }) => {

  function handleClose(e) {
    closeEntityBoxDialog()
    changeEntityIdHovering(null)
  }

  const entityModelsToSelect = Object.keys(entityModels).map((entityModelId) => {
    return entityModels[entityModelId]
  }).filter((entityModel) => {
    return entityModel.entityIID === entityBoxDialogType
  })

  return <><CobrowsingDialog open onClose={handleClose}>
    <div className="EntityBoxDialog">
      <EntityModelAdd entityIID={entityBoxDialogType} addEntityDialogIID={ENTITY_BOX_DIALOG_IID}>
      {(onClick) => {
        return <Button size="wide" startIcon={<Icon icon="faPlus"/>}onClick={onClick}>
          Add {entityModelClassToDisplayName[entityBoxDialogType]}
        </Button>
      }}
      </EntityModelAdd>
      <EntityBoxList entityModels={entityModelsToSelect} onSelectEntity={(entityModelId) => {
        if(entityBoxDialogActionId === IMPORT_DATA_SOURCE_AID) {  
          editGameModel({
            entityModels: {
              [entityModelId]: {
                importedStageIds: {
                  [currentStageId]: true
                },
                entityModelId
              }
            }
          })
        } 
        handleClose()
      }}/>
    </div>
  </CobrowsingDialog>
    {isEditEntityGraphicsOpen === ENTITY_BOX_DIALOG_IID && <EditEntityGraphics 
      onComplete={async (entityModel) => {
        editGameModel({
          entityModels: {
            [entityModel.entityModelId]: {
              ...entityModel,
              isNew: false,
              importedStageIds: {
                [currentStageId]: false
              },
            }
          }
        })
      }}
  />}
  </>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { closeEntityBoxDialog, editGameModel }),
)(EntityBoxDialog);
