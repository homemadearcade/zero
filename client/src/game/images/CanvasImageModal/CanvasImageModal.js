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
import useGameEditorSize from '../../../hooks/useGameEditorSize';
import { getImageUrlFromTextureId } from '../../../utils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { ADD_BRUSH_IID } from '../../../constants/interfaceIds';

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
    let game;

    async function goAddTexture() {
      await addCanvasImage({
        textureId: textureId, 
        visualTags: [],
        imageUrl: getImageUrlFromTextureId(textureId),
        imageType: IMAGE_TYPE_SPRITE,
        userId: me?.id,
        arcadeGame: gameModel.id
      })

      const size = nodeSize * (3 * 10);

      setTimeout(() => {
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
        
        game = new Phaser.Game(config);
        game.scene.add(POPUP_SCENE, new CodrawingScene({ initialTextureId: imageCanvasTextureId, textureId, textureTint: textureTintSelected, key: POPUP_SCENE, size }), true);
        setCanvasImageModalGameInstance(game)
      })

    }

    goAddTexture()

    console.log('load sprite edit ')
    return () => {
      if(!game) return
      console.log('unload sprite edit ')
      getCurrentGameScene(game).unload()
      game.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClose(){
    closeCanvasImageModal()
    clearBrush()
  }

  function handleSave(textureId) {
    onSaveCanvasImage(textureId)
    handleClose()
  }
  const { gameEditorHeight } = useGameEditorSize()

  function onSelectColor(hex) {
    selectBrush(COLOR_BRUSH_ID + '/' + IMAGE_CANVAS_MODAL_CANVAS_ID + '/' + hex)
  }

  function onUnselectColor() {
    clearBrush()
  }
  
  let brushList = Object.keys(brushes).map((brushId, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  })

  // brushList.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
  //     <Button size="fit" onClick={() => {
  //       openCreateBrushFlow(IMAGE_CANVAS_MODAL_CANVAS_ID)
  //     }}>
  //       +
  //     </Button>
  // </Unlockable>)

  const isSaving = !!textureIdSaving[textureId]
  return (
    <CobrowsingModal widthModifier={1} open={true} zIndexIncrease={10}  onClose={handleClose}>
      <div className="CanvasImageModal" style={{height: gameEditorHeight * 0.7}}>
        <div className="CanvasImageModal__left-column">
          <BrushControl/>
          <EraserSelect layerCanvasId={IMAGE_CANVAS_MODAL_CANVAS_ID}></EraserSelect>
          <AggregateColorSelect onSelectColor={onSelectColor} onUnselectColor={onUnselectColor}/>
        </div>
        <div id="PhaserPopupGame"/>
        <div className="CanvasImageModal__right-column">
          <BorderedGrid 
            maxItems={42} 
            size="1.75em"
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
              gameInstanceScene.load.image(textureId, getImageUrlFromTextureId(textureId));
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