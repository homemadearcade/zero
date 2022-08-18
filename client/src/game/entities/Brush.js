import Phaser from "phaser";
import store from "../../store";
import { getHexIntFromHexString } from "../../utils/editorUtils";
import { getCobrowsingState } from "../../utils/cobrowsingUtils";
import { DEFAULT_TEXTURE_ID } from "../../constants";
import { publishCodrawingStrokes } from "../../store/actions/codrawingActions";

export class Brush extends Phaser.GameObjects.Image {
  constructor(scene, { brushId, tint, depth, textureId, spriteSheetName, spriteIndex }){
    
    if(!spriteSheetName) {
      super(scene, 0, 0, textureId, 0)
    } else if(spriteSheetName, spriteIndex){
      super(scene, 0, 0, spriteSheetName, spriteIndex)
    }  else {
      //'make a MISSING TEXTURE ID
      super(scene, 0, 0, DEFAULT_TEXTURE_ID, 0)
    }
    
    this.brushId = brushId

    this.scene = scene
    this.scene.add.existing(this)

    const brushSize = getCobrowsingState().editor.brushSize
    const nodeSize = store.getState().game.gameModel.world.nodeSize
    this.width = nodeSize * brushSize
    this.height = nodeSize * brushSize

    this.setOrigin(0, 0)
    this.setDisplaySize(this.height, this.height)

    if(tint) this.setTint(getHexIntFromHexString(tint))
    this.setDepth(depth)
    
    this.lastStrokeX = null 
    this.lastSnapY = null
    this.strokeMemory = []

    this.canvas = null

    return this
  }

  update(pointer) {
    const { snappedX, snappedY } = this.snapMethod({x: pointer.worldX, y: pointer.worldY})
    this.setPosition(snappedX, snappedY)
  }

  stroke(pointer, canvas) {
    if(canvas.isSavingToAws) return 
    
    const { snappedX, snappedY } = this.snapMethod({x: pointer.worldX, y: pointer.worldY})

    if(snappedX === this.lastStrokeX && snappedY === this.lastStrokeY) return

    this.lastStrokeX = snappedX
    this.lastStrokeY = snappedY

    this.executeStroke(snappedX, snappedY, canvas)

    this.strokeMemory.push({
      x: snappedX,
      y: snappedY
    })
  }

  executeStroke(x, y, canvas) {
    if(this.isEraser) {
      canvas.erase(this, x, y)
    } else {
      canvas.draw(this, x, y);
    }
    this.canvas = canvas
  }

  releaseStroke() {
    const lobby = store.getState().lobby.lobby
    if(lobby.id) {
      store.dispatch(publishCodrawingStrokes({ brushId: this.brushId, canvasId: this.canvas.canvasId, stroke: this.strokeMemory }))
    }
    this.canvas.onStrokeReleased()
    this.canvas = null
    this.strokeMemory = []
  }
}



