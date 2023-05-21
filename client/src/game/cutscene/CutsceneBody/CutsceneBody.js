import React  from 'react';
import KeyIndicator from '../../ui/KeyIndicator/KeyIndicator';
import './CutsceneBody.scss';
import { IMAGE_AND_TEXT_SCENE_IID, IMAGE_CUTSCENE_IID, TEXT_SCENE_IID } from '../../../constants/interfaceIds';
import Texture from '../../textures/Texture/Texture';
import { mapCobrowsingState } from '../../../utils';
import { connect } from 'react-redux';
import classNames from 'classnames';

 function CutsceneBody({
  gameModel: { gameModel },
  scene: {text, imageUrl, sceneInterfaceType, entityModelId},
}) {

  const showImage = (sceneInterfaceType === IMAGE_AND_TEXT_SCENE_IID || sceneInterfaceType === IMAGE_CUTSCENE_IID) && imageUrl
  const showText = sceneInterfaceType !== IMAGE_CUTSCENE_IID && text?.length

  const speakerEntityModel = gameModel.entityModels[entityModelId]

  return (
    <div className={classNames("CutsceneBody", {
      'CutsceneBody--with-image': showImage,
    })}>
      {imageUrl && showImage && <img className="CutsceneBody__image" src={imageUrl} alt={text}/>}
      {showText && <div className="CutsceneBody__text-dialog">
        <div className="CutsceneBody__text-container">
          {speakerEntityModel && <div className="CutsceneBody__speaker">
            <div className="CutsceneBody__speaker-image">
              <Texture textureId={speakerEntityModel.graphics.textureId} textureTint={speakerEntityModel.graphics.textureTint} />
            </div>
            <div className="CutsceneBody__speaker-name">{speakerEntityModel.name}</div>
          </div>}
          <div className='CutsceneBody__text'>{text}</div>
        </div>
     
        <KeyIndicator className="CutsceneBody__text-key blink" keyName="x"/>
      </div>}
      {!showText && <div className="CutsceneBody__next"><KeyIndicator className="CutsceneBody__key blink" keyName="x"/></div>}
    </div>
  );
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { })(CutsceneBody);
