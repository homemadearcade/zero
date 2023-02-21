import Phaser from 'phaser';
import { isBrushIdColor, isBrushIdEraser } from '../../utils/editorUtils';
import { TexturePencil } from '../drawing/TexturePencil';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import { ColorPencil } from '../drawing/ColorPencil';
import { nodeSize } from '../defaultData/general';
import { BACKGROUND_CANVAS_DEPTH, DEFAULT_TEXTURE_ID, SPRITE_EDITOR_CANVAS_ID, UI_CANVAS_DEPTH } from '../constants';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { Brush } from '../drawing/Brush';
import { getTextureMetadata } from '../../utils/utils';
import { EraserSingleLayer } from '../drawing/EraserSingleLayer';
import store from '../../store';

export class CodrawingScene extends Phaser.Scene {
  constructor({key, textureId, newAwsImageId, tint, size}) {
    super({
      key: key,
    });

    this.brush = null 
    this.canvas= null

    this.size = size
    this.tint = tint

    this.gameRoom = {
      isNetworked: true
    }

    if(textureId) {
      this.textureId = textureId
      const { spriteIndex, spriteSheetName } = getTextureMetadata(this.textureId)
      this.spriteIndex = spriteIndex
      this.spriteSheetName = spriteSheetName
    }

    this.boundaries = {
      x: 0,
      y: 0,
      maxWidth: this.size,
      maxHeight: this.size,
      height: this.size,
      width: this.size
    }

    this.newAwsImageId = newAwsImageId
  }

  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // POINTER
  ////////////////////////////////////////////////////////////
  onPointerMove = (pointer)  => {
    window.pointer = pointer

    const gameSelector = getCobrowsingState().gameSelector
    const brushId = gameSelector.brushIdSelectedBrushList

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // BRUSHES
    ////////////////////////////////////////////////////////////
    if((!brushId && this.brush) || (this.brush && (this.brush.brushId !== brushId))) {
      this.destroyBrush()
    }

    if(brushId && !this.brush) {
      this.brush = this.getBrushFromBrushId(brushId)
    }

    if(this.brush) {
      this.brush.update(pointer)
    }

    if(this.canvas && pointer.isDown) {
      this.brush.stroke(pointer, this.canvas)
    }
  }

  onPointerDown = (pointer, gameObjects) => {
    if(pointer.leftButtonDown()) {
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // BRUSH
      ////////////////////////////////////////////////////////////
      if(this.brush) {
        const canvas = this.getLayerById(this.brush.getCanvasId())
        this.canvas = canvas
        this.brush.stroke(pointer, this.canvas)
      }
    }
  }

  onPointerUp = (pointer) => {
    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onPointerLeaveGame = () => {
    // without !this.canvas check we end up with discrepencies in codrawing
    if(this.brush && !this.canvas) this.destroyBrush()
    if(this.canvas) {
      this.onStrokeComplete()
      this.destroyBrush()
    }
  }

  onPointerUpOutside = (pointer)  => {
    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // HELPERS
  ////////////////////////////////////////////////////////////
  getBrushFromBrushId(brushId) {
    if(isBrushIdEraser(brushId)) {
      return new EraserSingleLayer(this, { brushId })
    } else if(isBrushIdColor(brushId)) {
      return new ColorPencil(this, { brushId })
    } else {
      return new TexturePencil(this, { brushId })
    }
  }

  getLayerById(canvasId) {
    return this.backgroundLayer
  }

  destroyBrush() {
    this.brush.destroy()
    this.brush = null
  }

  onStrokeComplete = async () => {
    this.brush.releaseStroke()
    this.canvas = null;
  }

  initialDraw = () => {
    this.loadingText.destroy()
    this.createGrids()
    if(!this.textureId && !this.tint) {
      return 
    }
    const texture = new Brush(this, { tint: this.tint, brushId: this.textureId, textureId: this.textureId, spriteSheetName: this.spriteSheetName, spriteIndex: this.spriteIndex })
    texture.setDisplaySize(this.size, this.size)
    this.backgroundLayer.draw(texture, 0, 0)
    this.backgroundLayer.addRenderTextureToUndoStack()
    texture.destroy()
  }

  onSpriteSheetsLoaded = () => {
    this.spriteSheetsToLoad.forEach((ssId) => {
      const ss = window.spriteSheets[ssId]
      ss.sprites.forEach((tile) => {
        const tileNamePrefix = 'sprite'
        this.textures.get(ss.id).add(tile.id.slice(tileNamePrefix.length), 0, tile.x, tile.y, tile.width, tile.height)
      })
    })
    this.load.off('complete', this.onSpriteSheetsLoaded)
    this.initialDraw()
  }

  create() {
    this.load.image(DEFAULT_TEXTURE_ID, '/assets/images/square10x10.png')
    
    const brushes = store.getState().gameModel.gameModel.brushes 

    const textureIds = [this.textureId]
    Object.keys(brushes).forEach((brushId) => {
      const brush = brushes[brushId]
      if(brush.textureId) {
        textureIds.push(brush.textureId)
      }
    })

    const gameModel = store.getState().gameModel.gameModel

    this.spriteSheetsToLoad = []
    textureIds.forEach((textureId) => {
      if(!this.textureId) {
        return
      }
      const { spriteSheetName } = getTextureMetadata(textureId)
      if(spriteSheetName) {
        const spriteSheet = window.spriteSheets[spriteSheetName]
        if(spriteSheet.serverImageUrl) {
          this.load.image(spriteSheet.id, window.location.origin + '/' +  spriteSheet.serverImageUrl)
          this.spriteSheetsToLoad.push(spriteSheetName)
        }
      } else {
        const awsImageData = gameModel.awsImages[textureId]
        this.load.image(textureId, window.awsUrl + awsImageData.url)
      }
    })

    this.load.start();
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.loadingText = this.add.text(screenCenterX, screenCenterY, 'Loading..').setOrigin(0.5);
    
    this.load.on('complete', this.onSpriteSheetsLoaded);
    
    this.backgroundLayer = new CodrawingCanvas(this, {
      isCodrawingHost: true, 
      canvasId: SPRITE_EDITOR_CANVAS_ID + '/' + this.newAwsImageId,
      stageId: null,
      boundaries: this.boundaries
    })
    this.backgroundLayer.setDepth(BACKGROUND_CANVAS_DEPTH)

    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointerup', this.onPointerUp);
    this.input.on('pointerupoutside', this.onPointerUpOutside);
    this.input.on('pointermove', this.onPointerMove, this)
    this.input.on('gameout', this.onPointerLeaveGame, this)
  }

  createGrids() {
    if(this.grid) this.grid.destroy()
    if(this.grid2) this.grid2.destroy()

    this.grid = this.add.grid(0, 0, this.size * 2, this.size * 2, nodeSize, nodeSize, null, null, 0x1111, 0.2)
    // this.grid2 = this.add.grid(0, 0, this.size * 2, this.size * 2, nodeSize * 3, nodeSize * 3, null, null, 0x1111, 0.2)

    this.grid.setDepth(UI_CANVAS_DEPTH)
    // this.grid2.setDepth(UI_CANVAS_DEPTH)

    this.grid3 = this.add.grid(0, 0, this.size * 2, this.size * 2, nodeSize, nodeSize, null, null, 0xFFFFFF, 0.2)

    this.grid3.setDepth(0)
  }


  update(time, delta) {
    const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
    if(isGridViewOn) {
      this.isGridViewOn = true
    } else {
      this.isGridViewOn = false
    }

    if(this.brush) {
      this.brush.setVisible(true)
    }

    if(getCobrowsingState().gameFormEditor.color.isEyeDropping) {
      this.input.setDefaultCursor('url(/assets/images/eyedropper.png)');
    } else {
      this.input.setDefaultCursor('default')
    }

    // if(this.isGridViewOn) {
    //   this.grid.setVisible(true)
    //   this.grid2.setVisible(true)
    // } else {
    //   this.grid.setVisible(false)
    //   this.grid2.setVisible(false)
    // }
  }

  unload() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}

