
    
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