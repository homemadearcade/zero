
    
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
    if(this.draggingEntityInstanceId || this.cameraDragStart) return
    if(!getCobrowsingState().editorInterface.isGridViewOn) return
    
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
    this.mouseFollower.setDisplaySize(40, 40).setTint(0xFFFFFF).setDepth(UI_LAYER_DEPTH)
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
    if(this.cursors.space.isDown && entityModel.projectile?.entityModelId) {
      if(this.scene.game.loop.time < this.nextFire) { 
        return
      }

      const projectile = new TemporaryInstance(this.scene, 'hero-'+Math.random(), { entityModelId: entityModel.projectile?.entityModelId } )
      projectile.fire(this)

      this.nextFire = this.scene.game.loop.time + projectile.cooldown;
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VEHICLE
    if(entityModel.controls.interfaceType === VEHICLE_CONTROLS) {
      let hasAngularMovement = false
      if(this.cursors.left.isDown) {
        hasAngularMovement = true
        this.setAngularVelocity(-entityModel.speed);
      } else if(this.cursors.right.isDown) {
        hasAngularMovement = true
        this.setAngularVelocity(entityModel.speed);
      }

      if(entityModel.controls.sticky && !hasAngularMovement) {
        this.setAngularVelocity(false)
      }
  
      if(!entityModel.controls.ignoreUpKey) {
        if(this.cursors.up.isDown) {
          this.thrust(entityModel.speed * 2);
        } else {
          this.setAcceleration(0)
          // if(entityModel.controls.sticky) {
          //   this.setVelocity(0, 0)
          // }
        }
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // DIRECTIONAL
    if(entityModel.controls.interfaceType === DIRECTIONAL_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      let xVelocityTouched = false
      let yVelocityTouched = false

      if(this.cursors.left.isDown) {
        if(entityModel.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(-entityModel.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.phaserInstance.x - entityModel.speed * mod, this.phaserInstance.y)
          }
        } else this.setAccelerationX(-entityModel.speed)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        if(entityModel.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(entityModel.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.phaserInstance.x + entityModel.speed * mod, this.phaserInstance.y)
          }
        } else this.setAccelerationX(entityModel.speed)
        xTouched = true
      }
      
      if(this.cursors.up.isDown) {
        if(entityModel.controls.sticky) {
          if(gravity.y === 0) {
            this.setVelocityY(-entityModel.speed)
            yVelocityTouched = true
          } else {
            this.setPosition(this.phaserInstance.x, this.phaserInstance.y - entityModel.speed * mod)
          }
        } else this.setAccelerationY(-entityModel.speed)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        if(entityModel.controls.sticky) {
          if(gravity.y === 0) {
            this.setVelocityY(entityModel.speed)
            yVelocityTouched = true
          } else {
            this.setPosition(this.phaserInstance.x, this.phaserInstance.y +  entityModel.speed * mod)
          }
        } else this.setAccelerationY(entityModel.speed)
        yTouched = true
      }

      if(entityModel.controls.sticky) {
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
    if(entityModel.controls.interfaceType === JUMP_GROUND) {
      let xTouched = false 

      let xVelocityTouched = false
      let yVelocityTouched = false

      if(this.cursors.left.isDown) {
        if(entityModel.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(-entityModel.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.phaserInstance.x - entityModel.speed * mod, this.phaserInstance.y)
          }
        } else this.setAccelerationX(-entityModel.speed)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        if(entityModel.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(entityModel.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.phaserInstance.x + entityModel.speed * mod, this.phaserInstance.y)
          }
        } else this.setAccelerationX(entityModel.speed)
        xTouched = true
      }

      if(this.cursors.down.isDown) {
        if(gravity.y === 0) {
          this.setVelocityY(entityModel.speed)
          yVelocityTouched = true
        } else {
          this.setPosition(this.phaserInstance.x, this.phaserInstance.y +  entityModel.speed * mod)
        }
      }

      if(this.cursors.space.isDown && this.phaserInstance.body.touching.down) {
        this.setVelocityY(-entityModel.ground)
      }

      if(entityModel.controls.sticky) {
        if(gravity.y === 0 && !yVelocityTouched) this.setVelocityY(0)
        if(gravity.x === 0 && !xVelocityTouched) this.setVelocityX(0)
      } else {
        if(!xTouched && !entityModel.controls.sticky) this.setAccelerationX(0)
      }
    }

    if(entityModel.attributes.rotationFollowKeys) {
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
      if(this.phaserInstance.body.touching.none === false || this.phaserInstance.body.blocked.none === false) {
        console.log('...', entityModel.movement.velocityX, entityModel.movement.velocityY)
        this.setVelocity(entityModel.movement.velocityX, entityModel.movement.velocityY)
      }
    }
    export const jumpOnCollide = {
  movement: {
    pattern: MOVEMENT_JUMP_ON_COLLIDE,
    ground: 300
  },
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
      <div className={customName + " Unlockable Unlockable--obscured"}>
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