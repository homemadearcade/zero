
    
    // const minimapCameraPercent = 0.2
    // this.cameras.fromJSON({
    //   name: 'mini',
    //   x: gameWidth - gameWidth * minimapCameraPercent,
    //   y: gameHeight - gameHeight * minimapCameraPercent,
    //   width: gameWidth * minimapCameraPercent,
    //   height: gameHeight * minimapCameraPercent,
    //   zoom: minimapCameraPercent,
    //   rotation: 0,
    //   scrollX: gameWidth/2,
    //   scrollY: gameHeight/2,
    //   roundPixels: false,
    //   visible: true,
    //   backgroundColor: 'black',
    //   bounds: {x: 0, y: 0, width: gameWidth, height: gameHeight},
    // })
    // this.minimapCamera = this.cameras.getCamera('mini')
    // this.minimapCamera.ignore(this.grid)
    // this.minimapCamera.ignore(this.grid2)



        this.editorCamera.setDeadzone(700, 700)
    if (this.editorCamera.deadzone)
    {
        const graphics = this.add.graphics().setScrollFactor(0);
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(200, 200, this.editorCamera.deadzone.width, this.editorCamera.deadzone.height);
    }




        // PREVENTING CAMERA DRAG FUNCTIONALITY FOR NOW
        // const editorCamera = this.editorCamera
        // this.cameraDragStart = { x: pointer.x, y: pointer.y, startScrollX: editorCamera.scrollX, startScrollY: editorCamera.scrollY }


ZOOM INTO X

          onMouseWheel = (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
    if(this.draggingObjectInstanceId || this.cameraDragStart) return
    if(!getCobrowsingState().editor.isGridViewOn) return
    
    window.pointer = pointer
    const zoomUpdate = (deltaY * 0.001)
    const maxZoom = 10
    const newZoom = Phaser.Math.Clamp(this.editorCamera.zoom - zoomUpdate, 1, maxZoom)

    store.dispatch(changeEditorCameraZoom(newZoom))

    if(zoomUpdate > 0) {
      this.targetCameraPosition = null
      return
    }

    if(!this.targetCameraPosition) {
      
      this.targetCameraPosition = {
        x: pointer.worldX,
        y: pointer.worldY
      }

      this.cameraScrollStart = {
        x: this.editorCamera.scrollX,
        y: this.editorCamera.scrollY
       }
 
      this.journeyZoomStart = this.editorCamera.zoom
    }

    clearTimeout(this.mouseWheelTimeout)
    this.mouseWheelTimeout = setTimeout(() => {
      this.targetCameraPosition = null
    }, 300) 

    const cameraScrollTarget = this.editorCamera2.getScroll(this.targetCameraPosition.x, this.targetCameraPosition.y)
    
    const journeyPercent = (newZoom - this.journeyZoomStart)/(maxZoom - this.journeyZoomStart)

    const x = Phaser.Math.Interpolation.Linear([this.cameraScrollStart.x, cameraScrollTarget.x], journeyPercent)
    this.editorCamera.scrollX = x

    const y = Phaser.Math.Interpolation.Linear([this.cameraScrollStart.y, cameraScrollTarget.y], journeyPercent)
    this.editorCamera.scrollY = y
  }





  MOUSE FOLLOW

    this.editorCamera.setDeadzone(700, 700)

    this.mouseFollower = this.add.image(0,0,DEFAULT_TEXTURE_ID).setScrollFactor(0)
    this.mouseFollower.setDisplaySize(40, 40).setTint(0xFFFFFF).setDepth(UI_CANVAS_DEPTH)
    this.mouseFollower.width = 40
    this.mouseFollower.height = 40

    this.editorCamera.startFollow(this.mouseFollower, false, 1, 1)


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


STICKY KEYS

const gravity = store.getState().gameModel.gameModel.world.gravity

    const mod = (1/(delta * 10))

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PROJECTILE
    if(this.cursors.space.isDown && objectClass.projectile?.classId) {
      if(this.scene.game.loop.time < this.nextFire) { 
        return
      }

      const projectile = new TemporaryInstance(this.scene, 'hero-'+Math.random(), { classId: objectClass.projectile?.classId } )
      projectile.fire(this)

      this.nextFire = this.scene.game.loop.time + projectile.cooldown;
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VEHICLE
    if(objectClass.controls.type === VEHICLE_CONTROLS) {
      let hasAngularMovement = false
      if(this.cursors.left.isDown) {
        hasAngularMovement = true
        this.setAngularVelocity(-objectClass.speed);
      } else if(this.cursors.right.isDown) {
        hasAngularMovement = true
        this.setAngularVelocity(objectClass.speed);
      }

      if(objectClass.controls.sticky && !hasAngularMovement) {
        this.setAngularVelocity(false)
      }
  
      if(!objectClass.controls.ignoreUpKey) {
        if(this.cursors.up.isDown) {
          this.thrust(objectClass.speed * 2);
        } else {
          this.setAcceleration(0)
          // if(objectClass.controls.sticky) {
          //   this.setVelocity(0, 0)
          // }
        }
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // DIRECTIONAL
    if(objectClass.controls.type === DIRECTIONAL_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      let xVelocityTouched = false
      let yVelocityTouched = false

      if(this.cursors.left.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(-objectClass.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x - objectClass.speed * mod, this.sprite.y)
          }
        } else this.setAccelerationX(-objectClass.speed)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(objectClass.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x + objectClass.speed * mod, this.sprite.y)
          }
        } else this.setAccelerationX(objectClass.speed)
        xTouched = true
      }
      
      if(this.cursors.up.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.y === 0) {
            this.setVelocityY(-objectClass.speed)
            yVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x, this.sprite.y - objectClass.speed * mod)
          }
        } else this.setAccelerationY(-objectClass.speed)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.y === 0) {
            this.setVelocityY(objectClass.speed)
            yVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x, this.sprite.y +  objectClass.speed * mod)
          }
        } else this.setAccelerationY(objectClass.speed)
        yTouched = true
      }

      if(objectClass.controls.sticky) {
        console.log(gravity, xVelocityTouched, yVelocityTouched)
        if(gravity.y === 0 && !yVelocityTouched) this.setVelocityY(0)
        if(gravity.x === 0 && !xVelocityTouched) this.setVelocityX(0)
      } else {
        if(!xTouched) this.setAccelerationX(0)
        if(!yTouched) this.setAccelerationY(0)
      }

    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // JUMPER
    if(objectClass.controls.type === JUMP_GROUND) {
      let xTouched = false 

      let xVelocityTouched = false
      let yVelocityTouched = false

      if(this.cursors.left.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(-objectClass.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x - objectClass.speed * mod, this.sprite.y)
          }
        } else this.setAccelerationX(-objectClass.speed)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(objectClass.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x + objectClass.speed * mod, this.sprite.y)
          }
        } else this.setAccelerationX(objectClass.speed)
        xTouched = true
      }

      if(this.cursors.down.isDown) {
        if(gravity.y === 0) {
          this.setVelocityY(objectClass.speed)
          yVelocityTouched = true
        } else {
          this.setPosition(this.sprite.x, this.sprite.y +  objectClass.speed * mod)
        }
      }

      if(this.cursors.space.isDown && this.sprite.body.touching.down) {
        this.setVelocityY(-objectClass.ground)
      }

      if(objectClass.controls.sticky) {
        if(gravity.y === 0 && !yVelocityTouched) this.setVelocityY(0)
        if(gravity.x === 0 && !xVelocityTouched) this.setVelocityX(0)
      } else {
        if(!xTouched && !objectClass.controls.sticky) this.setAccelerationX(0)
      }
    }

    if(objectClass.attributes.rotationFollowKeys) {
      if(this.cursors.left.isDown) {
        this.setAngle(270)
      } else if(this.cursors.right.isDown) {
        this.setAngle(90)
      } else if(this.cursors.up.isDown) {
        this.setAngle(0)
      } else if(this.cursors.down.isDown) {
        this.setAngle(180)
      }
    }


    // BOUNCE ON COLLIDE

        if(pattern === MOVEMENT_JUMP_ON_COLLIDE) {
      if(this.sprite.body.touching.none === false || this.sprite.body.blocked.none === false) {
        console.log('...', objectClass.movement.velocityX, objectClass.movement.velocityY)
        this.setVelocity(objectClass.movement.velocityX, objectClass.movement.velocityY)
      }
    }
    export const jumpOnCollide = {
  movement: {
    pattern: MOVEMENT_JUMP_ON_COLLIDE,
    ground: 300
  },
}



//////


    this.objectInstances.forEach((instance) => {
      instance.destroy()
    })
    this.objectInstances= []
    this.temporaryInstances.forEach((instance) => {
      instance.destroy()
    })
    this.temporaryInstances = []
    this.playerInstance.destroy()

    this.objectInstanceGroup.destroy()
    this.backgroundLayer.destroy()
    this.playgroundLayer.destroy()
    this.foregroundLayer.destroy()
    this.zoneInstanceLayer.destroy()
    this.uiLayer.destroy()

    this.initializeLayers()
    this.initializeObjectInstances()
    this.initializePlayerInstance()

    this.unregisterRelations()
    this.registerRelations()




  initializeLayers() {
    const gameModel = store.getState().gameModel.gameModel
    const playerInterface = getCobrowsingState().playerInterface
    const stageId = playerInterface.currentStageId
    const currentStage = gameModel.stages[stageId]

    this.backgroundLayer = new CodrawingCanvas(this, {canvasId: BACKGROUND_CANVAS_ID, stageId, boundaries: currentStage.boundaries})
    this.backgroundLayer.setDepth(BACKGROUND_CANVAS_DEPTH)
    // layer zero
    this.playgroundLayer = new CollisionCanvas(this, {canvasId: PLAYGROUND_CANVAS_ID, stageId, boundaries: currentStage.boundaries})
    this.playgroundLayer.setDepth(PLAYGROUND_CANVAS_DEPTH)

    this.objectInstanceGroup = this.add.group()
    // this.basicClassGroup = this.add.group()
    // this.npcClassGroup = this.add.group()
    // this.temporaryInstanceGroup = this.add.group()

    this.playerInstanceLayer = this.add.layer();
    this.playerInstanceLayer.setDepth(PLAYER_INSTANCE_CANVAS_DEPTH)
    this.playerInstanceGroup = this.add.group()

    this.zoneInstanceLayer = this.add.layer();
    this.zoneInstanceLayer.setDepth(ZONE_INSTANCE_CANVAS_DEPTH)

    // FOREGROUND layer
    this.foregroundLayer = new CodrawingCanvas(this, {canvasId: FOREGROUND_CANVAS_ID, stageId, boundaries: currentStage.boundaries})
    this.foregroundLayer.setDepth(FOREGROUND_CANVAS_DEPTH)

    this.uiLayer = this.add.layer();
    this.uiLayer.setDepth(UI_CANVAS_DEPTH)
  }


  export const uploadToAws = async (id, file) => {
  const contentType = file.type; // eg. image/jpeg or image/svg+xml

        let formData = new FormData();
      formData.append('file', file);
  try {
    return await axios({
      method: 'put',
      url: '/api/aws/post',
      headers: {
        'Content-Type': contentType || 'image/png',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      },
      data: formData,
      params: {
        Key: id,
        ContentType: contentType || 'image/png'
      }
    });
  } catch(e) {
    console.error(e)
  }


};





    // if(hideIfObscured) {
    //   return null
    // }

    // IF LOCKED UP THEN JUST SHOW A BLACK WALL
    return <div className={classNames("Unlockable__cover", {'Unlockable__cover--slider': isSlider})}>
      <div className={customClassName + " Unlockable Unlockable--obscured"}>
        {children}
      </div>
      <div className="Unlockable__obscured-icon">
        <Icon icon="faLock" />
      </div>
    </div>


        // if(isTiny) {
    //   if(isUnlocked) {
    //     return renderChildren()
    //   }
      
    //   return renderCover() //<ToggleLockMenu/>
    // }
    //      <ToggleLockMenu/>}