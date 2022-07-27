import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import store from "../../store";
import { getDepthFromCanvasId, getHexIntFromHexString, snapBrushXY } from "../../utils/editor";
import { getCobrowsingState } from "../../utils/cobrowsing";
import { publishCodrawingStrokes } from "../../store/actions/codrawingActions";

export class Pencil extends Phaser.GameObjects.Image {
  constructor(scene, {brushId}){
    const gameModel = store.getState().game.gameModel
    const brush = gameModel.brushes[brushId]

    const { spriteSheetName, spriteIndex } = getTextureMetadata(brush.textureId)
    super(scene, 0,0, spriteSheetName, spriteIndex)

    this.setOrigin(0, 0)
    this.brushId = brushId
    this.brush = brush
    this.lastSnapX = null 
    this.lastSnapY = null
    scene.add.existing(this)

    if(brush.tint) {
      const colorInt = getHexIntFromHexString(brush.tint)
      this.setTint(colorInt)
    }
 
    const brushSize = getCobrowsingState().editor.brushSize
    const nodeSize = gameModel.world.nodeSize
    const newWidth = nodeSize * brushSize
    const newHeight = nodeSize * brushSize

    this.setDisplaySize(newWidth, newHeight)
    this.setDepth(getDepthFromCanvasId(this.brush.canvasId))
    
    this.strokeMemory = []

    return this
  }

  update(pointer) {
    const { snappedX, snappedY } = snapBrushXY({x: pointer.worldX, y: pointer.worldY})
    this.setPosition(snappedX, snappedY)
  }

  stroke(pointer, canvas) {
    const { snappedX, snappedY } = snapBrushXY({x: pointer.worldX, y: pointer.worldY})

    if(snappedX === this.lastSnapX && snappedY === this.lastSnapY) return

    this.lastSnapX = snappedX
    this.lastSnapY = snappedY

    this.executeStroke(snappedX, snappedY, canvas)

    this.strokeMemory.push({
      x: snappedX,
      y: snappedY
    })
  }

  executeStroke(x, y, canvas) {
    canvas.draw(this, x, y);
    this.canvas = canvas
  }

  releaseStroke() {
    const lobby = store.getState().lobby.lobby
    if(lobby.id) {
      store.dispatch(publishCodrawingStrokes({ brushId: this.brushId, canvasId: this.canvas.canvasId, stroke: this.strokeMemory }))
    }
    this.canvas = null
    this.strokeMemory = []
  }

  getCanvasId() {
    return this.brush.canvasId
  }
}

