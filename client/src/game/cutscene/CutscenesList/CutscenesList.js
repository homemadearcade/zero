/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CutscenesList.scss';
import { openCreateCutscene, updateCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { REMOVED_DATA_SHOW_IID } from '../../../constants/interfaceIds';
import Divider from '../../../ui/Divider/Divider';

const CutscenesList = ({ openCreateCutscene, gameModel: { gameModel }}) => {
  const [showRemovedCutscenes, setShowRemovedCutscenes] = useState()
  
  const cutscenes = gameModel.cutscenes

  function renderCutscene(cutscene) {
     return <div key={cutscene.cutsceneId} className="CutscenesList__cutscene">
      <Typography component="h5" variant="h5">{cutscene.name}</Typography>
      <Button onClick={() => {
        openCreateCutscene(cutscene)
      }}>Edit</Button>
    </div>
  }

  return <div className="CutscenesList">
      {Object.keys(cutscenes).map((cutsceneId) => {
        const cutscene = cutscenes[cutsceneId]
        if(cutscene.isRemoved && !showRemovedCutscenes) return null
        return renderCutscene(cutscene)
      })}
      <Divider/>
      <Button onClick={() => {
        openCreateCutscene({
          name: 'Cutscene #' + (Object.keys(cutscenes).length + 1).toString()
        })
      }}><Icon icon="faPlus"/> New Cutscene</Button>
      {!showRemovedCutscenes && <Unlockable interfaceId={REMOVED_DATA_SHOW_IID}>
        <Button onClick={() => {
          setShowRemovedCutscenes(true)
        }}>Show Removed Cutscenes</Button>
      </Unlockable>}
    </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, openCreateCutscene }),
)(CutscenesList);
