/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './ClassNameModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import ClassNameForm from '../ClassNameForm/ClassNameForm';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Button from '../../../ui/Button/Button';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';
import { closeClassNameModal, updateCreateClass } from '../../../store/actions/game/gameFormEditorActions';
import { classTypeToDisplayName } from '../../constants';

const ClassNameModal = ({ closeClassNameModal, editGameModel, gameFormEditor: { entityClass }}) => {
  function handleClose() {
    closeClassNameModal()
  }

  function handleSubmit() {
    editGameModel({
      entityClasses: {
        [entityClass.entityClassId] : {
          name: entityClass.name,
        }
      }
    })
    handleClose()
  }

  return <CobrowsingModal open onClose={handleClose}>
      <div className="ClassNameModal">    
      <ClassNameForm
        isEditingInitially
        initialName={entityClass.name}
      />
      <Button disabled={entityClass.error} type="submit" onClick={handleSubmit}>Save</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeClassNameModal, editGameModel, updateCreateClass }),
)(ClassNameModal);
