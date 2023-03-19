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
import { CUTSCENE_ID_PREFIX, IMAGE_AND_TEXT_CUTSCENE, IMAGE_CUTSCENE, SCENE_ID_PREFIX, TEXT_CUTSCENE } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import MySpritesModal from '../../sprites/MySpritesModal/MySpritesModal';
import { closeMySpritesModal, openMySpritesModal } from '../../../store/actions/gameSelectorActions';
import SceneCard from '../SceneCard/SceneCard';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Switch from '../../../ui/Switch/Switch';
import { DIALOGUE_SHORTCUT_IID } from '../../../constants/interfaceIds';

const CreateCutscene = ({ 
  closeCreateCutscene, 
  editGameModel, 
  openMySpritesModal,
  closeMySpritesModal,
  updateCreateCutscene, 
  gameFormEditor: { cutscene },
  gameSelector: { isMySpritesModalOpen },
  gameModel: { gameModel },
}) => {
  const [editScene, setEditScene] = useState(null)
  function handleClose() {
    closeCreateCutscene()
  }
  
  useEffect(() => {
    if(!cutscene.cutsceneId) {
      updateCreateCutscene({ cutsceneId: CUTSCENE_ID_PREFIX+generateUniqueId(), isNew: true })
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
      id: SCENE_ID_PREFIX+generateUniqueId(),
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

    if(cutscene.inDialogueMenu) {
      return <Button onClick={() => {
        addScene(TEXT_CUTSCENE)
      }}>
        Add Line
      </Button>
    }

    return <>
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
    </>
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateCutscene">
       <Unlockable interfaceId={DIALOGUE_SHORTCUT_IID}>
        <Switch
          labels={['Only In Cutscene Menu', 'In Dialogue Menu']}
          size="small"
          onChange={(e) => {
              updateCreateCutscene({ inDialogueMenu: e.target.checked
            })          
          }}
          checked={cutscene.inDialogueMenu}
         />
      </Unlockable>
      <Typography component="h2" variant="h2">{cutscene.name}</Typography>
      <CutsceneNameForm initialName={cutscene.name}/>
      {cutscene.scenes.map((scene, index) => {
        return <div key={index} className='CreateCutscene__scene'>   
           <SceneCard 
            isEditing={index === editScene}
            index={index}
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
              openMySpritesModal()
              updateCreateCutscene({
                indexSelected: index
              })
            }}
            scene={scene}>
          </SceneCard>
        </div>
      })}
      {renderActionButtons()}
      <div className="CreateCutscene__buttons">
        <Button 
          disabled={!!cutscene.error || !cutscene.name.length}
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
          Save
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
    {isMySpritesModalOpen && <MySpritesModal onClickSprite={(textureId) => {
      const scenes = cutscene.scenes.slice()
      scenes[cutscene.indexSelected].imageUrl = textureId
      updateCreateCutscene({
        scenes,
      })
      closeMySpritesModal()
    }}/>}
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameSelector: state.gameSelector,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeCreateCutscene, editGameModel, openMySpritesModal, closeMySpritesModal }),
)(CreateCutscene);
