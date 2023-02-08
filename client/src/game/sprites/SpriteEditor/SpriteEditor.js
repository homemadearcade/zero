import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';

import './SpriteEditor.scss';
import { SPRITE_EDITOR_CANVAS_ID, POPUP_SCENE, COLOR_BRUSH_ID, PLAYGROUND_CANVAS_ID } from '../../constants';

import { getCurrentGameScene } from '../../../utils/editorUtils';
import { CodrawingScene } from '../../scenes/CodrawingScene';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { nodeSize } from '../../defaultData/general';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import BrushControl from '../../brush/BrushControl/BrushControl';
import { clearBrush, closeSpriteEditor, selectBrush } from '../../../store/actions/gameEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import UndoButton from '../../ui/UndoButton/UndoButton';
import { onSpriteEditorUndo } from '../../../store/actions/lobbyActions';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { setSpriteEditorGameInstance } from '../../../store/actions/webPageActions';
import EraserSelect from '../../ui/EraserSelect/EraserSelect';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import BrushItem from '../../brush/BrushItem/BrushItem';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { openCreateBrushFlow } from '../../../store/actions/gameFormEditorActions';
import { Divider } from '@mui/material';

const SpriteEditor = ({isHost, isNetworked, clearBrush, selectBrush, gameModel: { gameModel: { brushes, classes } }, tintSelected, setSpriteEditorGameInstance, gameEditor: { spriteEditorTextureId, spriteEditorAwsId }, webPage: { gameInstance, spriteEditorGameInstance }, closeSpriteEditor, onSaveSprite, openCreateBrushFlow, gameFormEditor: { isCreateBrushFlowOpen } }) => {
  function handleClose(){
    closeSpriteEditor()
    clearBrush()
  }

  function handleSave(textureId) {
    onSaveSprite(textureId)
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
    game.scene.add(POPUP_SCENE, new CodrawingScene({ isHost, isNetworked, textureId: spriteEditorTextureId, newAwsImageId: spriteEditorAwsId, tint: tintSelected, key: POPUP_SCENE, size }), true);
    setSpriteEditorGameInstance(game)

    console.log('load sprite edit ')
    return () => {
      console.log('unload sprite edit ')
      getCurrentGameScene(game).unload()
      game.destroy()
    }
  }, []);

  function onSelectColor(hex) {
    editGameModel({
      colors: {
        [hex]: {
          [SPRITE_EDITOR_CANVAS_ID]: true
        }
      }
    })

    selectBrush(COLOR_BRUSH_ID + '/' + SPRITE_EDITOR_CANVAS_ID + '/' + hex, SPRITE_EDITOR_CANVAS_ID)
  }

  function onUnselectColor() {
    clearBrush()
  }
  
  let brushList = Object.keys(brushes).map((brushId, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  })


  // cannot happen here cuz. of ... recursion?
  // brushList.push(<Unlockable isTiny interfaceId='addBrush'>
  //     <Button size="fit" onClick={() => {
  //       openCreateBrushFlow(SPRITE_EDITOR_CANVAS_ID)
  //     }}>
  //       +
  //     </Button>
  // </Unlockable>)


  return (
    <CobrowsingModal open={true} width="110vh" zIndexIncrease={10} height="70vh" onClose={handleClose}>
      <div className="SpriteEditor">
        <div className="SpriteEditor__left-column">
          <BrushControl/>
          <EraserSelect canvasId={SPRITE_EDITOR_CANVAS_ID}></EraserSelect>
          <AggregateColorSelect onSelectColor={onSelectColor} onUnselectColor={onUnselectColor}/>
        </div>
        <div id="PhaserPopupGame"/>
        <div className="SpriteEditor__right-column">
          <BorderedGrid 
            maxItems={42} 
            size="3.5vh"
            items={brushList}/>
          <UndoButton onClick={onSpriteEditorUndo}></UndoButton>
          <Button onClick={async () => {
            const spriteEditorScene = getCurrentGameScene(spriteEditorGameInstance)
            const textureId = await spriteEditorScene.backgroundLayer.save()
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
            Save
          </Button>
        </div>
      </div>

    </CobrowsingModal>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameEditor: state.gameEditor,
  webPage: state.webPage,
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { clearBrush, selectBrush, closeSpriteEditor, setSpriteEditorGameInstance, openCreateBrushFlow })(SpriteEditor);