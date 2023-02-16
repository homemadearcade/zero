/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './ClassNameModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeClassNameModal } from '../../../store/actions/gameSelectorActions';
import ClassNameForm from '../ClassNameForm/ClassNameForm';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { Alert } from '@mui/material';
import Button from '../../../ui/Button/Button';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';

const ClassNameModal = ({ closeClassNameModal, editGameModel, gameModel: { gameModel }, gameSelector: { classIdEditingName } }) => {
  const objectClass = gameModel.classes[classIdEditingName]
  const [error, setError] = useState()
  const [name, setName] = useState(objectClass.name)

  function handleClose() {
    closeClassNameModal()
  }

  function handleSubmit() {
    editGameModel({
      classes: {
        [objectClass.classId] : {
          ...objectClass,
          name
          // graphics: objectClass.graphics,
          // descriptors: objectClass.descriptors,
          // name: objectClass.name,
          // classId: objectClass.classId,
          // type: objectClass.type,
          // interfaceLocked: objectClass.interfaceLocked
        }
      }
    })
    handleClose()
  }

  return <CobrowsingModal open onClose={handleClose}>
    <ClassMemberTitle 
      classId={classIdEditingName} 
      title={<>
        Edit Name
          </>
      }></ClassMemberTitle>
    <div className="ClassNameModal">
      <ClassNameForm
        objectClass={{
          name
        }}
        onChangeName={(name) => {
          setName(name)
          setError(null)
        }}
        onError={(error) => {
          setError(error)
        }}></ClassNameForm>
      </div>
      {error && <Alert severity='error'>{error}</Alert>}
      <Button disabled={error} type="submit" onClick={handleSubmit}>Save</Button>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector
})

export default compose(
  connect(mapStateToProps, { closeClassNameModal, editGameModel }),
)(ClassNameModal);
