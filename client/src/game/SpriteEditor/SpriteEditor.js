import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';

import './SpriteEditor.scss';
import { BASE_CANVAS_ID, POPUP_SCENE } from '../../constants';

import { getCurrentGameScene } from '../../utils/editorUtils';
import { CodrawingScene } from '../scenes/CodrawingScene';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { getSpriteData, getTextureMetadata } from '../../utils/utils';
import { nodeSize } from '../../defaultData/general';
import AggregateColorSelect from '../AggregateColorSelect/AggregateColorSelect';
import BrushControl from '../BrushControl/BrushControl';

const SpriteEditor = ({isHost, isNetworked, textureId}) => {
  function handleClose(){}

  useEffect(() => {
    const { spriteSheetName } = getTextureMetadata(textureId)
    const texture = getSpriteData(textureId)  

    // const width = texture ? texture.width : nodeSize * (3 * 9);
    // const height = texture ? texture.height : nodeSize * (3 * 9);

    const size = nodeSize * (3 * 9);

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
    game.scene.add(POPUP_SCENE, new CodrawingScene({ isHost, isNetworked, textureId: textureId, spriteSheetName, key: POPUP_SCENE, size }), true);

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

        </div>
      </div>

    </CobrowsingModal>
  );
};

const mapStateToProps = (state) => ({
  
});

export default connect(mapStateToProps, { })(SpriteEditor);