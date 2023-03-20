import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/gameModelActions';

import './CameraEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { CAMERA_LERP_X_IID, CAMERA_LERP_Y_IID, CAMERA_ZOOM_IID } from '../../../constants/interfaceIds';

const CameraEditor = ({ entityClassId, gameModel: { gameModel, currentStageId }, editGameModel }) => {
  const classSelected = gameModel.entityClasses[entityClassId]

  if(!classSelected?.camera) {
    console.error('opened camera editor on a class with no camera')
    return null
  }

  const boundaries = gameModel.stages[currentStageId].boundaries
  const minZoomWidth = Math.floor((boundaries.width/boundaries.maxWidth) * 3)
  const minZoomHeight = Math.floor((boundaries.height/boundaries.maxHeight) * 3)

  const minZoomIndex = minZoomHeight < minZoomWidth ? minZoomHeight : minZoomWidth

  const zooms = [
    minZoomIndex === 3 && 1,
    minZoomIndex >= 2 && 1.5, 
    // 2.2,
    // 2.4,
    // 2.6,
    // 2.8,
     3, 
     4, 
     5,
     6,
     7,
     8,
     9, 
     10
  ].filter((num) => {
    return !!num
  })

// step={0.2} is like... perfect for grids

  return (
    <div className="CameraEditor">
      <Unlockable isSlider interfaceId={CAMERA_ZOOM_IID}>
        <SliderNotched
          formLabel="Zoom -/+"
          options={zooms}
          step={0.1}
          onChangeCommitted={(value) => {
            editGameModel({ entityClasses: { [entityClassId]: { camera: { zoom: value }  }}})        
          }}
          value={classSelected.camera.zoom}
      />
      </Unlockable>
      <Unlockable isSlider interfaceId={CAMERA_LERP_X_IID}>
        <SliderNotched
          formLabel="Lerp ⇆"
          options={[0, 0.09, 0.2, 0.4, 0.7, 1]}
          step={0.01}
          onChangeCommitted={(value) => {
            editGameModel({ entityClasses: { [entityClassId]: { camera: { lerpX: value }  }}})        
          }}
          value={classSelected.camera.lerpX}
      />
      </Unlockable>
      <Unlockable isSlider interfaceId={CAMERA_LERP_Y_IID}>
        <SliderNotched
          formLabel="Lerp ⇵"
          step={0.01}
          options={[0, 0.09, 0.2, 0.4, 0.7, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ entityClasses: { [entityClassId]: { camera: { lerpY: value }  }}})        
          }}
          value={classSelected.camera.lerpY}
      />
      </Unlockable>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { editGameModel })(CameraEditor);
