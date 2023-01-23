import Phaser from "phaser";
import store from "../../store";
import { Canvas } from "./Canvas";

import { ON_CODRAWING_STROKE, ON_CODRAWING_SUBSCRIBED } from "../../store/types";
import { subscribeCodrawing, unsubscribeCodrawing } from "../../store/actions/codrawingActions";

export class CodrawingCanvas extends Canvas {
  constructor(scene, props){
    super(scene, props)

    const state = store.getState()
    const lobby = state.lobby.lobby
    if(!lobby.id) return

    this.canvasId = props.canvasId
    this.scene = scene

    store.dispatch(subscribeCodrawing(this.textureId))

    // if(this.isHost) {
    //   window.socket.on(ON_CODRAWING_SUBSCRIBED, ({ userId, canvasId  }) => {
    //     const state = store.getState()
    //     const me = state.auth.me 
    //     if(canvasId !== this.canvasId) return 
    //     if(userId === me.id) return 
    //     this.debouncedSaveShort()
    //   });
    // }
  
    // event that is triggered if codrawing has been registered
    window.socket.on(ON_CODRAWING_STROKE, ({userId, textureId, stroke, brushId }) => {
      const state = store.getState()
      const me = state.auth.me 

      if(textureId !== this.textureId) return 
      if(userId === me.id) return 

      const canvas = this.scene.getLayerById(textureId)
      const brush = this.scene.getBrushFromBrushId(brushId)
      brush.setVisible(false)

      stroke.forEach(({x, y, width, height}) => {
        brush.setSize(width, height)
        brush.executeStroke(x, y, canvas)
      })

      brush.destroy()

      if(canvas.createCollisionBody) canvas.createCollisionBody()
      if(this.isHost) this.onStrokeReleased()
    });

    // if you are the game host all that means is that you get to save the image and if there are any discrepencies then yours is the true one

    return this
  }

  destroy() {
    const state = store.getState()
    const lobby = state.lobby.lobby
    if(!lobby.id) return
    
    super.destroy()

    store.dispatch(unsubscribeCodrawing(this.textureId))

    window.socket.off(ON_CODRAWING_SUBSCRIBED);
    window.socket.off(ON_CODRAWING_STROKE);
  }
}

