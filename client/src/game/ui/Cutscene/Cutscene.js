import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { progressActiveCutscene } from '../../../store/actions/narrativeActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import './Cutscene.scss';

function CutsceneBody({imageUrl, text, progressActiveCutscene}) {
  function progressIfX(event) {
    if(!event.key) return
    if(event.key.toLowerCase() === 'x'){
      progressActiveCutscene()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', progressIfX)
    return () => {
      window.removeEventListener('keydown', progressIfX)
    }
  })

  return (
    <div className="Cutscene">
      {imageUrl && <img className="Cutscene__image" src={imageUrl} alt={text}/>}
      <div className="Cutscene__text">{text}</div>
    </div>
  );
}

const Cutscene = ({ game: { gameModel: { classes, cutscenes } }, narrative: { classId, cutsceneId, cutsceneIndex }, progressActiveCutscene}) => {
  if(!cutsceneId) return null
  
  const { imageUrl, text } = cutscenes[cutsceneId].scenes[cutsceneIndex]

  return <CutsceneBody imageUrl={imageUrl} text={text} progressActiveCutscene={progressActiveCutscene} />
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  narrative: state.narrative,
  game: state.game
});

export default compose(
  connect(mapStateToProps, { progressActiveCutscene }),
)(Cutscene)