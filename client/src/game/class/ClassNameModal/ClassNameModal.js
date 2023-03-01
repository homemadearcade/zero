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
import { closeClassNameModal, updateCreateClass } from '../../../store/actions/gameFormEditorActions';
import SelectClassType from '../../ui/SelectClassType/SelectClassType';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CHANGE_CLASS_TYPE_IID } from '../../../constants/interfaceIds';

const ClassNameModal = ({ updateCreateClass, closeClassNameModal, editGameModel, gameFormEditor: { objectClass }, gameModel: { gameModel } }) => {
  if(!gameModel.classes[objectClass.classId]) return 
  function handleClose() {
    closeClassNameModal()
  }

  function handleSubmit() {
    editGameModel({
      classes: {
        [objectClass.classId] : {
          ...objectClass,
        }
      }
    })
    handleClose()
  }

  return <CobrowsingModal open onClose={handleClose}>
    <ClassMemberTitle 
      classId={objectClass.classId} 
      title={<>
        Edit Name
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
