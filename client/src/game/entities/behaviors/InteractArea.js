/* eslint-disable no-undef */
import Phaser from "phaser";
import { X_KID } from "../../../constants/keyboard/keyIds";
import store from "../../../store";
import { changeInteractOppurtunity } from "../../../store/actions/game/playerInterfaceActions";
import { ARCADE_PHYSICS, DEFAULT_TEXTURE_ID, MATTER_PHYSICS, ON_INTERACT } from "../../constants";
import { MatterSprite } from "./MatterSprite";

export class InteractArea extends MatterSprite {
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
    // this.physicsSprite.entityModelId = entityModelId

    this.overlaps = []
    this.interactables = []
    this.previousClosest = null
    this.paused = false

    scene.uiLayer.add(this.physicsSprite)

    this.entityInstance = entityInstance

    // this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    // this.strokeRect(-size/2, -size/2, size - (CAMERA_PREVIEW_BORDER_SIZE), size - (CAMERA_PREVIEW_BORDER_SIZE));

    // this.lastInteractedWithEntityId = null 
    // this.interactedWithEntityId = null

    return this
  }
  
  register(relations, entityInstancesByTag) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcade(relations, entityInstancesByTag)
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

  registerArcade(relations, entityInstancesByTag) {

    relations?.forEach((relation) => {
      const {event} = relation
      const releventEntityInstances = entityInstancesByTag[event.relationTagIdB]
      if(!releventEntityInstances || !releventEntityInstances.length) return
      const releventMatterSprites = releventEntityInstances.map(({physicsSprite}) => physicsSprite)
      this.overlaps.push(
        this.scene.physics.add.overlap(this.physicsSprite, releventMatterSprites, (a, b) => {
          if(this.paused) return
          if(this.scene.timeToTriggerAgain[relation.relationId] > Date.now()) return
          // console.log('event triggered')
          this.interactables.push({physicsSprite: b, relation})
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

  updateInteractions({ key }) {
    if(this.previousClosest) this.previousClosest.interactBorder.setVisible(false)

    let interactOppurtunity = {
      closestInteractable: null,
      closestDistance: Infinity,
      relations: []
    }

    this.interactables.forEach(({physicsSprite}) => {
      // physicsSprite.interactBorder.setVisible(false)
      const distance = Phaser.Math.Distance.Between(physicsSprite.x, physicsSprite.y, this.physicsSprite.x, this.physicsSprite.y)
      const { closestDistance } = interactOppurtunity
      if(distance < closestDistance) {
        interactOppurtunity.closestDistance = distance
        interactOppurtunity.closestInteractable = physicsSprite
      }
    })
    
    const { closestInteractable } = interactOppurtunity
    if(closestInteractable) {
      closestInteractable.interactBorder.setVisible(true)
      this.interactables.forEach(({physicsSprite, relation}) => {
        if(physicsSprite === closestInteractable) {
          interactOppurtunity.relations.push(relation)
        }
      })
    }

    if(this.interactables.length) {
      if(!store.getState().playerInterface.interactOppurtunity) {
        store.dispatch(changeInteractOppurtunity({
          interactOppurtunity
        }))
      }
    } else if(store.getState().playerInterface.interactOppurtunity) {
      store.dispatch(changeInteractOppurtunity(null))
    }

    if(closestInteractable && key.isPressable && key.isDown) {
      interactOppurtunity.relations.forEach((relation) => {
        this.entityInstance.runRelation(
          relation, 
          closestInteractable
        )
        
        key.isPressable = false
      })
    }

    this.previousClosest = closestInteractable
    this.interactables = []
  }

  destroy() {
    this.unregister()
    super.destroy()
  }

  update(followingEntity, key) {
    if(!this.scene) return console.error('interact area not destroyed again')

    this.updateInteractions({ key })
    
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

    // const physicsSprite = this.entityInstance.physicsSprite
    // this.lastInteractedWithEntityId = this.interactedWithEntityId
    // if(physicsSprite.body.touching.none && physicsSprite.body.blocked.none) {
    //   this.interactedWithEntityId = null
    // }
  }
}
