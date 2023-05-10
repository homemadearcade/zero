import Phaser from "phaser";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";
import { getCobrowsingState } from "../../utils/cobrowsingUtils";
import { DEFAULT_TEXTURE_ID, STROKE_DID } from "../constants";
import { publishCodrawingStrokes } from "../../store/actions/media/codrawingActions";
import { generateUniqueId } from "../../utils/webPageUtils";

export class Brush extends Phaser.GameObjects.Image {
  constructor(scene, { brushId, textureTint, depth, textureId, spriteSheetName, spriteIndex }){
    
    if(!spriteSheetName && textureId) {
      super(scene, 0, 0, textureId, 0)
    } else if(spriteSheetName, spriteIndex){
      super(scene, 0, 0, spriteSheetName, spriteIndex)
    }  else {
      //'make a MISSING CANVAS_IMAGE ID
      super(scene, 0, 0, DEFAULT_TEXTURE_ID, 0)
    }
    
    this.brushId = brushId

    this.scene = scene
    this.scene.add.existing(this)

    const brushSize = getCobrowsingState().gameSelector.brushSize
    const nodeSize = store.getState().gameModel.gameModel.size.nodeSize
    this.width = nodeSize * brushSize
    this.height = nodeSize * brushSize

    this.setOrigin(0, 0)
    this.setSize(this.width, this.height)

    if(textureTint) this.setTint(getHexIntFromHexString(textureTint))
    this.setDepth(depth)
    
    this.lastStrokeX = null 
    this.lastSnapY = null
    this.strokeMemory = []

    this.brushingCanvas = null

    return this
  }

  update(pointer, canvas) {
    const { clampedX, clampedY } = this.snapMethod({
      x: pointer.worldX, 
      y: pointer.worldY,
      boundaries: canvas.boundaries
    })
    this.setPosition(clampedX, clampedY)
  }

  stroke(pointer, canvas) {
    if(!canvas.strokeHistory) {
      return false
    }

    const { clampedX, clampedY } = this.snapMethod({
      x: pointer.worldX, y: pointer.worldY,
      boundaries: canvas.boundaries
    })
    if(clampedX === this.lastStrokeX && clampedY === this.lastStrokeY) return

    this.lastStrokeX = clampedX
    this.lastStrokeY = clampedY

    this.executeStroke(clampedX, clampedY, canvas)

    this.strokeMemory.push({
      width: this.width,
      height: this.height,
      x: clampedX,
      y: clampedY
    })

    if(this.strokeMemory.length > 20) {
      this.releaseStroke()
    }
  }

  setSize(width, height) {
    this.setDisplaySize(width, height)
  }

  executeStroke(x, y, canvas) {
    if(this.isEraser) {
      canvas.erase(this, x, y)
    } else {
      canvas.draw(this, x, y);
    }
    this.brushingCanvas = canvas
  }

  releaseStroke() {
    const strokeData = { 
      strokeId: STROKE_DID + generateUniqueId(),
      textureId: this.brushingCanvas.textureId,
      time: Date.now(),
      brushId: this.brushId,
      stroke: this.strokeMemory
    }
    
    if(this.scene.gameRoomInstance.isOnlineMultiplayer) {
      store.dispatch(publishCodrawingStrokes(strokeData))
      if(!this.brushingCanvas.isCodrawingHost) {
        this.brushingCanvas.addPendingStrokes(strokeData)
      }
    } else {
      this.brushingCanvas.addStrokeHistory(strokeData)
    }
    
    this.brushingCanvas.onStrokeReleased()
    this.brushingCanvas = null
    this.strokeMemory = []
  }
}



