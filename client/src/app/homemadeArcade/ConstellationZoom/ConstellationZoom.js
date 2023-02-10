import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ConstellationZoom.scss';
import { Constellation } from '../Constellation/Constellation';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import { GAME_EDITOR_EXPERIENCE } from '../../../constants';
import store from '../../../store';

const ConstellationZoom = () => {
  const [zoomOutImage, setZoomOutImage] = useState()

  useEffect(() => {
    let timeout =  setTimeout(() => {attemptConstellation()}, 0)

    async function attemptConstellation() {
      const state = store.getState()

      if(state.lobby.lobby?.experienceState === GAME_EDITOR_EXPERIENCE && state.lobby.lobby?.isGamePoweredOn) {
        const gameInstance = store.getState().webPage.gameInstance
        const scene = getCurrentGameScene(gameInstance)
      
        const { imgCanvas } = await scene.getImageFromGame('constellation')

        setZoomOutImage(imgCanvas)
      } else {
        console.log('not in correct state, redoing attemptConstellation')
        timeout = setTimeout(attemptConstellation, 1000)
      }
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [])

 return <div className="ConstellationZoom">
    {zoomOutImage && <Constellation className="Constellation--overlay" zoomOut zoomOutImage={zoomOutImage}>
    </Constellation>}
 </div>
};

const mapStateToProps = (state) => ({});

export default compose(
  connect(mapStateToProps, { }))(ConstellationZoom);
