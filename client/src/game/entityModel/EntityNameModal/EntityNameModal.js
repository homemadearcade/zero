/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EntityNameModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import EntityNameForm from '../EntityNameForm/EntityNameForm';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Button from '../../../ui/Button/Button';
import EntityMemberTitle from '../EntityMemberTitle/EntityMemberTitle';
import { closeEntityNameModal, updateCreateEntity } from '../../../store/actions/game/gameFormEditorActions';
import { entityModelTypeToDisplayName } from '../../constants';

const EntityNameModal = ({ closeEntityNameModal, editGameModel, gameFormEditor: { entityModel }}) => {
  function handleClose() {
    closeEntityNameModal()
  }

  function handleSubmit() {
    editGameModel({
      entityModels: {
        [entityModel.entityModelId] : {
          name: entityModel.name,
        }
      }
    })
    handleClose()
  }

  return <CobrowsingModal open onClose={handleClose}>
      <div className="EntityNameModal">    
      <EntityNameForm
        isEditingInitially
        initialName={entityModel.name}
      />
      <Button disabled={entityModel.error} type="submit" onClick={handleSubmit}>Save</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeEntityNameModal, editGameModel, updateCreateEntity }),
)(EntityNameModal);
