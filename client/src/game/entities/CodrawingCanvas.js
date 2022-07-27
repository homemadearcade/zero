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

    const me = state.auth.me 
    const gameHostId = lobby.gameHostId
    this.isHost = me.id === gameHostId
    this.canvasId = props.canvasId
    this.scene = scene

    store.dispatch(subscribeCodrawing(this.canvasId))

    if(this.isHost) {
      window.socket.on(ON_CODRAWING_SUBSCRIBED, ({ userId, canvasId  }) => {
        if(canvasId !== this.canvasId) return 
        if(userId === me.id) return 
        this.save()
      });
    }
  
    // event that is triggered if codrawing has been registered
    window.socket.on(ON_CODRAWING_STROKE, ({userId, canvasId, stroke, brushId }) => {
      if(canvasId !== this.canvasId) return 
      if(userId === me.id) return 

      const canvas = this.scene.getLayerById(canvasId)
      const brush = this.scene.getBrushFromBrushId(brushId)
      brush.setVisible(false)

      stroke.forEach(({x, y}) => {
        brush.executeStroke(x, y, canvas)
      })

      brush.destroy()

      if(canvas.createCollisionBody) canvas.createCollisionBody()
    });

    // if you are the game host all that means is that you get to save the image and if there are any discrepencies then yours is the true one

    return this
  }

  destroy() {
    super.destroy()

    store.dispatch(unsubscribeCodrawing(this.canvasId))

    window.socket.off(ON_CODRAWING_SUBSCRIBED);
    window.socket.off(ON_CODRAWING_STROKE);
  }
}

