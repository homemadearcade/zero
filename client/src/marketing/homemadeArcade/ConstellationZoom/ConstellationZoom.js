import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ConstellationZoom.scss';
import { Constellation } from '../Constellation/Constellation';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import store from '../../../store';

const ConstellationZoom = ({gameRoomInstance: { gameRoomInstance }, width, height}) => {
  const [zoomOutImage, setZoomOutImage] = useState()

  useEffect(() => {
    let timeout =  setTimeout(() => {attemptConstellation()}, 0)

    async function attemptConstellation() {
      if(zoomOutImage) return 

      if(gameRoomInstance.isPoweredOn) {
        const gameInstance = store.getState().webPage.gameInstance
        const scene = getCurrentGameScene(gameInstance)

        if(!scene || !scene.getImageOfCurrentView) {
          timeout = setTimeout(attemptConstellation, 1000)
          return
        }
      
        const { imgCanvas } = await scene.getImageOfCurrentView('constellation')

        setZoomOutImage(imgCanvas.toDataURL())
      } else {
        // console.log('not in correct state, redoing attemptConstellation')
        timeout = setTimeout(attemptConstellation, 1000)
      }
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [gameRoomInstance.isPoweredOn])

  if(zoomOutImage === false) {
    return <Constellation width={width} height={height} className="Constellation--overlay"></Constellation>
  }

 return <div className="ConstellationZoom">
    {zoomOutImage && <Constellation width={width} height={height} className="Constellation--overlay" zoomOut zoomOutImage={zoomOutImage}>
    </Constellation>}
 </div>
};

const mapStateToProps = (state) => ({
  gameRoomInstance: state.gameRoomInstance
});

export default compose(
  connect(mapStateToProps, { }))(ConstellationZoom);
