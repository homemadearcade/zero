import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';

import './SpriteEditor.scss';
import { SPRITE_EDITOR_CANVAS_ID, POPUP_SCENE, COLOR_BRUSH_ID } from '../../constants';

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

const SpriteEditor = ({isHost, isNetworked, clearBrush, selectBrush, tintSelected, setSpriteEditorGameInstance, gameEditor: { spriteEditorTextureId, spriteEditorAwsId }, webPage: { gameInstance, spriteEditorGameInstance }, closeSpriteEditor, onSaveSprite }) => {
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
    game.scene.add(POPUP_SCENE, new CodrawingScene({ isHost, isNetworked, textureId: spriteEditorTextureId, stageId: 'spriteeditor', newAwsImageId: spriteEditorAwsId, tint: tintSelected, key: POPUP_SCENE, size }), true);
    setSpriteEditorGameInstance(game)

    return () => {
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

    selectBrush(COLOR_BRUSH_ID + '/' + SPRITE_EDITOR_CANVAS_ID + '/' + hex)
  }

  function onUnselectColor() {
    clearBrush()
  }
  
  return (
    <CobrowsingModal open={true} width="110vh" height="70vh" onClose={handleClose}>
      <div className="SpriteEditor">
        <div className="SpriteEditor__left-column">
          <BrushControl/>
          <AggregateColorSelect onSelectColor={onSelectColor} onUnselectColor={onUnselectColor}/>
        </div>
        <div id="PhaserPopupGame"/>
        <div className="SpriteEditor__right-column">
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
          <UndoButton onClick={onSpriteEditorUndo}></UndoButton>
        </div>
      </div>

    </CobrowsingModal>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameEditor: state.gameEditor,
  webPage: state.webPage
});

export default connect(mapStateToProps, { clearBrush, selectBrush, closeSpriteEditor, setSpriteEditorGameInstance })(SpriteEditor);