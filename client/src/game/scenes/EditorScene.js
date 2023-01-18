import Phaser from 'phaser';
import { GameInstance } from './GameInstance';
import store from '../../store';
import { addAwsImage, editGameModel } from '../../store/actions/gameModelActions';
import { openContextMenuFromGameObject, openWorldContextMenu } from '../../store/actions/contextMenuActions';
import { isBrushIdColor, isBrushIdEraser, snapObjectXY } from '../../utils/editorUtils';
import { clearBrush, clearClass } from '../../store/actions/gameEditorActions';
import { closeSnapshotTaker, changeEditorCameraZoom } from '../../store/actions/gameViewEditorActions';
import { HERO_INSTANCE_ID, UI_CANVAS_DEPTH } from '../constants';
import { TexturePencil } from '../drawing/TexturePencil';
import { Eraser } from '../drawing/Eraser';
import { ClassStamper } from '../drawing/ClassStamper';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import { RemoteEditor } from '../entities/RemoteEditor';
import { ColorPencil } from '../drawing/ColorPencil';
import { gameSize, nodeSize } from '../defaultData/general';
import { urlToFile } from '../../utils/utils';
import { generateUniqueId } from '../../utils/webPageUtils';
import { getInterfaceIdData } from '../../utils/unlockableInterfaceUtils';

export class EditorScene extends GameInstance {
  constructor({key}) {
    super({
      key: key,
    });

    this.draggingObjectInstanceId = null
    this.canvas = null
    this.brush = null 
    this.stamper = null
    this.gameReloadDate = Date.now()
    this.isGridViewOn = true
    this.editorCamera = null
    this.remoteEditors = []
    this.mouseWheelTimeout = null

    this.snapshotSquare = null 
    this.snapshotStartPos = null
    this.isEditor = true
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // DRAG
  ////////////////////////////////////////////////////////////
  onDragStartContextMenu = (objectInstanceId) => {
    this.draggingObjectInstanceId = objectInstanceId
    this.isDragFromContext = true
    document.body.style.cursor = 'grab'
  }

  onDragStart = (pointer, entitySprite, dragX, dragY) => {
    const { isObscured } = getInterfaceIdData('contextMenu/instance/move')
    if(isObscured) {
      return
    }

    if(entitySprite.effectSpawned) return

    this.isDragFromContext = false
    document.body.style.cursor = 'grab'

    if(this.draggingObjectInstanceId) {
      this.continueDrag(entitySprite, {x: dragX, y: dragY})
    } else if(!this.brush && !this.stamper){
      this.draggingObjectInstanceId = entitySprite.id
    }
  }

  continueDrag(sprite, {x, y}) {
    const classId = this.getObjectInstance(this.draggingObjectInstanceId).classId
    const objectClass= store.getState().gameModel.gameModel.classes[classId]
    const { clampedX, clampedY } = snapObjectXY({x, y,  objectClass})
    sprite.x = clampedX;
    sprite.y = clampedY;
  }

  finishDrag(entitySprite) {
    document.body.style.cursor = null

    if(entitySprite.id === HERO_INSTANCE_ID) {
      store.dispatch(editGameModel({ 
        hero: {
          spawnX: entitySprite.x,
          spawnY: entitySprite.y
        }
      }))
    } else {
      store.dispatch(editGameModel({ 
        objects: {
          [entitySprite.id]: {
            spawnX: entitySprite.x,
            spawnY: entitySprite.y
          }
        }
      }))
    }
  }

  onDragEnd = (pointer, entitySprite) => {
    this.finishDrag(entitySprite)
  }


  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // RESIZE
  ////////////////////////////////////////////////////////////
  onResizeStart = (instanceId) => {
    this.resizingObjectInstance = this.getObjectInstance(instanceId)
  }

  onResizeMove = (pointer) => {
    const sprite = this.resizingObjectInstance.sprite
    const boundaries = store.getState().gameModel.gameModel.world.boundaries
    // const distance = Phaser.Math.Distance.Between(sprite.x, sprite.y, pointer.worldX, pointer.worldY)
    const distanceW = Phaser.Math.Snap.To(Math.abs(sprite.x - pointer.worldX), nodeSize)
    const distanceH = Phaser.Math.Snap.To(Math.abs(sprite.y - pointer.worldY), nodeSize)
    // const gridx = boundaries.x
    // const gridy = boundaries.y
    // const gridwidth = gridx + boundaries.width
    // const gridheight = gridy + boundaries.height

    let width;
    let height;
    if(pointer.event.shiftKey) {
      width = Phaser.Math.Clamp(distanceW, nodeSize, boundaries.width)
      height = Phaser.Math.Clamp(distanceH, nodeSize, boundaries.height)
    } else {
      width = Phaser.Math.Clamp(distanceW * 2, nodeSize, boundaries.width)
      height = Phaser.Math.Clamp(distanceH * 2, nodeSize, boundaries.height)
    }

    this.forAllObjectInstancesMatchingClassId(sprite.classId, (object) => {
      object.setSize(width, height)
    })
  }

  onResizeEnd = (pointer) => {
    const sprite = this.resizingObjectInstance.sprite
    if(sprite.id === HERO_INSTANCE_ID) {
      store.dispatch(editGameModel({ 
        hero: {
          spawnX: sprite.x,
          spawnY: sprite.y
        },
        classes: {
          [sprite.classId]: {
            graphics: {
              width: sprite.displayWidth,
              height: sprite.displayHeight
            }
          }
        }
      }))
    } else {
      store.dispatch(editGameModel({ 
        objects: {
          [sprite.id]: {
            spawnX: sprite.x,
            spawnY: sprite.y
          }
        },
        classes: {
          [sprite.classId]: {
            graphics: {
              width: sprite.displayWidth,
              height: sprite.displayHeight
            }
          } 
        }
      }))
    }

    this.resizingObjectInstance = null
  }


  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // POINTER
  ////////////////////////////////////////////////////////////
  onPointerMove = (pointer)  => {
    window.pointer = pointer

    const gameViewEditor = getCobrowsingState().gameViewEditor
    const gameEditor = getCobrowsingState().gameEditor
    const brushId = gameEditor.brushIdSelectedBrushList
    const classId = gameEditor.classIdSelectedClassList
    const gameModel = store.getState().gameModel.gameModel

    if(this.resizingObjectInstance) {
      this.onResizeMove(pointer)
      return
    }

    if(this.isDragFromContext && this.draggingObjectInstanceId) {
      const instance = this.getObjectInstance(this.draggingObjectInstanceId)
      this.continueDrag(instance.sprite, {x: pointer.worldX, y: pointer.worldY})
    }
    

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // SNAPSHOT
    ////////////////////////////////////////////////////////////
    if(this.snapshotSquare) {
      if(!gameViewEditor.isSnapshotTakerOpen) {
        this.snapshotSquare.clear()
        this.snapshotSquare = null 
        this.snapshotStartPos = null
       } else {
        this.snapshotSquare.clear()
        this.snapshotSquare.lineStyle(2, 0xffffff);
        this.snapshotSquare.strokeRect(this.snapshotStartPos.x - 2, this.snapshotStartPos.y - 2, (pointer.worldX - this.snapshotStartPos.x) + 2, (pointer.worldY - this.snapshotStartPos.y) + 2);
       }
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // BRUSHES
    ////////////////////////////////////////////////////////////
    if((!brushId && this.brush) || (this.brush && (this.brush.brushId !== brushId))) {
      this.destroyBrush()
    }

    if(brushId && !this.brush) {
      this.brush = this.getBrushFromBrushId(brushId)
    }

    if(this.brush) {
      this.brush.update(pointer)
    }
    if(this.canvas && pointer.isDown) {
      this.brush.stroke(pointer, this.canvas)
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // STAMPERS
    ////////////////////////////////////////////////////////////
    if((!classId && this.stamper) || (this.stamper && (this.stamper.classId !== classId))) {
      this.destroyStamper()
    }
    if(classId && !this.stamper) {
      const objectClass = gameModel.classes[classId]
      this.stamper = new ClassStamper(this, classId, objectClass)
    }
    if(this.stamper) {
      this.stamper.update(pointer)
    }
  }

  onPointerOver = (pointer, entitySprite) => {
    if(this.draggingObjectInstanceId) return
    entitySprite[0].editorHighlight.setVisible(true)
    const { isObscured } = getInterfaceIdData('contextMenu/instance/move')
    if(isObscured) {
      return
    }
    if(entitySprite.effectSpawned) return
    document.body.style.cursor = 'grab'
  }

  onPointerDownOutside = (pointer) => {
    if(pointer.leftButtonDown()) {
      if(this.resizingObjectInstance) {
        this.onResizeEnd()
      }
    }
  }

  onPointerDown = (pointer, gameObjects) => {
    const clickDelay = this.time.now - this.lastClick;
    this.lastClick = this.time.now;
    if(clickDelay < 350) {
      this.onDoubleClick(pointer)
      return
    }

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // CONTEXT MENU
    ////////////////////////////////////////////////////////////
    if (pointer.rightButtonDown()) {
      function disableContextMenue(e) {
        e.preventDefault()
        return false
      }

      document.body.addEventListener('contextmenu', disableContextMenue)
      setTimeout(() => {
        document.body.removeEventListener('contextmenu', disableContextMenue)
      })

      if(gameObjects.length) {
        store.dispatch(openContextMenuFromGameObject(gameObjects, pointer.event))
      } else {
        store.dispatch(openWorldContextMenu(pointer.event))
      }
    }

    if(pointer.leftButtonDown()) {

      if(this.draggingObjectInstanceId && this.isDragFromContext) {
        this.finishDrag(this.getObjectInstance(this.draggingObjectInstanceId).sprite)
      }

      if(this.resizingObjectInstance) {
        this.onResizeEnd()
      }

      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // SNAPSHOT
      ////////////////////////////////////////////////////////////
      const gameViewEditor = getCobrowsingState().gameViewEditor
      const gameModel = store.getState().gameModel.gameModel
      if(gameViewEditor.isSnapshotTakerOpen) {
        if(this.snapshotSquare) {
          const snapCanvas =  new Phaser.GameObjects.RenderTexture(this, 0, 0, gameModel.world.boundaries.maxWidth, gameModel.world.boundaries.maxHeight);
          snapCanvas.draw(this.world.backgroundColorLayer, 0,0)
          snapCanvas.draw(this.backgroundLayer, 0,0)
          snapCanvas.draw(this.playgroundLayer, 0,0)
          snapCanvas.draw(this.objectInstanceGroup, 0,0)
          snapCanvas.draw(this.foregroundLayer, 0,0)
          snapCanvas.snapshotArea(
            Math.floor(this.snapshotStartPos.x - 2), Math.floor(this.snapshotStartPos.y - 2), 
            Math.floor((pointer.worldX - this.snapshotStartPos.x) + 2), 
            Math.floor((pointer.worldY - this.snapshotStartPos.y) + 2), 
            async function (image) {
              const fileId = gameViewEditor.snapshotFileId
          
              var imgCanvas = document.createElement("canvas"),
              imgContext = imgCanvas.getContext("2d");
              imgCanvas.width = image.width;
              imgCanvas.height = image.height;
              imgContext.drawImage(image, 0, 0, image.width, image.height);

              const file = await urlToFile(imgCanvas.toDataURL(), fileId, 'image/png')

              addAwsImage(file, fileId, {
                name: fileId,
                type: 'layer'
              })
            }
          );
          this.snapshotSquare.clear()
          this.snapshotSquare = null
          this.snapshotStartPos = null
          store.dispatch(closeSnapshotTaker())
          return
        }
        this.snapshotSquare = this.add.graphics().setDepth(UI_CANVAS_DEPTH);
        this.snapshotStartPos = { x: pointer.worldX, y: pointer.worldY }
        return
      }


      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////
      // BRUSH
      ////////////////////////////////////////////////////////////
      if(this.brush) {
        const canvas = this.getLayerById(this.brush.getCanvasId())
        if(canvas.isSavingToAws) return
        this.canvas = canvas
        this.brush.stroke(pointer, this.canvas)
      }
    }
  }

  getImageFromGame(fileId) {
    return new Promise((resolve, reject) => {

      try {
        const gameModel = store.getState().gameModel.gameModel
        const snapCanvas =  new Phaser.GameObjects.RenderTexture(this, 0, 0, gameModel.world.boundaries.maxWidth, gameModel.world.boundaries.maxHeight);
        snapCanvas.draw(this.world.backgroundColorLayer, 0,0)
        snapCanvas.draw(this.backgroundLayer, 0,0)
        snapCanvas.draw(this.playgroundLayer, 0,0)
        snapCanvas.draw(this.objectInstanceGroup, 0,0)
        snapCanvas.draw(this.foregroundLayer, 0,0)
    
        snapCanvas.snapshot(async function (image) {    
          var imgCanvas = document.createElement("canvas"),
          imgContext = imgCanvas.getContext("2d");
          imgCanvas.width = image.width;
          imgCanvas.height = image.height;
          imgContext.drawImage(image, 0, 0, image.width, image.height);

          const file = await urlToFile(imgCanvas.toDataURL(), fileId, 'image/png')

          resolve({file, imgCanvas})
        });
      } catch(e) {
        reject(e)
      }
    })
  }

  onPointerUp = (pointer) => {
    if(this.stamper && pointer.leftButtonReleased() && !this.draggingObjectInstanceId) {
      this.stamper.stamp(pointer)
      if(!pointer.event.shiftKey) {
        this.destroyStamper()
        store.dispatch(clearClass())
      }
    }
    
    this.draggingObjectInstanceId = null

    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onPointerLeaveGame = () => {
    // without !this.canvas check we end up with discrepencies in codrawing
    if(this.brush && !this.canvas) this.destroyBrush()
    if(this.stamper) this.destroyStamper()
  }

  onPointerOut = (pointer, entitySprite) => {
    entitySprite[0].editorHighlight.setVisible(false)
    const { isObscured } = getInterfaceIdData('contextMenu/instance/move')
    if(isObscured) {
      return
    }
    document.body.style.cursor = null
  }

  onPointerUpOutside = (pointer)  => {
    this.draggingObjectInstanceId = null

    if(this.canvas) {
      this.onStrokeComplete()
    }
  }

  onDoubleClick = (pointer) => {
    store.dispatch(changeEditorCameraZoom(5))
    this.editorCamera.setZoom(5)
    this.editorCamera.pan(pointer.worldX, pointer.worldY, 0)
  }

  onMouseWheel = (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
    if(this.draggingObjectInstanceId) return
    if(!getCobrowsingState().gameViewEditor.isGridViewOn) return
    
    window.pointer = pointer
    const zoomUpdate = (deltaY * 0.001)
    const maxZoom = 10
    const newZoom = Phaser.Math.Clamp(this.editorCamera.zoom - zoomUpdate, 1, maxZoom)

    store.dispatch(changeEditorCameraZoom(newZoom))
  }
  
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // HELPERS
  ////////////////////////////////////////////////////////////
  getBrushFromBrushId(brushId) {
    if(isBrushIdEraser(brushId)) {
      return new Eraser(this, { brushId })
    } else if(isBrushIdColor(brushId)) {
      return new ColorPencil(this, { brushId })
    } else {
      return new TexturePencil(this, { brushId })
    }
  }

  destroyStamper() {
    this.stamper.destroy()
    this.stamper = null
  }

  destroyBrush() {
    this.brush.destroy()
    this.brush = null
  }

  onStrokeComplete = async () => {
    this.brush.releaseStroke()
    if(this.canvas.createCollisionBody) this.canvas.createCollisionBody()
    this.canvas = null;
  }

  getGameObjectById(id) {
    const gameModel = store.getState().gameModel.gameModel

    if(id === HERO_INSTANCE_ID) {
      return gameModel.hero
    }
    return gameModel.objects[id]
  }

  addGameObject(classId, {spawnX, spawnY}) {
    const id = generateUniqueId()

    const gameObject = {
      classId,
      spawnX,
      spawnY,
    }

    store.dispatch(editGameModel({
      objects: {
        [id]: gameObject
      }
    }))

    this.addObjectInstance(id, gameObject)
  }

  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  // NETWORK UPDATE
  ////////////////////////////////////////////////////////////
  onGameModelUpdate = (gameUpdate) => {
    if(gameUpdate.world?.gravity) {
      const gravity = gameUpdate.world.gravity
      const currentGravity = store.getState().gameModel.gameModel.world.gravity

      if(typeof gravity?.x === 'number' && typeof gravity?.y === 'number') {
        this.world.setGravity(gravity.x, gravity.y)
      } else if(typeof gravity?.x === 'number') {
        this.world.setGravity(gravity.x, currentGravity.y)
      } else if(typeof gravity?.y === 'number') {
        this.world.setGravity(currentGravity.x, gravity.y)
      }
    }

    if(gameUpdate.world?.backgroundColor) {
      this.world.createWorldBackgroundColorLayer()
    }

    if(gameUpdate.world?.boundaries) {
      if(gameUpdate.world.boundaries.loop) {
        this.sendReloadGameEvent()
        return
      }
      
      // set camera previews zoom
      // set camera bounds
      // set world bounds
      const gameModel = gameUpdate
      const gameWidth = gameModel.world.boundaries.width
      const gameHeight = gameModel.world.boundaries.height
      const gameX = gameModel.world.boundaries.x
      const gameY = gameModel.world.boundaries.y
      this.cameras.main.setBounds(gameX, gameY, gameWidth, gameHeight)
      // this.player.cameraPreview.setZoom(this.player.cameraPreview.zoom)
      this.world.setBoundaries(gameModel.world.boundaries)

      this.createGrids()
    }

    if(gameUpdate.awsImages) {
      if(gameUpdate.awsImages[this.backgroundLayer.textureId]) {
        this.backgroundLayer.updateTexture()
      } else if(gameUpdate.awsImages[this.playgroundLayer.textureId]) {
        this.playgroundLayer.updateTexture()
      } else if(gameUpdate.awsImages[this.foregroundLayer.textureId]) {
        this.foregroundLayer.updateTexture()
      } else {
        Object.keys(gameUpdate.awsImages).forEach((id) => {
          const textureId = gameUpdate.awsImages[id].url
          this.load.image(textureId, window.awsUrl + textureId);
          this.load.once('complete', (idk) => {
            console.log('loaded', textureId)
          });
          this.load.start();
        })
  
      }
    }

    if(gameUpdate.hero) {
      this.removePlayerInstance()
      this.addPlayerInstance()
    }

    if(gameUpdate.objects) Object.keys(gameUpdate.objects).forEach((id) => {
      const objectUpdate = gameUpdate.objects[id]
      const objectInstance = this.getObjectInstance(id)
      if(!objectInstance) {
        this.addObjectInstance(id, objectUpdate)
        return
      }
      if(objectUpdate === null) {
        this.removeObjectInstance(id)
        return
      }
      
      if(typeof objectUpdate.spawnX === 'number' || typeof objectUpdate.spawnY === 'number') {
        objectInstance.sprite.x = objectUpdate.spawnX
        objectInstance.sprite.y = objectUpdate.spawnY
      }
    })

    if(gameUpdate.relations) {
      this.sendReloadGameEvent()
    }

    if(gameUpdate.classes) Object.keys(gameUpdate.classes).forEach((id) => {
      const classUpdate = gameUpdate.classes[id]
      const objectClass = store.getState().gameModel.gameModel.classes[id]

      if(classUpdate.collisionResponse?.bounciness >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setBounce(classUpdate.collisionResponse.bounciness)
        })
      }
      if(classUpdate.collisionResponse?.friction >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setFriction(classUpdate.collisionResponse.friction)
        })
      }

      if(classUpdate.collisionResponse?.notPushable !== undefined) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setPushable(!classUpdate.collisionResponse.notPushable)
        })
      }

      if(classUpdate.movement?.drag >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setDrag(classUpdate.movement.drag)
        })
      }

      if(classUpdate.movement?.dragX >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setDragX(classUpdate.movement.dragX)
        })
      }

      if(classUpdate.movement?.dragAngular >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setAngularDrag(classUpdate.movement.dragAngular)
        })
      }

      if(classUpdate.movement?.dragY >= 0) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setDragY(classUpdate.movement.dragY)
        })
      }

      if(classUpdate.movement?.gravityY !== undefined) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setGravityY(classUpdate.movement?.gravityY)
        })
      }
      if(classUpdate.movement?.gravityX !== undefined) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setGravityX(classUpdate.movement?.gravityX)
        })
      }

      // if(classUpdate.frictionStatic >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(id, (object) => {
      //     object.setFrictionStatic(classUpdate.frictionStatic)
      //   })
      // }

      // if(objectClass.collisionResponse.useMass && classUpdate.mass >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(id, (object) => {
      //     object.setMass(classUpdate.mass)
      //   })
      // }
      // if(!objectClass.collisionResponse.useMass && classUpdate.density >= 0) {
      //   this.forAllObjectInstancesMatchingClassId(id, (object) => {
      //     object.setDensity(classUpdate.density)
      //   })
      // }

      if(classUpdate.movement?.controls) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.resetPhysics()
        })
      }

      if(classUpdate.movement?.ignoreGravity !== undefined) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setIgnoreGravity(classUpdate.movement?.ignoreGravity)
        })
      }

      if(classUpdate.collisionResponse?.ignoreSides) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setCollideIgnoreSides(classUpdate.collisionResponse?.ignoreSides)
        })
      }

      // if(classUpdate.unspawned !== undefined) {
      //   if(classUpdate.unspawned) {
      //     this.forAllObjectInstancesMatchingClassId(id, (object) => {
      //       object.unspawn()
      //     })
      //   } else {
      //     this.forAllObjectInstancesMatchingClassId(id, (object) => {
      //       object.spawn()
      //     })
      //   }
      // }

      if(
        // classUpdate.unspawned !== undefined ||
        classUpdate.graphics?.invisibile !== undefined ||
        classUpdate.worldBoundaryRelation || 
        classUpdate.graphics?.textureId ||
        classUpdate.movement?.pattern !== undefined ||
        classUpdate.movement?.velocityX !== undefined ||
        classUpdate.movement?.velocityY !== undefined ||
        classUpdate.collisionResponse?.ignoreWorldBounds !== undefined
      ) {
        // setTimeout(() => {
          this.forAllObjectInstancesMatchingClassId(id, (object) => {
            if(object.id === HERO_INSTANCE_ID) {
              this.removePlayerInstance()
              this.addPlayerInstance()
              return
            }
            const gameObject = this.getGameObjectById(object.id)
            this.removeObjectInstance(object.id)
            this.addObjectInstance(object.id, gameObject)
          })
        // })
      }

      if(classUpdate.graphics?.width && classUpdate.graphics?.height) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setSize(classUpdate.graphics?.width, classUpdate.graphics?.height)
        })
      } else if(classUpdate.graphics?.width) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setSize(classUpdate.graphics?.width, objectClass.graphics?.height)
        })
      } else if(classUpdate.graphics?.height) {
        this.forAllObjectInstancesMatchingClassId(id, (object) => {
          object.setSize(objectClass.graphics?.width, classUpdate.graphics?.height)
        })
      }

      if(classUpdate.camera !== undefined) {
        if(this.playerInstance.classId === id) {
          if(classUpdate.camera.zoom) {
            this.cameras.main.setZoom(classUpdate.camera.zoom)
            this.playerInstance.setZoom(classUpdate.camera.zoom)
          }
          if(classUpdate.camera.lerpX || classUpdate.camera.lerpY) {
            let lerpX = classUpdate.camera.lerpX ? classUpdate.camera.lerpX : objectClass.camera.lerpX
            let lerpY = classUpdate.camera.lerpY ? classUpdate.camera.lerpY : objectClass.camera.lerpY
            this.cameras.main.setLerp(lerpX, lerpY)
            // this.cameras.main.startFollow(this.playerInstance.sprite, false, classUpdate.camera.lerpX ? classUpdate.camera.lerpX : objectClass.camera.lerpX, classUpdate.camera.lerpY ? classUpdate.camera.lerpY : objectClass.camera.lerpY);
          }
        } 
      }
    })
  }

  createGrids() {
    // const gameModel = store.getState().gameModel.gameModel
    // const gameMaxWidth = gameModel.world.boundaries.maxWidth
    // const gameMaxHeight = gameModel.world.boundaries.maxHeight
    // this.grid = this.add.grid(0, 0, gameMaxWidth * 4, gameMaxHeight * 4, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    // this.grid2 = this.add.grid(0, 0, gameMaxWidth * 4, gameMaxHeight * 4, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    // this.grid.setDepth(UI_CANVAS_DEPTH)
    // this.grid2.setDepth(UI_CANVAS_DEPTH)

    if(this.grid) this.grid.destroy()
    if(this.grid2) this.grid2.destroy()

    const boundaries = store.getState().gameModel.gameModel.world.boundaries

    const gameWidth = boundaries.width
    const gameHeight = boundaries.height
    const gameX = boundaries.x
    const gameY = boundaries.y
    this.grid = this.add.grid(gameX + gameWidth/2, gameY + gameHeight/2, gameWidth, gameHeight, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    this.grid2 = this.add.grid(gameX + gameWidth/2, gameY + gameHeight/2, gameWidth, gameHeight, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    this.grid.setDepth(UI_CANVAS_DEPTH)
    this.grid2.setDepth(UI_CANVAS_DEPTH)
  }

  create() {
    super.create()

    this.createGrids()

    const gameModel = store.getState().gameModel.gameModel
    const gameMaxWidth = gameModel.world.boundaries.maxWidth
    const gameMaxHeight = gameModel.world.boundaries.maxHeight
    
    const editorCameraJSON = {
      x: 0,
      y: 0,
      width: gameSize,
      height: gameSize,
      zoom: 3,
      rotation: 0,
      scrollX: 0,
      scrollY: 0,
      roundPixels: false,
      visible: false,
      backgroundColor: false,
      bounds: {x: 0, y: 0, width: gameMaxWidth, height: gameMaxHeight},
    }

    this.cameras.fromJSON({
      name: 'editor',
      ...editorCameraJSON
    })

    this.editorCamera = this.cameras.getCamera('editor')
  
    var keys = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });
    const controlConfig = {
      camera: this.editorCamera,
      left: keys.left,
      right: keys.right,
      up: keys.up,
      down: keys.down,
      acceleration: 0.03,
      drag: 0.001,
      maxSpeed: 0.5
    };
    this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

    this.input.on('pointerover', this.onPointerOver);
    this.input.on('pointerout', this.onPointerOut);
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointerup', this.onPointerUp);
    this.input.on('pointerupoutside', this.onPointerUpOutside);
    this.input.on('pointerdownoutside', this.onPointerDownOutside);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('gameout', this.onPointerLeaveGame, this);
    this.input.dragDistanceThreshold = 16;
    this.input.on('drag', this.onDragStart);
    this.input.on('dragend', this.onDragEnd);
    this.input.on('wheel', this.onMouseWheel);
    this.escKey = this.input.keyboard.addKey('esc');  // Get key object

    const lobby = store.getState().lobby.lobby
    if(lobby.id) {
      const me = store.getState().auth.me
      lobby.users.forEach(({id}) => {
        if(id !== me.id && lobby.participantId === id) {
          this.remoteEditors.push(
            new RemoteEditor(this, { userId: id, color: 0xFF0000})
          )
        }
      })
    }
  }

  update(time, delta) {
    super.update(time, delta)

    this.cameraControls.update(delta)

    if(this.escKey.isDown) {
      store.dispatch(clearBrush())
      if(this.brush) this.destroyBrush()
      store.dispatch(clearClass())
      if(this.stamper) this.destroyStamper()

      this.canvas = null
    }

    this.remoteEditors.forEach((remoteEditor) => {
      const phaserView = store.getState().status.phaserViews[remoteEditor.userId]
      if(!remoteEditor.cameraPreview && phaserView) {
        remoteEditor.onPhaserViewFound()
      } else if(remoteEditor.cameraPreview && phaserView) {
        if(remoteEditor.cameraPreview.zoom !== phaserView.cameraZoom) {
          remoteEditor.cameraPreview.setZoom(phaserView.cameraZoom)
        }
        remoteEditor.update()
      }
    })

    const lobby = store.getState().lobby.lobby
    if(lobby.id) {
      const gameReloadDate = lobby.gameReloadDate
      if(gameReloadDate > this.gameReloadDate) {
        this.gameReloadDate = gameReloadDate
        this.reload()
      }
    }

    const cameraZoom = store.getState().gameViewEditor.cameraZoom
    if(cameraZoom !== this.editorCamera.zoom) {
      this.editorCamera.setZoom(cameraZoom)
      // this.editorCamera.zoomTo(cameraZoom, 100, 'Linear', true)
    }

    const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
    if(isGridViewOn) {
      this.isGridViewOn = true
    } else {
      this.isGridViewOn = false
    }

    if(this.isGridViewOn) {
      this.grid.setVisible(true)
      this.grid2.setVisible(true)
      this.cameras.main.setVisible(false)
      this.editorCamera.setVisible(true)
      // this.cameras.getCamera('mini').setVisible(true)
    } else {
      this.grid.setVisible(false)
      this.grid2.setVisible(false)
      this.cameras.main.setVisible(true)
      this.editorCamera.setVisible(false)
      // this.cameras.getCamera('mini').setVisible(false)
    }
  }

  unload() {
    super.unload()
  }
}

