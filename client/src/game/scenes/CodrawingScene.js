import Phaser from 'phaser';
import { getLayerIdFromEraserId, isBrushIdColor, isBrushIdEraser } from '../../utils/editorUtils';
import { TexturePencil } from '../drawing/TexturePencil';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import { ColorPencil } from '../drawing/ColorPencil';
import { CANVAS_IMAGE_DIALOG_LAYER_DEPTH, CANVAS_IMAGE_LAYER_ID, nodeSize } from '../constants';
import { BACKGROUND_LAYER_GROUP_DEPTH, DEFAULT_TEXTURE_ID, UI_LAYER_DEPTH } from '../constants';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { Brush } from '../drawing/Brush';
import { getImageUrlFromTextureId, getTextureMetadata } from '../../utils/utils';
import { EraserSingleLayer } from '../drawing/EraserSingleLayer';
import store from '../../store';

export class CodrawingScene extends Phaser.Scene {
  constructor({key, initialTextureId, textureId, textureTint, size}) {
    super({
      key: key,
    });

    this.brush = null 
    this.brushingCanvas= null

    this.size = size
    this.textureTint = textureTint

    this.gameRoomInstance = {
      isOnlineMultiplayer: true
    }

    if(initialTextureId) {
      this.initialTextureId = initialTextureId
      const { spriteIndex, spriteSheetName } = getTextureMetadata(this.initialTextureId)
      this.spriteIndex = spriteIndex
      this.spriteSheetName = spriteSheetName
    }

    this.textureId = textureId

    this.boundaries = {
      x: 0,
      y: 0,
      maxWidth: this.size,
      maxHeight: this.size,
      height: this.size,
      width: this.size
    }

    this.nodeSize = nodeSize
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
      this.brush = this.createBrushFromBrushId(brushId)
    }

    if(this.brush) {
      const canvas = this.getLayerInstanceByTextureId(this.brush.getLayerId())
      this.brush.update(pointer, canvas)
    }

    if(this.brushingCanvas && pointer.isDown) {
      this.brush.stroke(pointer, this.brushingCanvas)
    }
  }

  isPixelPerfectModeOn = () => {
    return true
  }

  onPointerDown = (pointer, entityInstances) => {
    if(pointer.leftButtonDown()) {
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // BRUSH
      ////////////////////////////////////////////////////////////
      if(this.brush) {
        const canvas = this.getLayerInstanceByTextureId(this.brush.getLayerId())
        this.brushingCanvas = canvas
        this.brush.stroke(pointer, this.brushingCanvas)
      }
    }
  }

  onPointerUp = (pointer) => {
    if(this.brushingCanvas && this.brush) {
      this.onStrokeComplete()
    }
  }

  onPointerLeaveGame = () => {
    if(this.brushingCanvas && this.brush) {
      this.onStrokeComplete()
      this.destroyBrush()
    }
    // without !this.brushingCanvas check we end up with discrepencies in codrawing
    if(this.brush && !this.brushingCanvas) this.destroyBrush()
  }

  onPointerUpOutside = (pointer)  => {
    if(this.brushingCanvas && this.brush) {
      this.onStrokeComplete()
    }
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // HELPERS
  ////////////////////////////////////////////////////////////
  createBrushFromBrushId(brushId) {
    if(isBrushIdEraser(brushId)) {
      return new EraserSingleLayer(this, { brushId })
    } else if(isBrushIdColor(brushId)) {
      return new ColorPencil(this, { brushId })
    } else {
      return new TexturePencil(this, { brushId })
    }
  }

  getDepthFromLayerId(layerId) {
    if(layerId === CANVAS_IMAGE_LAYER_ID) return CANVAS_IMAGE_DIALOG_LAYER_DEPTH
    else return CANVAS_IMAGE_DIALOG_LAYER_DEPTH
  }

  getDepthFromEraserId(eraserId) {
    return this.getDepthFromLayerId(getLayerIdFromEraserId(eraserId))
  }


  getLayerInstanceByTextureId() {
    return this.backgroundCanvasLayer
  }

  destroyBrush() {
    this.brush.destroy()
    this.brush = null
  }

  onStrokeComplete = async () => {
    this.brush.releaseStroke()
    this.brushingCanvas = null;
  }

  initialDraw = () => {
    this.loadingText.destroy()
    this.createGrids()
    if(!this.initialTextureId && !this.textureTint) {
      return 
    }
    const brush = new Brush(this, { 
      textureTint: this.textureTint, 
      brushId: this.initialTextureId, 
      textureId: this.initialTextureId, 
      spriteSheetName: this.spriteSheetName, 
      depth: 1,
      spriteIndex: this.spriteIndex })
    brush.setDisplaySize(this.size, this.size)
    this.backgroundCanvasLayer.draw(brush, 0, 0)
    this.backgroundCanvasLayer.addCanvasToUndoStack()
    brush.destroy()
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

    const textureIds = [this.initialTextureId]
    Object.keys(brushes).forEach((brushId) => {
      const brush = brushes[brushId]
      if(brush.textureId) {
        textureIds.push(brush.textureId)
      }
    })

    this.spriteSheetsToLoad = []
    textureIds.forEach((textureId) => {
      if(!textureId) {
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
        this.load.image(textureId, getImageUrlFromTextureId(textureId))
      }
    })

    this.load.start();
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.loadingText = this.add.text(screenCenterX, screenCenterY, 'Loading..').setOrigin(0.5);
    
    this.load.on('complete', this.onSpriteSheetsLoaded);
    
    this.backgroundCanvasLayer = new CodrawingCanvas(this, {
      isCodrawingHost: true, 
      textureId: this.textureId,
      boundaries: this.boundaries
    })
    this.backgroundCanvasLayer.setDepth(BACKGROUND_LAYER_GROUP_DEPTH)

    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointerup', this.onPointerUp);
    this.input.on('pointerupoutside', this.onPointerUpOutside);
    this.input.on('pointermove', this.onPointerMove, this)
    this.input.on('gameout', this.onPointerLeaveGame, this)
  }

  createGrids() {
    if(this.grid) this.grid.destroy()
    if(this.grid2) this.grid2.destroy()

    this.grid = this.add.grid(0, 0, this.size * 2, this.size * 2, this.nodeSize, this.nodeSize, null, null, 0x1111, 0.2)
    // this.grid2 = this.add.grid(0, 0, this.size * 2, this.size * 2, this.nodeSize * 3, this.nodeSize * 3, null, null, 0x1111, 0.2)

    this.grid.setDepth(UI_LAYER_DEPTH)
    // this.grid2.setDepth(UI_LAYER_DEPTH)

    this.grid3 = this.add.grid(0, 0, this.size * 2, this.size * 2, this.nodeSize, this.nodeSize, null, null, 0xFFFFFF, 0.2)

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

    if(getCobrowsingState().gameFormEditor.isEyeDropping) {
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
    // const game = this.game
    this.game.destroy(true)
    // game.loop.destroy()
    // game.renderer.destroy()
  }
}

