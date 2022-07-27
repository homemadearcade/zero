import Phaser from "phaser";
import store from "../../store";
import { getDepthFromLayerId, getHexFromColorId, getHexIntFromHexString, getLayerIdFromColorId, snapBrushXY } from "../../utils/editor";
import { getCobrowsingState } from "../../utils/cobrowsing";

export class Paintbrush extends Phaser.GameObjects.Image {
  constructor(scene, brushId){
    super(scene, 0,0, 'square10x10')

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
    this.setDepth(getDepthFromLayerId(getLayerIdFromColorId(this.brushId)))
    
    return this
  }

  update(pointer) {
    const { snappedX, snappedY } = snapBrushXY({x: pointer.worldX, y: pointer.worldY})
    this.setPosition(snappedX, snappedY)
  }

  stroke(pointer, layer) {
    const { snappedX, snappedY } = snapBrushXY({x: pointer.worldX, y: pointer.worldY})

    if(snappedX === this.lastSnapX && snappedY === this.lastSnapY) return

    this.lastSnapX = snappedX
    this.lastSnapY = snappedY
    layer.draw(this, snappedX, snappedY);
  }

  getLayerId() {
    return getLayerIdFromColorId(this.brushId)
  }
}

