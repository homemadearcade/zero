/* eslint-disable no-undef */
import Phaser from "phaser";
import store from "../../../store";
import { changeControlPopup } from "../../../store/actions/playerInterfaceActions";
import { ARCADE_PHYSICS, DEFAULT_TEXTURE_ID, MATTER_PHYSICS, ON_INTERACT } from "../../constants";
import { Sprite } from "./Sprite";

export class InteractArea extends Sprite {
  constructor(scene, objectInstance, { color, width, height }){
    super(scene, { spawnX: 0, spawnY: 0, textureId: DEFAULT_TEXTURE_ID })

    this.scene = scene
    this.color = color
    this.width = width
    this.height = height

    this.setOrigin(0.5, 0.5)
    this.setAlpha(0.3)
    this.setTint(color)
    this.setSize(this.width, this.height)
    this.setIgnoreGravity(true)
    this.setImmovable(true)
    this.setVisible(false)

    this.overlaps = []
    this.interactables = []
    this.previousClosest = null
    this.paused = false

    scene.uiLayer.add(this.sprite)

    this.objectInstance = objectInstance

    this.xKey = scene.input.keyboard.addKey('X');  // Get key object

    // this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    // this.strokeRect(-size/2, -size/2, size - (CAMERA_PREVIEW_BORDER_SIZE), size - (CAMERA_PREVIEW_BORDER_SIZE));

    // this.lastInteractedWithClassId = null 
    // this.interactedWithClassId = null

    return this
  }
  
  register(relations) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcade(relations)
    } 
    if(this.scene.physicsType === MATTER_PHYSICS) {
      this.registerMatter(relations)
    } 
  }

  unregister() {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.overlaps.forEach((overlaps) =>  {
        overlaps.destroy()
      })
      this.overlaps = []
    }

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }

  registerArcade(relations) {
    relations.forEach((relation) => {
      const {event} = relation
      const releventInstances = this.scene.objectInstancesByTag[event.tagIdB]
      if(!releventInstances || !releventInstances.length) return
      const releventSprites = releventInstances.map(({sprite}) => sprite)
      this.overlaps.push(
        this.scene.physics.add.overlap(this.sprite, releventSprites, (a, b) => {
          if(this.paused) return
          if(this.objectInstance.effects.timeToTriggerAgain[relation.relationId] > Date.now()) return
          // console.log('event triggered')
          this.interactables.push({entitySprite: b, relation})
        })
      )
    })
  }

  registerMatter(relations) {
    relations.forEach((relation) => {
      const {event} = relation

      if(event.type === ON_INTERACT) {
        this.scene.matterCollision.addOnCollideActive({
          objectA: this.interactArea,
          callback: eventData => {
            const { gameObjectB } = eventData;
            if(gameObjectB === this) return
            if(!gameObjectB) return
            if(event.classIdB === gameObjectB.classId) {
              this.interactables.push({gameObject: gameObjectB, relation})
            }
          }
        })
        this.scene.matterCollision.addOnCollideEnd({
          objectA: this.interactArea,
          callback: eventData => {
            const { gameObjectB } = eventData;
            if(gameObjectB === this) return
            if(!gameObjectB) return
            if(event.classId === gameObjectB.classId) {
              gameObjectB.interactBorder.setVisible(false)
            }
          }
        })
      }
    })
  }

  pause() {
    if(this.previousClosest) this.previousClosest.interactBorder.setVisible(false)
    this.paused = true
  }

  resume() {
    this.paused = false
  }

  updateInteractions() {
    if(this.previousClosest) this.previousClosest.interactBorder.setVisible(false)

    let interactPossibility = {
      closestInteractable: null,
      closestDistance: Infinity,
      relations: []
    }

    if(this.interactables.length) {
      if(!store.getState().playerInterface.controlsToPress) {
        store.dispatch(changeControlPopup({
          key: 'x'
        }))
      }
    } else if(store.getState().playerInterface.controlsToPress) {
      store.dispatch(changeControlPopup(null))
    }

    this.interactables.forEach(({entitySprite}) => {
      // entitySprite.interactBorder.setVisible(false)
      const distance = Phaser.Math.Distance.Between(entitySprite.x, entitySprite.y, this.sprite.x, this.sprite.y)
      const { closestDistance } = interactPossibility
      if(distance < closestDistance) {
        interactPossibility.closestDistance = distance
        interactPossibility.closestInteractable = entitySprite
      }
    })
    
    const { closestInteractable } = interactPossibility
    if(closestInteractable) {
      closestInteractable.interactBorder.setVisible(true)
      this.interactables.forEach(({entitySprite, relation}) => {
        if(entitySprite === closestInteractable) {
          interactPossibility.relations.push(relation)
        }
      })
    }

    if(closestInteractable && this.xKey.isDown && this.xKey.isPressable) {
      interactPossibility.relations.forEach((relation) => {
        this.objectInstance.startRunEventEffects(
          relation, 
          closestInteractable
        )
        this.xKey.isPressable = false
      })
    }

    if(closestInteractable && this.xKey.isUp) {
      this.xKey.isPressable = true
    }

    this.previousClosest = closestInteractable
    this.interactables = []
  }

  destroy() {
    this.unregister()
    super.destroy()
  }

  update(followingEntity) {
    if(!this.scene) return console.error('interact area not destroyed again')

    this.updateInteractions()
    
    let cornerX = followingEntity.x
    let cornerY = followingEntity.y
      
    // this.setAngle(followingEntity.angle)
    this.setPosition(cornerX, cornerY)  
    this.setAngle(followingEntity.angle)  


    if(this.scene.isGridViewOn) {
      this.setVisible(true)
    } else {
      this.setVisible(false)
    }

    // const sprite = this.objectInstance.sprite
    // this.lastInteractedWithClassId = this.interactedWithClassId
    // if(sprite.body.touching.none && sprite.body.blocked.none) {
    //   this.interactedWithClassId = null
    // }
  }
}
