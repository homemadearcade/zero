import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';

import './CanvasImageModal.scss';
import { IMAGE_CANVAS_MODAL_CANVAS_ID, POPUP_SCENE, COLOR_BRUSH_ID, NON_LAYER_COLOR_ID } from '../../constants';

import { getCurrentGameScene } from '../../../utils/editorUtils';
import { CodrawingScene } from '../../scenes/CodrawingScene';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { nodeSize } from '../../constants';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import BrushControl from '../../brush/BrushControl/BrushControl';
import { clearBrush, closeCanvasImageModal, selectBrush } from '../../../store/actions/gameSelectorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import UndoButton from '../../ui/UndoButton/UndoButton';
import { onCanvasImageModalUndo } from '../../../store/actions/lobbyActions';
import { setCanvasImageModalGameInstance } from '../../../store/actions/webPageActions';
import EraserSelect from '../../ui/EraserSelect/EraserSelect';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import BrushItem from '../../brush/BrushItem/BrushItem';
import { openCreateBrushFlow } from '../../../store/actions/gameFormEditorActions';
import { addCanvasImage } from '../../../store/actions/canvasImageActions';
import { IMAGE_TYPE_SPRITE } from '../../../constants';

const CanvasImageModal = ({
  clearBrush,
  selectBrush,
  gameModel: { gameModel, gameModel: { brushes } },
  textureTintSelected,
  setCanvasImageModalGameInstance,
  gameSelector: { imageCanvasTextureId, imageCanvasNewTextureId },
  webPage: { gameInstance, imageCanvasGameInstance },
  closeCanvasImageModal,
  onSaveCanvasImage,
  openCreateBrushFlow,
  gameFormEditor: { isCreateBrushFlowOpen },
  canvasImage: { textureIdSaving },
  addCanvasImage,
  auth: { me }
 }) => {
  const [textureId] = useState(gameModel.id + '/' + imageCanvasNewTextureId)

  useEffect(() => {
    async function goAddTexture() {
      await addCanvasImage({
        textureId: textureId, 
        imageType: IMAGE_TYPE_SPRITE,
        userId: me?.id,
        arcadeGame: gameModel.id
      })
    }

    goAddTexture()
  }, [])

  function handleClose(){
    closeCanvasImageModal()
    clearBrush()
  }

  function handleSave(textureId) {
    onSaveCanvasImage(textureId)
    handleClose()
  }

  useEffect(() => {
    const size = nodeSize * (3 * 10);

    const config= {
      type: Phaser.WEBGL,
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        parent: 'PhaserPopupGame',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: size,
        height: size
      },
    }
    
    const game = new Phaser.Game(config);
    game.scene.add(POPUP_SCENE, new CodrawingScene({ initialTextureId: imageCanvasTextureId, textureId, textureTint: textureTintSelected, key: POPUP_SCENE, size }), true);
    setCanvasImageModalGameInstance(game)

    console.log('load sprite edit ')
    return () => {
      console.log('unload sprite edit ')
      getCurrentGameScene(game).unload()
      game.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSelectColor(hex) {
    selectBrush(COLOR_BRUSH_ID + '/' + IMAGE_CANVAS_MODAL_CANVAS_ID + '/' + hex)
  }

  function onUnselectColor() {
    clearBrush()
  }
  
  let brushList = Object.keys(brushes).map((brushId, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  })


  // cannot happen here cuz. of ... recursion?
  // brushList.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
  //     <Button size="fit" onClick={() => {
  //       openCreateBrushFlow(IMAGE_CANVAS_MODAL_CANVAS_ID)
  //     }}>
  //       +
  //     </Button>
  // </Unlockable>)

  const isSaving = !!textureIdSaving[textureId]
  return (
    <CobrowsingModal open={true} width="110vh" zIndexIncrease={10} height="70vh" onClose={handleClose}>
      <div className="CanvasImageModal">
        <div className="CanvasImageModal__left-column">
          <BrushControl/>
          <EraserSelect layerCanvasId={IMAGE_CANVAS_MODAL_CANVAS_ID}></EraserSelect>
          <AggregateColorSelect onSelectColor={onSelectColor} onUnselectColor={onUnselectColor}/>
        </div>
        <div id="PhaserPopupGame"/>
        <div className="CanvasImageModal__right-column">
          <BorderedGrid 
            maxItems={42} 
            size="3.5vh"
            items={brushList}/>
          <UndoButton onClick={onCanvasImageModalUndo}></UndoButton>
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
              const textureId = await imageCanvasScene.backgroundCanvasLayer.save()
              const gameInstanceScene = getCurrentGameScene(gameInstance)
              if(!gameInstanceScene) {
                handleSave(textureId)
                return
              }
              gameInstanceScene.load.image(textureId, window.awsUrl + textureId);
              gameInstanceScene.load.once('complete', () => {
                handleSave(textureId)
              });
              gameInstanceScene.load.start();
            }}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

    </CobrowsingModal>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  webPage: state.webPage,
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
  canvasImage: state.canvasImage,
  auth: state.auth
});

export default connect(mapStateToProps, { addCanvasImage, clearBrush, selectBrush, closeCanvasImageModal, setCanvasImageModalGameInstance, openCreateBrushFlow })(CanvasImageModal);