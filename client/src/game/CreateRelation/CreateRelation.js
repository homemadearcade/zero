/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateRelation.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateRelation, updateCreateRelation } from '../../store/actions/gameFormEditorActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';

const CreateRelation = ({ closeCreateRelation, gameFormEditor: { relation }}) => {
  function handleClose() {
    closeCreateRelation()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateRelation({ descriptors })
  // }}

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateRelation">
      <Typography component="h2" variant="h2">Cutscenes</Typography>
      <div className="CreateRelation__buttons">


        <Button onClick={handleClose}>
          Save
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateRelation, closeCreateRelation }),
)(CreateRelation);
