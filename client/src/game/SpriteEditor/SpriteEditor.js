import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';

import './SpriteEditor.scss';
import { BASE_CANVAS_ID, POPUP_SCENE } from '../../constants';

import { getCurrentGameScene } from '../../utils/editorUtils';
import { CodrawingScene } from '../scenes/CodrawingScene';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { nodeSize } from '../../defaultData/general';
import AggregateColorSelect from '../AggregateColorSelect/AggregateColorSelect';
import BrushControl from '../BrushControl/BrushControl';
import { closeSpriteEditor } from '../../store/actions/editorActions';
import Button from '../../app/ui/Button/Button';
import { v4 as uuidv4 } from 'uuid';

const SpriteEditor = ({isHost, isNetworked, editor: { spriteEditorTextureId }, game: { gameInstance }, closeSpriteEditor, onSaveSprite }) => {
  const [spriteEditorGameInstance, setSpriteEditorGameInstance] = useState(null)

  function handleClose(){
    closeSpriteEditor()
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
    game.scene.add(POPUP_SCENE, new CodrawingScene({ isHost, isNetworked, textureId: spriteEditorTextureId, newAwsImageId: uuidv4(), key: POPUP_SCENE, size }), true);
    setSpriteEditorGameInstance(game)

    return () => {
      getCurrentGameScene(game).unload()
      game.destroy()
    }
  }, []);
  
  return (
    <CobrowsingModal open={true} width="110vh" height="70vh" onClose={handleClose}>
      <div className="SpriteEditor">
        <div className="SpriteEditor__left-column">
          <BrushControl/>
          <AggregateColorSelect canvasId={BASE_CANVAS_ID}/>
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
        </div>
      </div>

    </CobrowsingModal>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game
});

export default connect(mapStateToProps, { closeSpriteEditor })(SpriteEditor);