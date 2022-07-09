import Phaser from 'phaser';

import { CoreObject } from '../entities/CoreObject'
import { PlayerObject } from '../entities/PlayerObject';
import store from '../../store';
import { spaceshipClass } from '../../defaultData/heros';
import { WorldCollisionBody } from '../entities/WorldCollisionBody';

export class CoreScene extends Phaser.Scene {
  constructor({key }) {
    super({
      key: key,
    });
  }

  forAllObjectInstancesMatchingClassId(classId, fx) {
    this.objectInstances.forEach((object) => {
      if(object.classId === classId) {
        fx(object)
      }
    })
  }

  getGameObjectById(id) {
    const gameModel = store.getState().game.gameModel

    if(id === 'player') {
      return gameModel.hero
    }
    return gameModel.objects[id]
  }

  addObjectInstance(id, gameObject) {
    const newPhaserObject = new CoreObject(this, id, gameObject)
    this.objectInstances.push(newPhaserObject)
    this.objectInstancesById[id] = newPhaserObject
  }

  removeObjectInstance(id) {
    this.objectInstances = this.objectInstances.filter((object) => {
      return id !== object.id
    })
    this.objectInstancesById[id].destroy()
  }

  updateObjectInstance(objectInstance, {x, y, rotation}) {
    if(x) objectInstance.x = x;
    if(y) objectInstance.y = y;
    if(rotation) objectInstance.rotation = rotation;
  }

  create() {
    const gameModel = store.getState().game.gameModel

    this.layer_1 = this.add.renderTexture(0, 0, gameModel.world.boundaries.width, gameModel.world.boundaries.height);
    this.layer0 = this.add.renderTexture(0, 0, gameModel.world.boundaries.width, gameModel.world.boundaries.height);
    this.collisionGridNodes = []

    this.objectInstances = Object.keys(gameModel.objects).map((gameObjectId) => {
      if(!gameModel.objects[gameObjectId]) {
        return console.error('Object missing!')
      } 
      if(gameObjectId === 'player') {
        return console.error('Player got in?!')
      }
      return new CoreObject(this, gameObjectId, gameModel.objects[gameObjectId])
    });

    this.objectInstances = this.objectInstances.filter((objectInstance) => {
      return !!objectInstance
    })

    this.objectInstancesById = this.objectInstances.reduce((prev, next) => {
      prev[next.id] = next 
      return prev
    }, {})

    if(gameModel.hero.initialCassId) {
      this.player = new PlayerObject(this, 'player', {
        classId: gameModel.hero.initialClassId,
        spriteId: 'ship2',
        spawnX: gameModel.hero.spawnX,
        spawnY: gameModel.hero.spawnY
      });
    } else {
      this.player = new PlayerObject(this, 'player', {
        classDataOverride: {...spaceshipClass},
        spriteId: 'ship2',
        spawnX: gameModel.hero.spawnX,
        spawnY: gameModel.hero.spawnY
      });
    }

    this.layer1 = this.add.renderTexture(0, 0, gameModel.world.boundaries.width, gameModel.world.boundaries.height);
  }

  createLayerZeroCollisions = () => {
    this.layer0.snapshot((imageData) => {
      const gameModel = store.getState().game.gameModel 
      const nodeSize = gameModel.world.nodeSize
      this.bufferCanvas = document.createElement('canvas');
      this.bufferCanvas.width = gameModel.world.boundaries.width
      this.bufferCanvas.height = gameModel.world.boundaries.height
      this.bufferCanvasContext = this.bufferCanvas.getContext('2d');
      this.bufferCanvasContext.drawImage(imageData, 0,  0, this.bufferCanvas.width, this.bufferCanvas.height);
      this.terrainData = this.bufferCanvasContext.getImageData(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
  
      const data = this.terrainData.data

      const grid = []

      const rowLength = (4 * (gameModel.world.boundaries.width))
      const halfNodeSize = nodeSize/2
      let x = 0;
      let y = 0;
      for(let i = halfNodeSize; i < data.length/rowLength; i += nodeSize) {
        grid.push([])
        y = 0
        for(let i2 = (i * rowLength) + (halfNodeSize * 4); i2 < (i * rowLength) + rowLength; i2 += (4 * nodeSize)) {
          y = i2/4
          // console.log(i2)
          grid[x].push({ alpha: data[i2], touched: false})
        }
        x++ 
      }

      this.collisionGridNodes = []
      this.worldCollisionBody?.destroy()

      grid.forEach((row, y) => {
        row.forEach((node, x) => {
          if(node.alpha && ! node.touched) {
            let rowNodes = []
            let searchX = x
            while(row[searchX].alpha) {
              row[searchX].touched = true
              searchX++
              console.log(searchX)
              rowNodes.push(row[searchX])
            }

            if(rowNodes.length) {
              console.log(rowNodes.length)
              this.collisionGridNodes.push({ x: x * nodeSize, y: y * nodeSize, width: rowNodes.length})
            } else {
              this.collisionGridNodes.push({ x: x * nodeSize, y: y * nodeSize, width: 1})
            }
          }
        })
      })

      this.worldCollisionBody = new WorldCollisionBody(this, 
        { 
          parts: this.collisionGridNodes,
          width: gameModel.world.boundaries.width, 
          height: gameModel.world.boundaries.height, 
          nodeWidth: nodeSize, 
          nodeHeight: nodeSize
        })
    })
  }



  respawn() {
    this.objectInstances.forEach((object) => {
      object.x = object.spawnX
      object.y = object.spawnY
    })

    this.player.x = this.player.spawnX
    this.player.y = this.player.spawnY
  }

  reloadGameModel = (gameModel) => {
    console.log('reloading game based on model change', gameModel)
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.scene.restart(); // restart current scene
  }
  
  update(time, delta) {
    this.objectInstances.forEach((object) => {
      object.update(time, delta);
    })

    this.player.update(time, delta)
  }

  unload() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}