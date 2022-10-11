/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CutscenesMenu.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCutscenesMenu, updateCreateCutscene } from '../../store/actions/gameActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';

const CutscenesMenu = ({ closeCutscenesMenu, game: { gameModel }}) => {
  function handleClose() {
    closeCutscenesMenu()
  }

  const cutscenes = gameModel.cutscenes
  // onChange={(event, descriptors) => {
  //   updateCreateCutscene({ descriptors })
  // }}

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CutscenesMenu">
      <Typography component="h2" variant="h2">Cutscenes</Typography>
      {Object.keys(cutscenes).map(() => {
      
      })}
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeCutscenesMenu }),
)(CutscenesMenu);
