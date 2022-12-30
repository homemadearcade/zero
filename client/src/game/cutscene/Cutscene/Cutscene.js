import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { progressActiveCutscene } from '../../../store/actions/gameContextActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import KeyIndicator from '../../ui/KeyIndicator/KeyIndicator';
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
      {imageUrl && <img className="Cutscene__image" src={window.awsUrl + imageUrl} alt={text}/>}
      <div className="Cutscene__text-container">
        <div className="Cutscene__text">{text}</div>
        <KeyIndicator className="Cutscene__text-key blink" keyName="x"/>
      </div>
    </div>
  );
}

const Cutscene = ({ gameModel: { gameModel: { cutscenes } }, gameContext: { cutsceneId, cutsceneIndex }, progressActiveCutscene}) => {
  if(!cutsceneId) return null
  
  const { imageUrl, text } = cutscenes[cutsceneId].scenes[cutsceneIndex]

  return <CutsceneBody imageUrl={imageUrl} text={text} progressActiveCutscene={progressActiveCutscene} />
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameContext: state.gameContext,
  gameModel: state.gameModel,
});

export default compose(
  connect(mapStateToProps, { progressActiveCutscene }),
)(Cutscene)