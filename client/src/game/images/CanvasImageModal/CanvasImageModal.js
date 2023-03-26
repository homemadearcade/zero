import React, { useState } from 'react';
import { connect } from 'react-redux';

import './CanvasImageModal.scss';
import { CANVAS_IMAGE_LAYER_ID,  COLOR_BRUSH_ID, NON_LAYER_COLOR_ID } from '../../constants';

import { getCurrentGameScene } from '../../../utils/editorUtils';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import BrushControl from '../../brush/BrushControl/BrushControl';
import { clearBrush, selectBrush } from '../../../store/actions/gameSelectorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import UndoButton from '../../ui/UndoButton/UndoButton';
import { onCanvasImageModalUndo } from '../../../store/actions/lobbyActions';
import { setCanvasImageModalGameInstance } from '../../../store/actions/webPageActions';
import EraserSelect from '../../ui/EraserSelect/EraserSelect';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import BrushItem from '../../brush/BrushItem/BrushItem';
import { openCreateBrushFlow, updateCreateCanvasImage, closeCreateCanvasImageModal } from '../../../store/actions/gameFormEditorActions';
import { IMAGE_TYPE_SPRITE } from '../../../constants';
import useGameEditorSize from '../../../hooks/useGameEditorSize';
import { getImageUrlFromTextureId } from '../../../utils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { ADD_BRUSH_IID } from '../../../constants/interfaceIds';
import Loader from '../../../ui/Loader/Loader';
import CanvasImageView from '../CanvasImageView/CanvasImageView';
import SelectDescriptors from '../../ui/SelectDescriptors/SelectDescriptors';
import { editCanvasImage } from '../../../store/actions/canvasImageActions';

const CanvasImageModal = ({
  clearBrush,
  selectBrush,
  gameModel: { gameModel, gameModel: { brushes } },
  textureTintSelected,
  webPage: { gameInstance, imageCanvasGameInstance },
  closeCreateCanvasImageModal,
  onSaveCanvasImage,
  openCreateBrushFlow,
  gameFormEditor: { isCreateBrushFlowOpen, canvasImage, imageCanvasTextureId, isCanvasImageModalLoading },
  canvasImage: { textureIdSaving },
  updateCreateCanvasImage,
  editCanvasImage
 }) => {

  function handleClose(){
    closeCreateCanvasImageModal()
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

  // brushList.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
  //     <Button size="fit" onClick={() => {
  //       openCreateBrushFlow(CANVAS_IMAGE_LAYER_ID)
  //     }}>
  //       +
  //     </Button>
  // </Unlockable>)

  const isSaving = !!textureIdSaving[canvasImage.textureId]

  function renderBody() {
    if(isCanvasImageModalLoading) return <Loader></Loader>

    return <><div className="CanvasImageModal__left-column">
        <BrushControl/>
        <EraserSelect layerId={CANVAS_IMAGE_LAYER_ID}></EraserSelect>
        <AggregateColorSelect onSelectColor={onSelectColor} onUnselectColor={onUnselectColor}/>
      </div>
      <CanvasImageView 
        textureTint={textureTintSelected}
        initialTextureId={imageCanvasTextureId}
        textureId={canvasImage.textureId}
      />
      <div className="CanvasImageModal__right-column">
        <BorderedGrid 
          maxItems={42} 
          size="1.75em"
          items={brushList}/>
        <UndoButton onClick={onCanvasImageModalUndo}></UndoButton>
        <SelectDescriptors 
          onChange={(event, visualTags) => {
            updateCreateCanvasImage({ visualTags })
          }}
          formLabel="Descriptors"
          value={canvasImage.visualTags}
        />
        <Button onClick={() => {
            const imageCanvasScene = getCurrentGameScene(imageCanvasGameInstance)
            imageCanvasScene.backgroundCanvasLayer.rotate()
          }}>
            Rotate
        </Button>
        <Button 
          disabled={isSaving}
          onClick={async () => {
 
            const imageCanvasScene = getCurrentGameScene(imageCanvasGameInstance)
            const textureId = imageCanvasScene.backgroundCanvasLayer.textureId
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
          }}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </>
  }

  return <CobrowsingModal widthModifier={1.2} open={true} zIndexIncrease={10}  onClose={handleClose}>
    <div className="CanvasImageModal" style={{height: gameEditorHeight * 0.8}}>
      {renderBody()}
    </div>
  </CobrowsingModal>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  webPage: state.webPage,
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
  canvasImage: state.canvasImage,
  auth: state.auth
});

export default connect(mapStateToProps, { editCanvasImage, clearBrush, selectBrush, closeCreateCanvasImageModal, setCanvasImageModalGameInstance, openCreateBrushFlow, updateCreateCanvasImage })(CanvasImageModal);