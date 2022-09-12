import {  DEFAULT_TEXTURE_ID } from "../../constants";
import store from "../../store";
import Phaser from "phaser";

export class MovingPlatformSensor extends Phaser.Physics.Matter.Image {
  constructor(scene, { color, width, parent }){
    super(scene.matter.world, 0, 0, DEFAULT_TEXTURE_ID, 0, { isSensor: true })

    this.scene = scene
    this.color = color

    this.setOrigin(0.5, 0.5)
    this.setAlpha(0.3)
    this.setTint(0x0000FF)
    this.setDisplaySize(width, 1)

    scene.add.existing(this)
    scene.uiLayer.add([this])

    this.onTops = []
    this.scene.matterCollision.addOnCollideActive({
      objectA: this,
      callback: eventData => {
        const { gameObjectB } = eventData;
        if(gameObjectB === this) return
        if(gameObjectB === parent) return
        if(!gameObjectB) return
        if(!gameObjectB.classId) return
        this.onTops.push(gameObjectB)
        gameObjectB.setIgnoreGravity(true)
      }
    })
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this,
      callback: eventData => {
        const { gameObjectB } = eventData;
        if(gameObjectB === this) return
        if(gameObjectB === parent) return
        if(!gameObjectB) return
        if(!gameObjectB.classId) return
        const gameModel = store.getState().game.gameModel
        const objectClass = gameModel.classes[gameObjectB.classId]
        gameObjectB.setIgnoreGravity(objectClass.attributes.setIgnoreGravity)
      }
    })

    return this
  }

  update(followingEntity) {
    if(!this.scene) return console.error('interact area not destroyed again')
    
    let cornerX = followingEntity.x
    let cornerY = followingEntity.y - (followingEntity.height/2)
    const deltaX = this.x - cornerX
    const deltaY = this.y - cornerY
      
    this.setAngle(followingEntity.angle)
    this.setPosition(cornerX, cornerY)  

    this.onTops.forEach((onTop) => {
      // onTop.setPosition(onTop.x = deltaX, onTop.y + deltaY)
    })

    if(this.scene.isGridViewOn) {
      this.setVisible(true)
    } else {
      this.setVisible(false)
    }
  }
}
