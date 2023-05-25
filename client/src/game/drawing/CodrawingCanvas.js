import store from "../../store";
import { Canvas } from "./Canvas";

import { ON_CODRAWING_STROKE, ON_CODRAWING_SUBSCRIBED, ON_CODRAWING_STROKE_ACKNOWLEDGED, ON_CODRAWING_INITIALIZE, MARK_CANVAS_IMAGE_STROKES_PENDING, ON_CODRAWING_IMAGE_UPDATE } from "../../store/types";
import { subscribeCodrawing, unsubscribeCodrawing } from "../../store/actions/media/codrawingActions";
import { noCodrawingStrokeUpdateDelta} from "../constants";
import { changeErrorState, clearErrorState } from "../../store/actions/errorsActions";
import { CODRAWING_CONNECTION_LOST } from "../../constants";
import { editCanvasImage, getCanvasImageByTextureId } from "../../store/actions/media/canvasImageActions";

export class CodrawingCanvas extends Canvas {
  constructor(scene, props){
    super(scene, props)

    // if you are the host all that means is that you get to save the image and if there are any discrepencies then yours is the true one
    this.isCodrawingHost = props.isCodrawingHost
    this.isOnlineMultiplayer = scene.gameRoomInstance.isOnlineMultiplayer
    this.gameInstanceId = scene.gameRoomInstance.gameInstanceId
    this.imageType = null

    this.strokeHistory = null
    this.initializeStrokeHistory()
    if(!this.isOnlineMultiplayer) return

    this.strokesPending = []
    if(!this.isCodrawingHost) {
      this.strokeCheckInterval = setInterval(this.pendingStrokeCheck, noCodrawingStrokeUpdateDelta/5)
      window.socket.on(ON_CODRAWING_STROKE_ACKNOWLEDGED, ({ strokeId, textureId }) => {
        if(this.textureId !== textureId) return
        this.removePendingStroke(strokeId)
      })
    }
 
    store.dispatch(subscribeCodrawing(this.textureId))

    // event that is triggered if codrawing has been registered
    window.socket.on(ON_CODRAWING_STROKE, (strokeData) => {
      const { userMongoId, textureId, strokeId } = strokeData
      const state = store.getState()
      const me = state.auth.me 

      if(textureId !== this.textureId) return 

      if(this.isCodrawingHost) {
        this.addStrokeHistory(strokeData)
      }

      if(userMongoId === me.id) return 

      this.executeRemoteStroke(strokeData)

      const canvas = this.scene.getLayerInstanceByTextureId(textureId)
      if(canvas.createCollisionBody) canvas.createCollisionBody()
      if(this.isCodrawingHost) {
        this.onStrokeReleased()
        window.socket.emit(ON_CODRAWING_STROKE_ACKNOWLEDGED, { strokeId, userMongoId, textureId })
      }
    });

    // window.socket.on(ON_CODRAWING_IMAGE_UPDATE, ({textureId}) => {
    //   if(textureId !== this.textureId) return
    //   console.log('ON_CODRAWING_IMAGE_UPDATE')
    //   this.updateTexture({ callback: () => {
    //     this.initialDraw()
    //   }})
      
    // })

    return this
  }

  removePendingStroke(strokeId) {
    this.strokesPending = this.strokesPending.filter((stroke) => {
      return stroke.strokeId !== strokeId
    })
    if(this.strokesPending.length === 0) {
      store.dispatch({
        type: MARK_CANVAS_IMAGE_STROKES_PENDING,
        payload: {
          textureId: this.textureId,
          pending: false
        }
      })
    }
  }

  addPendingStrokes(strokeData) {
    this.strokesPending.push(strokeData)
    store.dispatch({
      type: MARK_CANVAS_IMAGE_STROKES_PENDING,
      payload: {
        textureId: this.textureId,
        pending: true
      }
    })
  } 

  addStrokeHistory(strokeData) {
    this.strokeHistory.push(strokeData)
    this.markUnsaved()
    store.dispatch(editCanvasImage(this.canvasImageMongoId, {
      strokeHistory: this.strokeHistory
    }))
  }

  async initializeStrokeHistory() {
    this.strokeHistory = []
    try{
      const canvasImage = await this.getStrokeHistory()
      this.canvasImageMongoId = canvasImage.id
      this.imageType = canvasImage.imageType
      if(canvasImage.strokeHistory.length && this.isCodrawingHost) {
        this.strokeHistory = canvasImage.strokeHistory
        this.debouncedSave()
      }
      canvasImage.strokeHistory.forEach((strokeData) => {
        this.executeRemoteStroke(strokeData)
      })

      const initialTextureId = canvasImage.initialTextureId
      if(initialTextureId) {
        if(this.scene.textures.exists(initialTextureId)) {
          super.draw(initialTextureId, 0, 0)
        }
      }
    } catch(e) {
      console.log(e, 'couldnt find image')
    }
  }

  async getStrokeHistory() {
    return await store.dispatch(getCanvasImageByTextureId(this.textureId))
  }


  pendingStrokeCheck = () => {
    if(this.strokesPending.length) {
      const lastStroke = this.strokesPending[this.strokesPending.length - 1]
      if(lastStroke.time + noCodrawingStrokeUpdateDelta < Date.now()) {
        this.strokeHistory = null
        clearInterval(this.strokeCheckInterval)
        store.dispatch(changeErrorState(CODRAWING_CONNECTION_LOST, { textureId: this.textureId }))
        console.error('Your drawing is out of sync and it will now reset', this.textureId)
        store.dispatch(unsubscribeCodrawing(this.textureId))
        this.strokesPending = []
        this.updateTexture({ callback: async () => {
          this.clear()
          this.initialDraw()
          await store.dispatch(subscribeCodrawing(this.textureId))
          store.dispatch(clearErrorState(CODRAWING_CONNECTION_LOST))
          this.strokeCheckInterval = setInterval(this.pendingStrokeCheck, noCodrawingStrokeUpdateDelta/5)
        }})
      }
    }
  }

  executeRemoteStroke({textureId, brushId, stroke}) {
    const canvas = this.scene.getLayerInstanceByTextureId(textureId)
    const brush = this.scene.createBrushFromBrushId(brushId)
    brush.setVisible(false)

    stroke.forEach(({x, y, width, height}) => {
      brush.setSize(width, height)
      brush.executeStroke(x, y, canvas)
    })

    brush.destroy()
  }

  destroy() {
    if(!this.isOnlineMultiplayer) return
    
    super.destroy()

    store.dispatch(unsubscribeCodrawing(this.textureId))

    window.socket.off(ON_CODRAWING_INITIALIZE);
    window.socket.off(ON_CODRAWING_STROKE_ACKNOWLEDGED);
    window.socket.off(ON_CODRAWING_SUBSCRIBED);
    window.socket.off(ON_CODRAWING_STROKE);

    clearInterval(this.strokeCheckInterval)
  }
}

