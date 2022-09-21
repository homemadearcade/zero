import Phaser from "phaser";
import { ARCADE_PHYSICS, DEFAULT_TEXTURE_ID, MATTER_PHYSICS, ON_INTERACT } from "../../../constants";
import { Entity } from "../Entity";
import { Relations } from "./Relations";

export class InteractArea extends Entity {
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
    this.interactables = []
    this.previousClosest = null
    this.paused = false

    scene.uiLayer.add(this.sprite)

    this.objectInstance = objectInstance
    this.relations = new Relations(scene, objectInstance, this)

    this.xKey = scene.input.keyboard.addKey('X');  // Get key object

    // this.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, this.color, 1);
    // this.strokeRect(-size/2, -size/2, size - (CAMERA_PREVIEW_BORDER_SIZE), size - (CAMERA_PREVIEW_BORDER_SIZE));

    return this
  }
  
  register(relationships) {
    if(this.scene.physicsType === ARCADE_PHYSICS) {
      this.registerArcade(relationships)
    } 
    if(this.scene.physicsType === MATTER_PHYSICS) {
      this.registerMatter(relationships)
    } 
  }

  registerArcade(relations) {
    relations.forEach(({classId, event, effect}) => {
      if(event === ON_INTERACT) {
        const releventInstances = this.scene.objectInstances.filter((objectInstance) => objectInstance.classId === classId).map(({sprite}) => sprite)
        this.scene.physics.add.overlap(this.sprite, releventInstances, (a, b) => {
          if(this.paused) return
          this.interactables.push({entitySprite: b, effect})
        })
      }
    })
  }

  registerMatter(relations) {
    relations.forEach(({classId, event, effect}) => {
      if(event === ON_INTERACT) {
        this.scene.matterCollision.addOnCollideActive({
          objectA: this.interactArea,
          callback: eventData => {
            const { gameObjectB } = eventData;
            if(gameObjectB === this) return
            if(!gameObjectB) return
            if(classId === gameObjectB.classId) {
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
            if(classId === gameObjectB.classId) {
              gameObjectB.border.setVisible(false)
            }
          }
        })
      }
    })
  }

  pause() {
    if(this.previousClosest) this.previousClosest.border.setVisible(false)
    this.paused = true
  }

  resume() {
    this.paused = false
  }

  updateInteractions() {
    if(this.previousClosest) this.previousClosest.border.setVisible(false)

    let interactPossibility = {
      closestInteractable: null,
      closestDistance: Infinity,
      effect: null
    }

    this.interactables.forEach(({entitySprite, effect}) => {
      entitySprite.border.setVisible(false)
      const distance = Phaser.Math.Distance.Between(entitySprite.x, entitySprite.y, this.sprite.x, this.sprite.y)
      const { closestDistance } = interactPossibility
      if(distance < closestDistance) {
        interactPossibility.closestDistance = distance
        interactPossibility.closestInteractable = entitySprite
        interactPossibility.effect = effect
      }
    })
    
    const { closestInteractable, effect } = interactPossibility
    if(closestInteractable) closestInteractable.border.setVisible(true)
    if(closestInteractable && this.xKey.isDown) {
      this.relations.runEffect(effect, closestInteractable)
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
