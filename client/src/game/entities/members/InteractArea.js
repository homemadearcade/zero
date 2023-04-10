/* eslint-disable no-undef */
import Phaser from "phaser";
import store from "../../../store";
import { changeControlPopup } from "../../../store/actions/game/playerInterfaceActions";
import { ARCADE_PHYSICS, DEFAULT_TEXTURE_ID, MATTER_PHYSICS, ON_INTERACT } from "../../constants";
import { PhaserInstance } from "./PhaserInstance";

export class InteractArea extends PhaserInstance {
  constructor(scene, entityInstance, { color, width, height }){
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

    this.entityInstanceId = 'interact area'
    // this.phaserInstance.entityModelId = entityModelId

    this.overlaps = []
    this.interactables = []
    this.previousClosest = null
    this.paused = false

    scene.uiLayer.add(this.phaserInstance)

    this.entityInstance = entityInstance

    this.xKey = scene.input.keyboard.addKey('X');  // Get key object

    // this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    // this.strokeRect(-size/2, -size/2, size - (CAMERA_PREVIEW_BORDER_SIZE), size - (CAMERA_PREVIEW_BORDER_SIZE));

    // this.lastInteractedWithEntityId = null 
    // this.interactedWithEntityId = null

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
    relations?.forEach((relation) => {
      const {event} = relation
      const releventEntityInstances = this.scene.entityInstancesByTag[event.relationTagIdB]
      if(!releventEntityInstances || !releventEntityInstances.length) return
      const releventPhaserInstances = releventEntityInstances.map(({phaserInstance}) => phaserInstance)
      this.overlaps.push(
        this.scene.physics.add.overlap(this.phaserInstance, releventPhaserInstances, (a, b) => {
          if(this.paused) return
          if(this.scene.timeToTriggerAgain[relation.relationId] > Date.now()) return
          // console.log('event triggered')
          this.interactables.push({entitySprite: b, relation})
        })
      )
    })
  }

  registerMatter(relations) {
    relations?.forEach((relation) => {
      const {event} = relation

      if(event.eventType === ON_INTERACT) {
        this.scene.matterCollision.addOnCollideActive({
          objectA: this.interactArea,
          callback: eventData => {
            const { gameObjectB } = eventData;
            if(gameObjectB === this) return
            if(!gameObjectB) return
            if(event.entityModelIdB === gameObjectB.entityModelId) {
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
            if(event.entityModelId === gameObjectB.entityModelId) {
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
      const distance = Phaser.Math.Distance.Between(entitySprite.x, entitySprite.y, this.phaserInstance.x, this.phaserInstance.y)
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
        this.entityInstance.runRelation(
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

    // const phaserInstance = this.entityInstance.phaserInstance
    // this.lastInteractedWithEntityId = this.interactedWithEntityId
    // if(phaserInstance.body.touching.none && phaserInstance.body.blocked.none) {
    //   this.interactedWithEntityId = null
    // }
  }
}
