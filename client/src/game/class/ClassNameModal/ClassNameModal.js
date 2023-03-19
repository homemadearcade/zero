/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './ClassNameModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import ClassNameForm from '../ClassNameForm/ClassNameForm';
import { editGameModel } from '../../../store/actions/gameModelActions';
import Button from '../../../ui/Button/Button';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';
import { closeClassNameModal, updateBoundaryRelation, updateCreateClass } from '../../../store/actions/gameFormEditorActions';
import SelectClassType from '../../ui/SelectClassType/SelectClassType';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CHANGE_CLASS_TYPE_IID, CLASS_TAGS_IID } from '../../../constants/interfaceIds';
import SelectTag from '../../ui/SelectTag/SelectTag';
import SelectBoundaryEffect from '../../ui/SelectBoundaryEffect/SelectBoundaryEffect';

const ClassNameModal = ({ updateCreateClass, closeClassNameModal, editGameModel, gameFormEditor: { objectClass }, gameModel: { gameModel } }) => {
  if(!gameModel.classes[objectClass.classId]) return 
  function handleClose() {
    closeClassNameModal()
  }

  function handleSubmit() {
    editGameModel({
      classes: {
        [objectClass.classId] : {
          name: objectClass.name,
          tags: objectClass.tags,
          type: objectClass.type,
          boundaryRelation: objectClass.boundaryRelation
        }
      }
    })
    handleClose()
  }

  return <CobrowsingModal open onClose={handleClose}>
    <ClassMemberTitle 
      classId={objectClass.classId} 
      title={<>
        Edit Class
          </>
      }></ClassMemberTitle>
    <div className="ClassNameModal">
      <ClassNameForm
        initialName={objectClass.name}
      />
      <Unlockable interfaceId={CHANGE_CLASS_TYPE_IID}>
        <SelectClassType formLabel="Type" value={objectClass.type ? [objectClass.type]: []} onChange={(event, type) => {
          updateCreateClass({
            type: type[type.length-1]
          })
        }}/>
      </Unlockable>
      <Unlockable interfaceId={CLASS_TAGS_IID}>
        <SelectTag hideClassTags hideAutoapplied formLabel="Tags" value={objectClass.tags ? Object.keys(objectClass.tags).filter((tagId) => {
          return !!objectClass.tags[tagId]
        }) : []} onChange={(event, tags) => {

          const currentTags = Object.keys(objectClass.tags).filter((tagId) => !!objectClass.tags[tagId]).reduce((prev, tagId) => {
            const tag = objectClass.tags[tagId]
            // this purely helps with the UI so that it doesnt APPEAR delated at the end.
            // these tags will always come back through the game model update event
            if(tag.isAutogenerated) {
              prev[tagId] = {
                isAutogenerated: true
              }
            } else {
              prev[tagId] = null
            }
            return prev
          }, {})

          const newTags = tags.reduce((prev, tagId) => {
              prev[tagId] = {}
              return prev
          }, currentTags)

          updateCreateClass({
            tags: newTags
          })
        }}/>
      </Unlockable>
      <SelectBoundaryEffect
        classId={objectClass.classId}
        formLabel={`What happens when touching the world boundary?`}
        value={objectClass.boundaryRelation ? [objectClass.boundaryRelation] : []}
        onChange={(event, BoundaryRelations) => {
          const boundaryRelation = BoundaryRelations[BoundaryRelations.length-1]
          updateCreateClass({ boundaryRelation })
      }}/>
      <Button disabled={objectClass.error} type="submit" onClick={handleSubmit}>Save</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeClassNameModal, editGameModel, updateCreateClass }),
)(ClassNameModal);
