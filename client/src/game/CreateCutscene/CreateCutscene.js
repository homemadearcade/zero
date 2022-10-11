/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateCutscene.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateCutscene, updateCreateCutscene } from '../../store/actions/gameFormEditorActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';

const CreateCutscene = ({ closeCreateCutscene, gameFormEditor: { cutscene }}) => {
  function handleClose() {
    closeCreateCutscene()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateCutscene({ descriptors })
  // }}

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateCutscene">
      <Typography component="h2" variant="h2">Cutscenes</Typography>
      <div className="CreateCutscene__buttons">

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
  connect(mapStateToProps, { updateCreateCutscene, closeCreateCutscene }),
)(CreateCutscene);
