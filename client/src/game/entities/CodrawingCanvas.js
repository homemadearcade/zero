import Phaser from "phaser";
import store from "../../store";
import { Canvas } from "./Canvas";

export class CodrawingCanvas extends Canvas {
  constructor(scene, props){
    super(scene, props)

    // // event that is triggered if another user has subscribed to your cobrowsingu, sends the initial state out
    // window.socket.on(ON_CODRAWING_SUBSCRIBED, () => {
    //  IF YOU ARE THE HOST, SAVE THIS CANVAS...
    // });
  
    // event that is triggered if codrawing has been registered
    // window.socket.on(ON_CODRAWING_STROKE, ({userId, remoteState}) => {
      
    // });

    // of course if its destroyed...
    // window.socket.off(ON_CODRAWING_STROKE);


    // if you are the game host all that means is that you get to save the image and if there are any discrepencies then yours is the true one

    return this
  }
}

