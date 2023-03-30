/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditClassModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import ClassNameForm from '../ClassNameForm/ClassNameForm';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Button from '../../../ui/Button/Button';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';
import { closeEditClassModal, openEditClassGraphics, updateBoundaryRelation, updateCreateClass } from '../../../store/actions/game/gameFormEditorActions';
import SelectClassInterfaceCategory from '../../ui/SelectClassInterfaceCategory/SelectClassInterfaceCategory';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CHANGE_CLASS_TYPE_IID, CLASS_RELATION_TAGS_IID } from '../../../constants/interfaceIds';
import SelectRelationTag from '../../ui/SelectRelationTag/SelectRelationTag';
import SelectBoundaryEffect from '../../ui/SelectBoundaryEffect/SelectBoundaryEffect';
import { classTypeToDisplayName, classTypeToPrefix, ENTITY_CLASS_ID_PREFIX } from '../../constants';
import { generateUniqueId } from '../../../utils';
import Typography from '../../../ui/Typography/Typography';
import TextureStage from '../../textures/TextureStage/TextureStage';

const EditClassModal = ({ openEditClassGraphics, updateCreateClass, closeEditClassModal, editGameModel, gameFormEditor: { entityClass }, gameModel: { gameModel } }) => {
  function handleClose() {
    closeEditClassModal()
  }

  useEffect(() => {
    if(!entityClass.entityClassId) {
      updateCreateClass({ entityClassId: ENTITY_CLASS_ID_PREFIX+classTypeToPrefix[entityClass.classInterfaceCategory]+generateUniqueId(), isNew: true })
    }
  }, [])

  if(!gameModel.entityClasses[entityClass.entityClassId]) return 

  function handleSubmit() {
    editGameModel({
      entityClasses: {
        [entityClass.entityClassId] : {
          name: entityClass.name,
          relationTags: entityClass.relationTags,
          classInterfaceCategory: entityClass.classInterfaceCategory,
          boundaryRelation: entityClass.boundaryRelation
        }
      }
    })
    handleClose()
  }

  function renderTagSelect() {
    return <Unlockable interfaceId={CLASS_RELATION_TAGS_IID}>
        <SelectRelationTag removeClassTags isAddingToClass formLabel="Relations" value={entityClass.relationTags ? Object.keys(entityClass.relationTags).filter((relationTagId) => {
          return !!entityClass.relationTags[relationTagId]
        }) : []} onChange={(event, relationTags) => {

          const currentTags = Object.keys(entityClass.relationTags).filter((relationTagId) => !!entityClass.relationTags[relationTagId]).reduce((prev, relationTagId) => {
            const relationTag = entityClass.relationTags[relationTagId]
            // this purely helps with the UI so that it doesnt APPEAR delated at the end.
            // these relationTags will always come back through the game model update event
            if(relationTag.wasAutoapplied) {
              prev[relationTagId] = {
                wasAutoapplied: true
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

          updateCreateClass({
            relationTags: newTags
          })
        }}/>
      </Unlockable>
  }

  function renderSelectCategory() {
    return <Unlockable interfaceId={CHANGE_CLASS_TYPE_IID}>
        <SelectClassInterfaceCategory formLabel="Category" value={entityClass.classInterfaceCategory ? [entityClass.classInterfaceCategory]: []} onChange={(event, classInterfaceCategory) => {
          if(!classInterfaceCategory.length) return
          updateCreateClass({
            classInterfaceCategory: classInterfaceCategory[classInterfaceCategory.length-1]
          })
        }}/>
      </Unlockable>
  }

  
  return <CobrowsingModal open onClose={handleClose}>
    <div className="EditClassModal">
       <div className="EditClassModal__name"><Typography variant="h5">
        {entityClass.isNew && 'New ' + classTypeToDisplayName[entityClass.classInterfaceCategory]}
        {!entityClass.isNew && <div>
          <ClassNameForm
            initialName={entityClass.name}
          />
        </div>}
        </Typography>
      </div>
      <div className="EditClassModal__header">
        <div className="EditClassModal__texture-stage">
          <TextureStage onClickIcon={() => {
            openEditClassGraphics(entityClass)
            closeEditClassModal()
          }} overlayIcon={'faPenToSquare'} textureId={entityClass.graphics.textureId} textureTint={entityClass.graphics.textureTint}>
              
          </TextureStage>
        </div>
        <div className="EditClassModal__primary-options">
 
          {renderTagSelect()}
          {renderSelectCategory()}
        </div>
      </div>
      <SelectBoundaryEffect
        entityClassId={entityClass.entityClassId}
        formLabel={`What happens when touching the world boundary?`}
        value={entityClass.boundaryRelation ? [entityClass.boundaryRelation] : []}
        onChange={(event, BoundaryRelations) => {
          const boundaryRelation = BoundaryRelations[BoundaryRelations.length-1]
          updateCreateClass({ boundaryRelation })
      }}/>
      <Button disabled={entityClass.error} type="submit" onClick={handleSubmit}>Save</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { openEditClassGraphics, closeEditClassModal, editGameModel, updateCreateClass }),
)(EditClassModal);
