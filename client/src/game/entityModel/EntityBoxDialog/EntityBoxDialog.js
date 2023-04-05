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
import { entityModelTypeToDisplayName } from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import EditEntityGraphics from '../EditEntityGraphics/EditEntityGraphics';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { DATA_SOURCE_IMPORT_AID } from '../../../constants/actionIds';

const EntityBoxDialog = ({ 
  closeEntityBoxDialog, 
  gameSelector: { entityBoxDialogType, entityBoxDialogActionId }, 
  gameFormEditor: { isEditEntityGraphicsOpen },
  gameModel : { gameModel, gameModel : { entityModels }},
  editGameModel
 }) => {

  function handleClose(e) {
    closeEntityBoxDialog()
  }

  const entityModelsToSelect = Object.keys(entityModels).map((entityModelId) => {
    return entityModels[entityModelId]
  }).filter((entityModel) => {
    return entityModel.entityInterfaceId === entityBoxDialogType
  })

  return <><CobrowsingDialog open onClose={handleClose}>
    <div className="EntityBoxDialog">
      <EntityModelAdd entityInterfaceId={entityBoxDialogType} addEntityDialogInterfaceId={ENTITY_BOX_DIALOG_IID}>
      {(onClick) => {
        return <Button size="wide" startIcon={<Icon icon="faPlus"/>}onClick={onClick}>
          Add {entityModelTypeToDisplayName[entityBoxDialogType]}
        </Button>
      }}
      </EntityModelAdd>
      <EntityBoxList entityModels={entityModelsToSelect} onSelectEntity={(entityModelId) => {
        if(entityBoxDialogActionId === DATA_SOURCE_IMPORT_AID) {  
          editGameModel({
            entityModels: {
              [entityModelId]: {
                isImported: true,
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
              isImported: false
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
