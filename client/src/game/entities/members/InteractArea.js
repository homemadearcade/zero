/* eslint-disable no-undef */
import Phaser from "phaser";
import { ARCADE_PHYSICS, DEFAULT_TEXTURE_ID, MATTER_PHYSICS, ON_INTERACT } from "../../constants";
import { Sprite } from "./Sprite";

export class InteractArea extends Sprite {
  constructor(scene, objectInstance, { color, size }){
    super(scene, { spawnX: 0, spawnY: 0, textureId: DEFAULT_TEXTURE_ID })

    this.scene = scene
    this.color = color
    this.size = size

    this.setOrigin(0.5, 0.5)
    this.setAlpha(0.3)
    this.setTint(color)
    this.setSize(this.size, this.size)
    this.setIgnoreGravity(true)
    this.setImmovable(true)
    this.setVisible(false)

    this.unregisters = []
    this.interactables = []
    this.previousClosest = null
    this.paused = false

    scene.uiLayer.add(this.sprite)

    this.objectInstance = objectInstance

    this.xKey = scene.input.keyboard.addKey('X');  // Get key object

    // this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    // this.strokeRect(-size/2, -size/2, size - (CAMERA_PREVIEW_BORDER_SIZE), size - (CAMERA_PREVIEW_BORDER_SIZE));

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
      this.unregisters.forEach((fx) =>  {
        this.scene.physics.world.removeCollider(fx)
      })
    }

    if(this.scene.physicsType === MATTER_PHYSICS) {

    }
  }

  registerArcade(relations) {
    Object.keys(relations).map((relationId) => {
	    return relations[relationId]
    }).forEach(({event, effect}) => {
      if(event.type === ON_INTERACT) {
        const releventInstancesB = this.scene.objectInstances.filter((objectInstance) => objectInstance.classId === event.classIdB)
        const releventSpritesB = releventInstancesB.map(({sprite}) => sprite)
        this.unregisters.push(
          this.scene.physics.add.overlap(this.sprite, releventSpritesB, (a, b) => {
            if(this.paused) return
            this.interactables.push({entitySprite: b, effect, effectInteractable: false})
          })
        )

        const releventInstancesA = this.scene.objectInstances.filter((objectInstance) => objectInstance.classId === event.classIdA)
        const releventSpritesA = releventInstancesA.map(({sprite}) => sprite)
        this.unregisters.push(
          this.scene.physics.add.overlap(this.sprite, releventSpritesA, (a, b) => {
            if(this.paused) return
            this.interactables.push({entitySprite: b, effect, effectInteractable: true})
          })
        )
      }
    })
  }

  registerMatter(relations) {
    Object.keys(relations).map((relationId) => {
	    return relations[relationId]
    }).forEach(({event, effect}) => {
      if(event.type === ON_INTERACT) {
        this.scene.matterCollision.addOnCollideActive({
          objectA: this.interactArea,
          callback: eventData => {
            const { gameObjectB } = eventData;
            if(gameObjectB === this) return
            if(!gameObjectB) return
            if(event.classIdB === gameObjectB.classId) {
              this.interactables.push({gameObject: gameObjectB, effect})
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
      effects: []
    }

    this.interactables.forEach(({entitySprite, effectInteractable}) => {
      // entitySprite.interactBorder.setVisible(false)
      const distance = Phaser.Math.Distance.Between(entitySprite.x, entitySprite.y, this.sprite.x, this.sprite.y)
      const { closestDistance } = interactPossibility
      if(distance < closestDistance) {
        interactPossibility.closestDistance = distance
        interactPossibility.closestInteractable = entitySprite
        interactPossibility.effectInteractable = effectInteractable
      }
    })
    
    const { closestInteractable, effectInteractable } = interactPossibility
    if(closestInteractable) {
      closestInteractable.interactBorder.setVisible(true)
      this.interactables.forEach(({entitySprite, effect}) => {
        if(entitySprite === closestInteractable) {
          interactPossibility.effects.push(effect)
        }
      })
    }

    if(closestInteractable && this.xKey.isDown && this.xKey.isPressable) {
      interactPossibility.effects.forEach((effect) => {
        if(effectInteractable) {
          this.scene.getObjectInstance(closestInteractable.id).runEffect(effect, closestInteractable)
        } else {
          this.objectInstance.runEffect(effect, closestInteractable)
        }

        this.xKey.isPressable = false
      })
    }
    if(closestInteractable && this.xKey.isUp) {
      this.xKey.isPressable = true
    }

    this.previousClosest = closestInteractable
    this.interactables = []
  }

  update(followingEntity) {
    if(!this.scene) return console.error('interact area not destroyed again')

    this.updateInteractions()
    
    let cornerX = followingEntity.x
    let cornerY = followingEntity.y
      
    // this.setAngle(followingEntity.angle)
    this.setPosition(cornerX, cornerY)  

    if(this.scene.isGridViewOn) {
      this.setVisible(true)
    } else {
      this.setVisible(false)
    }
  }
}
