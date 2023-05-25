import React from 'react';
import { connect } from 'react-redux';

import './CanvasImageDialog.scss';
import { CANVAS_IMAGE_LAYER_ID,  COLOR_BRUSH_ID } from '../../constants';

import { getCurrentGameScene } from '../../../utils/editorUtils';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import BrushControl from '../../brush/BrushControl/BrushControl';
import { clearBrush, selectBrush } from '../../../store/actions/game/gameSelectorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import UndoButton from '../../ui/UndoButton/UndoButton';
import { setCanvasImageDialogGameInstance } from '../../../store/actions/webPageActions';
import EraserSelect from '../../ui/EraserSelect/EraserSelect';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import BrushItem from '../../brush/BrushItem/BrushItem';
import { openCreateBrushFlow, updateCreateCanvasImage, closeCreateCanvasImageDialog } from '../../../store/actions/game/gameFormEditorActions';
import useGameEditorSize from '../../../hooks/useGameEditorSize';
import { getImageUrlFromTextureId } from '../../../utils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CANVAS_IMAGE_VISUAL_TAGS_IID } from '../../../constants/interfaceIds';
import Loader from '../../../ui/Loader/Loader';
import CanvasImageView from '../CanvasImageView/CanvasImageView';
import SelectVisualTags from '../../ui/SelectVisualTags/SelectVisualTags';
import { editCanvasImage } from '../../../store/actions/media/canvasImageActions';
import { onCanvasImageDialogUndo } from '../../../store/actions/game/gameRoomInstanceActions';
import ButtonMenu from '../../../ui/ButtonMenu/ButtonMenu';
import { MenuItem } from '@mui/material';

const CanvasImageDialog = ({
  clearBrush,
  selectBrush,
  gameModel: { gameModel, gameModel: { brushes } },
  webPage: { gameInstance, imageCanvasGameInstance },
  closeCreateCanvasImageDialog,
  onSaveCanvasImage,
  openCreateBrushFlow,
  gameFormEditor: { isCreateBrushFlowOpen, canvasImage, canvasImageTextureId, canvasImageTextureTint, isCanvasImageDialogLoading },
  canvasImage: { textureIdSaving },
  updateCreateCanvasImage,
  editCanvasImage
 }) => {
  function handleClose(){
    closeCreateCanvasImageDialog()
    clearBrush()
  }

  function handleSave(textureId) {
    onSaveCanvasImage(textureId)
    handleClose()
  }

  const { gameEditorHeight } = useGameEditorSize()

  function onSelectColor(hex) {
    selectBrush(COLOR_BRUSH_ID + '/' + CANVAS_IMAGE_LAYER_ID + '/' + hex)
  }

  function onUnselectColor() {
    clearBrush()
  }
  
  let brushList = Object.keys(brushes).map((brushId, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  })

  // brushList.push(<Unlockable isTiny interfaceId={BRUSH_ADD_IID}>
  //     <Button size="fit" onClick={() => {
  //       openCreateBrushFlow(CANVAS_IMAGE_LAYER_ID)
  //     }}>
  //       +
  //     </Button>
  // </Unlockable>)


  function renderBody() {
    if(isCanvasImageDialogLoading) return <Loader text="Loading..."></Loader>
    if(!canvasImage) return <Loader text="Loading Image.."></Loader>
    
    const isSaving = !!textureIdSaving[canvasImage.textureId]

    return <><div className="CanvasImageDialog__left-column">
        <BrushControl/>
        <EraserSelect layerId={CANVAS_IMAGE_LAYER_ID}></EraserSelect>
        <AggregateColorSelect onSelectColor={onSelectColor} onUnselectColor={onUnselectColor}/>
      </div>
      <CanvasImageView 
        textureTint={canvasImageTextureTint}
        initialTextureId={canvasImageTextureId}
        textureId={canvasImage.textureId}
      />
      <div className="CanvasImageDialog__right-column">
        <BorderedGrid 
          maxItems={42} 
          size="1.75em"
          items={brushList}/>
        {false && <UndoButton onClick={onCanvasImageDialogUndo}></UndoButton>}
        <Unlockable interfaceId={CANVAS_IMAGE_VISUAL_TAGS_IID}><SelectVisualTags 
          onChange={(event, visualTags) => {
            updateCreateCanvasImage({ visualTags })
          }}
          formLabel="Descriptors"
          value={canvasImage.visualTags}
        /></Unlockable> 
        <ButtonMenu 
          text="Edit"
          variant="outlined"
          menu={(handleClose) => {
            return [
                <MenuItem onClick={() => {
                  handleClose()
                  const imageCanvasScene = getCurrentGameScene(imageCanvasGameInstance)
                  // imageCanvasScene.backgroundCanvasLayer.setOrigin(0.5, 0.5)
                  imageCanvasScene.backgroundCanvasLayer.rotate()
                }}>
                  Rotate
              </MenuItem>,
              <MenuItem onClick={() => {
                  handleClose()
                  const imageCanvasScene = getCurrentGameScene(imageCanvasGameInstance)
                  imageCanvasScene.backgroundCanvasLayer.flipHorizontal()
                  // imageCanvasScene.backgroundCanvasLayer = imageCanvasScene.backgroundCanvasLayer.clone()
                }}>
                  Flip ⇆
              </MenuItem>,
              <MenuItem onClick={() => {
                  handleClose()
                  const imageCanvasScene = getCurrentGameScene(imageCanvasGameInstance)
                  imageCanvasScene.backgroundCanvasLayer.flipVertical()
                }}>
                  Flip ⇵
              </MenuItem>
            ]
          }}
        >
          
        </ButtonMenu>
        <Button 
          disabled={isSaving}
          onClick={async () => {
            const imageCanvasScene = getCurrentGameScene(imageCanvasGameInstance)
            const textureId = imageCanvasScene.backgroundCanvasLayer.textureId

            try {
              await imageCanvasScene.backgroundCanvasLayer.save()
              const gameInstanceScene = getCurrentGameScene(gameInstance)
              if(!gameInstanceScene) {
                handleSave(textureId)
                return
              }
              gameInstanceScene.load.image(textureId, getImageUrlFromTextureId(textureId));
              gameInstanceScene.load.once('complete', () => {
                handleSave(textureId)
              });
              gameInstanceScene.load.start();
              editCanvasImage(canvasImage.id, {
                visualTags: canvasImage.visualTags
              })
            } catch(e) {
              console.error(e)
              handleSave(canvasImageTextureId)
            }
          }}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </>
  }

  return <CobrowsingDialog widthModifier={1.2} open={true} zIndexIncrease={10}>
    <div className="CanvasImageDialog" style={{height: gameEditorHeight * 0.8}}>
      {renderBody()}
    </div>
  </CobrowsingDialog>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  webPage: state.webPage,
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
  canvasImage: state.canvasImage,
  auth: state.auth
});

export default connect(mapStateToProps, { editCanvasImage, clearBrush, selectBrush, closeCreateCanvasImageDialog, setCanvasImageDialogGameInstance, openCreateBrushFlow, updateCreateCanvasImage })(CanvasImageDialog);