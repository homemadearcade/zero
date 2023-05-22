/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EntityNameDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import EntityNameForm from '../EntityNameForm/EntityNameForm';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Button from '../../../ui/Button/Button';
import { closeEntityNameDialog } from '../../../store/actions/game/gameFormEditorActions';

const EntityNameDialog = ({ closeEntityNameDialog, editGameModel, gameFormEditor: { entityModel }}) => {
  function handleClose() {
    closeEntityNameDialog()
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

  return <CobrowsingDialog open onClose={handleClose}>
      <div className="EntityNameDialog">    
      <EntityNameForm
        isEditingInitially
        initialName={entityModel.name}
      />
      <Button disabled={entityModel.error} type="submit" onClick={handleSubmit}>Save</Button>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeEntityNameDialog, editGameModel }),
)(EntityNameDialog);
