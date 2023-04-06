/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditEntityDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import EntityNameForm from '../EntityNameForm/EntityNameForm';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Button from '../../../ui/Button/Button';
import { closeEditEntityDialog, openEditEntityGraphics, updateCreateEntity } from '../../../store/actions/game/gameFormEditorActions';
import SelectEntityModelInterfaceCategory from '../../ui/SelectEntityModelInterfaceCategory/SelectEntityModelInterfaceCategory';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CHANGE_ENTITY_INTERFACE_IID, EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, ENTITY_RELATION_TAGS_IID } from '../../../constants/interfaceIds';
import SelectRelationTag from '../../ui/SelectRelationTag/SelectRelationTag';
import SelectBoundaryEffect from '../../ui/SelectBoundaryEffect/SelectBoundaryEffect';
import { entityModelTypeToDisplayName, entityModelTypeToPrefix, ENTITY_MODEL_DID } from '../../constants';
import { generateUniqueId } from '../../../utils';
import Typography from '../../../ui/Typography/Typography';
import TextureStage from '../../textures/TextureStage/TextureStage';

const EditEntityDialog = ({ openEditEntityGraphics, updateCreateEntity, closeEditEntityDialog, editGameModel, gameFormEditor: { entityModel }, gameModel: { gameModel } }) => {
  function handleClose() {
    closeEditEntityDialog()
  }

  useEffect(() => {
    if(!entityModel.entityModelId) {
      updateCreateEntity({ entityModelId: ENTITY_MODEL_DID+entityModelTypeToPrefix[entityModel.entityInterfaceId]+generateUniqueId(), isNew: true })
    }
  }, [])

  if(!gameModel.entityModels[entityModel.entityModelId]) return 

  function handleSubmit() {
    editGameModel({
      entityModels: {
        [entityModel.entityModelId] : {
          name: entityModel.name,
          relationTags: entityModel.relationTags,
          entityInterfaceId: entityModel.entityInterfaceId,
          boundaryRelation: entityModel.boundaryRelation
        }
      }
    })
    handleClose()
  }

  function renderTagSelect() {
    return <Unlockable interfaceId={ENTITY_RELATION_TAGS_IID}>
        <SelectRelationTag interfaceId={ENTITY_RELATION_TAGS_IID} removeEntityTags formLabel="Relationship Tags" value={entityModel.relationTags ? Object.keys(entityModel.relationTags).filter((relationTagId) => {
          return !!entityModel.relationTags[relationTagId]
        }) : []} onChange={(event, relationTags) => {

          const currentTags = Object.keys(entityModel.relationTags).filter((relationTagId) => !!entityModel.relationTags[relationTagId]).reduce((prev, relationTagId) => {
            const relationTag = entityModel.relationTags[relationTagId]
            // this purely helps with the UI so that it doesnt APPEAR delated at the end.
            // these relationTags will always come back through the game model update event
            if(relationTag.isReadOnly) {
              prev[relationTagId] = {
                isReadOnly: true
              }
            } else {
              prev[relationTagId] = null
            }
            return prev
          }, {})

          const newTags = relationTags.reduce((prev, relationTagId) => {
              prev[relationTagId] = {}
              return prev
          }, currentTags)

          updateCreateEntity({
            relationTags: newTags
          })
        }}/>
      </Unlockable>
  }

  function renderSelectInterfaceId() {
    return <Unlockable interfaceId={CHANGE_ENTITY_INTERFACE_IID}>
      <SelectEntityModelInterfaceCategory formLabel="Category" value={entityModel.entityInterfaceId ? [entityModel.entityInterfaceId]: []} onChange={(event, entityInterfaceId) => {
        if(!entityInterfaceId.length) return
        updateCreateEntity({
          entityInterfaceId: entityInterfaceId[entityInterfaceId.length-1]
        })
      }}/>
    </Unlockable>
  }

  
  return <CobrowsingDialog open onClose={handleClose}>
    <div className="EditEntityDialog">
       <div className="EditEntityDialog__name"><Typography variant="h5">
        {entityModel.isNew && 'New ' + entityModelTypeToDisplayName[entityModel.entityInterfaceId]}
        {!entityModel.isNew && <div>
          <EntityNameForm
            initialName={entityModel.name}
          />
        </div>}
        </Typography>
      </div>
      <div className="EditEntityDialog__header">
        <div className="EditEntityDialog__texture-stage">
          <TextureStage onClickIcon={() => {
            openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, entityModel)
            closeEditEntityDialog()
          }} overlayIcon={'faPenToSquare'} textureId={entityModel.graphics.textureId} textureTint={entityModel.graphics.textureTint}>
              
          </TextureStage>
        </div>
        <div className="EditEntityDialog__primary-options">
 
          {renderTagSelect()}
          {renderSelectInterfaceId()}
        </div>
      </div>
      <SelectBoundaryEffect
        entityModelId={entityModel.entityModelId}
        formLabel={`What happens when touching the world boundary?`}
        value={entityModel.boundaryRelation ? [entityModel.boundaryRelation] : []}
        onChange={(event, BoundaryRelations) => {
          const boundaryRelation = BoundaryRelations[BoundaryRelations.length-1]
          updateCreateEntity({ boundaryRelation })
      }}/>
      <Button disabled={entityModel.error} type="submit" onClick={handleSubmit}>Save</Button>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { openEditEntityGraphics, closeEditEntityDialog, editGameModel, updateCreateEntity }),
)(EditEntityDialog);
