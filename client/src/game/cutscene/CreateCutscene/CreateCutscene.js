/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateCutscene.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateCutscene, updateCreateCutscene } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CutsceneNameForm from '../../cutscene/CutsceneNameForm/CutsceneNameForm';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { IMAGE_AND_TEXT_CUTSCENE, IMAGE_CUTSCENE, TEXT_CUTSCENE } from '../../constants';
import { TextField } from '@mui/material';
import Typography from '../../../ui/Typography/Typography';
import MySpritesModal from '../../sprites/MySpritesModal/MySpritesModal';
import { closeMySpritesModal, openMySpritesModal } from '../../../store/actions/gameEditorActions';
import Sprite from '../../sprites/Sprite/Sprite';

const CreateCutscene = ({ 
  closeCreateCutscene, 
  editGameModel, 
  openMySpritesModal,
  closeMySpritesModal,
  updateCreateCutscene, 
  gameFormEditor: { cutscene },
  gameEditor: { isMySpritesModalOpen },
  gameModel: { gameModel }
}) => {
  const [isNewCutscene, setIsNewCutscene] = useState(null)

  function handleClose() {
    closeCreateCutscene()
  }
  
  useEffect(() => {
    if(!cutscene.cutsceneId) {
      updateCreateCutscene({ cutsceneId: generateUniqueId() })
      setIsNewCutscene(true)
    } else {
      setIsNewCutscene(false)
    }
  }, [])


  function handleTextChange(value, index) {
    const scenes = cutscene.scenes.slice()
    scenes[index].text = value

    updateCreateCutscene({
      scenes,
    })
  }

  function addScene(type) {
    const scenes = cutscene.scenes.slice()
    scenes.push({
      type,
      text: null,
      imageUrl: null,
    })

    updateCreateCutscene({
      scenes,
    })
  }

  function removeScene(index) {
    const scenes = cutscene.scenes.slice()

    scenes.splice(index, 1)

    updateCreateCutscene({
      scenes,
    })
  }

  function renderTextInput(scene, index) {
    return  <TextField multiline value={scene.text} onChange={(e) => {
      handleTextChange(e.target.value, index)
    }} label={"Text"}/>
  }

  function renderImageSelect(scene, index) {
    return <>
      {scene.imageUrl && <img className="CreateCutscene__scene-image" alt={index + ' image'} src={window.awsUrl + scene.imageUrl}/>}
      <Button onClick={() => {
        openMySpritesModal()
        updateCreateCutscene({
          indexSelected: index
        })
      }}>Select Image</Button>
    </>
  }

  function renderSceneContents(scene, index) {
    if(scene.type === IMAGE_AND_TEXT_CUTSCENE) {
      return <div className='CreateCutscene__scene-contents'>
        {renderImageSelect(scene, index)}
        {renderTextInput(scene, index)}
      </div>
    } else if(scene.type === IMAGE_CUTSCENE) {
      return <div className='CreateCutscene__scene-contents'>
        {renderImageSelect(scene, index)}
      </div>
    } else if(scene.type === TEXT_CUTSCENE) {
      return <div className='CreateCutscene__scene-contents'>
        {renderTextInput(scene, index)}
      </div>
    }
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateCutscene">
      <Typography component="h2" variant="h2">{cutscene.name}</Typography>
      <CutsceneNameForm/>
      {cutscene.scenes.map((scene, index) => {
        return <div key={index} className='CreateCutscene__scene'> 
          <Typography component="h5" variant="h5">{index + 1}</Typography>
          <Button onClick={() => {
            removeScene(index)
          }}>Remove Scene</Button>
          {renderSceneContents(scene, index)}
        </div>
      })}
      <Button onClick={() => {
        addScene(TEXT_CUTSCENE)
      }}>
        Add Text Scene
      </Button>
      <Button onClick={() => {
        addScene(IMAGE_CUTSCENE)
      }}>
        Add Image Scene
      </Button>
      <Button onClick={() => {
        addScene(IMAGE_AND_TEXT_CUTSCENE)
      }}>
        Add Image and Text Scene
      </Button>
      <div className="CreateCutscene__buttons">
        <Button 
          disabled={!!cutscene.error || !cutscene.name.length}
          onClick={() => {
            editGameModel({
              cutscenes: {
                [cutscene.cutsceneId] : {
                  ...cutscene
                }
              }
            })
            handleClose()
          }}>
          Save
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
    {isMySpritesModalOpen && <MySpritesModal onClickSprite={(textureId) => {
      const scenes = cutscene.scenes.slice()
      scenes[cutscene.indexSelected].imageUrl = gameModel.awsImages[textureId].url
      updateCreateCutscene({
        scenes,
      })
      closeMySpritesModal()
    }}/>}
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameEditor: state.gameEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeCreateCutscene, editGameModel, openMySpritesModal, closeMySpritesModal }),
)(CreateCutscene);
