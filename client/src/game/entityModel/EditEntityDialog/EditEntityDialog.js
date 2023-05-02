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
import SelectEntityModelClass from '../../ui/SelectEntityModelClass/SelectEntityModelClass';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CHANGE_ENTITY_INTERFACE_IID, 
   EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, EDIT_ENTITY_MODEL_ADVANCED_TAB_CONTANER_IID, EDIT_ENTITY_MODEL_AUTOGENERATION_TAB_IID, 
   EDIT_ENTITY_MODEL_BEHAVIORS_TAB_IID, EDIT_ENTITY_MODEL_GENERAL_TAB_IID, EDIT_ENTITY_MODEL_JSON_TAB_IID, 
   EDIT_ENTITY_MODEL_TAB_CONTANER_IID, ENTITY_MODEL_BOUNDARY_RELATION_IID, 
  ENTITY_RELATION_TAGS_IID, 
   ENTITY_SPAWN_ZONE_ENTITY_IID, LIVE_ENTITY_EDITOR_CAMERA_TAB_IID, LIVE_ENTITY_EDITOR_COLLISIONS_TAB_IID, 
   LIVE_ENTITY_EDITOR_JUMP_TAB_IID, LIVE_ENTITY_EDITOR_MOVEMENT_TAB_IID, 
   LIVE_ENTITY_EDITOR_PROJECTILE_TAB_IID, PLAYER_ENTITY_IID, ZONE_ENTITY_IID } from '../../../constants/interfaceIds';
import SelectRelationTag from '../../ui/SelectRelationTag/SelectRelationTag';
import SelectBoundaryEffect from '../../ui/SelectBoundaryEffect/SelectBoundaryEffect';
import { entityModelClassToDisplayName, entityModelClassToPrefix, ENTITY_MODEL_DID } from '../../constants';
import { copyToClipboard, generateUniqueId } from '../../../utils';
import Typography from '../../../ui/Typography/Typography';
import TextureStage from '../../textures/TextureStage/TextureStage';
import SelectEntityModel from '../../ui/SelectEntityModel/SelectEntityModel';
import CobrowsingTabs from '../../cobrowsing/CobrowsingTabs/CobrowsingTabs';
import { openEntityBehaviorLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import ReactJson from 'react-json-view';
import Divider from '../../../ui/Divider/Divider';

const EditEntityDialog = ({ 
  openEditEntityGraphics, 
  updateCreateEntity, 
  closeEditEntityDialog, 
  editGameModel, 
  openEntityBehaviorLiveEditor,
  gameFormEditor: { entityModel }, 
  gameModel: { gameModel } }) => {
  function handleClose() {
    closeEditEntityDialog()
  }

  useEffect(() => {
    if(!entityModel.entityModelId) {
      updateCreateEntity({ entityModelId: ENTITY_MODEL_DID+entityModelClassToPrefix[entityModel.entityIID]+generateUniqueId(), isNew: true })
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
      <SelectEntityModelClass formLabel="Class" value={entityModel.entityIID ? [entityModel.entityIID]: []} onChange={(event, entityIID) => {
        if(!entityIID.length) return
        updateCreateEntity({
          entityIID: entityIID[entityIID.length-1]
        })
      }}/>
    </Unlockable>
  }


  function renderSpawnZoneGeneration(formLabel) {
    return <Unlockable interfaceId={ENTITY_SPAWN_ZONE_ENTITY_IID}>
      <SelectEntityModel 
        entityModelClass={ZONE_ENTITY_IID}
        interfaceId={ENTITY_SPAWN_ZONE_ENTITY_IID}
        formLabel={formLabel}
        value={entityModel.spawnZoneEntityModelIds}
        onChange={(event, entityModels) => {
            updateCreateEntity({ spawnZoneEntityModelIds: entityModels })
        }}
      />
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
      {renderSpawnZoneGeneration('Potential Spawn Zones')}
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
        <Button onClick={() => {
          openEntityBehaviorLiveEditor(LIVE_ENTITY_EDITOR_MOVEMENT_TAB_IID, entityModel.entityModelId)
        }}>Edit Movement</Button>
        <Button onClick={() => {
          openEntityBehaviorLiveEditor(LIVE_ENTITY_EDITOR_COLLISIONS_TAB_IID, entityModel.entityModelId)
        }}>Edit Collisions</Button>
        {entityModel.entityIID === PLAYER_ENTITY_IID &&
          <Button onClick={() => {
            openEntityBehaviorLiveEditor(LIVE_ENTITY_EDITOR_CAMERA_TAB_IID, entityModel.entityModelId)
          }}>Edit Camera</Button>
        }
        <Button onClick={() => {
          openEntityBehaviorLiveEditor(LIVE_ENTITY_EDITOR_PROJECTILE_TAB_IID, entityModel.entityModelId)
        }}>Edit Projectile</Button>
      {entityModel.entityIID === PLAYER_ENTITY_IID && 
        <Button onClick={() => {
          openEntityBehaviorLiveEditor(LIVE_ENTITY_EDITOR_JUMP_TAB_IID, entityModel.entityModelId)
        }}>Edit Jump</Button>
      }
    </>
  }

  const autogenerationTab = {
    interfaceId: EDIT_ENTITY_MODEL_AUTOGENERATION_TAB_IID,
    label: 'Autogeneration',
    body: <>
      {renderSpawnZoneGeneration('Generate spawn effect for zones:')}
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
        {entityModel.isNew && 'New ' + entityModelClassToDisplayName[entityModel.entityIID]}
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
  connect(mapStateToProps, { openEditEntityGraphics, openEntityBehaviorLiveEditor, closeEditEntityDialog, editGameModel, updateCreateEntity }),
)(EditEntityDialog);
