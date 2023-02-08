/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CutscenesMenu.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCutscenesMenu, openCreateCutscene, updateCreateCutscene } from '../../../store/actions/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const CutscenesMenu = ({ closeCutscenesMenu, openCreateCutscene, gameModel: { gameModel }}) => {
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
      {Object.keys(cutscenes).map((cutsceneId) => {

        const cutscene = cutscenes[cutsceneId]
        if(cutscene.isRemoved) return null

        return <div key={cutsceneId} className="CutscenesMenu__cutscene">
          <Typography component="h4" variant="h4">{cutscene.name}</Typography>
          <Button onClick={() => {
            openCreateCutscene(cutscene)
          }}>Edit</Button>
        </div>
      })}
      <Button onClick={() => {
        openCreateCutscene({
          name: 'Cutscene #' + (Object.keys(cutscenes).length + 1).toString()
        })
      }}>New Cutscene</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeCutscenesMenu, openCreateCutscene }),
)(CutscenesMenu);
