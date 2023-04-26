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
import { CAMERA_EDITOR_IID, CHANGE_ENTITY_INTERFACE_IID, COLLISION_EDITOR_IID, EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, EDIT_ENTITY_MODEL_ADVANCED_TAB_CONTANER_IID, EDIT_ENTITY_MODEL_AUTOGENERATION_TAB_IID, EDIT_ENTITY_MODEL_BEHAVIORS_TAB_IID, EDIT_ENTITY_MODEL_GENERAL_TAB_IID, EDIT_ENTITY_MODEL_JSON_TAB_IID, EDIT_ENTITY_MODEL_TAB_CONTANER_IID, ENTITY_MODEL_BOUNDARY_RELATION_IID, ENTITY_MODEL_OPEN_CAMERA_IID, ENTITY_MODEL_OPEN_COLLISIONS_IID, ENTITY_MODEL_OPEN_JUMP_IID, ENTITY_MODEL_OPEN_MOVEMENT_IID, ENTITY_MODEL_OPEN_PROJECTILE_IID, ENTITY_RELATION_TAGS_IID, ENTITY_SPAWN_ZONE_ENTITY_IID, JUMP_EDITOR_IID, MOVEMENT_EDITOR_IID, PLAYER_ENTITY_IID, PROJECTILE_EDITOR_IID, ZONE_ENTITY_IID } from '../../../constants/interfaceIds';
import SelectRelationTag from '../../ui/SelectRelationTag/SelectRelationTag';
import SelectBoundaryEffect from '../../ui/SelectBoundaryEffect/SelectBoundaryEffect';
import { entityModelTypeToDisplayName, entityModelTypeToPrefix, ENTITY_MODEL_DID } from '../../constants';
import { copyToClipboard, generateUniqueId } from '../../../utils';
import Typography from '../../../ui/Typography/Typography';
import TextureStage from '../../textures/TextureStage/TextureStage';
import SelectEntityModel from '../../ui/SelectEntityModel/SelectEntityModel';
import CobrowsingTabs from '../../cobrowsing/CobrowsingTabs/CobrowsingTabs';
import { openLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import ReactJson from 'react-json-view';
import Divider from '../../../ui/Divider/Divider';

const EditEntityDialog = ({ 
  openEditEntityGraphics, 
  updateCreateEntity, 
  closeEditEntityDialog, 
  editGameModel, 
  openLiveEditor,
  gameFormEditor: { entityModel }, 
  gameModel: { gameModel } }) => {
  function handleClose() {
    closeEditEntityDialog()
  }

  useEffect(() => {
    if(!entityModel.entityModelId) {
      updateCreateEntity({ entityModelId: ENTITY_MODEL_DID+entityModelTypeToPrefix[entityModel.entityIID]+generateUniqueId(), isNew: true })
    }
  }, [])

  if(!gameModel.entityModels[entityModel.entityModelId]) return 

  function handleSubmit() {
    editGameModel({
      entityModels: {
        [entityModel.entityModelId] : {
          name: entityModel.name,
          relationTags: entityModel.relationTags,
          entityIID: entityModel.entityIID,
          boundaryRelation: entityModel.boundaryRelation,
          spawnZoneEntityModelIds: entityModel.spawnZoneEntityModelIds,
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
      <SelectEntityModelInterfaceCategory formLabel="Category" value={entityModel.entityIID ? [entityModel.entityIID]: []} onChange={(event, entityIID) => {
        if(!entityIID.length) return
        updateCreateEntity({
          entityIID: entityIID[entityIID.length-1]
        })
      }}/>
    </Unlockable>
  }


  const generalTab = {
    interfaceId: EDIT_ENTITY_MODEL_GENERAL_TAB_IID,
    label: 'General',
    body: <>
      <div className="EditEntityDialog__header">
        <div className="EditEntityDialog__texture-stage">
          <TextureStage onClickIcon={() => {
            openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, entityModel)
            closeEditEntityDialog()
          }} overlayIcon={'faPenToSquare'} textureId={entityModel.graphics.textureId} textureTint={entityModel.graphics.textureTint}>
              
          </TextureStage>
        </div>
        <div className="EditEntityDialog__primary-options">
          {renderSelectInterfaceId()}
          {renderTagSelect()}
        </div>
      </div>
      <Unlockable interfaceId={ENTITY_MODEL_BOUNDARY_RELATION_IID}>
        <SelectBoundaryEffect
          entityModelId={entityModel.entityModelId}
          formLabel={`What happens when touching the world boundary?`}
          value={entityModel.boundaryRelation ? [entityModel.boundaryRelation] : []}
          onChange={(event, BoundaryRelations) => {
            const boundaryRelation = BoundaryRelations[BoundaryRelations.length-1]
            updateCreateEntity({ boundaryRelation })
        }}/>
      </Unlockable>
      <Button disabled={entityModel.error} type="submit" onClick={handleSubmit}>Save</Button>
    </>
  }

  const behaviorsTab = {
    interfaceId: EDIT_ENTITY_MODEL_BEHAVIORS_TAB_IID,
    label: 'Behaviors',
    body: <>
      <Unlockable interfaceId={ENTITY_MODEL_OPEN_COLLISIONS_IID}>
        <Button onClick={() => {
          openLiveEditor(COLLISION_EDITOR_IID, entityModel.entityModelId)
        }}>Edit Collisions</Button>
      </Unlockable>
      {entityModel.entityIID === PLAYER_ENTITY_IID &&
        <Unlockable interfaceId={ENTITY_MODEL_OPEN_CAMERA_IID}>
          <Button onClick={() => {
            openLiveEditor(CAMERA_EDITOR_IID, entityModel.entityModelId)
          }}>Edit Camera</Button>
        </Unlockable>
      }
      <Unlockable interfaceId={ENTITY_MODEL_OPEN_PROJECTILE_IID}>
        <Button onClick={() => {
          openLiveEditor(PROJECTILE_EDITOR_IID, entityModel.entityModelId)
        }}>Edit Projectile</Button>
      </Unlockable>
      {entityModel.entityIID === PLAYER_ENTITY_IID && <Unlockable interfaceId={ENTITY_MODEL_OPEN_JUMP_IID}>
        <Button onClick={() => {
          openLiveEditor(JUMP_EDITOR_IID, entityModel.entityModelId)
        }}>Edit Jump</Button>
      </Unlockable>}
      <Unlockable interfaceId={ENTITY_MODEL_OPEN_MOVEMENT_IID}>
        <Button onClick={() => {
          openLiveEditor(MOVEMENT_EDITOR_IID, entityModel.entityModelId)
        }}>Edit Movement</Button>
      </Unlockable>
    </>
  }

  const autogenerationTab = {
    interfaceId: EDIT_ENTITY_MODEL_AUTOGENERATION_TAB_IID,
    label: 'Autogeneration',
    body: <>
      <Unlockable interfaceId={ENTITY_SPAWN_ZONE_ENTITY_IID}>
        <SelectEntityModel 
          entityModelType={ZONE_ENTITY_IID}
          interfaceId={ENTITY_SPAWN_ZONE_ENTITY_IID}
          formLabel={'Generate spawn effect for zones:'}
          value={entityModel.spawnZoneEntityModelIds}
          onChange={(event, entityModels) => {
              updateCreateEntity({ spawnZoneEntityModelIds: entityModels })
          }}
        />
      </Unlockable>
      <Button disabled={entityModel.error} type="submit" onClick={handleSubmit}>Save</Button>
    </>
  }

  const jsonTab = {
    interfaceId: EDIT_ENTITY_MODEL_JSON_TAB_IID,
    label: 'JSON',
    body: <>
        <Button onClick={() => {
          copyToClipboard(JSON.stringify(entityModel))
        }} >Copy to clipboard</Button>
        <ReactJson src={entityModel} theme="monokai" />
    </>
  }

  const advancedTabs = [autogenerationTab, jsonTab]

  const advancedTab = {
    interfaceId: EDIT_ENTITY_MODEL_ADVANCED_TAB_CONTANER_IID,
    label: 'Advanced',
    body: <>
      <Divider/>
      <CobrowsingTabs className="EditEntityDialog__tabs" interfaceGroupId={EDIT_ENTITY_MODEL_ADVANCED_TAB_CONTANER_IID} tabs={advancedTabs}/>
    </>
  }

  const tabs = [generalTab, behaviorsTab, advancedTab]
  
  return <CobrowsingDialog widthModifier={1} open onClose={handleClose}>
    <div className="EditEntityDialog">
       <div className="EditEntityDialog__name"><Typography variant="h5">
        {entityModel.isNew && 'New ' + entityModelTypeToDisplayName[entityModel.entityIID]}
        {!entityModel.isNew && <div>
          <EntityNameForm
            initialName={entityModel.name}
          />
        </div>}
        </Typography>
      </div>

      <CobrowsingTabs className="EditEntityDialog__tabs" interfaceGroupId={EDIT_ENTITY_MODEL_TAB_CONTANER_IID} tabs={tabs}/>

    </div>

  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { openEditEntityGraphics, openLiveEditor, closeEditEntityDialog, editGameModel, updateCreateEntity }),
)(EditEntityDialog);
