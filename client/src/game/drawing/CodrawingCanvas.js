import Phaser from "phaser";
import store from "../../store";
import { Canvas } from "./Canvas";

import { ON_CODRAWING_STROKE, ON_CODRAWING_SUBSCRIBED, ON_CODRAWING_STROKE_ACKNOWLEDGED, ON_CODRAWING_INITIALIZE } from "../../store/types";
import { subscribeCodrawing, unsubscribeCodrawing } from "../../store/actions/codrawingActions";
import { noCodrawingStrokeUpdateDelta } from "../constants";

export class CodrawingCanvas extends Canvas {
  constructor(scene, props){
    super(scene, props)

    const state = store.getState()
    const lobby = state.lobby.lobby
    if(!lobby.id) return

    this.canvasId = props.canvasId
    this.scene = scene

    // if you are the host all that means is that you get to save the image and if there are any discrepencies then yours is the true one
    this.isHost = props.isHost

    this.strokesPending = []
    if(!this.isHost) {
      this.strokeCheckInterval = setInterval(() => {
        if(this.strokesPending.length) {
          const lastStroke = this.strokesPending[this.strokesPending.length - 1]
          if(lastStroke.time + noCodrawingStrokeUpdateDelta < Date.now()) {
            alert('your drawing is out of sync, tell jon')
            // this.updateTexture(async () => {
            //   await store.dispatch(unsubscribeCodrawing(this.textureId))
            //   await store.dispatch(subscribeCodrawing(this.textureId))
            //   this.clear()
            //   this.initialDraw()
            // })
          }
        }
      }, noCodrawingStrokeUpdateDelta/5)
      
      window.socket.on(ON_CODRAWING_STROKE_ACKNOWLEDGED, ({ strokeId, textureId }) => {
        if(this.textureId !== textureId) return

        this.strokesPending = this.strokesPending.filter((stroke) => {
          return stroke.strokeId !== strokeId
        })
      })
    }
 
    store.dispatch(subscribeCodrawing(this.textureId))

    if(this.isHost) {
      this.strokeHistory = []

      window.socket.on(ON_CODRAWING_SUBSCRIBED, ({ userId, textureId  }) => {
        const state = store.getState()
        const me = state.auth.me 
        if(textureId !== this.textureId) return 
        if(userId === me.id) return 
        window.socket.emit(ON_CODRAWING_INITIALIZE, { userId, textureId, strokeHistory: this.strokeHistory })
      });
    }

    window.socket.on(ON_CODRAWING_INITIALIZE, ({ userId, textureId, strokeHistory  }) => {
      const state = store.getState()
      const me = state.auth.me 
      if(textureId !== this.textureId) return 
      if(userId !== me.id) return 
      strokeHistory.forEach((strokeData) => {
        this.executeRemoteStroke(strokeData)
      })
    })
  
    // event that is triggered if codrawing has been registered
    window.socket.on(ON_CODRAWING_STROKE, (strokeData) => {
      const {userId, textureId, strokeId } = strokeData
      const state = store.getState()
      const me = state.auth.me 

      if(textureId !== this.textureId) return 

      if(this.isHost) this.strokeHistory.push(strokeData)

      if(userId === me.id) return 

      this.executeRemoteStroke(strokeData)

      const canvas = this.scene.getLayerById(textureId)
      if(canvas.createCollisionBody) canvas.createCollisionBody()
      if(this.isHost) {
        this.onStrokeReleased()
        window.socket.emit(ON_CODRAWING_STROKE_ACKNOWLEDGED, { strokeId, userId, textureId })
      }
    });

    return this
  }

  executeRemoteStroke({textureId, brushId, stroke}) {
    const canvas = this.scene.getLayerById(textureId)
    const brush = this.scene.getBrushFromBrushId(brushId)
    brush.setVisible(false)

    stroke.forEach(({x, y, width, height}) => {
      brush.setSize(width, height)
      brush.executeStroke(x, y, canvas)
    })

    brush.destroy()
  }

  destroy() {
    const state = store.getState()
    const lobby = state.lobby.lobby
    if(!lobby.id) return
    
    super.destroy()

    store.dispatch(unsubscribeCodrawing(this.textureId))

    window.socket.off(ON_CODRAWING_INITIALIZE);
    window.socket.off(ON_CODRAWING_STROKE_ACKNOWLEDGED);
    window.socket.off(ON_CODRAWING_SUBSCRIBED);
    window.socket.off(ON_CODRAWING_STROKE);
  }
}

