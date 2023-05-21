import React  from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { progressActiveCutscene } from '../../../store/actions/game/playerInterfaceActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import './Cutscene.scss';
import CutsceneBody from '../CutsceneBody/CutsceneBody';

const Cutscene = ({ gameModel: { gameModel }, playerInterface: { cutsceneId, cutsceneIndex }, progressActiveCutscene}) => {
  if(!cutsceneId) return null
  if(!gameModel) return null 

  const { cutscenes } = gameModel

  if(!cutscenes[cutsceneId].scenes[cutsceneIndex]) {
    return <CutsceneBody scene={{
      text: 'Hello World'
    }} progressActiveCutscene={progressActiveCutscene} />
  }
  
  const scene = cutscenes[cutsceneId].scenes[cutsceneIndex]

  return <div className="Cutscene">
    <CutsceneBody scene={scene} progressActiveCutscene={progressActiveCutscene} />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  playerInterface: state.playerInterface,
  gameModel: state.gameModel,
});

export default compose(
  connect(mapStateToProps, { progressActiveCutscene }),
)(Cutscene)