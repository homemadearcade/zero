import Phaser from "phaser";
import store from "../../store";
import { getDepthFromCanvasId, getHexFromColorId, getHexIntFromHexString, getCanvasIdFromColorId, snapBrushXY } from "../../utils/editor";
import { getCobrowsingState } from "../../utils/cobrowsing";
import { DEFAULT_TEXTURE_ID } from "../../constants";
import { publishCodrawingStrokes } from "../../store/actions/codrawingActions";

export class Paintbrush extends Phaser.GameObjects.Image {
  constructor(scene, { brushId }){
    super(scene, 0,0, DEFAULT_TEXTURE_ID)

    this.setOrigin(0, 0)
    this.brushId = brushId
    this.lastSnapX = null 
    this.lastSnapY = null
    scene.add.existing(this)

    const brushSize = getCobrowsingState().editor.brushSize
    const nodeSize = store.getState().game.gameModel.world.nodeSize
    const newWidth = nodeSize * brushSize
    const newHeight = nodeSize * brushSize

    const colorInt = getHexIntFromHexString(getHexFromColorId(this.brushId))
    this.setTintFill(colorInt)

    this.setDisplaySize(newWidth, newHeight)
    this.setDepth(getDepthFromCanvasId(getCanvasIdFromColorId(this.brushId)))
    
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
    return getCanvasIdFromColorId(this.brushId)
  }
}

