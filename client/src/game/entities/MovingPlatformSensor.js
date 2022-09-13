import {  DEFAULT_TEXTURE_ID } from "../../constants";
import store from "../../store";
import Phaser from "phaser";
import _ from "lodash";

export class MovingPlatformSensor extends Phaser.Physics.Matter.Image {
  constructor(scene, { color, parent }){
    super(scene.matter.world, 0, 0, DEFAULT_TEXTURE_ID, 0, { isSensor: true })

    this.scene = scene
    this.color = color

    this.setOrigin(0.5, 0.5)
    this.setAlpha(0.3)
    this.setTint(color)
    this.setDisplaySize(parent.width, parent.height/2)

    scene.add.existing(this)
    scene.uiLayer.add([this])

    this.onTops = []
    this.scene.matterCollision.addOnCollideActive({
      objectA: this,
      callback: eventData => {
        const { gameObjectB } = eventData;
        console.log('trying', gameObjectB?.id, eventData.gameObjectA.id)
        if(gameObjectB === parent) {
          console.log('problem?')
          return
        }
        if(!gameObjectB) return
        if(!gameObjectB.classId) return
        console.log('made it', gameObjectB.id)

        this.onTops.push(gameObjectB)
        gameObjectB.setVelocityY(0)
        gameObjectB.setIgnoreGravity(true)
      }
    })
    this.scene.matterCollision.addOnCollideEnd({
      objectA: this,
      callback: eventData => {
        const { gameObjectB } = eventData;
        if(gameObjectB === parent) return
        if(!gameObjectB) return
        if(!gameObjectB.classId) return

        // const index = this.onTops.indexOf(gameObjectB)
        // this.onTops.splice(index,1)

        const gameModel = store.getState().game.gameModel
        const objectClass = gameModel.classes[gameObjectB.classId]
        console.log('ended', gameObjectB.id)
        gameObjectB.setIgnoreGravity(objectClass.attributes.setIgnoreGravity)
        gameObjectB.setVelocityY(0)
      }
    })

    return this
  }

  update(followingEntity) {
    if(!followingEntity.prevX) return 

    if(!this.scene) return console.error('moving platform not destroyed')
    
    let cornerX = followingEntity.x
    let cornerY = followingEntity.y  - followingEntity.height/4

    this.setAngle(followingEntity.angle)
    this.setPosition(cornerX, cornerY)  

    this.onTops.forEach((onTop) => {
      onTop.setPosition(onTop.x - followingEntity.deltaX, onTop.y - followingEntity.deltaY)
    })

    this.onTops = []

    if(this.scene.isGridViewOn) {
      this.setVisible(true)
    } else {
      this.setVisible(false)
    }

  }
}
