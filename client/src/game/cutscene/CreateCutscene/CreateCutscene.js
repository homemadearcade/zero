/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateCutscene.scss';
import CobrowsingDialog from '../../../game/cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeCreateCutscene, updateCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CutsceneNameForm from '../../cutscene/CutsceneNameForm/CutsceneNameForm';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { generateUniqueId } from '../../../utils/webPageUtils';
import Typography from '../../../ui/Typography/Typography';
import GameTexturesDialog from '../../textures/GameTexturesDialog/GameTexturesDialog';
import { closeGameTexturesDialog, openGameTexturesDialog } from '../../../store/actions/game/gameSelectorActions';
import SceneCard from '../SceneCard/SceneCard';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import { TEXT_SCENE_SHORTCUT_IID, IMAGE_AND_TEXT_SCENE_IID, IMAGE_CUTSCENE_IID, TEXT_SCENE_IID } from '../../../constants/interfaceIds';
import { getImageUrlFromTextureId } from '../../../utils';
import { CUTSCENE_DID, SCENE_DID } from '../../constants';
import Divider from '../../../ui/Divider/Divider';

const CreateCutscene = ({ 
  closeCreateCutscene, 
  editGameModel, 
  openGameTexturesDialog,
  closeGameTexturesDialog,
  updateCreateCutscene, 
  gameFormEditor: { cutscene },
  gameSelector: { isGameTexturesDialogOpen },
  gameModel: { gameModel },
}) => {
  const [editScene, setEditScene] = useState(null)
  function handleClose() {
    closeCreateCutscene()
  }
  
  const defaultCutsceneName = 'Cutscene #' + (Object.keys(gameModel.cutscenes).length + 1).toString()

  useEffect(() => {
    if(!cutscene.cutsceneId) {
      updateCreateCutscene({ 
        cutsceneId: CUTSCENE_DID+generateUniqueId(), 
        isNew: true,
        name: defaultCutsceneName,
     })
    }
  }, [])

  function handleTextChange(value, index) {
    const scenes = cutscene.scenes.slice()
    scenes[index].text = value

    updateCreateCutscene({
      scenes,
    })
  }

  function addScene(sceneInterfaceType) {
    const scenes = cutscene.scenes.slice()
    scenes.push({
      sceneId: SCENE_DID+generateUniqueId(),
      sceneInterfaceType,
      text: null,
      imageUrl: null,
    })

    setEditScene(scenes.length -1)

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

  function renderActionButtons() {

    if(cutscene.isTextSceneOnly) {
      return <Button onClick={() => {
        addScene(TEXT_SCENE_IID)
      }}>
        Add Line
      </Button>
    }

    return <>
      <Button onClick={() => {
        addScene(TEXT_SCENE_IID)
      }}>
        Add Text Scene
      </Button>
      <Button onClick={() => {
        addScene(IMAGE_CUTSCENE_IID)
      }}>
        Add Image Scene
      </Button>
      <Button onClick={() => {
        addScene(IMAGE_AND_TEXT_SCENE_IID)
      }}>
        Add Image and Text Scene
      </Button>
    </>
  }

  return <CobrowsingDialog open={true}>
    <div className="CreateCutscene">
      <CutsceneNameForm initialName={cutscene.name || defaultCutsceneName}/>
      <Unlockable interfaceId={TEXT_SCENE_SHORTCUT_IID}>
        <Switch
          labels={['Is Cutscene', 'Is Text Scene']}
          size="small"
          onChange={(e) => {
              updateCreateCutscene({ isTextSceneOnly: e.target.checked
            })          
          }}
          checked={cutscene.isTextSceneOnly}
         />
      </Unlockable>
      <Divider/>
      {cutscene.scenes.map((scene, index) => {
        return <div key={index} className='CreateCutscene__scene'>   
           <SceneCard 
            isEditing={index === editScene}
            index={index}
            onSelectEntityModelId={(entityModelId) => {
              const scenes = cutscene.scenes.slice()
              scenes[index].entityModelId = entityModelId

              updateCreateCutscene({
                scenes,
              })
            }}
            onRemoveScene={() => {
              removeScene(index)
            }} 
            onChangeText={(e) => {
              handleTextChange(e.target.value, index)
            }}
            onEditScene={() => {
              setEditScene(index)
            }} 
            onDoneEditing={() => {
              setEditScene(null)
            }}
            onChooseNewImage={() => {
              openGameTexturesDialog()
              updateCreateCutscene({
                indexSelected: index
              })
            }}
            scene={scene}>
          </SceneCard>
          <Divider/>
        </div>
      })}
      {renderActionButtons()}
      <div className="CreateCutscene__buttons">
        <Button 
          onClick={() => {
            editGameModel({
              cutscenes: {
                [cutscene.cutsceneId] : {
                  ...cutscene,
                  isNew: false
                }
              }
            })
            handleClose()
          }}>
          {cutscene.isNew ? 'Create' : 'Save'}
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        {!cutscene.isNew && !cutscene.isRemoved && <Button onClick={() => {
            editGameModel({
              cutscenes: {
                [cutscene.cutsceneId]: {
                  isRemoved: true
                }
              }
            })
            handleClose()
        }}>Remove</Button>}
        {cutscene.isRemoved && <Button onClick={() => {
            editGameModel({
              cutscenes: {
                [cutscene.cutsceneId]: {
                  isRemoved: false
                }
              }
            })
            handleClose()
        }}>Restore</Button>}
      </div>
    </div>
    {isGameTexturesDialogOpen && <GameTexturesDialog onClickTexture={(textureId) => {
      const scenes = cutscene.scenes.slice()
      scenes[cutscene.indexSelected].imageUrl = getImageUrlFromTextureId(textureId)
      updateCreateCutscene({
        scenes,
      })
      closeGameTexturesDialog()
    }}/>}
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameSelector: state.gameSelector,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeCreateCutscene, editGameModel, openGameTexturesDialog, closeGameTexturesDialog }),
)(CreateCutscene);
