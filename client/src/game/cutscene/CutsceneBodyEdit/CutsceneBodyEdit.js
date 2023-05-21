import React  from 'react';
import KeyIndicator from '../../ui/KeyIndicator/KeyIndicator';
import './CutsceneBodyEdit.scss';
import TextField from '../../../ui/TextField/TextField';
import Button from '../../../ui/Button/Button';
import { IMAGE_AND_TEXT_SCENE_IID, IMAGE_CUTSCENE_IID, SELECT_SPEAKER_ENTITY_MODEL_IID, TEXT_SCENE_IID } from '../../../constants/interfaceIds';
import SelectEntityModel from '../../ui/SelectEntityModel/SelectEntityModel';

export default function CutsceneBodyEdit({
  scene: {text, imageUrl, sceneInterfaceType, entityModelId},
  onDoneEditing,
  onChooseNewImage,
  onChangeText,
  onSelectEntityModelId
}) {

  const showImage = sceneInterfaceType === IMAGE_AND_TEXT_SCENE_IID || sceneInterfaceType === IMAGE_CUTSCENE_IID
  const showText = sceneInterfaceType !== IMAGE_CUTSCENE_IID
  return (
    <div className="CutsceneBodyEdit">
      {imageUrl && showImage && <img className="CutsceneBodyEdit__image" src={imageUrl} alt={text}/>}
      {showImage && <Button onClick={onChooseNewImage}>Choose New Image</Button>}
      {showText && <div className="CutsceneBodyEdit__text-container">
        <TextField multiline fullWidth minRows={4} onChange={onChangeText} value={text || ''} label={"Text"} />
        <SelectEntityModel
          interfaceId={SELECT_SPEAKER_ENTITY_MODEL_IID}
          formLabel="Speaker"
          value={entityModelId ? [entityModelId] : []}
          onChange={(event, entityModels) => {
            const newEntityId = entityModels[entityModels.length-1]
            onSelectEntityModelId(newEntityId ? newEntityId : null)
        }}/>
      </div>}
      <Button onClick={onDoneEditing}>Done</Button>
    </div>
  );
}